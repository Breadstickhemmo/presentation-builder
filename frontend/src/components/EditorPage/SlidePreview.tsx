import React from 'react';
import { Paper, Box } from '@mui/material';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
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
      {slide.elements.map(element => {
        let content;

        switch(element.element_type) {
            case 'IMAGE':
                content = element.content ? (
                    <img 
                        src={element.content} 
                        alt=""
                        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                    />
                ) : null;
                break;
            case 'YOUTUBE_VIDEO':
                content = element.thumbnailUrl ? (
                    <Box sx={{ width: '100%', height: '100%', position: 'relative', bgcolor: 'black' }}>
                        <img 
                            src={element.thumbnailUrl}
                            alt="video thumbnail"
                            style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }}
                        />
                        <PlayCircleOutlineIcon sx={{ 
                            position: 'absolute', top: '50%', left: '50%', 
                            transform: 'translate(-50%, -50%)', fontSize: '4rem', color: 'white'
                        }} />
                    </Box>
                ) : null;
                break;
            case 'UPLOADED_VIDEO':
                content = (
                    <Box sx={{ width: '100%', height: '100%', position: 'relative', bgcolor: 'black' }}>
                        <PlayCircleOutlineIcon sx={{ 
                            position: 'absolute', top: '50%', left: '50%', 
                            transform: 'translate(-50%, -50%)', fontSize: '4rem', color: 'white'
                        }} />
                    </Box>
                );
                break;
            case 'TEXT':
            default:
                content = (
                    <Box
                        sx={{
                            width: '100%', height: '100%', whiteSpace: 'pre-wrap',
                            wordBreak: 'break-word', fontSize: element.font_size,
                            overflow: 'hidden', p: '8px'
                        }}
                    >
                        {element.content}
                    </Box>
                );
                break;
        }

        return (
            <Box
                key={element.id}
                sx={{
                    position: 'absolute', left: element.pos_x, top: element.pos_y,
                    width: element.width, height: element.height, boxSizing: 'border-box'
                }}
            >
                {content}
            </Box>
        );
      })}
    </Paper>
  );
};