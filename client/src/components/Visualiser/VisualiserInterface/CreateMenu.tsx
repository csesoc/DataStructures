import { Box, Typography, useTheme, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import React, { useCallback, useContext } from 'react';
import VisualiserContext from './VisualiserContext';
import axios from 'axios';

import styles from './Control.module.scss';

const MenuButton = styled(Button)({
  backgroundColor: '#46B693',
  '&:hover': {
    backgroundColor: '#2b6e5a',
  },
});

/**
 * Contains the ability to reset and create new data structures
 *
 * It receives a bunch of callbacks and connects it to each of the corresponding
 * UI components.
 *
 * Eg. it receives a `handlePlay` callback and attaches it to the Play button's
 *     `onClick` handler.
 */
const CreateMenu = () => {
  const { controller } = useContext(VisualiserContext);
  const theme = useTheme();

  const handleReset = useCallback(() => {
    controller.resetDataStructure();
  }, [controller]);

  const handleGenerate = useCallback(() => {
    controller.generateDataStructure();
  }, [controller]);

  const handleSave = () => {
    const data = {
      owner: "Your Title",
      type: "Your Description",
      data: controller.getData()
    };
    console.log(controller.getData());
    axios
      .post("http://localhost:3000/api/todo", data)
      .then((response) => {
        // Handle the response data
        console.log("Linked List saved:", response.data);
      })
      .catch((error) => {
        // Handle the error
        console.error("Error saving data structure:", error);
      });
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      position="absolute"
      width="200px"
      top="80px"
      right="10px"
      gap="10px"
    >
      <MenuButton onClick={handleGenerate}>
        <Typography color="textPrimary" whiteSpace="nowrap">
          Create New
        </Typography>
      </MenuButton>
      <MenuButton onClick={handleReset}>
        <Typography color="textPrimary" whiteSpace="nowrap">
          Reset All
        </Typography>
      </MenuButton>
      <MenuButton onClick={handleSave}>
        <Typography color="textPrimary" whiteSpace="nowrap">
          Save
        </Typography>
      </MenuButton>
    </Box>
  );
};

export default CreateMenu;
