import { Container, Theme, Typography, Box } from '@mui/material';
import { useTheme, styled } from '@mui/material/styles';
import Topics from 'components/Topics';
import Features from 'components/Features';
import PageLayout from 'components/PageLayout';
import Helmet from 'react-helmet';
import React from 'react';

const HeroBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: 10,
  minHeight: '100vh',
  boxSizing: 'border-box',
  paddingTop: 120,
  textAlign: 'center',
  backgroundImage: `linear-gradient(to bottom, #18154f, ${theme.palette.primary.main})`,
}));

const HomePage = () => {
  const theme: Theme = useTheme();

  return (
    <PageLayout>
      <Helmet>
        <title>Structs.sh</title>
      </Helmet>
      <HeroBox>
        <Typography variant="h4">
          <strong>Welcome to Structs.sh</strong>
        </Typography>
        <Typography variant="body1">
          An interactive learning platform for computer science, tailored to UNSW CSE students.
        </Typography>
        <Topics />
      </HeroBox>
      <Box paddingTop={5} bgcolor={theme.palette.primary.main}>
        <Container maxWidth="md">
          <Features />
        </Container>
      </Box>
    </PageLayout>
  );
};

export default HomePage;
