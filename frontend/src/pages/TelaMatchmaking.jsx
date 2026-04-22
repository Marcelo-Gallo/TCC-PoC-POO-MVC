import React, { useState, useEffect } from 'react';
import api from '../services/api';
import TabelaRanking from '../components/TabelaRanking';
import GestaoPortfolio from '../components/GestaoPortfolio';
import {
  Container,
  Typography,
  Box,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Paper,
  Alert,
  Grid,
  Dialog,
  CircularProgress,
  useTheme,
  useMediaQuery,
  IconButton,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  AutoAwesome as AutoAwesomeIcon,
  HelpOutline as HelpIcon
} from '@mui/icons-material';

const TelaMatchmaking = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [demandas, setDemandas] = useState([]);
  const [demandaSelecionada, setDemandaSelecionada] = useState('');
  const [resultados, setResultados] = useState(null);
  const [carregando, setCarregando] = useState(false);
  const [mensagem, setMensagem] = useState({ texto: '', tipo: 'info' });
  const [expertiseSelecionada, setExpertiseSelecionada] = useState(null);
  const [openHelp, setOpenHelp] = useState(false);

  useEffect(() => {
    carregarDemandas();
  }, []);

  const carregarDemandas = async () => {
    try {
      const response = await api.get('/demandas');
      setDemandas(response.data);
    } catch (error) {
      setMensagem({ texto: 'Erro ao carregar as demandas disponíveis.', tipo: 'error' });
    }
  };

  const gerarRanking = async (e) => {
    e.preventDefault();
    if (!demandaSelecionada) {
      setMensagem({ texto: 'Por favor, selecione uma demanda para análise.', tipo: 'warning' });
      return;
    }

    setCarregando(true);
    setMensagem({ texto: '', tipo: 'info' });
    setResultados(null);

    try {
      const response = await api.get(`/demandas/${demandaSelecionada}/matchmaking`);
      setResultados(response.data);
      
      if (response.data.stemming.resultados.length === 0 && response.data.lematizacao.resultados.length === 0) {
        setMensagem({ texto: 'Nenhum investigador compatível encontrado para esta demanda.', tipo: 'warning' });
      }
    } catch (error) {
      setMensagem({ texto: error.response?.data?.detail || 'Erro ao processar o algoritmo de similaridade.', tipo: 'error' });
    } finally {
      setCarregando(false);
    }
  };

  const abrirPortfolio = (id) => {
    setExpertiseSelecionada(id);
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 3, mb: 2, display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 800, color: 'text.primary', display: 'flex', alignItems: 'center', gap: 2, fontSize: isMobile ? '1.5rem' : '2.125rem' }}>
            Matchmaking Semântico <AutoAwesomeIcon color="primary" fontSize={isMobile ? "medium" : "large"} />
          </Typography>
          {!isMobile && (
            <Typography variant="subtitle1" color="text.secondary">
              Análise comparativa em tempo real: Stemming (NLTK) vs. Lematização (SpaCy)
            </Typography>
          )}
        </Box>
        <IconButton onClick={() => setOpenHelp(true)} sx={{ borderRadius: 1, border: '1px solid', borderColor: 'divider', width: '48px', height: '48px' }}>
          <HelpIcon />
        </IconButton>
      </Box>

      {mensagem.texto && (
        <Alert severity={mensagem.tipo} sx={{ mb: 3, flexShrink: 0 }} onClose={() => setMensagem({ texto: '', tipo: 'info' })}>
          {mensagem.texto}
        </Alert>
      )}

      <Paper sx={{ p: isMobile ? 2 : 3, mb: 4, backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 2 }}>
        <Box component="form" onSubmit={gerarRanking}>
          <Grid container spacing={2} alignItems="flex-start">
            <Grid item xs={12} md={9}>
              <FormControl fullWidth required sx={{ backgroundColor: 'white' }}>
                <InputLabel>Selecione a Demanda (Governo/Indústria)</InputLabel>
                <Select
                  value={demandaSelecionada}
                  label="Selecione a Demanda (Governo/Indústria)"
                  onChange={(e) => setDemandaSelecionada(e.target.value)}
                >
                  <MenuItem value="" disabled>Escolha uma demanda na base de dados...</MenuItem>
                  {demandas.map(demanda => (
                    <MenuItem key={demanda.id} value={demanda.id}>
                      #{demanda.id} - {demanda.titulo} ({demanda.area_cnpq})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <Button 
                type="submit" 
                variant="contained" 
                color="primary" 
                fullWidth 
                disabled={carregando}
                sx={{ height: '56px', fontWeight: 'bold', fontSize: '1rem' }}
              >
                {carregando ? <CircularProgress size={28} color="inherit" /> : 'Executar Análise'}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>

      {resultados && (
        <Grid container spacing={3} sx={{ flexGrow: 1 }}>
          <Grid item xs={12} md={6}>
            <TabelaRanking 
              titulo="Abordagem 1: Stemming (NLTK)" 
              metricas={resultados.stemming} 
              corDestaque="#0ea5e9" 
              aoAbrirPortfolio={abrirPortfolio}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TabelaRanking 
              titulo="Abordagem 2: Lematização (SpaCy)" 
              metricas={resultados.lematizacao} 
              corDestaque="#10b981" 
              isPrimary={true} 
              aoAbrirPortfolio={abrirPortfolio}
            />
          </Grid>
        </Grid>
      )}

      <Dialog 
        open={!!expertiseSelecionada} 
        onClose={() => setExpertiseSelecionada(null)}
        maxWidth="md"
        fullWidth
        fullScreen={isMobile}
        PaperProps={{ sx: { height: isMobile ? '100%' : '80vh', borderRadius: isMobile ? 0 : 2 } }}
      >
        {isMobile && (
          <DialogTitle sx={{ bgcolor: 'primary.main', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            Portfólio do Investigador
            <Button onClick={() => setExpertiseSelecionada(null)} color="inherit">Fechar</Button>
          </DialogTitle>
        )}
        <DialogContent sx={{ p: 0 }}>
          {expertiseSelecionada && (
            <GestaoPortfolio 
              expertiseId={expertiseSelecionada} 
              onClose={() => setExpertiseSelecionada(null)}
              onAtualizar={() => {}}
            />
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={openHelp} onClose={() => setOpenHelp(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700, color: 'primary.main' }}>
          Sobre o Matchmaking Semântico
        </DialogTitle>
        <DialogContent dividers>
          <Typography variant="body1" paragraph>
            Este motor utiliza Processamento de Linguagem Natural (PLN) para reduzir a assimetria de informação entre os atores da Tríplice Hélice.
          </Typography>
          <Box component="ul" sx={{ pl: 2, mb: 2, typography: 'body2', color: 'text.secondary' }}>
            <li style={{ marginBottom: '8px' }}>
              <strong>Stemming (NLTK):</strong> Abordagem mais rápida que reduz as palavras aos seus radicais (ex: "pesquisando" vira "pesquis").
            </li>
            <li style={{ marginBottom: '8px' }}>
              <strong>Lematização (SpaCy):</strong> Abordagem morfológica que identifica a raiz canônica das palavras (ex: "fui" vira "ir"), sendo geralmente mais precisa para o português.
            </li>
          </Box>
          <Alert severity="info" sx={{ mt: 2 }}>
            <strong>Score de Similaridade:</strong> Representa a interseção vetorial entre a descrição da demanda e o histórico do investigador. Scores acima de 40% indicam forte potencial de colaboração.
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

export default TelaMatchmaking;