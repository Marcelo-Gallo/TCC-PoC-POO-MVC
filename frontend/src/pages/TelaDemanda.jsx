import React, { useState, useEffect } from 'react';
import api from '../services/api';
import FormularioDemanda from '../components/FormularioDemanda';
import TabelaDemandas from '../components/TabelaDemandas';
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

const TelaDemanda = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [demandas, setDemandas] = useState([]);
  const [atores, setAtores] = useState([]);
  const [demandaParaEditar, setDemandaParaEditar] = useState(null);
  const [mensagem, setMensagem] = useState({ texto: '', tipo: 'info' });
  const [mostrarInativos, setMostrarInativos] = useState(false);
  const [openHelp, setOpenHelp] = useState(false);
  const [openFormModal, setOpenFormModal] = useState(false);

  useEffect(() => {
    carregarDemandas();
    carregarAtores();
  }, [mostrarInativos]);

  useEffect(() => {
    if (demandaParaEditar) {
      setOpenFormModal(true);
    }
  }, [demandaParaEditar]);

  const carregarDemandas = async () => {
    try {
      const response = await api.get(`/demandas?mostrar_inativos=${mostrarInativos}`);
      setDemandas(response.data);
    } catch (error) {
      setMensagem({ texto: 'Erro ao carregar a lista de demandas.', tipo: 'error' });
    }
  };

  const carregarAtores = async () => {
    try {
      const resAtivos = await api.get('/atores');
      const resInativos = await api.get('/atores?mostrar_inativos=true');
      setAtores([...resAtivos.data, ...resInativos.data]);
    } catch (error) {
      setMensagem({ texto: 'Erro ao carregar os atores para o formulário.', tipo: 'error' });
    }
  };

  const inativarDemanda = async (id) => {
    if (window.confirm('Deseja realmente inativar esta demanda?')) {
      try {
        await api.put(`/demandas/${id}`, { is_deleted: true });
        setMensagem({ texto: 'Demanda inativada com sucesso!', tipo: 'success' });
        carregarDemandas();
      } catch (error) {
        setMensagem({ texto: 'Erro ao inativar a demanda.', tipo: 'error' });
      }
    }
  };

  const restaurarDemanda = async (id) => {
    if (window.confirm('Deseja realmente restaurar esta demanda?')) {
      try {
        await api.put(`/demandas/${id}`, { is_deleted: false });
        setMensagem({ texto: 'Demanda restaurada com sucesso!', tipo: 'success' });
        carregarDemandas();
      } catch (error) {
        setMensagem({ texto: 'Erro ao restaurar a demanda.', tipo: 'error' });
      }
    }
  };

  const fecharModalForm = () => {
    setOpenFormModal(false);
    setDemandaParaEditar(null);
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
            <FormularioDemanda
              demandaParaEditar={demandaParaEditar}
              atores={atores}
              aoSucesso={carregarDemandas}
              aoCancelar={() => setDemandaParaEditar(null)}
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
                    Nova Demanda
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
          
          <TabelaDemandas
            dados={demandas}
            aoEditar={setDemandaParaEditar}
            aoInativar={inativarDemanda}
            aoRestaurar={restaurarDemanda}
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
          {demandaParaEditar ? 'Editar Demanda' : 'Nova Demanda'}
          <Button onClick={fecharModalForm} sx={{ color: 'white' }}>Fechar</Button>
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <FormularioDemanda
            demandaParaEditar={demandaParaEditar}
            atores={atores}
            aoSucesso={() => {
              carregarDemandas();
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
          Gestão de Demandas Tecnológicas
        </DialogTitle>
        <DialogContent dividers>
          <Typography variant="body1" paragraph>
            As demandas representam problemas, dores ou oportunidades identificadas por <strong>Indústrias</strong> ou pelo <strong>Governo</strong> que necessitam de solução técnica ou científica.
          </Typography>
          <Box component="ul" sx={{ pl: 2, mb: 2, typography: 'body2', color: 'text.secondary' }}>
            <li style={{ marginBottom: '8px' }}>
              <strong>Mapeamento:</strong> O gestor cadastra a demanda vinculando-a a um Ator específico do ecossistema.
            </li>
            <li style={{ marginBottom: '8px' }}>
              <strong>Classificação CNPq:</strong> A utilização das áreas do CNPq permite que o motor de matchmaking encontre expertises acadêmicas com linguagens similares.
            </li>
            <li style={{ marginBottom: '8px' }}>
              <strong>Descrição Semântica:</strong> Quanto mais detalhada a descrição, melhor será o processamento de linguagem natural para gerar o "match" perfeito.
            </li>
          </Box>
          <Alert severity="info" sx={{ mt: 2 }}>
            <strong>Fluxo de Inovação:</strong> Após cadastradas, estas demandas são comparadas com as expertises das universidades no menu "Matchmaking (IA)".
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

export default TelaDemanda;