import React from 'react';
import { AppBar, Toolbar, Typography, Tooltip, IconButton, ButtonGroup } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import EditIcon from '@mui/icons-material/Edit';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import { useAuth } from '../../context/AuthContext';

interface EditorToolbarProps {
  title: string;
  presentationId: string;
  onRenameClick: () => void;
  onAddElement: (type: 'TEXT') => void;
}

export const EditorToolbar: React.FC<EditorToolbarProps> = ({ title, presentationId, onRenameClick, onAddElement }) => {
  const { token } = useAuth();

  const handleDownload = () => {
    const url = `http://127.0.0.1:5000/api/presentations/${presentationId}/download`;
    fetch(url, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(res => res.blob())
    .then(blob => {
      const href = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = href;
      link.setAttribute('download', `${title}.pptx`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(href);
    });
  };

  return (
    <AppBar position="static" color="default" elevation={1}>
      <Toolbar variant="dense">
        <Typography variant="h6" noWrap sx={{ flexGrow: 1 }}>{title}</Typography>
        
        <ButtonGroup variant="outlined" sx={{ mr: 2 }}>
          <Tooltip title="Добавить текст">
            <IconButton onClick={() => onAddElement('TEXT')}><TextFieldsIcon /></IconButton>
          </Tooltip>
        </ButtonGroup>

        <Tooltip title="Переименовать"><IconButton onClick={onRenameClick}><EditIcon /></IconButton></Tooltip>
        <Tooltip title="Скачать (.pptx)"><IconButton onClick={handleDownload}><DownloadIcon /></IconButton></Tooltip>
      </Toolbar>
    </AppBar>
  );
};