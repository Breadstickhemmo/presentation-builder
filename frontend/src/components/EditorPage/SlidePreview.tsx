import React from 'react';
import { Paper, Box } from '@mui/material';
import { Slide } from '../../hooks/usePresentation';

interface SlidePreviewProps {
  slide: Slide;
}

export const SlidePreview: React.FC<SlidePreviewProps> = ({ slide }) => {
  return (
    <Paper
      elevation={0}
      sx={{
        width: 1280,
        height: 720,
        position: 'relative',
        bgcolor: slide.background_color,
        overflow: 'hidden',
        pointerEvents: 'none',
      }}
    >
      {slide.elements.map(element => (
        <Box
          key={element.id}
          sx={{
            position: 'absolute',
            left: element.pos_x,
            top: element.pos_y,
            width: element.width,
            height: element.height,
            boxSizing: 'border-box',
          }}
        >
          {element.element_type === 'IMAGE' && element.content ? (
            <img 
              src={element.content} 
              alt=""
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            />
          ) : (
            <Box
              sx={{
                width: '100%',
                height: '100%',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                fontSize: element.font_size,
                overflow: 'hidden',
                p: '8px'
              }}
            >
              {element.content}
            </Box>
          )}
        </Box>
      ))}
    </Paper>
  );
};