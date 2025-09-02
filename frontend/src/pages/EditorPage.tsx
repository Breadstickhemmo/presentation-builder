import React, { useRef, useState, useLayoutEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Box, CircularProgress, Typography, Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button } from '@mui/material';
import { usePresentation } from '../hooks/usePresentation';
import { SlideList } from '../components/EditorPage/SlideList';
import { SlideEditor } from '../components/EditorPage/SlideEditor';
import { EditorToolbar } from '../components/EditorPage/EditorToolbar';

const BASE_WIDTH = 1280;
const BASE_HEIGHT = 720;

export const EditorPage = () => {
  const { presentationId } = useParams<{ presentationId: string }>();
  const { 
    presentation, 
    loading, 
    activeSlide, 
    handleSelectSlide, 
    handleAddSlide, 
    handleDeleteSlide,
    handleRenamePresentation,
    handleAddElement,
    handleUpdateElement,
    handleDeleteElement
  } = usePresentation(presentationId);

  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [isRenameOpen, setIsRenameOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');

  const handleOpenRename = () => {
    if (presentation) {
      setNewTitle(presentation.title);
      setIsRenameOpen(true);
    }
  };
  
  const handleCloseRename = () => setIsRenameOpen(false);

  const handleSaveRename = async () => {
    await handleRenamePresentation(newTitle);
    handleCloseRename();
  };

  useLayoutEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        const scaleX = width / BASE_WIDTH;
        const scaleY = height / BASE_HEIGHT;
        setScale(Math.min(scaleX, scaleY) * 0.95);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [presentation]);

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'calc(100vh - 112px)' }}><CircularProgress /></Box>;
  }

  if (!presentation) {
    return <Typography sx={{ p: 3 }}>Презентация не найдена или у вас нет к ней доступа.</Typography>;
  }

  return (
    <>
      <Box sx={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 64px)' }}>
        <EditorToolbar 
          title={presentation.title} 
          presentationId={presentation.id} 
          onRenameClick={handleOpenRename} 
          onAddElement={handleAddElement}
        />
        <Box sx={{ display: 'flex', flexGrow: 1, overflow: 'hidden' }}>
          <SlideList
            slides={presentation.slides}
            activeSlideId={activeSlide?.id || null}
            onSelectSlide={handleSelectSlide}
            onAddSlide={handleAddSlide}
            onDeleteSlide={handleDeleteSlide}
          />
          <Box 
            ref={containerRef}
            sx={{ flexGrow: 1, backgroundColor: 'grey.200', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}
          >
            <Box sx={{ transform: `scale(${scale})`, transformOrigin: 'center center' }}>
              <SlideEditor 
                slide={activeSlide} 
                scale={scale}
                onUpdateElement={handleUpdateElement}
                onDeleteElement={handleDeleteElement}
              />
            </Box>
          </Box>
        </Box>
      </Box>
      <Dialog open={isRenameOpen} onClose={handleCloseRename} fullWidth maxWidth="xs">
        <DialogTitle>Переименовать презентацию</DialogTitle>
        <DialogContent>
          <TextField autoFocus margin="dense" label="Название презентации" type="text" fullWidth variant="standard" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSaveRename()} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseRename}>Отмена</Button>
          <Button onClick={handleSaveRename}>Сохранить</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};