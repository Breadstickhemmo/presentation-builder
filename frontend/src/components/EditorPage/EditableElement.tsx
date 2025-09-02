import React, { useState, useEffect } from 'react';
import { Rnd } from 'react-rnd';
import { Box, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import TextareaAutosize from 'react-textarea-autosize';
import { SlideElement } from '../../hooks/usePresentation';

interface EditableElementProps {
  element: SlideElement;
  scale: number;
  onUpdate: (id: string, data: Partial<SlideElement>) => void;
  onDelete: (id: string) => void;
}

export const EditableElement: React.FC<EditableElementProps> = ({ element, scale, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(element.content || '');

  useEffect(() => {
    setContent(element.content || '');
  }, [element.content]);

  const handleTextBlur = () => {
    setIsEditing(false);
    if (content !== element.content) {
      onUpdate(element.id, { content });
    }
  };

  const textStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    padding: '8px',
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
    fontSize: 24,
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

  return (
    <Rnd
      scale={scale}
      size={{ width: element.width, height: element.height }}
      position={{ x: element.pos_x, y: element.pos_y }}
      onDragStop={(e, d) => onUpdate(element.id, { pos_x: d.x, pos_y: d.y })}
      onResizeStop={(e, direction, ref, delta, position) => {
        onUpdate(element.id, {
          width: parseInt(ref.style.width, 10),
          height: parseInt(ref.style.height, 10),
          ...position,
        });
      }}
      bounds="parent"
      minWidth={100}
      minHeight={50}
    >
      <Box
        onDoubleClick={() => setIsEditing(true)}
        sx={{
          width: '100%',
          height: '100%',
          border: '1px solid transparent',
          '&:hover': { border: '1px dashed grey' },
          boxSizing: 'border-box',
          position: 'relative',
          '& .delete-button': { opacity: 0 },
          '&:hover .delete-button': { opacity: 1 },
        }}
      >
        <IconButton
          className="delete-button"
          size="small"
          onClick={() => onDelete(element.id)}
          sx={{
            position: 'absolute',
            top: -12,
            right: -12,
            zIndex: 1,
            bgcolor: 'white',
            border: '1px solid grey',
            transform: `scale(${1 / scale})`,
            transformOrigin: 'top right',
            transition: 'opacity 0.2s',
            '&:hover': { bgcolor: 'error.main', color: 'white' },
          }}
        >
          <DeleteIcon fontSize="inherit" />
        </IconButton>

        {isEditing ? (
          <TextareaAutosize
            onBlur={handleTextBlur}
            value={content}
            onChange={e => setContent(e.target.value)}
            autoFocus
            style={editingStyle}
          />
        ) : (
          <Box sx={textStyle}>
            {element.content}
          </Box>
        )}
      </Box>
    </Rnd>
  );
};