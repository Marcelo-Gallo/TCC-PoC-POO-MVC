import React, { useState, useEffect } from 'react';
import api from '../services/api';
import GestaoPortfolio from '../components/GestaoPortfolio';
import {
  Container,
  Typography,
  Box,
  TextField,
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
  IconButton,
  Alert,
  Grid,
  Tooltip,
  Badge
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  RestoreFromTrash as RestoreIcon,
  ArrowBack as BackIcon,
  Inventory as InventoryIcon,
  FolderOpen as FolderIcon
} from '@mui/icons-material';

const TelaExpertise = () => {
  const [atores, setAtores] = useState([]);
  const [expertises, setExpertises] = useState([]);
  
  const [areaConhecimento, setAreaConhecimento] = useState('');
  const [areaCnpq, setAreaCnpq] = useState('');
  const [pesquisadorResponsavel, setPesquisadorResponsavel] = useState('');
  const [linkLattes, setLinkLattes] = useState('');
  const [atorId, setAtorId] = useState('');
  const [mensagem, setMensagem] = useState({ texto: '', tipo: 'info' });

  const [editandoId, setEditandoId] = useState(null);
  const [expertiseSelecionada, setExpertiseSelecionada] = useState(null);
  const [mostrarInativos, setMostrarInativos] = useState(false);

  useEffect(() => {
    carregarAtoresUniversidade();
    carregarExpertises();
  }, [mostrarInativos]);

  const carregarAtoresUniversidade = async () => {
    try {
      const resAtivos = await api.get('/atores');
      const resInativos = await api.get('/atores?mostrar_inativos=true');
      
      const todosAtores = [...resAtivos.data, ...resInativos.data];
      setAtores(todosAtores.filter(a => a.tipo_helice === 'UNIVERSIDADE'));
    } catch (error) {
      setMensagem({ texto: 'Erro ao carregar atores.', tipo: 'error' });
    }
  };

  const carregarExpertises = async () => {
    try {
      const response = await api.get(`/expertises?mostrar_inativos=${mostrarInativos}`);
      setExpertises(response.data);
    } catch (error) {
      setMensagem({ texto: 'Erro ao carregar expertises.', tipo: 'error' });
    }
  };

  const limparFormulario = () => {
    setEditandoId(null);
    setPesquisadorResponsavel('');
    setAreaConhecimento('');
    setAreaCnpq('');
    setLinkLattes('');
    setAtorId('');
  };

  const prepararEdicao = (exp) => {
    setEditandoId(exp.id);
    setPesquisadorResponsavel(exp.pesquisador_responsavel);
    setAreaConhecimento(exp.area_conhecimento);
    setAreaCnpq(exp.area_cnpq);
    setLinkLattes(exp.link_lattes || '');
    setAtorId(exp.ator_id);
    setMensagem({ texto: '', tipo: 'info' });
    setExpertiseSelecionada(null);
  };

  const salvarExpertise = async (e) => {
    e.preventDefault();
    const payload = {
      area_conhecimento: areaConhecimento,
      area_cnpq: areaCnpq,
      pesquisador_responsavel: pesquisadorResponsavel,
      link_lattes: linkLattes,
      ator_id: parseInt(atorId)
    };

    try {
      if (editandoId) {
        await api.put(`/expertises/${editandoId}`, payload);
        setMensagem({ texto: 'Investigador atualizado com sucesso!', tipo: 'success' });
      } else {
        await api.post('/expertises', payload);
        setMensagem({ texto: 'Investigador registado com sucesso!', tipo: 'success' });
      }
      limparFormulario();
      carregarExpertises();
    } catch (error) {
      setMensagem({ texto: error.response?.data?.detail || 'Erro ao guardar a expertise.', tipo: 'error' });
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
        setMensagem({ texto: 'Erro ao inativar investigador.', tipo: 'error' });
      }
    }
  };

  const restaurarExpertise = async (id) => {
    if (window.confirm('Deseja restaurar este investigador?')) {
      try {
        await api.put(`/expertises/${id}`, { is_deleted: false });
        setMensagem({ texto: 'Investigador restaurado com sucesso!', tipo: 'success' });
        carregarExpertises();
      } catch (error) {
        setMensagem({ texto: 'Erro ao restaurar investigador.', tipo: 'error' });
      }
    }
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 800, color: 'text.primary' }}>
          Catálogo de Investigadores
        </Typography>
        <Button
          variant="outlined"
          color={mostrarInativos ? "secondary" : "warning"}
          startIcon={mostrarInativos ? <BackIcon /> : <InventoryIcon />}
          onClick={() => {
            setMostrarInativos(!mostrarInativos);
            setExpertiseSelecionada(null);
            limparFormulario();
          }}
        >
          {mostrarInativos ? 'Voltar' : 'Ver Lixeira'}
        </Button>
      </Box>

      {mensagem.texto && (
        <Alert severity={mensagem.tipo} sx={{ mb: 3 }} onClose={() => setMensagem({ texto: '', tipo: 'info' })}>
          {mensagem.texto}
        </Alert>
      )}

      <Grid container spacing={4}>
        <Grid item xs={12} md={expertiseSelecionada && !mostrarInativos ? 7 : 12} sx={{ transition: 'all 0.3s ease-in-out' }}>
          
          {!mostrarInativos && (
            <Paper sx={{ p: 3, mb: 4, borderRadius: 2 }}>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 700 }}>
                {editandoId ? 'Editar Investigador' : 'Registar Novo Investigador'}
              </Typography>
              <Box component="form" onSubmit={salvarExpertise}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Nome do Investigador"
                      fullWidth
                      value={pesquisadorResponsavel}
                      onChange={(e) => setPesquisadorResponsavel(e.target.value)}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth required>
                      <InputLabel>Universidade</InputLabel>
                      <Select
                        value={atorId}
                        label="Universidade"
                        onChange={(e) => setAtorId(e.target.value)}
                      >
                        <MenuItem value="" disabled>Selecione a Universidade...</MenuItem>
                        {atores.map(a => (
                          <MenuItem key={a.id} value={a.id}>
                            {a.nome} {a.is_deleted ? ' - (ARQUIVADO)' : ''}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Área de Conhecimento"
                      fullWidth
                      value={areaConhecimento}
                      onChange={(e) => setAreaConhecimento(e.target.value)}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Área CNPq"
                      fullWidth
                      value={areaCnpq}
                      onChange={(e) => setAreaCnpq(e.target.value)}
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Link do Currículo Lattes (Opcional)"
                      type="url"
                      fullWidth
                      value={linkLattes}
                      onChange={(e) => setLinkLattes(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sx={{ display: 'flex', gap: 2, mt: 1 }}>
                    <Button type="submit" variant="contained" color="success" size="large">
                      {editandoId ? 'Atualizar Investigador' : 'Registar Investigador'}
                    </Button>
                    {editandoId && (
                      <Button variant="text" color="secondary" onClick={limparFormulario}>
                        Cancelar
                      </Button>
                    )}
                  </Grid>
                </Grid>
              </Box>
            </Paper>
          )}

          <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            <Table>
              <TableHead sx={{ backgroundColor: '#f8fafc' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Investigador</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Área</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 'bold' }}>Trabalhos</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 'bold' }}>Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {expertises.map(exp => (
                  <TableRow 
                    key={exp.id} 
                    hover 
                    sx={{ backgroundColor: expertiseSelecionada === exp.id ? '#f1f5f9' : 'inherit' }}
                  >
                    <TableCell sx={{ fontWeight: 500 }}>{exp.pesquisador_responsavel}</TableCell>
                    <TableCell>{exp.area_conhecimento}</TableCell>
                    <TableCell align="center">
                      <Badge badgeContent={exp.portfolios?.length || 0} color="primary" showZero />
                    </TableCell>
                    <TableCell align="center">
                      {mostrarInativos ? (
                        <Tooltip title="Restaurar">
                          <IconButton color="success" onClick={() => restaurarExpertise(exp.id)}>
                            <RestoreIcon />
                          </IconButton>
                        </Tooltip>
                      ) : (
                        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                          <Tooltip title="Editar">
                            <IconButton color="primary" onClick={() => prepararEdicao(exp)}>
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Abrir Portfólio">
                            <IconButton color="info" onClick={() => setExpertiseSelecionada(exp.id)}>
                              <FolderIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Inativar">
                            <IconButton color="error" onClick={() => inativarExpertise(exp.id)}>
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
                {expertises.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} align="center" sx={{ py: 3, color: 'text.secondary' }}>
                      {mostrarInativos ? 'Nenhum investigador arquivado encontrado.' : 'Nenhum investigador ativo encontrado.'}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>

        {expertiseSelecionada && !mostrarInativos && (
          <Grid item xs={12} md={5}>
            <GestaoPortfolio 
              expertiseId={expertiseSelecionada} 
              onClose={() => setExpertiseSelecionada(null)}
              onAtualizar={carregarExpertises}
            />
          </Grid>
        )}
      </Grid>
    </Container>
  );
};

export default TelaExpertise;