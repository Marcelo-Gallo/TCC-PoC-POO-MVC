import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  IconButton,
  Tooltip,
  Divider,
  Alert,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  HelpOutline as HelpIcon
} from '@mui/icons-material';
import api from '../services/api';

const FormularioGestor = ({
  aoSucesso,
  onOpenHelp,
  setMensagem,
  onArchivedDetected,
  usuarioLogado
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const limparCampos = () => {
    setNome('');
    setEmail('');
    setSenha('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/gestores', { nome, email, senha });
      setMensagem({ texto: 'Gestor cadastrado com sucesso!', tipo: 'success' });
      limparCampos();
      aoSucesso();
    } catch (error) {
      if (error.response?.status === 409 && error.response?.data?.detail === 'USER_ARCHIVED') {
        onArchivedDetected({ nome, email, senha });
      } else {
        setMensagem({ 
          texto: error.response?.data?.detail || 'Erro ao cadastrar.', 
          tipo: 'error' 
        });
      }
    }
  };

  if (!usuarioLogado?.is_master) return null;

  return (
    <Paper
      elevation={isMobile ? 0 : 1}
      sx={{
        p: isMobile ? 0 : 3,
        borderRadius: isMobile ? 0 : 2,
        position: isMobile ? 'static' : 'sticky',
        top: '0',
        boxShadow: isMobile ? 'none' : '0 4px 12px rgba(0,0,0,0.05)',
        backgroundColor: 'transparent'
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>
          Novo Administrador
        </Typography>
        <Tooltip title="Sobre as permissões">
          <IconButton size="small" onClick={onOpenHelp}>
            <HelpIcon fontSize="small" color="action" />
          </IconButton>
        </Tooltip>
      </Box>

      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField
          label="Nome Completo"
          fullWidth
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          required
          variant="filled"
        />

        <TextField
          label="E-mail Corporativo"
          type="email"
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          variant="filled"
        />

        <TextField
          label="Senha Temporária"
          type="password"
          fullWidth
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          required
          variant="filled"
        />

        <Button 
          type="submit" 
          variant="contained" 
          color="primary" 
          fullWidth 
          sx={{ height: '48px', mt: 1 }}
        >
          Adicionar à Equipe
        </Button>
      </Box>
      
      <Divider sx={{ my: 3 }} />
      
      <Alert severity="warning" variant="outlined" sx={{ fontSize: '0.75rem' }}>
        <strong>Nota de Segurança:</strong> Novos membros são criados com nível "Admin". Apenas um Master pode transferir a posse total do sistema.
      </Alert>
    </Paper>
  );
};

export default FormularioGestor;