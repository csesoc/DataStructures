import { useContext, useState } from 'react';
import { Alert, List } from '@mui/material';
import FloatingWindow from 'components/FloatingWindow';
import VisualiserContext from './VisualiserContext';
import OperationDetails from './OperationDetails';

/**
 * The GUI form that lets users input arguments to a menu of commands and then
 * have them affect the visualiser.
 *
 * It receives an `executeCommand` callback which should be linked to call
 * commands in the visualiser source code.
 *
 * All the commands that the form supports are listed separately in the
 * `commandsInputRules.ts` file, where the terminal commands also reside.
 */
const Operations = () => {
  const { documentation, topicTitle } = useContext(VisualiserContext);
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const handleToggleExpansion = () => {
    setIsExpanded(!isExpanded);
  };

  return !documentation ? (
    <Alert severity="error">
      No operations are defined for the topicTitle &apos;
      {topicTitle}
      &apos;
    </Alert>
  ) : (
    <FloatingWindow
      flexDirection="row"
      isExpanded={isExpanded}
      handleToggleExpansion={handleToggleExpansion}
    >
      <List>
        {Object.keys(documentation).map((command) => (
          <OperationDetails command={command} key={documentation[command].id} />
        ))}
      </List>
    </FloatingWindow>
  );
};

export default Operations;
