import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { getUsuarioLogado } from '../utils/auth';
import {
  Avatar, Button, TextField, Box, Typography, Container, Alert, Paper
} from '@mui/material';
import LockResetIcon from '@mui/icons-material/LockReset';

const TelaPrimeiroLogin = () => {
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [mensagem, setMensagem] = useState({ texto: '', tipo: 'info' });
  const navigate = useNavigate();
  const usuario = getUsuarioLogado();

  const handleTrocarSenha = async (e) => {
    e.preventDefault();
    
    if (novaSenha !== confirmarSenha) {
      setMensagem({ texto: 'As senhas não coincidem. Tente novamente.', tipo: 'error' });
      return;
    }

    if (novaSenha.length < 6) {
      setMensagem({ texto: 'A nova senha deve ter pelo menos 6 caracteres.', tipo: 'warning' });
      return;
    }

    try {
      await api.put('/gestores/primeiro-login', { nova_senha: novaSenha });
      
      localStorage.removeItem('token');
      alert('Senha atualizada com sucesso! Por favor, faça login com sua nova credencial de segurança.');
      navigate('/login');
    } catch (error) {
      setMensagem({ texto: error.response?.data?.detail || 'Erro ao atualizar a senha.', tipo: 'error' });
    }
  };

  return (
    <Box 
      sx={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        backgroundColor: '#f8fafc' 
      }}
    >
      <Container component="main" maxWidth="sm">
        <Paper 
          elevation={4} 
          sx={{ 
            p: 5, 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            borderRadius: 3,
            borderTop: '5px solid #f59e0b'
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'warning.main', width: 64, height: 64 }}>
            <LockResetIcon fontSize="large" />
          </Avatar>
          
          <Typography component="h1" variant="h5" sx={{ fontWeight: 800, mt: 1 }}>
            Ação de Segurança Necessária
          </Typography>
          <Typography variant="body1" sx={{ mt: 2, mb: 3, textAlign: 'center', color: 'text.secondary' }}>
            Olá, <strong>{usuario?.nome?.split(' ')[0]}</strong>. Este é o seu primeiro acesso. 
            Por questões de segurança, você precisa substituir a senha temporária por uma senha pessoal definitiva.
          </Typography>

          {mensagem.texto && (
            <Alert severity={mensagem.tipo} sx={{ width: '100%', mb: 3 }}>
              {mensagem.texto}
            </Alert>
          )}

          <Box component="form" onSubmit={handleTrocarSenha} sx={{ width: '100%' }}>
            <TextField
              margin="normal"
              required
              fullWidth
              label="Nova Senha Pessoal"
              type="password"
              value={novaSenha}
              onChange={(e) => setNovaSenha(e.target.value)}
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Confirme a Nova Senha"
              type="password"
              value={confirmarSenha}
              onChange={(e) => setConfirmarSenha(e.target.value)}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="warning"
              size="large"
              sx={{ mt: 4, mb: 2, height: '54px', fontWeight: 'bold', fontSize: '1.1rem' }}
            >
              Definir Nova Senha e Acessar
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default TelaPrimeiroLogin;