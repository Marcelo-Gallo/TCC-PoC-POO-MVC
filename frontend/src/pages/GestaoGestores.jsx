import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { getUsuarioLogado } from '../utils/auth';
import FormularioGestor from '../components/FormularioGestor';
import TabelaGestores from '../components/TabelaGestores';
import {
  Container,
  Alert,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Typography,
  Box,
  useTheme,
  useMediaQuery,
  IconButton
} from '@mui/material';
import { 
  Shield as ShieldIcon, 
  SettingsBackupRestore as RestoreIcon,
  HelpOutline as HelpIcon,
  Add as AddIcon
} from '@mui/icons-material';

const GestaoGestores = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const usuarioLogado = getUsuarioLogado();

  const [gestores, setGestores] = useState([]);
  const [mensagem, setMensagem] = useState({ texto: '', tipo: 'info' });
  const [openHelp, setOpenHelp] = useState(false);
  const [openFormModal, setOpenFormModal] = useState(false);
  
  const [modalTransferirAberto, setModalTransferirAberto] = useState(false);
  const [modalRestaurarAberto, setModalRestaurarAberto] = useState(false);
  const [gestorAlvo, setGestorAlvo] = useState(null);
  const [dadosRestauracao, setDadosRestauracao] = useState({ nome: '', email: '', senha: '' });

  useEffect(() => {
    carregarGestores();
  }, []);

  const carregarGestores = async () => {
    try {
      const response = await api.get('/gestores');
      setGestores(response.data);
    } catch (error) {
      setMensagem({ texto: 'Erro ao carregar a equipa de operação.', tipo: 'error' });
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
      setModalTransferirAberto(false);
      localStorage.removeItem('token');
      alert("A posse do sistema foi transferida. Terá de fazer login novamente.");
      navigate('/login');
    } catch (error) {
      setMensagem({ texto: error.response?.data?.detail || 'Erro na transferência.', tipo: 'error' });
      setModalTransferirAberto(false);
    }
  };

  const confirmarRestauracao = async () => {
    try {
      await api.put('/gestores/restaurar', { 
        email: dadosRestauracao.email, 
        novo_nome: dadosRestauracao.nome, 
        nova_senha: dadosRestauracao.senha 
      });
      setMensagem({ texto: 'Conta reativada com sucesso!', tipo: 'success' });
      setModalRestaurarAberto(false);
      carregarGestores();
    } catch (error) {
      setMensagem({ texto: error.response?.data?.detail || 'Erro ao restaurar.', tipo: 'error' });
      setModalRestaurarAberto(false);
    }
  };

  const handleArchivedDetected = (dados) => {
    setDadosRestauracao(dados);
    setModalRestaurarAberto(true);
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 3, mb: 2, display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 800, color: 'text.primary', display: 'flex', alignItems: 'center', gap: 2, fontSize: isMobile ? '1.5rem' : '2.125rem' }}>
          Equipa de Operação <ShieldIcon color="primary" fontSize={isMobile ? "medium" : "large"} />
        </Typography>
        {!isMobile && (
          <Typography variant="subtitle1" color="text.secondary">
            Gestão de administradores e controle de hierarquia da plataforma.
          </Typography>
        )}
      </Box>

      {mensagem.texto && (
        <Alert severity={mensagem.tipo} sx={{ mb: 3, flexShrink: 0 }} onClose={() => setMensagem({ texto: '', tipo: 'info' })}>
          {mensagem.texto}
        </Alert>
      )}

      <Grid container spacing={3} sx={{ flexGrow: 1, overflow: 'hidden' }}>
        
        {/* Formulário Fixo Lateral no Desktop */}
        {!isMobile && usuarioLogado?.is_master && (
          <Grid item xs={12} md={4}>
            <FormularioGestor
              aoSucesso={carregarGestores}
              onOpenHelp={() => setOpenHelp(true)}
              setMensagem={setMensagem}
              onArchivedDetected={handleArchivedDetected}
              usuarioLogado={usuarioLogado}
            />
          </Grid>
        )}

        <Grid item xs={12} md={!usuarioLogado?.is_master || isMobile ? 12 : 8} sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          
          {/* Barra de Ações Mobile */}
          {isMobile && usuarioLogado?.is_master && (
            <Box sx={{ mb: 2, display: 'flex', gap: 1, alignItems: 'center' }}>
              <IconButton 
                onClick={() => setOpenHelp(true)}
                sx={{ borderRadius: 1, border: '1px solid', borderColor: 'divider', width: '48px', height: '48px' }}
              >
                <HelpIcon />
              </IconButton>
              
              <Button 
                variant="contained" 
                startIcon={<AddIcon />} 
                onClick={() => setOpenFormModal(true)}
                fullWidth
                sx={{ height: '48px' }}
              >
                Novo Gestor
              </Button>
            </Box>
          )}

          <TabelaGestores
            dados={gestores}
            aoTransferirMaster={(gestor) => { setGestorAlvo(gestor); setModalTransferirAberto(true); }}
            aoDeletar={deletarGestor}
            usuarioLogado={usuarioLogado}
          />
        </Grid>
      </Grid>

      {/* Modal para Cadastro no Celular */}
      <Dialog 
        open={isMobile && openFormModal} 
        onClose={() => setOpenFormModal(false)} 
        fullScreen={isMobile}
      >
        <DialogTitle sx={{ fontWeight: 700, bgcolor: 'primary.main', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Novo Administrador
          <Button onClick={() => setOpenFormModal(false)} sx={{ color: 'white' }}>Fechar</Button>
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <FormularioGestor
            aoSucesso={() => {
              carregarGestores();
              setOpenFormModal(false);
            }}
            onOpenHelp={() => setOpenHelp(true)}
            setMensagem={setMensagem}
            onArchivedDetected={(dados) => {
              setOpenFormModal(false); // Fecha o formulário e abre o modal de restauração
              handleArchivedDetected(dados);
            }}
            usuarioLogado={usuarioLogado}
          />
        </DialogContent>
      </Dialog>

      {/* Modal de Transferência Master */}
      <Dialog open={modalTransferirAberto} onClose={() => setModalTransferirAberto(false)}>
        <DialogTitle sx={{ fontWeight: 'bold', color: 'error.main' }}>Transferir Propriedade</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Está prestes a transferir o nível <strong>Master</strong> para {gestorAlvo?.nome}. 
            Isto revogará as suas permissões de gestão imediatamente.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setModalTransferirAberto(false)} color="inherit">Cancelar</Button>
          <Button onClick={confirmarTransferencia} color="error" variant="contained">Confirmar Transferência</Button>
        </DialogActions>
      </Dialog>

      {/* Modal de Restauração */}
      <Dialog open={modalRestaurarAberto} onClose={() => setModalRestaurarAberto(false)}>
        <DialogTitle sx={{ fontWeight: 'bold', color: 'warning.main', display: 'flex', alignItems: 'center', gap: 1 }}>
          <RestoreIcon /> Conta Inativa
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            O e-mail <strong>{dadosRestauracao.email}</strong> já existe mas está arquivado. Deseja reativá-lo com os novos dados?
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setModalRestaurarAberto(false)} color="inherit">Cancelar</Button>
          <Button onClick={confirmarRestauracao} color="warning" variant="contained">Reativar Agora</Button>
        </DialogActions>
      </Dialog>

      {/* Modal de Ajuda */}
      <Dialog open={openHelp} onClose={() => setOpenHelp(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700, color: 'primary.main' }}>Hierarquia do Sistema</DialogTitle>
        <DialogContent dividers>
          <Typography variant="body2" paragraph>
            <strong>👑 Master:</strong> Único utilizador com poder de gerir a equipa e transferir a posse do sistema.
          </Typography>
          <Typography variant="body2">
            <strong>👤 Admin:</strong> Pode gerir atores, demandas e expertises, mas não altera a equipa.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpenHelp(false)} variant="contained">Entendido</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default GestaoGestores;