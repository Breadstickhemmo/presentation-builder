import React from 'react';
import { Box, Paper, Typography } from '@mui/material';
import { Slide, SlideElement } from '../../hooks/usePresentation';
import { EditableElement } from './EditableElement';

interface SlideEditorProps {
  slide: Slide | null;
  scale: number;
  selectedElementId: string | null;
  onSelectElement: (id: string | null) => void;
  onUpdateElement: (id: string, data: Partial<SlideElement>) => void;
}

export const SlideEditor: React.FC<SlideEditorProps> = ({ slide, scale, selectedElementId, onSelectElement, onUpdateElement }) => {
  if (!slide) {
    return (
      <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography color="text.secondary">Выберите слайд для редактирования</Typography>
      </Box>
    );
  }

  return (
    <Paper
      elevation={3}
      onClick={() => onSelectElement(null)}
      sx={{
        width: 1280,
        height: 720,
        position: 'relative',
        bgcolor: slide.background_color,
        overflow: 'hidden',
      }}
    >
      {slide.elements.map(element => (
        <EditableElement 
          key={element.id} 
          element={element}
          scale={scale}
          isSelected={element.id === selectedElementId}
          onSelect={onSelectElement}
          onUpdate={onUpdateElement}
        />
      ))}
    </Paper>
  );
};