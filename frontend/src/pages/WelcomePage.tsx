import React from 'react';
import { Box, Divider } from '@mui/material';
import { Header } from '../components/Header';
import { HeroSection } from '../components/HeroSection';
import { FeaturesSection } from '../components/FeaturesSection';

export const WelcomePage = () => {
  return (
    <Box>
      <Header />
      <main>
        <HeroSection />
        <Divider />
        <FeaturesSection />
      </main>
    </Box>
  );
};