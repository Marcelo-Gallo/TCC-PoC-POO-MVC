import React, { useState, useEffect } from 'react';
import api from '../services/api';
import FormularioAtor from '../components/FormularioAtor';
import TabelaAtores from '../components/TabelaAtores';
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
  IconButton
} from '@mui/material';
import { 
  Add as AddIcon, 
  Inventory as InventoryIcon, 
  ArrowBack as BackIcon,
  HelpOutline as HelpIcon
} from '@mui/icons-material';

const GestaoAtores = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [atores, setAtores] = useState([]);
  const [atorParaEditar, setAtorParaEditar] = useState(null);
  const [mensagem, setMensagem] = useState({ texto: '', tipo: 'info' });
  const [mostrarInativos, setMostrarInativos] = useState(false);
  const [openHelp, setOpenHelp] = useState(false);
  const [openFormModal, setOpenFormModal] = useState(false);

  useEffect(() => {
    carregarAtores();
  }, [mostrarInativos]);

  useEffect(() => {
    if (atorParaEditar) {
      setOpenFormModal(true);
    }
  }, [atorParaEditar]);

  const carregarAtores = async () => {
    try {
      const response = await api.get(`/atores?mostrar_inativos=${mostrarInativos}`);
      setAtores(response.data);
    } catch (error) {
      setMensagem({ texto: 'Erro ao carregar a lista de atores.', tipo: 'error' });
    }
  };

  const inativarAtor = async (id) => {
    if (window.confirm('Deseja realmente inativar este ator?')) {
      try {
        await api.put(`/atores/${id}`, { is_deleted: true });
        setMensagem({ texto: 'Ator inativado com sucesso!', tipo: 'success' });
        carregarAtores();
      } catch (error) {
        setMensagem({ texto: 'Erro ao inativar o ator.', tipo: 'error' });
      }
    }
  };

  const restaurarAtor = async (id) => {
    if (window.confirm('Deseja realmente restaurar este ator e torná-lo ativo novamente?')) {
      try {
        await api.put(`/atores/${id}`, { is_deleted: false });
        setMensagem({ texto: 'Ator restaurado com sucesso!', tipo: 'success' });
        carregarAtores();
      } catch (error) {
        setMensagem({ texto: 'Erro ao restaurar o ator.', tipo: 'error' });
      }
    }
  };

  const fecharModalForm = () => {
    setOpenFormModal(false);
    setAtorParaEditar(null);
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
        {!isMobile && (
          <Grid item xs={12} md={4}>
            <FormularioAtor
              atorParaEditar={atorParaEditar}
              aoSucesso={carregarAtores}
              aoCancelar={() => setAtorParaEditar(null)}
              mostrarInativos={mostrarInativos}
              setMostrarInativos={setMostrarInativos}
              onOpenHelp={() => setOpenHelp(true)}
              setMensagem={setMensagem}
            />
          </Grid>
        )}

        <Grid item xs={12} md={isMobile ? 12 : 8} sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          
          {isMobile && (
            <Box sx={{ mb: 2, display: 'flex', gap: 1, alignItems: 'center' }}>
              {!mostrarInativos ? (
                <>
                  <IconButton 
                    onClick={() => setOpenHelp(true)}
                    sx={{ 
                      borderRadius: 1, 
                      border: '1px solid', 
                      borderColor: 'divider', 
                      color: 'text.secondary',
                      width: '48px',
                      height: '48px'
                    }}
                  >
                    <HelpIcon />
                  </IconButton>
                  
                  <Tooltip title="Ver Lixeira / Arquivados">
                    <Button 
                      variant="outlined" 
                      color="inherit" 
                      onClick={() => setMostrarInativos(true)}
                      sx={{ minWidth: '48px', height: '48px', px: 0, borderColor: 'divider', color: 'text.secondary' }}
                    >
                      <InventoryIcon />
                    </Button>
                  </Tooltip>
                  
                  <Button 
                    variant="contained" 
                    startIcon={<AddIcon />} 
                    onClick={() => setOpenFormModal(true)}
                    fullWidth
                    sx={{ height: '48px' }}
                  >
                    Novo Ator
                  </Button>
                </>
              ) : (
                <Button 
                  variant="outlined" 
                  startIcon={<BackIcon />} 
                  onClick={() => setMostrarInativos(false)}
                  fullWidth
                  color="inherit"
                  sx={{ height: '48px', borderColor: 'divider', color: 'text.secondary' }}
                >
                  Voltar aos Ativos
                </Button>
              )}
            </Box>
          )}
          
          <TabelaAtores
            dados={atores}
            aoEditar={setAtorParaEditar}
            aoInativar={inativarAtor}
            aoRestaurar={restaurarAtor}
            mostrarInativos={mostrarInativos}
          />
        </Grid>
      </Grid>

      <Dialog 
        open={isMobile && openFormModal} 
        onClose={fecharModalForm} 
        fullScreen={isMobile}
      >
        <DialogTitle sx={{ fontWeight: 700, bgcolor: 'primary.main', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {atorParaEditar ? 'Editar Ator' : 'Novo Ator'}
          <Button onClick={fecharModalForm} sx={{ color: 'white' }}>Fechar</Button>
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <FormularioAtor
            atorParaEditar={atorParaEditar}
            aoSucesso={() => {
              carregarAtores();
              fecharModalForm();
            }}
            aoCancelar={fecharModalForm}
            mostrarInativos={mostrarInativos}
            setMostrarInativos={setMostrarInativos}
            onOpenHelp={() => setOpenHelp(true)}
            setMensagem={setMensagem}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={openHelp} onClose={() => setOpenHelp(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700, color: 'primary.main' }}>
          Gestão do Ecossistema
        </DialogTitle>
        <DialogContent dividers>
          <Typography variant="body1" paragraph>
            Este painel gerencia as entidades que compõem a <strong>Tríplice Hélice</strong>, formando a base de dados para o algoritmo de inovação.
          </Typography>
          <Box component="ul" sx={{ pl: 2, mb: 2, typography: 'body2', color: 'text.secondary' }}>
            <li style={{ marginBottom: '8px' }}>
              <Typography variant="body2" component="span" fontWeight="bold" color="info.main">Universidades:</Typography> Instituições de ensino e pesquisa provedoras de expertise.
            </li>
            <li style={{ marginBottom: '8px' }}>
              <Typography variant="body2" component="span" fontWeight="bold" color="warning.main">Indústrias:</Typography> Empresas e setor produtivo com demandas tecnológicas reais.
            </li>
            <li style={{ marginBottom: '8px' }}>
              <Typography variant="body2" component="span" fontWeight="bold" color="success.main">Governo:</Typography> Órgãos públicos, prefeituras e entidades de fomento com demandas.
            </li>
          </Box>
          <Alert severity="info" sx={{ mt: 2 }}>
            <strong>Nota sobre o Matchmaking:</strong> Apenas os atores mantidos como <em>ativos</em> neste painel poderão cadastrar demandas e expertises. Se uma instituição for arquivada, suas oportunidades deixarão de gerar "matches" no sistema.
          </Alert>
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

export default GestaoAtores;