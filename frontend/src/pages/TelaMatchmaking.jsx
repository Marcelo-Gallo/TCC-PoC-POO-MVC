import React, { useState, useEffect } from 'react';
import api from '../services/api';
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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Alert,
  Grid,
  Chip,
  Dialog,
  CircularProgress,
  Link
} from '@mui/material';
import {
  AutoAwesome as AutoAwesomeIcon,
  Launch as LaunchIcon
} from '@mui/icons-material';

const TelaMatchmaking = () => {
  const [demandas, setDemandas] = useState([]);
  const [demandaSelecionada, setDemandaSelecionada] = useState('');
  const [resultados, setResultados] = useState(null);
  const [carregando, setCarregando] = useState(false);
  const [mensagem, setMensagem] = useState({ texto: '', tipo: 'info' });
  const [expertiseSelecionada, setExpertiseSelecionada] = useState(null);

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

  const renderTabela = (titulo, metricas, corDestaque, isPrimary = false) => (
    <Paper sx={{ p: 3, height: '100%', borderRadius: 2, borderTop: `4px solid ${corDestaque}` }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 800, color: 'text.primary' }}>
          {titulo}
        </Typography>
        <Chip 
          label={`⏱️ ${metricas.tempo_execucao_segundos}s`} 
          size="small" 
          sx={{ fontWeight: 'bold', backgroundColor: '#f1f5f9' }} 
        />
      </Box>
      
      {metricas.resultados.length > 0 ? (
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f8fafc' }}>
                <TableCell sx={{ fontWeight: 'bold', width: '60px' }}>Rank</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Investigador / Interseção</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Score</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {metricas.resultados.map((resultado, index) => (
                <TableRow key={index} hover>
                  <TableCell sx={{ fontWeight: 800, color: corDestaque, fontSize: '1.1rem' }}>
                    {index + 1}º
                  </TableCell>
                  <TableCell>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                      {resultado.pesquisador_responsavel}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                      {resultado.area_conhecimento}
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {resultado.termos_explicativos.map((termo, i) => (
                        <Chip 
                          key={i} 
                          label={termo} 
                          size="small" 
                          variant="outlined"
                          sx={{ fontSize: '0.65rem', height: '20px' }} 
                        />
                      ))}
                    </Box>
                  </TableCell>
                  <TableCell align="center">
                    <Chip 
                      label={`${(resultado.score * 100).toFixed(1)}%`}
                      color={resultado.score > 0.4 ? 'success' : 'warning'}
                      size="small"
                      sx={{ fontWeight: 'bold' }}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'center' }}>
                      <Button 
                        size="small" 
                        variant={isPrimary ? "contained" : "outlined"} 
                        color={isPrimary ? "primary" : "inherit"}
                        onClick={() => setExpertiseSelecionada(resultado.expertise_id)}
                        sx={{ fontSize: '0.65rem', py: 0.2, minWidth: '70px' }}
                      >
                        Portfolio
                      </Button>
                      {resultado.link_lattes && (
                        <Link 
                          href={resultado.link_lattes} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          sx={{ fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: 0.5 }}
                        >
                          Lattes <LaunchIcon sx={{ fontSize: '0.7rem' }} />
                        </Link>
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Typography textAlign="center" color="text.secondary" sx={{ py: 4 }}>
          Nenhum match encontrado.
        </Typography>
      )}
    </Paper>
  );

  return (
    <Container maxWidth="xl">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 800, color: 'text.primary', display: 'flex', alignItems: 'center', gap: 2 }}>
          Motor de Matchmaking <AutoAwesomeIcon color="primary" fontSize="large" />
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Análise comparativa em tempo real: Stemming (NLTK) vs. Lematização (SpaCy)
        </Typography>
      </Box>

      {mensagem.texto && (
        <Alert severity={mensagem.tipo} sx={{ mb: 3 }} onClose={() => setMensagem({ texto: '', tipo: 'info' })}>
          {mensagem.texto}
        </Alert>
      )}

      <Paper sx={{ p: 3, mb: 4, backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}>
        <Box component="form" onSubmit={gerarRanking}>
          <Grid container spacing={2} alignItems="flex-start">
            <Grid item xs={12} md={9}>
              <FormControl fullWidth required sx={{ backgroundColor: 'white' }}>
                <InputLabel>Selecione o Problema / Demanda (Governo/Indústria)</InputLabel>
                <Select
                  value={demandaSelecionada}
                  label="Selecione o Problema / Demanda (Governo/Indústria)"
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
                {carregando ? <CircularProgress size={28} color="inherit" /> : 'Executar Modelos IA'}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>

      {resultados && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            {renderTabela('Abordagem 1: Stemming (NLTK)', resultados.stemming, '#0ea5e9')}
          </Grid>
          <Grid item xs={12} md={6}>
            {renderTabela('Abordagem 2: Lematização (SpaCy)', resultados.lematizacao, '#10b981', true)}
          </Grid>
        </Grid>
      )}

      <Dialog 
        open={!!expertiseSelecionada} 
        onClose={() => setExpertiseSelecionada(null)}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { height: '80vh', borderRadius: 2 } }}
      >
        {expertiseSelecionada && (
          <GestaoPortfolio 
            expertiseId={expertiseSelecionada} 
            onClose={() => setExpertiseSelecionada(null)}
            onAtualizar={() => {}}
          />
        )}
      </Dialog>
    </Container>
  );
};

export default TelaMatchmaking;