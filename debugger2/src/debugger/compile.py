from asyncio import create_subprocess_exec
from asyncio.subprocess import PIPE
from pathlib import Path


async def compile(source_path: str | Path, output_path: str | Path) -> None:
    clang = await create_subprocess_exec(
        "clang",
        str(source_path),
        "-o",
        str(output_path),
        "-g",
        "-O0",
        # "-Wall",
        # "-Wextra",
        # "-Werror",
        stdin=PIPE,
        stdout=PIPE,
        stderr=PIPE,
    )
    stdout, stderr = await clang.communicate()
    exit_code = await clang.wait()
    assert exit_code == 0, ("Failed to compile source code", stderr)
