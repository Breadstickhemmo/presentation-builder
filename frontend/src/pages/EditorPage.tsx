import React, { useRef, useState, useLayoutEffect, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Box, CircularProgress, Typography, Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button, Tabs, Tab, styled } from '@mui/material';
import { usePresentation } from '../hooks/usePresentation';
import { SlideList } from '../components/EditorPage/SlideList';
import { SlideEditor } from '../components/EditorPage/SlideEditor';
import { EditorToolbar } from '../components/EditorPage/EditorToolbar';
import apiClient from '../services/apiService';
import { useNotification } from '../context/NotificationContext';

const BASE_WIDTH = 1280;
const BASE_HEIGHT = 720;

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

export const EditorPage = () => {
  const { presentationId } = useParams<{ presentationId: string }>();
  const { showNotification } = useNotification();
  const { 
    presentation, loading, activeSlide, 
    handleSelectSlide, handleAddSlide, handleDeleteSlide, handleRenamePresentation,
    handleReorderSlides,
    handleAddElement, handleUpdateElement, handleDeleteElement 
  } = usePresentation(presentationId);

  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [isRenameOpen, setIsRenameOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');
  const [videoModalTab, setVideoModalTab] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;
      if (['TEXTAREA', 'INPUT'].includes(target.tagName)) {
        return;
      }

      if ((event.key === 'Delete' || event.key === 'Backspace') && selectedElementId) {
        handleDeleteElement(selectedElementId);
        setSelectedElementId(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedElementId, handleDeleteElement]);

  useEffect(() => {
    setSelectedElementId(null);
  }, [activeSlide]);

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

  const handleOpenVideoModal = () => setIsVideoModalOpen(true);
  const handleCloseVideoModal = () => {
    setIsVideoModalOpen(false);
    setVideoUrl('');
    setVideoModalTab(0);
    setIsUploading(false);
  }

  const handleAddYoutubeVideo = () => {
    if(videoUrl) {
        handleAddElement('YOUTUBE_VIDEO', videoUrl);
    }
    handleCloseVideoModal();
  }

  const handleVideoFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    setIsUploading(true);
    try {
        const response = await apiClient.post('/upload/video', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        handleAddElement('UPLOADED_VIDEO', response.data.url);
        handleCloseVideoModal();
    } catch (error) {
        showNotification('Не удалось загрузить видео', 'error');
        setIsUploading(false);
    }
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
          onAddVideoClick={handleOpenVideoModal}
        />
        <Box sx={{ display: 'flex', flexGrow: 1, overflow: 'hidden' }}>
          <SlideList
            slides={presentation.slides}
            activeSlideId={activeSlide?.id || null}
            onSelectSlide={handleSelectSlide}
            onAddSlide={handleAddSlide}
            onDeleteSlide={handleDeleteSlide}
            onReorderSlides={handleReorderSlides}
          />
          <Box 
            ref={containerRef}
            sx={{ flexGrow: 1, backgroundColor: 'grey.200', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}
          >
            <Box sx={{ transform: `scale(${scale})`, transformOrigin: 'center center' }}>
              <SlideEditor 
                slide={activeSlide} 
                scale={scale}
                selectedElementId={selectedElementId}
                onSelectElement={setSelectedElementId}
                onUpdateElement={handleUpdateElement}
              />
            </Box>
          </Box>
        </Box>
      </Box>
      <Dialog open={isRenameOpen} onClose={handleCloseRename} fullWidth maxWidth="xs">
        <DialogTitle>Переименовать презентацию</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Название презентации"
            type="text"
            fullWidth
            variant="standard"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSaveRename()}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseRename}>Отмена</Button>
          <Button onClick={handleSaveRename}>Сохранить</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={isVideoModalOpen} onClose={handleCloseVideoModal} fullWidth maxWidth="sm">
        <DialogTitle>Добавить видео</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Tabs value={videoModalTab} onChange={(_, newValue) => setVideoModalTab(newValue)} centered>
                <Tab label="YouTube" />
                <Tab label="Загрузить файл" />
            </Tabs>
            {videoModalTab === 0 && (
                <TextField
                    autoFocus
                    margin="dense"
                    label="Ссылка на видео"
                    type="url"
                    fullWidth
                    variant="standard"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=..."
                    onKeyPress={(e) => e.key === 'Enter' && handleAddYoutubeVideo()}
                />
            )}
            {videoModalTab === 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 4, border: '2px dashed grey', borderRadius: 2 }}>
                    <Button
                        component="label"
                        variant="contained"
                        disabled={isUploading}
                    >
                        {isUploading ? <CircularProgress size={24} /> : 'Выбрать видеофайл'}
                        <VisuallyHiddenInput type="file" accept="video/mp4,video/webm" onChange={handleVideoFileUpload} />
                    </Button>
                </Box>
            )}
        </DialogContent>
        <DialogActions>
            <Button onClick={handleCloseVideoModal}>Отмена</Button>
            {videoModalTab === 0 && <Button onClick={handleAddYoutubeVideo}>Добавить</Button>}
        </DialogActions>
    </Dialog>
    </>
  );
};