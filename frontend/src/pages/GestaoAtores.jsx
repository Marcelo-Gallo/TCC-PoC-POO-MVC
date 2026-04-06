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

const GestaoAtores = () => {
  const [atores, setAtores] = useState([]);
  const [nome, setNome] = useState('');
  const [tipoHelice, setTipoHelice] = useState('UNIVERSIDADE');
  const [editandoId, setEditandoId] = useState(null);
  const [mensagem, setMensagem] = useState({ texto: '', tipo: 'info' });
  const [mostrarInativos, setMostrarInativos] = useState(false);

  const formRef = useRef(null);

  useEffect(() => {
    carregarAtores();
  }, [mostrarInativos]);

  const carregarAtores = async () => {
    try {
      const response = await api.get(`/atores?mostrar_inativos=${mostrarInativos}`);
      setAtores(response.data);
    } catch (error) {
      setMensagem({ texto: 'Erro ao carregar a lista de atores.', tipo: 'error' });
    }
  };

  const salvarAtor = async (e) => {
    e.preventDefault();
    try {
      if (editandoId) {
        await api.put(`/atores/${editandoId}`, { nome, tipo_helice: tipoHelice });
        setMensagem({ texto: 'Ator atualizado com sucesso!', tipo: 'success' });
      } else {
        await api.post('/atores', { nome, tipo_helice: tipoHelice });
        setMensagem({ texto: 'Ator cadastrado com sucesso!', tipo: 'success' });
      }
      limparFormulario();
      carregarAtores();
    } catch (error) {
      setMensagem({ texto: error.response?.data?.detail || 'Erro ao salvar o ator.', tipo: 'error' });
    }
  };

  const prepararEdicao = (ator) => {
    setEditandoId(ator.id);
    setNome(ator.nome);
    setTipoHelice(ator.tipo_helice);
    setMensagem({ texto: '', tipo: 'info' });
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
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

  const limparFormulario = () => {
    setNome('');
    setTipoHelice('UNIVERSIDADE');
    setEditandoId(null);
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 800, color: 'text.primary' }}>
          Gestão do Ecossistema (Tríplice Hélice)
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
                {editandoId ? 'Editar Instituição/Empresa' : 'Cadastrar Novo Ator'}
              </Typography>
              <Box component="form" onSubmit={salvarAtor} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField
                  label="Nome da Instituição/Empresa"
                  fullWidth
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  required
                />
                <FormControl fullWidth required>
                  <InputLabel>Tipo de Hélice</InputLabel>
                  <Select
                    value={tipoHelice}
                    label="Tipo de Hélice"
                    onChange={(e) => setTipoHelice(e.target.value)}
                  >
                    <MenuItem value="UNIVERSIDADE">Universidade</MenuItem>
                    <MenuItem value="INDUSTRIA">Indústria</MenuItem>
                    <MenuItem value="GOVERNO">Governo</MenuItem>
                  </Select>
                </FormControl>
                <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                  <Button type="submit" variant="contained" color="success" fullWidth sx={{ height: '56px' }}>
                    {editandoId ? 'Atualizar' : 'Cadastrar'}
                  </Button>
                  {editandoId && (
                    <Button variant="outlined" color="secondary" onClick={limparFormulario} fullWidth sx={{ height: '56px' }}>
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
                  Você está visualizando os registros inativos. Restaure um ator na tabela ao lado para poder editá-lo novamente.
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
                  <TableCell sx={{ fontWeight: 'bold' }}>Nome</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Hélice</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 'bold' }}>Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {atores.map(ator => (
                  <TableRow key={ator.id} hover>
                    <TableCell>#{ator.id}</TableCell>
                    <TableCell sx={{ fontWeight: 500 }}>{ator.nome}</TableCell>
                    <TableCell>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          fontWeight: 'bold',
                          color: ator.tipo_helice === 'UNIVERSIDADE' ? '#0ea5e9' : 
                                 ator.tipo_helice === 'INDUSTRIA' ? '#f59e0b' : '#10b981'
                        }}
                      >
                        {ator.tipo_helice}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      {mostrarInativos ? (
                        <Tooltip title="Restaurar">
                          <IconButton color="success" onClick={() => restaurarAtor(ator.id)}>
                            <RestoreIcon />
                          </IconButton>
                        </Tooltip>
                      ) : (
                        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                          <Tooltip title="Editar">
                            <IconButton color="primary" onClick={() => prepararEdicao(ator)}>
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Inativar">
                            <IconButton color="error" onClick={() => inativarAtor(ator.id)}>
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
                {atores.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} align="center" sx={{ py: 3, color: 'text.secondary' }}>
                      {mostrarInativos ? 'Nenhum ator arquivado encontrado.' : 'Nenhum ator ativo encontrado.'}
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

export default GestaoAtores;