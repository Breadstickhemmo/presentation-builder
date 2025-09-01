import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';

export const Header = () => {
  const handleLoginClick = () => console.log('Login clicked');
  const handleRegisterClick = () => console.log('Register clicked');

  return (
    <AppBar position="static" color="transparent" elevation={0}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Презентатор.ИИ
        </Typography>
        <Box>
          <Button color="inherit" onClick={handleLoginClick}>
            Войти
          </Button>
          <Button variant="contained" onClick={handleRegisterClick}>
            Регистрация
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};