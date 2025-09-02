import React from 'react';
import { Paper, Typography } from '@mui/material';

interface Slide {
  id: number;
  title: string | null;
  content: string | null;
}

interface SlideThumbnailProps {
  slide: Slide;
  isActive: boolean;
  onClick: () => void;
}

export const SlideThumbnail: React.FC<SlideThumbnailProps> = ({ slide, isActive, onClick }) => {
  return (
    <Paper
      variant="outlined"
      onClick={onClick}
      sx={{
        width: '100%',
        aspectRatio: '16 / 9',
        cursor: 'pointer',
        borderColor: isActive ? 'primary.main' : 'divider',
        borderWidth: isActive ? 2 : 1,
        p: 1,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
      }}
    >
      <Typography
        sx={{
          fontSize: '0.6rem',
          fontWeight: 'bold',
          width: '100%',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        {slide.title || ' '}
      </Typography>
      <Typography
        sx={{
          fontSize: '0.4rem',
          width: '100%',
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}
      >
        {slide.content || ' '}
      </Typography>
    </Paper>
  );
};