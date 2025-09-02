import React from 'react';
import { Container, Typography } from '@mui/material';

export const HomePage = () => {
  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4">Добро пожаловать!</Typography>
      <Typography>Здесь будет список ваших презентаций.</Typography>
    </Container>
  );
};