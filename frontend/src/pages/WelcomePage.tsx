import React from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import { Header } from '../components/Header';

export const WelcomePage = () => {
  return (
    <Box>
      <Header />
      <Container maxWidth="md">
        <Box
          sx={{
            my: 15, // margin top & bottom
            textAlign: 'center',
          }}
        >
          <Typography variant="h2" component="h1" gutterBottom>
            Создавайте потрясающие презентации с помощью ИИ
          </Typography>
          <Typography variant="h5" color="text.secondary" paragraph>
            Наш инструмент поможет учителям быстро и легко готовить
            интерактивные уроки с видео и автоматической генерацией слайдов.
          </Typography>
          <Button variant="contained" size="large" sx={{ mt: 4 }}>
            Попробовать бесплатно
          </Button>
        </Box>
      </Container>
    </Box>
  );
};