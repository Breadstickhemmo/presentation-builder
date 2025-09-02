import React from 'react';
import { Paper, Typography } from '@mui/material';

interface Slide {
  id: number;
  title: string | null;
  content: string | null;
}

interface SlidePreviewProps {
  slide: Slide;
}

export const SlidePreview: React.FC<SlidePreviewProps> = ({ slide }) => {
  const titleStyles = { fontSize: '2.5rem', fontWeight: 'bold' };
  const contentStyles = { fontSize: '1.2rem' };
  const commonTextStyles = {
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
    width: '100%',
    overflow: 'hidden',
  };

  return (
    <Paper
      elevation={0}
      sx={{
        width: 1280,
        height: 720,
        p: 4,
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
        boxSizing: 'border-box',
        pointerEvents: 'none', 
      }}
    >
      <Typography variant="h3" sx={{ ...titleStyles, ...commonTextStyles }}>
        {slide.title || ' '}
      </Typography>
      <Typography variant="body1" sx={{ ...contentStyles, ...commonTextStyles }}>
        {slide.content || ' '}
      </Typography>
    </Paper>
  );
};