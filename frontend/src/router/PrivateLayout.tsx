import React from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';

export const PrivateLayout = () => {
  const { logout } = useAuth();
  return (
    <Box>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Презентатор.ИИ
          </Typography>
          <Button color="inherit" onClick={logout}>Выйти</Button>
        </Toolbar>
      </AppBar>
      <main>
        <Outlet />
      </main>
    </Box>
  );
};