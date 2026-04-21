import React, { useState, useEffect, useRef } from 'react';
import api from '../services/api';
import { useTableData } from '../hooks/useTableData';
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
  TableSortLabel,
  InputAdornment,
  useTheme,
  useMediaQuery,
  Chip,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  RestoreFromTrash as RestoreIcon,
  ArrowBack as BackIcon,
  Inventory as InventoryIcon,
  Search as SearchIcon,
  HelpOutline as HelpIcon
} from '@mui/icons-material';

const GestaoAtores = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [atores, setAtores] = useState([]);
  const [nome, setNome] = useState('');
  const [tipoHelice, setTipoHelice] = useState('UNIVERSIDADE');
  const [editandoId, setEditandoId] = useState(null);
  const [mensagem, setMensagem] = useState({ texto: '', tipo: 'info' });
  const [mostrarInativos, setMostrarInativos] = useState(false);
  const [openHelp, setOpenHelp] = useState(false);

  const {
    processedData,
    searchQuery,
    setSearchQuery,
    sortConfig,
    requestSort
  } = useTableData(atores, 'id');

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

  const getHeliceStyle = (tipo) => {
    switch (tipo) {
      case 'UNIVERSIDADE': return { color: 'info', label: 'Universidade' };
      case 'INDUSTRIA': return { color: 'warning', label: 'Indústria' };
      case 'GOVERNO': return { color: 'success', label: 'Governo' };
      default: return { color: 'default', label: tipo };
    }
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 3, mb: 2, display: 'flex', flexDirection: 'column', height: '100%' }}>
      {mensagem.texto && (
        <Alert severity={mensagem.tipo} sx={{ mb: 3, flexShrink: 0 }} onClose={() => setMensagem({ texto: '', tipo: 'info' })}>
          {mensagem.texto}
        </Alert>
      )}

      <Grid container spacing={3} sx={{ flexGrow: 1, overflow: 'hidden' }}>
        <Grid item xs={12} md={4} sx={{ height: isMobile ? 'auto' : '100%', overflowY: isMobile ? 'visible' : 'auto' }}>
          <Paper sx={{ p: 3, borderRadius: 2, position: isMobile ? 'static' : 'sticky', top: '0', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            {!mostrarInativos ? (
              <>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>
                    {editandoId ? 'Editar Registro' : 'Novo Ator'}
                  </Typography>
                  <Tooltip title="Sobre este painel">
                    <IconButton size="small" onClick={() => setOpenHelp(true)}>
                      <HelpIcon fontSize="small" color="action" />
                    </IconButton>
                  </Tooltip>
                </Box>
                <Box component="form" onSubmit={salvarAtor} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <TextField label="Nome da Instituição/Empresa" fullWidth value={nome} onChange={(e) => setNome(e.target.value)} required variant="filled" />
                  <FormControl fullWidth required variant="filled">
                    <InputLabel>Tipo de Hélice</InputLabel>
                    <Select value={tipoHelice} label="Tipo de Hélice" onChange={(e) => setTipoHelice(e.target.value)}>
                      <MenuItem value="UNIVERSIDADE">Universidade</MenuItem>
                      <MenuItem value="INDUSTRIA">Indústria</MenuItem>
                      <MenuItem value="GOVERNO">Governo</MenuItem>
                    </Select>
                  </FormControl>
                  <Button type="submit" variant="contained" color="primary" fullWidth sx={{ height: '48px', mt: 1 }}>
                    {editandoId ? 'Salvar Alterações' : 'Cadastrar no Sistema'}
                  </Button>
                  {editandoId && <Button variant="text" color="secondary" onClick={limparFormulario} fullWidth>Cancelar Edição</Button>}
                </Box>
                
                <Divider sx={{ my: 3 }} />
                
                <Button
                  variant="outlined"
                  fullWidth
                  color="inherit"
                  startIcon={<InventoryIcon />}
                  onClick={() => setMostrarInativos(true)}
                  sx={{ borderColor: 'divider', color: 'text.secondary' }}
                >
                  Visualizar Itens Arquivados
                </Button>
              </>
            ) : (
              <>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <IconButton onClick={() => setMostrarInativos(false)} sx={{ mr: 1 }}>
                    <BackIcon />
                  </IconButton>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>Itens Arquivados</Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Você está visualizando registros inativos. Utilize o ícone de restauração na tabela para reativá-los.
                </Typography>
                <Alert severity="warning" variant="outlined">
                  Registros arquivados não aparecem no motor de matchmaking.
                </Alert>
              </>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={8} sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <Paper sx={{ mb: 2, borderRadius: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.05)', flexShrink: 0 }}>
            <TextField
              fullWidth
              variant="standard"
              placeholder="Pesquisar por nome ou categoria..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{ px: 2, py: 1.5 }}
              InputProps={{ 
                disableUnderline: true,
                startAdornment: (<InputAdornment position="start"><SearchIcon color="disabled" /></InputAdornment>), 
              }}
            />
          </Paper>

          <TableContainer 
            component={Paper} 
            sx={{ 
              borderRadius: 2, 
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)', 
              maxHeight: isMobile ? '400px' : 'calc(100vh - 220px)',
              overflowY: 'auto' 
            }}
          >
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f8fafc', width: '80px' }}>
                    <TableSortLabel active={sortConfig.key === 'id'} direction={sortConfig.key === 'id' ? sortConfig.direction : 'asc'} onClick={() => requestSort('id')}>ID</TableSortLabel>
                  </TableCell>
                  <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f8fafc' }}>
                    <TableSortLabel active={sortConfig.key === 'nome'} direction={sortConfig.key === 'nome' ? sortConfig.direction : 'asc'} onClick={() => requestSort('nome')}>Instituição / Empresa</TableSortLabel>
                  </TableCell>
                  <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f8fafc', width: '160px' }}>
                    <TableSortLabel active={sortConfig.key === 'tipo_helice'} direction={sortConfig.key === 'tipo_helice' ? sortConfig.direction : 'asc'} onClick={() => requestSort('tipo_helice')}>Hélice</TableSortLabel>
                  </TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold', backgroundColor: '#f8fafc', width: '120px' }}>Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {processedData.map(ator => {
                  const style = getHeliceStyle(ator.tipo_helice);
                  return (
                    <TableRow key={ator.id} hover>
                      <TableCell sx={{ color: 'text.secondary' }}>#{ator.id}</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>{ator.nome}</TableCell>
                      <TableCell>
                        <Chip label={style.label} color={style.color} variant="soft" size="small" sx={{ fontWeight: 600 }} />
                      </TableCell>
                      <TableCell align="right">
                        {mostrarInativos ? (
                          <Tooltip title="Restaurar Registro">
                            <IconButton size="small" color="success" onClick={() => restaurarAtor(ator.id)}>
                              <RestoreIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        ) : (
                          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 0.5 }}>
                            <Tooltip title="Editar">
                              <IconButton size="small" color="primary" onClick={() => prepararEdicao(ator)}>
                                <EditIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Arquivar">
                              <IconButton size="small" color="error" onClick={() => inativarAtor(ator.id)}>
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
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