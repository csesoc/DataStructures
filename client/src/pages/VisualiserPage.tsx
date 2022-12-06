import { LineLoader } from 'components/Loader';
import Visualiser from 'components/Visualiser';
import React, { FC, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getTopic, Topic } from 'utils/apiRequests';
import Notification from 'utils/Notification';
import { toTitleCase, urlToTitle } from 'utils/url';
import 'visualiser-src/linked-list-visualiser/styles/visualiser.css';
import { motion } from 'framer-motion';
import Helmet from 'react-helmet';
import { TopNavbar } from 'components/Navbars';
import { useTheme } from '@mui/styles';
import { Theme } from '@mui/material';
import Box from '@mui/material/Box';

const containerVariants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: { duration: 1 },
  },
  exit: {
    opacity: '-100vw',
    transition: { ease: 'easeInOut' },
  },
};

/**
 * Defines the layout and contents of the visualiser pages.
 * Notably, we're using a split-pane layout here.
 */
const VisualiserPage = () => {
  const topic = toTitleCase(urlToTitle(useParams().topic));

  return topic ? (
    <Box height="100vh" overflow="hidden">
      <TopNavbar position="static" />
      <motion.div variants={containerVariants} initial="hidden" animate="visible" exit="exit">
        <Helmet>
          <title>{topic !== undefined ? topic : 'Structs.sh'}</title>
        </Helmet>
        <Visualiser topicTitle={topic} />
      </motion.div>
    </Box>
  ) : (
    <LineLoader fullViewport />
  );
};

export default VisualiserPage;
