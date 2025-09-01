import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { ReactComponent as HeroIllustration } from '../assets/hero-illustration.svg';

export const HeroSection = () => {
  return (
    <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 } }}>
      <Grid container spacing={4} alignItems="center">
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography
            variant="h2"
            component="h1"
            fontWeight="700"
            sx={{ mb: 3, lineHeight: 1.2 }}
          >
            Создавайте потрясающие презентации с помощью ИИ
          </Typography>
          <Typography
            variant="h5"
            color="text.secondary"
            paragraph
            sx={{ mb: 4, maxWidth: '550px' }}
          >
            Наш инструмент поможет учителям быстро и легко готовить
            интерактивные уроки с видео и автоматической генерацией слайдов.
          </Typography>
          <Button
            variant="contained"
            size="large"
            endIcon={<ArrowForwardIcon />}
            sx={{ 
              py: 1.5, 
              px: 4, 
              fontSize: '1rem',
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: 6,
              },
            }}
          >
            Попробовать бесплатно
          </Button>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <HeroIllustration style={{ width: '100%', maxWidth: '500px', height: 'auto' }} />
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};