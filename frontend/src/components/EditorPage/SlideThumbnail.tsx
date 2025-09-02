import React from 'react';
import { Paper, Typography } from '@mui/material';
import { Slide } from '../../hooks/usePresentation';

interface SlideThumbnailProps {
  slide: Slide;
  isActive: boolean;
  onClick: () => void;
}

export const SlideThumbnail: React.FC<SlideThumbnailProps> = ({ slide, isActive, onClick }) => {
  const titleElement = slide.elements.find(e => e.element_type === 'TEXT');
  const contentElement = slide.elements.filter(e => e.element_type === 'TEXT')[1];

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
        bgcolor: slide.background_color,
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
        {titleElement?.content || ' '}
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
        {contentElement?.content || ' '}
      </Typography>
    </Paper>
  );
};