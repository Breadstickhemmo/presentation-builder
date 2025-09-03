import React from 'react';
import { Box, List, ListItem, Typography, Paper, Divider, Button, IconButton, Tooltip } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { SlidePreview } from './SlidePreview';
import { Slide } from '../../hooks/usePresentation';

interface SlideListProps {
  slides: Slide[];
  activeSlideId: number | null;
  onSelectSlide: (id: number) => void;
  onAddSlide: () => void;
  onDeleteSlide: (id: number) => void;
}

const THUMBNAIL_WIDTH = 150;
const BASE_SLIDE_WIDTH = 1280;
const SCALE_FACTOR = THUMBNAIL_WIDTH / BASE_SLIDE_WIDTH;

export const SlideList: React.FC<SlideListProps> = ({ slides, activeSlideId, onSelectSlide, onAddSlide, onDeleteSlide }) => {
  return (
    <Paper elevation={0} sx={{ width: 200, height: '100%', display: 'flex', flexDirection: 'column', borderRight: '1px solid', borderColor: 'divider', bgcolor: 'background.default' }}>
      <List sx={{ overflowY: 'auto', flexGrow: 1, p: 2 }}>
        {slides.map((slide, index) => (
          <ListItem key={slide.id} disablePadding sx={{ mb: 2, position: 'relative', '& .delete-button': { opacity: 0 }, '&:hover .delete-button': { opacity: 1 } }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', width: '100%' }}>
              <Typography sx={{ mr: 2, color: 'text.secondary', fontSize: '0.8rem' }}>{index + 1}</Typography>
              <Box 
                onClick={() => onSelectSlide(slide.id)}
                sx={{ 
                  flexGrow: 1, cursor: 'pointer',
                  border: `solid ${slide.id === activeSlideId ? 2 : 1}px`,
                  borderColor: slide.id === activeSlideId ? 'primary.main' : 'divider',
                  aspectRatio: '16 / 9',
                  overflow: 'hidden',
                }}
              >
                <Box sx={{
                  transform: `scale(${SCALE_FACTOR})`,
                  transformOrigin: 'top left',
                  width: BASE_SLIDE_WIDTH,
                  height: BASE_SLIDE_WIDTH * (9 / 16),
                }}>
                  <SlidePreview slide={slide} />
                </Box>
              </Box>
            </Box>
            <Tooltip title="Удалить слайд">
              <IconButton className="delete-button" size="small" onClick={(e) => { e.stopPropagation(); onDeleteSlide(slide.id); }} sx={{ position: 'absolute', top: -5, right: -5, bgcolor: 'background.paper', transition: 'opacity 0.2s', '&:hover': { bgcolor: 'error.light', color: 'error.contrastText' } }}>
                <DeleteIcon fontSize="inherit" />
              </IconButton>
            </Tooltip>
          </ListItem>
        ))}
      </List>
      <Divider />
      <Box sx={{ p: 2 }}>
        <Button fullWidth startIcon={<AddIcon />} onClick={onAddSlide}>Новый слайд</Button>
      </Box>
    </Paper>
  );
};