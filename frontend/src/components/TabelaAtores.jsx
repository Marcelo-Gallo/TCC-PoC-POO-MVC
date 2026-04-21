import React from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
  TableSortLabel,
  TextField,
  InputAdornment,
  Chip,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  RestoreFromTrash as RestoreIcon,
  Search as SearchIcon
} from '@mui/icons-material';
import { useTableData } from '../hooks/useTableData';

const TabelaAtores = ({ 
  dados, 
  aoEditar, 
  aoInativar, 
  aoRestaurar, 
  mostrarInativos 
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const {
    processedData,
    searchQuery,
    setSearchQuery,
    sortConfig,
    requestSort
  } = useTableData(dados, 'id');

  const getHeliceStyle = (tipo) => {
    switch (tipo) {
      case 'UNIVERSIDADE': return { color: 'info', label: 'Universidade' };
      case 'INDUSTRIA': return { color: 'warning', label: 'Indústria' };
      case 'GOVERNO': return { color: 'success', label: 'Governo' };
      default: return { color: 'default', label: tipo };
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
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
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="disabled" />
              </InputAdornment>
            ), 
          }}
        />
      </Paper>

      <TableContainer 
        component={Paper} 
        sx={{ 
          borderRadius: 2, 
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)', 
          maxHeight: isMobile ? 'calc(100vh - 200px)' : 'calc(100vh - 220px)',
          overflowY: 'auto',
          overflowX: 'hidden'
        }}
      >
        <Table stickyHeader size={isMobile ? "small" : "medium"}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f8fafc', width: '80px', display: { xs: 'none', sm: 'table-cell' } }}>
                <TableSortLabel 
                  active={sortConfig.key === 'id'} 
                  direction={sortConfig.key === 'id' ? sortConfig.direction : 'asc'} 
                  onClick={() => requestSort('id')}
                >
                  ID
                </TableSortLabel>
              </TableCell>
              <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f8fafc' }}>
                <TableSortLabel 
                  active={sortConfig.key === 'nome'} 
                  direction={sortConfig.key === 'nome' ? sortConfig.direction : 'asc'} 
                  onClick={() => requestSort('nome')}
                >
                  Instituição
                </TableSortLabel>
              </TableCell>
              <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f8fafc', width: isMobile ? '100px' : '160px' }}>
                <TableSortLabel 
                  active={sortConfig.key === 'tipo_helice'} 
                  direction={sortConfig.key === 'tipo_helice' ? sortConfig.direction : 'asc'} 
                  onClick={() => requestSort('tipo_helice')}
                >
                  Hélice
                </TableSortLabel>
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: 'bold', backgroundColor: '#f8fafc', width: isMobile ? '80px' : '120px' }}>
                Ações
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {processedData.map(ator => {
              const style = getHeliceStyle(ator.tipo_helice);
              return (
                <TableRow key={ator.id} hover>
                  <TableCell sx={{ color: 'text.secondary', display: { xs: 'none', sm: 'table-cell' } }}>
                    #{ator.id}
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: isMobile ? '0.85rem' : '1rem' }}>
                    {ator.nome}
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={style.label} 
                      color={style.color} 
                      variant="soft" 
                      size="small" 
                      sx={{ fontWeight: 600, fontSize: isMobile ? '0.65rem' : '0.8125rem', height: isMobile ? '20px' : '24px' }} 
                    />
                  </TableCell>
                  <TableCell align="right" sx={{ paddingRight: isMobile ? 1 : 2 }}>
                    {mostrarInativos ? (
                      <Tooltip title="Restaurar Registro">
                        <IconButton size={isMobile ? "small" : "medium"} color="success" onClick={() => aoRestaurar(ator.id)}>
                          <RestoreIcon fontSize={isMobile ? "small" : "medium"} />
                        </IconButton>
                      </Tooltip>
                    ) : (
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: isMobile ? 0 : 0.5 }}>
                        <Tooltip title="Editar">
                          <IconButton size={isMobile ? "small" : "medium"} color="primary" onClick={() => aoEditar(ator)}>
                            <EditIcon fontSize={isMobile ? "small" : "medium"} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Arquivar">
                          <IconButton size={isMobile ? "small" : "medium"} color="error" onClick={() => aoInativar(ator.id)}>
                            <DeleteIcon fontSize={isMobile ? "small" : "medium"} />
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
    </Box>
  );
};

export default TabelaAtores;