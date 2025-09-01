import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';

interface HeaderProps {
  onLoginClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  onRegisterClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export const Header: React.FC<HeaderProps> = ({ onLoginClick, onRegisterClick }) => {
  return (
    <AppBar position="static" color="transparent" elevation={0} sx={{ borderBottom: 1, borderColor: 'divider' }}>
      <Toolbar>
        <Typography variant="h6" component="div" fontWeight="bold" sx={{ flexGrow: 1 }}>
          Презентатор.ИИ
        </Typography>
        <Box>
          <Button color="primary" variant="outlined" onClick={onLoginClick} sx={{ mr: 1.5 }}>
            Войти
          </Button>
          <Button variant="contained" onClick={onRegisterClick}>
            Регистрация
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};