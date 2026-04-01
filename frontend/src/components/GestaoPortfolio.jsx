import React, { useState, useEffect } from 'react';
import api from '../services/api';
import {
  Box,
  Typography,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Paper,
  IconButton,
  Alert,
  Grid,
  Chip,
  Tooltip,
  Divider
} from '@mui/material';
import {
  Close as CloseIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Article as ArticleIcon,
  EmojiObjects as PatenteIcon,
  School as TeseIcon,
  Work as ProjetoIcon
} from '@mui/icons-material';

const GestaoPortfolio = ({ expertiseId, onClose, onAtualizar }) => {
  const [portfolios, setPortfolios] = useState([]);
  const [nomePesquisador, setNomePesquisador] = useState('');
  const [modo, setModo] = useState('lista');
  const [mensagem, setMensagem] = useState({ texto: '', tipo: 'info' });

  const [idEditando, setIdEditando] = useState(null);
  const [tipo, setTipo] = useState('ARTIGO');
  const [titulo, setTitulo] = useState('');
  const [ano, setAno] = useState('');
  const [resumo, setResumo] = useState('');

  useEffect(() => {
    carregarPortfolios();
  }, [expertiseId]);

  const carregarPortfolios = async () => {
    try {
      const response = await api.get('/expertises');
      const expertiseAtual = response.data.find(e => e.id === expertiseId);
      
      if (expertiseAtual) {
        setPortfolios(expertiseAtual.portfolios);
        setNomePesquisador(expertiseAtual.pesquisador_responsavel);
      } else {
        setPortfolios([]);
        setNomePesquisador('');
      }
    } catch (error) {
      setMensagem({ texto: 'Erro ao recarregar portfólios.', tipo: 'error' });
    }
  };

  const abrirFormularioNovo = () => {
    limparFormulario();
    setModo('novo');
  };

  const abrirFormularioEdicao = (port) => {
    setIdEditando(port.id);
    setTipo(port.tipo);
    setTitulo(port.titulo);
    setAno(port.ano_publicacao);
    setResumo(port.resumo);
    setModo('editar');
  };

  const limparFormulario = () => {
    setIdEditando(null);
    setTipo('ARTIGO');
    setTitulo('');
    setAno('');
    setResumo('');
  };

  const salvarPortfolio = async (e) => {
    e.preventDefault();
    const payload = {
      tipo,
      titulo,
      ano_publicacao: parseInt(ano),
      resumo
    };

    try {
      if (modo === 'novo') {
        payload.expertise_id = expertiseId;
        await api.post(`/expertises/${expertiseId}/portfolios`, payload);
        setMensagem({ texto: 'Portfólio adicionado com sucesso!', tipo: 'success' });
      } else if (modo === 'editar') {
        await api.put(`/expertises/portfolios/${idEditando}`, payload);
        setMensagem({ texto: 'Portfólio atualizado com sucesso!', tipo: 'success' });
      }
      
      setModo('lista');
      carregarPortfolios();
      onAtualizar();
    } catch (error) {
      setMensagem({ texto: error.response?.data?.detail || 'Erro ao guardar portfólio.', tipo: 'error' });
    }
  };

  const inativarPortfolio = async (id) => {
    if (window.confirm('Deseja inativar este item? Ele não será mais considerado na IA.')) {
      try {
        await api.put(`/expertises/portfolios/${id}`, { is_deleted: true });
        setMensagem({ texto: 'Item inativado!', tipo: 'success' });
        carregarPortfolios();
        onAtualizar();
      } catch (error) {
        setMensagem({ texto: 'Erro ao inativar.', tipo: 'error' });
      }
    }
  };

  const getTipoIcon = (tipo) => {
    switch(tipo) {
      case 'ARTIGO': return <ArticleIcon fontSize="small" />;
      case 'PATENTE': return <PatenteIcon fontSize="small" />;
      case 'TESE': return <TeseIcon fontSize="small" />;
      case 'PROJETO': return <ProjetoIcon fontSize="small" />;
      default: return <ArticleIcon fontSize="small" />;
    }
  };

  const getTipoColor = (tipo) => {
    switch(tipo) {
      case 'ARTIGO': return 'primary';
      case 'PATENTE': return 'warning';
      case 'TESE': return 'secondary';
      case 'PROJETO': return 'success';
      default: return 'default';
    }
  };

  return (
    <Paper elevation={3} sx={{ height: '100%', display: 'flex', flexDirection: 'column', borderRadius: 2, overflow: 'hidden' }}>
      <Box sx={{ p: 2, backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 800, color: 'primary.main', lineHeight: 1.2 }}>
            Portfólio Técnico
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
            {nomePesquisador || `Investigador #${expertiseId}`}
          </Typography>
        </Box>
        <Tooltip title="Fechar painel">
          <IconButton onClick={onClose} size="small" sx={{ backgroundColor: '#e2e8f0', '&:hover': { backgroundColor: '#cbd5e1' } }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>

      <Box sx={{ p: 2, flexGrow: 1, overflowY: 'auto', backgroundColor: '#ffffff' }}>
        {mensagem.texto && (
          <Alert severity={mensagem.tipo} sx={{ mb: 2 }} onClose={() => setMensagem({ texto: '', tipo: 'info' })}>
            {mensagem.texto}
          </Alert>
        )}

        {modo === 'lista' && (
          <>
            <Button 
              variant="contained" 
              fullWidth 
              startIcon={<AddIcon />} 
              onClick={abrirFormularioNovo}
              sx={{ mb: 3, py: 1 }}
            >
              Adicionar Novo Trabalho
            </Button>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {portfolios.length > 0 ? (
                portfolios.map(port => (
                  <Paper key={port.id} variant="outlined" sx={{ p: 2, borderRadius: 2, borderColor: '#e2e8f0' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 1 }}>
                        <Chip 
                          icon={getTipoIcon(port.tipo)} 
                          label={port.tipo} 
                          size="small" 
                          color={getTipoColor(port.tipo)} 
                          variant="outlined" 
                          sx={{ fontWeight: 'bold' }}
                        />
                        <Chip label={port.ano_publicacao} size="small" sx={{ backgroundColor: '#f1f5f9', fontWeight: 600 }} />
                      </Box>
                      <Box sx={{ display: 'flex', gap: 0.5, mt: -0.5, mr: -1 }}>
                        <IconButton size="small" color="primary" onClick={() => abrirFormularioEdicao(port)}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton size="small" color="error" onClick={() => inativarPortfolio(port.id)}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, lineHeight: 1.3, mb: 1, color: '#1e293b' }}>
                      {port.titulo}
                    </Typography>
                    <Divider sx={{ my: 1 }} />
                    <Typography variant="body2" sx={{ color: '#64748b', fontStyle: 'italic', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      "{port.resumo}"
                    </Typography>
                  </Paper>
                ))
              ) : (
                <Typography textAlign="center" color="text.secondary" sx={{ py: 4 }}>
                  Nenhum trabalho registado neste portfólio.
                </Typography>
              )}
            </Box>
          </>
        )}

        {(modo === 'novo' || modo === 'editar') && (
          <Box component="form" onSubmit={salvarPortfolio} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'primary.main', mb: 1 }}>
              {modo === 'novo' ? 'Novo Trabalho Científico' : 'Editar Trabalho'}
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12} sm={8}>
                <FormControl fullWidth required size="small">
                  <InputLabel>Tipo de Trabalho</InputLabel>
                  <Select value={tipo} label="Tipo de Trabalho" onChange={(e) => setTipo(e.target.value)}>
                    <MenuItem value="ARTIGO">Artigo Científico</MenuItem>
                    <MenuItem value="PATENTE">Patente</MenuItem>
                    <MenuItem value="PROJETO">Projeto</MenuItem>
                    <MenuItem value="TESE">Tese/Dissertação</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField 
                  label="Ano" 
                  type="number" 
                  fullWidth 
                  size="small"
                  value={ano} 
                  onChange={(e) => setAno(e.target.value)} 
                  required 
                />
              </Grid>
            </Grid>
            
            <TextField 
              label="Título do Trabalho" 
              fullWidth 
              size="small"
              value={titulo} 
              onChange={(e) => setTitulo(e.target.value)} 
              required 
            />
            
            <TextField 
              label="Resumo (Insumo para a IA)" 
              fullWidth 
              multiline 
              rows={5} 
              value={resumo} 
              onChange={(e) => setResumo(e.target.value)} 
              required 
              helperText="Descreva as palavras-chave e a tecnologia envolvida."
            />
            
            <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
              <Button type="submit" variant="contained" color="success" fullWidth>
                Guardar
              </Button>
              <Button variant="outlined" color="secondary" fullWidth onClick={() => setModo('lista')}>
                Cancelar
              </Button>
            </Box>
          </Box>
        )}
      </Box>
    </Paper>
  );
};

export default GestaoPortfolio;