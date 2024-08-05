import styles from 'styles/Timeline.module.css';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import UndoIcon from '@mui/icons-material/Undo';
import RedoIcon from '@mui/icons-material/Redo';
import ReplayIcon from '@mui/icons-material/Replay';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import { useEffect, useState } from 'react';
import { useSocketCommunication } from '../../../Services/useSocketCommunication';
import { useFrontendStateStore } from '../../Store/frontendStateStore';
import { Button } from '../../../components/Button';
import Slider from '../../../components/Timeline/Slider';
import { useGlobalStore } from '../../Store/globalStateStore';
import { isInitialBackendState } from '../../Types/backendType';

const Controls = () => {
  const { currFrame } = useGlobalStore();
  const { userAnnotation, parser } = useGlobalStore().visualizer;
  const { sendCode, bulkSendNextStates, getNextState } = useSocketCommunication();
  const { states, currentIndex, stepForward, stepBackward, jumpToState } = useFrontendStateStore();
  const { isActive } = useFrontendStateStore();

  const playToggle = () => {
    bulkSendNextStates(10);
  };

  const [autoNext, setAutoNext] = useState<boolean>(false);
  useEffect(() => {
    if (currFrame && !isInitialBackendState(currFrame) && userAnnotation) {
      const newParsedState = parser.parseState(currFrame, userAnnotation);
      useFrontendStateStore.getState().appendFrontendNewState(currFrame, newParsedState);

      if (autoNext === true) {
        stepForward();
        setAutoNext(false);
      }
    } else {
      let issue = 'something';
      if (!currFrame) {
        issue = 'backendState';
      } else if (!userAnnotation) {
        issue = 'localsAnnotations';
      }
      console.error(`Unable to parse backend state: ${issue} is undefined`);
    }
  }, [currFrame, userAnnotation]);

  return (
    <div className={styles.timeline}>
      <Button variant="primary" onClick={sendCode}>
        Compile
      </Button>
      <Button disabled={!isActive} onClick={playToggle}>
        <PlayArrowIcon />
      </Button>
      <Button
        disabled={!isActive || currentIndex === 0}
        onClick={() => {
          stepBackward();
        }}
      >
        <UndoIcon />
      </Button>
      <Button
        onClick={async () => {
          if (currentIndex === states.length - 1) {
            setAutoNext(true);
            await getNextState();
          } else {
            stepForward();
          }
        }}
      >
        <RedoIcon />
      </Button>
      <Button
        disabled={!isActive}
        onClick={() => {
          jumpToState(currentIndex === states.length ? 0 : states.length);
        }}
      >
        {currentIndex === states.length ? <ReplayIcon /> : <SkipNextIcon />}
      </Button>
      <Slider
        max={states.length}
        value={currentIndex}
        onChange={([value]: number[]) => jumpToState(value)}
      />
    </div>
  );
};

export default Controls;
