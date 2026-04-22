import React, { useState, useEffect } from 'react';
import api from '../services/api';
import FormularioExpertise from '../components/FormularioExpertise';
import TabelaExpertises from '../components/TabelaExpertises';
import GestaoPortfolio from '../components/GestaoPortfolio';
import {
  Container,
  Alert,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  useTheme,
  useMediaQuery,
  Tooltip,
  IconButton,
  Fade
} from '@mui/material';
import { 
  Add as AddIcon, 
  Inventory as InventoryIcon, 
  ArrowBack as BackIcon,
  HelpOutline as HelpIcon
} from '@mui/icons-material';

const TelaExpertise = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [expertises, setExpertises] = useState([]);
  const [atores, setAtores] = useState([]);
  const [expertiseParaEditar, setExpertiseParaEditar] = useState(null);
  const [expertiseSelecionada, setExpertiseSelecionada] = useState(null);
  const [mensagem, setMensagem] = useState({ texto: '', tipo: 'info' });
  const [mostrarInativos, setMostrarInativos] = useState(false);
  const [openHelp, setOpenHelp] = useState(false);
  const [openFormModal, setOpenFormModal] = useState(false);

  useEffect(() => {
    carregarExpertises();
    carregarAtoresUniversidade();
  }, [mostrarInativos]);

  useEffect(() => {
    if (expertiseParaEditar) {
      setOpenFormModal(true);
    }
  }, [expertiseParaEditar]);

  const carregarExpertises = async () => {
    try {
      const response = await api.get(`/expertises?mostrar_inativos=${mostrarInativos}`);
      setExpertises(response.data);
    } catch (error) {
      setMensagem({ texto: 'Erro ao carregar a lista de investigadores.', tipo: 'error' });
    }
  };

  const carregarAtoresUniversidade = async () => {
    try {
      const resAtivos = await api.get('/atores');
      const resInativos = await api.get('/atores?mostrar_inativos=true');
      const todosAtores = [...resAtivos.data, ...resInativos.data];
      setAtores(todosAtores.filter(a => a.tipo_helice === 'UNIVERSIDADE'));
    } catch (error) {
      setMensagem({ texto: 'Erro ao carregar as universidades para o formulário.', tipo: 'error' });
    }
  };

  const inativarExpertise = async (id) => {
    if (window.confirm('Deseja realmente inativar este investigador? Todos os trabalhos do portfólio serão ocultados (Exclusão em Cascata).')) {
      try {
        await api.put(`/expertises/${id}`, { is_deleted: true });
        setMensagem({ texto: 'Investigador inativado com sucesso!', tipo: 'success' });
        if (expertiseSelecionada === id) setExpertiseSelecionada(null);
        carregarExpertises();
      } catch (error) {
        setMensagem({ texto: 'Erro ao inativar o investigador.', tipo: 'error' });
      }
    }
  };

  const restaurarExpertise = async (id) => {
    if (window.confirm('Deseja realmente restaurar este investigador?')) {
      try {
        await api.put(`/expertises/${id}`, { is_deleted: false });
        setMensagem({ texto: 'Investigador restaurado com sucesso!', tipo: 'success' });
        carregarExpertises();
      } catch (error) {
        setMensagem({ texto: 'Erro ao restaurar o investigador.', tipo: 'error' });
      }
    }
  };

  const fecharModalForm = () => {
    setOpenFormModal(false);
    setExpertiseParaEditar(null);
  };

  const abrirPortfolio = (id) => {
    setExpertiseSelecionada(id);
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 3, mb: 2, display: 'flex', flexDirection: 'column', height: '100%' }}>
      {mensagem.texto && (
        <Alert 
          severity={mensagem.tipo} 
          sx={{ mb: 3, flexShrink: 0 }} 
          onClose={() => setMensagem({ texto: '', tipo: 'info' })}
        >
          {mensagem.texto}
        </Alert>
      )}

      <Grid container spacing={3} sx={{ flexGrow: 1, overflow: 'hidden' }}>
        
        {/* Lado Esquerdo: Formulário Fixo no Desktop */}
        {!isMobile && (
          <Grid item xs={12} md={4}>
            <FormularioExpertise
              expertiseParaEditar={expertiseParaEditar}
              atores={atores}
              aoSucesso={carregarExpertises}
              aoCancelar={() => setExpertiseParaEditar(null)}
              mostrarInativos={mostrarInativos}
              setMostrarInativos={setMostrarInativos}
              onOpenHelp={() => setOpenHelp(true)}
              setMensagem={setMensagem}
            />
          </Grid>
        )}

        {/* Lado Direito: Tabela e Portfólio */}
        <Grid item xs={12} md={isMobile ? 12 : 8} sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          
          {isMobile && (
            <Box sx={{ mb: 2, display: 'flex', gap: 1, alignItems: 'center' }}>
              {!mostrarInativos ? (
                <>
                  <IconButton onClick={() => setOpenHelp(true)} sx={{ borderRadius: 1, border: '1px solid', borderColor: 'divider', width: '48px', height: '48px' }}>
                    <HelpIcon />
                  </IconButton>
                  <Tooltip title="Ver Lixeira / Arquivados">
                    <Button variant="outlined" color="inherit" onClick={() => { setMostrarInativos(true); setExpertiseSelecionada(null); }} sx={{ minWidth: '48px', height: '48px', px: 0, borderColor: 'divider' }}>
                      <InventoryIcon />
                    </Button>
                  </Tooltip>
                  <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpenFormModal(true)} fullWidth sx={{ height: '48px' }}>
                    Novo Investigador
                  </Button>
                </>
              ) : (
                <Button variant="outlined" startIcon={<BackIcon />} onClick={() => setMostrarInativos(false)} fullWidth color="inherit" sx={{ height: '48px', borderColor: 'divider' }}>
                  Voltar aos Ativos
                </Button>
              )}
            </Box>
          )}
          
          <Grid container spacing={3} sx={{ flexGrow: 1, height: '100%' }}>
            {/* Tabela de Investigadores */}
            <Grid item xs={12} md={expertiseSelecionada && !mostrarInativos ? 7 : 12}>
              <TabelaExpertises
                dados={expertises}
                expertiseSelecionada={expertiseSelecionada}
                aoEditar={setExpertiseParaEditar}
                aoInativar={inativarExpertise}
                aoRestaurar={restaurarExpertise}
                aoAbrirPortfolio={abrirPortfolio}
                mostrarInativos={mostrarInativos}
              />
            </Grid>

            {/* Componente Portfólio no Desktop (ocupa a lateral) */}
            {expertiseSelecionada && !mostrarInativos && !isMobile && (
              <Fade in={!!expertiseSelecionada} timeout={400}>
                <Grid item xs={12} md={5}>
                  <GestaoPortfolio 
                    expertiseId={expertiseSelecionada} 
                    onClose={() => setExpertiseSelecionada(null)}
                    onAtualizar={carregarExpertises}
                  />
                </Grid>
              </Fade>
            )}
          </Grid>
        </Grid>
      </Grid>

      {/* Modal para Cadastro/Edição no Celular */}
      <Dialog open={isMobile && openFormModal} onClose={fecharModalForm} fullScreen={isMobile}>
        <DialogTitle sx={{ fontWeight: 700, bgcolor: 'primary.main', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {expertiseParaEditar ? 'Editar Investigador' : 'Novo Investigador'}
          <Button onClick={fecharModalForm} sx={{ color: 'white' }}>Fechar</Button>
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <FormularioExpertise
            expertiseParaEditar={expertiseParaEditar}
            atores={atores}
            aoSucesso={() => { carregarExpertises(); fecharModalForm(); }}
            aoCancelar={fecharModalForm}
            mostrarInativos={mostrarInativos}
            setMostrarInativos={setMostrarInativos}
            onOpenHelp={() => setOpenHelp(true)}
            setMensagem={setMensagem}
          />
        </DialogContent>
      </Dialog>

      {/* Modal para Gestão de Portfólio no Celular */}
      <Dialog open={isMobile && !!expertiseSelecionada} onClose={() => setExpertiseSelecionada(null)} fullScreen={isMobile}>
        <DialogContent sx={{ p: 0 }}>
           {expertiseSelecionada && (
              <GestaoPortfolio 
                expertiseId={expertiseSelecionada} 
                onClose={() => setExpertiseSelecionada(null)}
                onAtualizar={carregarExpertises}
              />
           )}
        </DialogContent>
      </Dialog>

      {/* Modal de Ajuda */}
      <Dialog open={openHelp} onClose={() => setOpenHelp(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700, color: 'primary.main' }}>
          Catálogo de Investigadores
        </DialogTitle>
        <DialogContent dividers>
          <Typography variant="body1" paragraph>
            As expertises representam o conhecimento técnico e soluções científicas oferecidas pelas <strong>Universidades</strong>.
          </Typography>
          <Box component="ul" sx={{ pl: 2, mb: 2, typography: 'body2', color: 'text.secondary' }}>
            <li style={{ marginBottom: '8px' }}>
              <strong>Investigador:</strong> Docente ou pesquisador responsável por uma linha de pesquisa.
            </li>
            <li style={{ marginBottom: '8px' }}>
              <strong>Portfólio:</strong> Clique no ícone de pasta na tabela para cadastrar os trabalhos e artigos publicados por este investigador.
            </li>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 1 }}>
          <Button onClick={() => setOpenHelp(false)} variant="contained" disableElevation>
            Entendido
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default TelaExpertise;