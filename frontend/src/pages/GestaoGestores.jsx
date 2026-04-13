import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { getUsuarioLogado } from '../utils/auth';
import {
  Container, Typography, Box, TextField, Button, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Paper, IconButton, Alert, Grid, Chip,
  Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions
} from '@mui/material';
import { Delete as DeleteIcon, Key as KeyIcon, Shield as ShieldIcon, SettingsBackupRestore as RestoreIcon } from '@mui/icons-material';

const GestaoGestores = () => {
  const navigate = useNavigate();
  const usuarioLogado = getUsuarioLogado();
  const [gestores, setGestores] = useState([]);
  const [mensagem, setMensagem] = useState({ texto: '', tipo: 'info' });
  
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const [modalAberto, setModalAberto] = useState(false);
  const [modalRestaurarAberto, setModalRestaurarAberto] = useState(false);
  const [gestorAlvo, setGestorAlvo] = useState(null);

  useEffect(() => {
    carregarGestores();
  }, []);

  const carregarGestores = async () => {
    try {
      const response = await api.get('/gestores');
      setGestores(response.data);
    } catch (error) {
      setMensagem({ texto: 'Erro ao carregar a equie.', tipo: 'error' });
    }
  };

  const criarGestor = async (e) => {
    e.preventDefault();
    try {
      await api.post('/gestores', { nome, email, senha });
      setMensagem({ texto: 'Gestor cadastrado com sucesso!', tipo: 'success' });
      setNome(''); setEmail(''); setSenha('');
      carregarGestores();
    } catch (error) {
      if (error.response?.status === 409 && error.response?.data?.detail === 'USER_ARCHIVED') {
        setModalRestaurarAberto(true);
      } else {
        setMensagem({ texto: error.response?.data?.detail || 'Erro ao cadastrar.', tipo: 'error' });
      }
    }
  };

  const confirmarRestauracao = async () => {
    try {
      await api.put('/gestores/restaurar', { email, novo_nome: nome, nova_senha: senha });
      setMensagem({ texto: 'Conta reativada com sucesso!', tipo: 'success' });
      setModalRestaurarAberto(false);
      setNome(''); setEmail(''); setSenha('');
      carregarGestores();
    } catch (error) {
      setMensagem({ texto: error.response?.data?.detail || 'Erro ao restaurar.', tipo: 'error' });
      setModalRestaurarAberto(false);
    }
  };

  const deletarGestor = async (id) => {
    if (window.confirm('Tem a certeza que deseja excluir este gestor da plataforma?')) {
      try {
        await api.delete(`/gestores/${id}`);
        setMensagem({ texto: 'Gestor removido com sucesso!', tipo: 'success' });
        carregarGestores();
      } catch (error) {
        setMensagem({ texto: error.response?.data?.detail || 'Erro ao remover.', tipo: 'error' });
      }
    }
  };

  const confirmarTransferencia = async () => {
    try {
      await api.post(`/gestores/${gestorAlvo.id}/transferir-master`);
      setModalAberto(false);

      localStorage.removeItem('token');
      alert("A posse do sistema foi transferida. Você será redirecionado para o login para atualizar as suas permissões de segurança.");
      navigate('/login');
    } catch (error) {
      setMensagem({ texto: error.response?.data?.detail || 'Erro ao transferir.', tipo: 'error' });
      setModalAberto(false);
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 800, color: 'text.primary', display: 'flex', alignItems: 'center', gap: 2 }}>
          Equipe de Operação <ShieldIcon color="primary" fontSize="large" />
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Gestão de administradores da prefeitura e controle de acessos da plataforma.
        </Typography>
      </Box>

      {mensagem.texto && (
        <Alert severity={mensagem.tipo} sx={{ mb: 3 }} onClose={() => setMensagem({ texto: '', tipo: 'info' })}>
          {mensagem.texto}
        </Alert>
      )}

      {usuarioLogado?.is_master && (
        <Paper sx={{ p: 3, mb: 4, borderRadius: 2 }}>
          <Typography variant="h6" sx={{ mb: 3, fontWeight: 700 }}>Cadastrar Novo Administrador</Typography>
          <Box component="form" onSubmit={criarGestor}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={4}>
                <TextField label="Nome Completo" fullWidth value={nome} onChange={(e) => setNome(e.target.value)} required />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField label="E-mail Corporativo" type="email" fullWidth value={email} onChange={(e) => setEmail(e.target.value)} required />
              </Grid>
              <Grid item xs={12} md={2}>
                <TextField label="Senha Temporária" type="password" fullWidth value={senha} onChange={(e) => setSenha(e.target.value)} required />
              </Grid>
              <Grid item xs={12} md={2}>
                <Button type="submit" variant="contained" color="success" fullWidth sx={{ height: '56px' }}>Adicionar</Button>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      )}

      <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
        <Table>
          <TableHead sx={{ backgroundColor: '#f8fafc' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Colaborador</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>E-mail</TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold' }}>Nível de Acesso</TableCell>
              {usuarioLogado?.is_master && (
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Controles Master</TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {gestores.map(gestor => (
              <TableRow key={gestor.id} hover sx={{ backgroundColor: gestor.is_master ? '#fffbeb' : 'inherit' }}>
                <TableCell sx={{ fontWeight: gestor.is_master ? 800 : 500 }}>
                  {gestor.nome} {usuarioLogado?.email === gestor.email && " (Você)"}
                </TableCell>
                <TableCell>{gestor.email}</TableCell>
                <TableCell align="center">
                  <Chip 
                    label={gestor.is_master ? "👑 Master" : "Admin"} 
                    color={gestor.is_master ? "warning" : "default"}
                    sx={{ fontWeight: 'bold' }}
                  />
                </TableCell>
                
                {usuarioLogado?.is_master && (
                  <TableCell align="center">
                    {!gestor.is_master && (
                      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                        <Button 
                          size="small" 
                          variant="outlined" 
                          color="warning" 
                          startIcon={<KeyIcon />}
                          onClick={() => { setGestorAlvo(gestor); setModalAberto(true); }}
                        >
                          Passar Master
                        </Button>
                        <IconButton color="error" onClick={() => deletarGestor(gestor.id)}>
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    )}
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      
      <Dialog open={modalAberto} onClose={() => setModalAberto(false)}>
        <DialogTitle sx={{ fontWeight: 'bold', color: 'error.main', display: 'flex', alignItems: 'center', gap: 1 }}>
          <ShieldIcon /> Transferência de Propriedade
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: 'text.primary', fontWeight: 500 }}>
            Você está prestes a transferir a coroa de Master para <strong>{gestorAlvo?.nome}</strong>.
          </DialogContentText>
          <DialogContentText sx={{ mt: 2 }}>
            <strong>Atenção:</strong> Esta é uma ação irreversível por você. Ao confirmar, você perderá instantaneamente os direitos de adicionar, remover ou editar membros da equipe. Você será desconectado da plataforma para aplicar as novas regras.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button onClick={() => setModalAberto(false)} color="inherit" variant="text">Cancelar</Button>
          <Button onClick={confirmarTransferencia} color="error" variant="contained" sx={{ fontWeight: 'bold' }}>
            Eu entendo o risco, Transferir Posse
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal de Restauração de Conta Arquivada */}
      <Dialog open={modalRestaurarAberto} onClose={() => setModalRestaurarAberto(false)}>
        <DialogTitle sx={{ fontWeight: 'bold', color: 'warning.main', display: 'flex', alignItems: 'center', gap: 1 }}>
          <RestoreIcon /> Conta Inativa Detectada
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: 'text.primary', mb: 2 }}>
            O e-mail <strong>{email}</strong> já está registrado em nossa base, mas encontra-se arquivado (excluído).
          </DialogContentText>
          <DialogContentText>
            Deseja reativar o acesso desta conta? O sistema aplicará os dados que você acabou de digitar:
          </DialogContentText>
          <Box sx={{ mt: 2, p: 2, bgcolor: '#f8fafc', borderRadius: 1 }}>
            <Typography variant="body2"><strong>Novo Nome:</strong> {nome}</Typography>
            <Typography variant="body2"><strong>Nova Senha Temporária:</strong> {senha.replace(/./g, '*')}</Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button onClick={() => setModalRestaurarAberto(false)} color="inherit" variant="text">Cancelar</Button>
          <Button onClick={confirmarRestauracao} color="warning" variant="contained" sx={{ fontWeight: 'bold' }}>
            Reativar Conta
          </Button>
        </DialogActions>
      </Dialog>
      
    </Container>
  );
};

export default GestaoGestores;