import { useState, useEffect, useCallback } from 'react';
import apiClient from '../services/apiService';
import { useNotification } from '../context/NotificationContext';

interface Slide {
  id: number;
  title: string | null;
  content: string | null;
  slide_number: number;
  background_color: string;
}

interface PresentationData {
  id: string;
  title: string;
  slides: Slide[];
}

export const usePresentation = (presentationId?: string) => {
  const [presentation, setPresentation] = useState<PresentationData | null>(null);
  const [activeSlide, setActiveSlide] = useState<Slide | null>(null);
  const [loading, setLoading] = useState(true);
  const { showNotification } = useNotification();

  const fetchPresentation = useCallback(async () => {
    if (!presentationId) return;
    try {
      setLoading(true);
      const response = await apiClient.get<PresentationData>(`/presentations/${presentationId}`);
      setPresentation(response.data);
      if (response.data.slides.length > 0) {
        setActiveSlide(response.data.slides[0]);
      }
    } catch (error) {
      showNotification('Не удалось загрузить презентацию', 'error');
    } finally {
      setLoading(false);
    }
  }, [presentationId, showNotification]);

  useEffect(() => {
    fetchPresentation();
  }, [fetchPresentation]);

  const handleSelectSlide = (id: number) => {
    const slide = presentation?.slides.find(s => s.id === id);
    if (slide) {
      setActiveSlide(slide);
    }
  };

  const handleUpdateSlide = useCallback(async (slideId: number, data: { title?: string; content?: string }) => {
    try {
      await apiClient.put(`/slides/${slideId}`, data);
      setPresentation(prev => {
        if (!prev) return null;
        const updatedSlides = prev.slides.map(s => 
          s.id === slideId ? { ...s, ...data } : s
        );
        setActiveSlide(prevActive => prevActive ? updatedSlides.find(s => s.id === prevActive.id) || null : null);
        return { ...prev, slides: updatedSlides };
      });
    } catch (error) {
      showNotification('Ошибка сохранения', 'error');
    }
  }, [showNotification]);

  const handleAddSlide = async () => {
    try {
      const response = await apiClient.post(`/presentations/${presentationId}/slides`);
      const newSlide = response.data;
      setPresentation(prev => prev ? { ...prev, slides: [...prev.slides, newSlide] } : null);
      setActiveSlide(newSlide);
      showNotification('Слайд добавлен', 'success');
    } catch (error) {
      showNotification('Не удалось добавить слайд', 'error');
    }
  };

  const handleDeleteSlide = async (slideId: number) => {
    try {
      await apiClient.delete(`/slides/${slideId}`);
      showNotification('Слайд удален', 'success');
      setPresentation(prev => {
        if (!prev) return null;
        const newSlides = prev.slides.filter(s => s.id !== slideId);
        if (activeSlide?.id === slideId) {
          setActiveSlide(newSlides.length > 0 ? newSlides[0] : null);
        }
        return { ...prev, slides: newSlides };
      });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Не удалось удалить слайд';
      showNotification(errorMessage, 'error');
    }
  };
  
  const handleRenamePresentation = useCallback(async (newTitle: string) => {
    if (!presentation) return;
    try {
      await apiClient.put(`/presentations/${presentation.id}`, { title: newTitle });
      setPresentation(prev => prev ? { ...prev, title: newTitle } : null);
      showNotification('Презентация переименована', 'success');
    } catch (error) {
      showNotification('Не удалось переименовать', 'error');
    }
  }, [presentation, showNotification]);

  return { 
    presentation, 
    loading, 
    activeSlide, 
    handleSelectSlide, 
    handleUpdateSlide, 
    handleAddSlide, 
    handleDeleteSlide,
    handleRenamePresentation
  };
};