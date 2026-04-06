import React, { useState, useEffect, useRef } from 'react';
import api from '../services/api';
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
  Tooltip
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  RestoreFromTrash as RestoreIcon,
  ArrowBack as BackIcon,
  Inventory as InventoryIcon
} from '@mui/icons-material';

const TelaDemanda = () => {
  const [demandas, setDemandas] = useState([]);
  const [atores, setAtores] = useState([]);
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [atorId, setAtorId] = useState('');
  const [areaCnpq, setAreaCnpq] = useState('');
  const [editandoId, setEditandoId] = useState(null);
  const [mensagem, setMensagem] = useState({ texto: '', tipo: 'info' });
  const [mostrarInativos, setMostrarInativos] = useState(false);

  const formRef = useRef(null);

  useEffect(() => {
    carregarDemandas();
    carregarAtores();
  }, [mostrarInativos]);

  const carregarDemandas = async () => {
    try {
      const response = await api.get(`/demandas?mostrar_inativos=${mostrarInativos}`);
      setDemandas(response.data);
    } catch (error) {
      setMensagem({ texto: 'Erro ao carregar as demandas.', tipo: 'error' });
    }
  };

  const carregarAtores = async () => {
    try {
      const resAtivos = await api.get('/atores');
      const resInativos = await api.get('/atores?mostrar_inativos=true');
      setAtores([...resAtivos.data, ...resInativos.data]);
    } catch (error) {
      setMensagem({ texto: 'Erro ao carregar os atores.', tipo: 'error' });
    }
  };

  const salvarDemanda = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        titulo,
        descricao,
        ator_id: parseInt(atorId),
        area_cnpq: areaCnpq
      };

      if (editandoId) {
        await api.put(`/demandas/${editandoId}`, payload);
        setMensagem({ texto: 'Demanda atualizada com sucesso!', tipo: 'success' });
      } else {
        await api.post('/demandas', payload);
        setMensagem({ texto: 'Demanda registada com sucesso!', tipo: 'success' });
      }
      limparFormulario();
      carregarDemandas();
    } catch (error) {
      setMensagem({ texto: error.response?.data?.detail || 'Erro ao guardar a demanda.', tipo: 'error' });
    }
  };

  const prepararEdicao = (demanda) => {
    setEditandoId(demanda.id);
    setTitulo(demanda.titulo);
    setDescricao(demanda.descricao);
    setAtorId(demanda.ator_id);
    setAreaCnpq(demanda.area_cnpq);
    setMensagem({ texto: '', tipo: 'info' });

    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
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

  const limparFormulario = () => {
    setTitulo('');
    setDescricao('');
    setAtorId('');
    setAreaCnpq('');
    setEditandoId(null);
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 800, color: 'text.primary' }}>
          Gestão de Demandas
        </Typography>
        <Button
          variant="outlined"
          color={mostrarInativos ? "secondary" : "warning"}
          startIcon={mostrarInativos ? <BackIcon /> : <InventoryIcon />}
          onClick={() => setMostrarInativos(!mostrarInativos)}
        >
          {mostrarInativos ? 'Voltar' : 'Ver Lixeira'}
        </Button>
      </Box>

      {mensagem.texto && (
        <Alert severity={mensagem.tipo} sx={{ mb: 3 }} onClose={() => setMensagem({ texto: '', tipo: 'info' })}>
          {mensagem.texto}
        </Alert>
      )}
      <Grid container spacing={4} alignItems="flex-start">
        <Grid item xs={12} md={4} ref={formRef}>
          {!mostrarInativos ? (
            <Paper sx={{ p: 3, borderRadius: 2, position: 'sticky', top: '100px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 700 }}>
                {editandoId ? 'Editar Problema ou Oportunidade' : 'Registar Nova Demanda'}
              </Typography>
              <Box component="form" onSubmit={salvarDemanda} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                
                <TextField
                  label="Título da Demanda"
                  fullWidth
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  required
                />
                
                <TextField
                  label="Área CNPq"
                  fullWidth
                  placeholder="Ex: 1.03.00.00-7"
                  value={areaCnpq}
                  onChange={(e) => setAreaCnpq(e.target.value)}
                  required
                />
                
                <FormControl fullWidth required>
                  <InputLabel>Ator Vinculado (Indústria/Governo)</InputLabel>
                  <Select
                    value={atorId}
                    label="Ator Vinculado (Indústria/Governo)"
                    onChange={(e) => setAtorId(e.target.value)}
                  >
                    <MenuItem value="" disabled>Selecione um ator...</MenuItem>
                    {atores.map(ator => (
                      <MenuItem key={ator.id} value={ator.id}>
                        {ator.nome} ({ator.tipo_helice}) {ator.is_deleted ? ' - (ARQUIVADO)' : ''}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                
                <TextField
                  label="Descrição Detalhada"
                  fullWidth
                  multiline
                  rows={4}
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  required
                />
                
                <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                  <Button type="submit" variant="contained" color="success" size="large" fullWidth>
                    {editandoId ? 'Atualizar' : 'Registar'}
                  </Button>
                  {editandoId && (
                    <Button variant="outlined" color="secondary" onClick={limparFormulario} fullWidth>
                      Cancelar
                    </Button>
                  )}
                </Box>
              </Box>
            </Paper>
          ) : (
             <Paper sx={{ p: 3, borderRadius: 2, backgroundColor: '#fef2f2', border: '1px solid #fca5a5' }}>
                <Typography variant="h6" color="error" sx={{ fontWeight: 700 }}>
                  Modo Lixeira
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Você está visualizando os registros inativos. Restaure uma demanda na tabela ao lado para poder editá-la novamente.
                </Typography>
             </Paper>
          )}
        </Grid>

        <Grid item xs={12} md={8}>
          <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            <Table>
              <TableHead sx={{ backgroundColor: '#f8fafc' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>ID</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Título</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Área CNPq</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 'bold' }}>Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {demandas.map(demanda => (
                  <TableRow key={demanda.id} hover>
                    <TableCell>#{demanda.id}</TableCell>
                    <TableCell sx={{ fontWeight: 500 }}>{demanda.titulo}</TableCell>
                    <TableCell>{demanda.area_cnpq}</TableCell>
                    <TableCell align="center">
                      {mostrarInativos ? (
                        <Tooltip title="Restaurar">
                          <IconButton color="success" onClick={() => restaurarDemanda(demanda.id)}>
                            <RestoreIcon />
                          </IconButton>
                        </Tooltip>
                      ) : (
                        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                          <Tooltip title="Editar">
                            <IconButton color="primary" onClick={() => prepararEdicao(demanda)}>
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Inativar">
                            <IconButton color="error" onClick={() => inativarDemanda(demanda.id)}>
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
                {demandas.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} align="center" sx={{ py: 3, color: 'text.secondary' }}>
                      {mostrarInativos ? 'Nenhuma demanda arquivada.' : 'Nenhuma demanda ativa encontrada.'}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>

      </Grid>
    </Container>
  );
};

export default TelaDemanda;