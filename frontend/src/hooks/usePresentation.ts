import { useState, useEffect, useCallback, useMemo } from 'react';
import apiClient from '../services/apiService';
import { useNotification } from '../context/NotificationContext';

export interface SlideElement {
  id: string;
  element_type: 'TEXT' | 'IMAGE';
  pos_x: number;
  pos_y: number;
  width: number;
  height: number;
  content: string | null;
  font_size: number;
}

export interface Slide {
  id: number;
  slide_number: number;
  background_color: string;
  elements: SlideElement[];
}

export interface PresentationData {
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
    if (slide) setActiveSlide(slide);
  };

  const handleAddSlide = async () => {
    if (!presentationId) return;
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
    if (!presentation) return;
    try {
      await apiClient.delete(`/slides/${slideId}`);
      showNotification('Слайд удален', 'success');

      const oldSlides = presentation.slides;
      const slideToDeleteIndex = oldSlides.findIndex(s => s.id === slideId);
      
      const newSlides = oldSlides.filter(s => s.id !== slideId);

      if (activeSlide?.id === slideId) {
        if (newSlides.length === 0) {
          setActiveSlide(null);
        } else {
          const newActiveIndex = Math.min(slideToDeleteIndex, newSlides.length - 1);
          setActiveSlide(newSlides[newActiveIndex]);
        }
      }
      
      setPresentation({ ...presentation, slides: newSlides });

    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Не удалось удалить слайд';
      showNotification(errorMessage, 'error');
    }
  };
  
  const handleReorderSlides = useCallback(async (reorderedSlides: Slide[]) => {
    if (!presentation) return;

    const originalSlides = presentation.slides;
    setPresentation(prev => prev ? { ...prev, slides: reorderedSlides } : null);

    const slideIds = reorderedSlides.map(s => s.id);
    try {
      await apiClient.put(`/presentations/${presentation.id}/slides/reorder`, { slide_ids: slideIds });
    } catch (error) {
      showNotification('Не удалось сохранить порядок', 'error');
      setPresentation(prev => prev ? { ...prev, slides: originalSlides } : null);
    }
  }, [presentation, showNotification]);


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

  const handleUpdateElement = useCallback(async (elementId: string, data: Partial<SlideElement>) => {
    if (!activeSlide) return;
    const originalPresentation = presentation;
    
    setPresentation(prev => {
        if (!prev) return null;
        const newSlides = prev.slides.map(s => s.id === activeSlide.id ? { ...s, elements: s.elements.map(e => e.id === elementId ? { ...e, ...data } : e) } : s);
        setActiveSlide(newSlides.find(s => s.id === activeSlide.id) || null);
        return { ...prev, slides: newSlides };
    });
    
    try {
      await apiClient.put(`/elements/${elementId}`, data);
    } catch (error) {
      showNotification('Ошибка сохранения элемента', 'error');
      setPresentation(originalPresentation);
    }
  }, [activeSlide, presentation, showNotification]);

  const handleAddElement = async (type: 'TEXT' | 'IMAGE', content?: string) => {
    if (!activeSlide) return;

    const newElementData = type === 'TEXT'
      ? { element_type: type, content: 'Новый текст' }
      : { element_type: type, content: content, width: 640, height: 360 };

    try {
      const response = await apiClient.post(`/slides/${activeSlide.id}/elements`, newElementData);
      const createdElement = response.data;
      
      setPresentation(prev => {
        if (!prev) return null;
        const newSlides = prev.slides.map(s => s.id === activeSlide.id ? { ...s, elements: [...s.elements, createdElement] } : s);
        setActiveSlide(newSlides.find(s => s.id === activeSlide.id) || null);
        return { ...prev, slides: newSlides };
      });
    } catch (error) { showNotification('Не удалось добавить элемент', 'error'); }
  };

  const handleDeleteElement = async (elementId: string) => {
    if (!activeSlide) return;
    try {
      await apiClient.delete(`/elements/${elementId}`);
      setPresentation(prev => {
        if (!prev) return null;
        const newSlides = prev.slides.map(s => s.id === activeSlide.id ? { ...s, elements: s.elements.filter(e => e.id !== elementId) } : s);
        setActiveSlide(newSlides.find(s => s.id === activeSlide.id) || null);
        return { ...prev, slides: newSlides };
      });
    } catch (error) { showNotification('Не удалось удалить элемент', 'error'); }
  };

  return { 
    presentation, loading, activeSlide, 
    handleSelectSlide, handleAddSlide, handleDeleteSlide, handleRenamePresentation,
    handleReorderSlides,
    handleAddElement, handleUpdateElement, handleDeleteElement
  };
};