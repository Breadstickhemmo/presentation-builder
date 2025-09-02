import React, { useCallback } from 'react';
import { Box, Paper, Typography } from '@mui/material';
import { EditableText } from './EditableText';

interface Slide {
  id: number;
  title: string | null;
  content: string | null;
}

interface SlideEditorProps {
  slide: Slide | null;
  onUpdate: (slideId: number, data: { title?: string; content?: string }) => void;
}

export const SlideEditor: React.FC<SlideEditorProps> = ({ slide, onUpdate }) => {
  const handleTitleSave = useCallback((newTitle: string) => {
    if (slide) {
      onUpdate(slide.id, { title: newTitle });
    }
  }, [slide, onUpdate]);

  const handleContentSave = useCallback((newContent: string) => {
    if (slide) {
      onUpdate(slide.id, { content: newContent });
    }
  }, [slide, onUpdate]);

  if (!slide) {
    return (
      <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
        <Typography color="text.secondary">Выберите слайд для редактирования</Typography>
      </Box>
    );
  }

  return (
    <Paper
      elevation={3}
      sx={{
        width: 1280,
        height: 720,
        p: 4,
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
        boxSizing: 'border-box'
      }}
    >
      <EditableText
        initialValue={slide.title || ''}
        onSave={handleTitleSave}
        placeholder="Введите заголовок"
        variant="h3"
      />
      <EditableText
        initialValue={slide.content || ''}
        onSave={handleContentSave}
        placeholder="Введите подзаголовок"
        variant="body1"
      />
    </Paper>
  );
};