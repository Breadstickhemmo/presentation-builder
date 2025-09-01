import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, Box, Tabs, Tab, TextField, Button, Typography, Link, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

type FormType = 'login' | 'register';

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
  initialFormType: FormType;
}

export const AuthModal: React.FC<AuthModalProps> = ({ open, onClose, initialFormType }) => {
  const [tabIndex, setTabIndex] = useState(0);

  useEffect(() => {
    if (open) {
      setTabIndex(initialFormType === 'login' ? 0 : 1);
    }
  }, [initialFormType, open]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log('Form submitted');
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} PaperProps={{ sx: { borderRadius: 2, width: '100%', maxWidth: '450px' } }}>
      <DialogTitle sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        p: 0,
      }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', flexGrow: 1 }}>
          <Tabs value={tabIndex} onChange={handleTabChange} variant="fullWidth">
            <Tab label="Вход" sx={{ py: 2 }} />
            <Tab label="Регистрация" sx={{ py: 2 }} />
          </Tabs>
        </Box>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            color: (theme) => theme.palette.grey[500],
            mx: 1, 
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <DialogContent>
        <Box component="form" onSubmit={handleSubmit} sx={{ pt: 2 }}>
          {tabIndex === 0 && (
            <>
              <TextField margin="normal" required fullWidth id="login-email" label="Email" name="email" autoComplete="email" autoFocus />
              <TextField margin="normal" required fullWidth name="password" label="Пароль" type="password" id="login-password" autoComplete="current-password" />
              <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                Войти
              </Button>
              <Typography variant="body2" align="center">
                Нет аккаунта?{' '}
                <Link href="#" onClick={() => setTabIndex(1)} sx={{ cursor: 'pointer' }}>
                  Зарегистрируйтесь
                </Link>
              </Typography>
            </>
          )}
          {tabIndex === 1 && (
            <>
              <TextField margin="normal" required fullWidth id="register-email" label="Email" name="email" autoComplete="email" autoFocus />
              <TextField margin="normal" required fullWidth name="password" label="Пароль" type="password" id="register-password" />
              <TextField margin="normal" required fullWidth name="confirmPassword" label="Подтвердите пароль" type="password" id="register-confirm-password" />
              <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                Зарегистрироваться
              </Button>
              <Typography variant="body2" align="center">
                Уже есть аккаунт?{' '}
                <Link href="#" onClick={() => setTabIndex(0)} sx={{ cursor: 'pointer' }}>
                  Войдите
                </Link>
              </Typography>
            </>
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
};