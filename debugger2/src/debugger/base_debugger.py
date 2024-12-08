from asyncio import create_subprocess_exec
from asyncio import create_task
from asyncio import Queue
from asyncio import to_thread
from asyncio import Event
from asyncio import iscoroutinefunction
from asyncio.subprocess import PIPE
from contextlib import suppress
from pathlib import Path
import os

from . import mion


def panic(*args, **kwargs):
    raise AssertionError(*args, **kwargs)


class BaseDebugger:
    def __init__(self) -> None:
        do_nothing = lambda *args, **kwargs: None
        self.oob_handler = do_nothing
        self.inferior_handler = do_nothing
        self._inferior_dispatch_done = Event()
        self._inferior_dispatch_done.set()
        self._did_init = False

    async def init(self, executable_path: str | Path) -> None:
        self.fd_master, self.fd_slave = os.openpty()
        self.process = await create_subprocess_exec(
            "gdb",
            "--interpreter=mi4",
            "--quiet",
            "-nx",
            "-nh",
            "--tty",
            os.ttyname(self.fd_slave),
            "--args",
            str(executable_path),
            stdin=PIPE,
            stdout=PIPE,
        )

        self.result_queue = Queue[tuple[str, dict]]()
        create_task(self._stdout_dispatch())
        create_task(self._inferior_dispatch())
        self._did_init = True
        return self

    async def deinit(self) -> None:
        if not self._did_init:
            return

        self.process.stdin.write_eof()  # or write `-gdb-exit`
        await self.process.stdin.drain()
        await self.process.wait()

        self.result_queue.shutdown()
        await self.result_queue.join()

        os.close(self.fd_master)
        os.close(self.fd_slave)
        await self._inferior_dispatch_done.wait()

    async def run_command(self, command: str):
        self.process.stdin.write(f"{command}\n".encode())
        await self.process.stdin.drain()

        subkind, result = await self.result_queue.get()
        self.result_queue.task_done()
        assert (
            subkind in mion.RESULT_CLASS
        ), f"Command '{command}' returned unexpected status {subkind}"
        return result

    def on_oob[F](self, func: F) -> F:
        """oob = out of band"""
        self.oob_handler = func
        return func

    def on_inferior[F](self, func: F) -> F:
        """inferior = inferior output"""
        self.inferior_handler = func
        return func

    async def _stdout_dispatch(self) -> None:
        while line := await self.process.stdout.readline():
            line = line.strip().decode()
            if line == "(gdb)":
                continue

            kind, message = line[:1], line[1:]
            match kind:
                case mion.RESULT:
                    subkind, message = _split_subkind(message)
                    await self.result_queue.put((subkind, mion.loads(message)))
                case _ if kind in mion.ASYNC:
                    subkind, message = _split_subkind(message)
                    if iscoroutinefunction(self.oob_handler):
                        await self.oob_handler((subkind, mion.loads(message)))
                    else:
                        self.oob_handler((subkind, mion.loads(message)))
                case _ if kind in mion.STREAM:
                    if iscoroutinefunction(self.oob_handler):
                        await self.oob_handler(message)
                    else:
                        self.oob_handler(message)
                case _:
                    panic(f"Received unknown message from GDB: {kind}")

    async def _inferior_dispatch(self) -> None:
        self._inferior_dispatch_done.clear()
        with suppress(OSError):
            while output := await to_thread(os.read, self.fd_master, 512):
                if iscoroutinefunction(self.inferior_handler):
                    await self.inferior_handler(output.decode())
                else:
                    self.inferior_handler(output.decode())
        self._inferior_dispatch_done.set()


def _split_subkind(message: str) -> tuple[str, str]:
    """
    >>> _split_subkind('abc')
    ('abc', '')
    >>> _split_subkind('abc,def')
    ('abc', 'def')
    >>> _split_subkind('abc,def,ghi')
    ('abc', 'def,ghi')
    """

    if "," in message:
        return tuple(message.split(",", 1))
    return message, ""
