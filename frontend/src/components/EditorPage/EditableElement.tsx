import React, { useState, useEffect } from 'react';
import { Rnd, RndDragCallback, RndResizeCallback } from 'react-rnd';
import { Box } from '@mui/material';
import TextareaAutosize from 'react-textarea-autosize';
import { SlideElement } from '../../hooks/usePresentation';

interface EditableElementProps {
  element: SlideElement;
  scale: number;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onUpdate: (id: string, data: Partial<SlideElement>) => void;
}

export const EditableElement: React.FC<EditableElementProps> = ({ element, scale, isSelected, onSelect, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(element.content || '');

  useEffect(() => { setContent(element.content || ''); }, [element.content]);

  const handleTextBlur = () => {
    setIsEditing(false);
    if (content !== element.content) { onUpdate(element.id, { content }); }
  };

  const textStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    padding: '8px',
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
    fontSize: element.font_size,
    fontFamily: 'inherit',
    overflow: 'hidden',
    boxSizing: 'border-box',
  };

  const editingStyle = {
    ...textStyle,
    height: undefined,
    background: 'transparent',
    border: 'none',
    resize: 'none' as const,
    outline: 'none',
    color: 'inherit',
  };
  
  const onDragStop: RndDragCallback = (e, d) => {
    onUpdate(element.id, { pos_x: d.x, pos_y: d.y });
  };
  
  const onResizeStop: RndResizeCallback = (e, direction, ref, delta, position) => {
    onUpdate(element.id, {
      width: parseInt(ref.style.width, 10),
      height: parseInt(ref.style.height, 10),
      pos_x: position.x,
      pos_y: position.y,
    });
  };

  const renderContent = () => {
    switch (element.element_type) {
      case 'TEXT':
        return isEditing ? (
          <TextareaAutosize onBlur={handleTextBlur} value={content} onChange={e => setContent(e.target.value)} autoFocus style={editingStyle} />
        ) : (
          <Box sx={textStyle}>{element.content}</Box>
        );
      case 'IMAGE':
        return element.content ? (
          <img 
            src={element.content} 
            alt="slide element" 
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            onDragStart={(e) => e.preventDefault()}
          />
        ) : null;
      case 'YOUTUBE_VIDEO':
        const videoId = element.content;
        const embedSrc = `https://www.youtube.com/embed/${videoId}`;
        return (
            <iframe
                width="100%"
                height="100%"
                src={embedSrc}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
            ></iframe>
        );
      case 'UPLOADED_VIDEO':
        return element.content ? (
            <video
                src={element.content}
                width="100%"
                height="100%"
                controls
                style={{ objectFit: 'contain' }}
            />
        ) : null;
      default:
        return null;
    }
  };

  return (
    <Rnd
      scale={scale}
      size={{ width: element.width, height: element.height }}
      position={{ x: element.pos_x, y: element.pos_y }}
      onDragStop={onDragStop}
      onResizeStop={onResizeStop}
      bounds="parent"
      minWidth={100}
      minHeight={50}
      disableDragging={isEditing}
      onDragStart={() => onSelect(element.id)}
      onClick={(e: React.MouseEvent) => { 
        e.stopPropagation(); 
        onSelect(element.id); 
      }}
    >
      <Box
        onDoubleClick={() => element.element_type === 'TEXT' && setIsEditing(true)}
        sx={{
          width: '100%',
          height: '100%',
          border: '2px solid',
          borderColor: isSelected ? 'primary.main' : 'transparent',
          '&:hover': { borderColor: isSelected ? 'primary.main' : 'rgba(0,0,0,0.2)', },
          boxSizing: 'border-box',
          position: 'relative',
          bgcolor: element.element_type.includes('VIDEO') ? 'black' : 'transparent',
        }}
      >
        {isSelected && (element.element_type === 'YOUTUBE_VIDEO' || element.element_type === 'UPLOADED_VIDEO') && (
            <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1, cursor: 'move' }} />
        )}
        {renderContent()}
      </Box>
    </Rnd>
  );
};