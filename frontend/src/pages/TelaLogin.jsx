import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import {
  Avatar,
  Button,
  TextField,
  Box,
  Typography,
  Container,
  Alert,
  Paper
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

const TelaLogin = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErro('');

    try {
      const formData = new URLSearchParams();
      formData.append('username', email);
      formData.append('password', senha);

      const response = await api.post('/auth/login', formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      localStorage.setItem('token', response.data.access_token);
      navigate('/atores');
    } catch (error) {
      setErro('Credenciais inválidas. Verifique seu e-mail e senha.');
    }
  };

  return (
    <Box 
      sx={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        backgroundColor: 'background.default'
      }}
    >
      <Container component="main" maxWidth="xs">
        <Paper 
          elevation={4} 
          sx={{ 
            p: 4, 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            borderRadius: 3
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'primary.main', width: 56, height: 56 }}>
            <LockOutlinedIcon fontSize="large" />
          </Avatar>
          
          <Typography component="h1" variant="h5" sx={{ fontWeight: 800, mb: 3, mt: 1 }}>
            Acesso do Gestor
          </Typography>

          {erro && (
            <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
              {erro}
            </Alert>
          )}

          <Box component="form" onSubmit={handleLogin} sx={{ mt: 1, width: '100%' }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="E-mail corporativo"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Senha"
              type="password"
              id="password"
              autoComplete="current-password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
            />
            <div style={{ marginTop: '10px', textAlign: 'right' }}>
                <Link to="/recuperar-senha" style={{ fontSize: '14px', color: '#3498db', textDecoration: 'none' }}>
                    Esqueci minha senha
                </Link>
            </div>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              sx={{ mt: 4, mb: 2, height: '50px', fontWeight: 'bold', fontSize: '1.1rem' }}
            >
              Entrar no Sistema
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default TelaLogin;