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

const TabelaDemandas = ({ 
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

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Paper sx={{ mb: 2, borderRadius: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.05)', flexShrink: 0 }}>
        <TextField
          fullWidth
          variant="standard"
          placeholder="Buscar por ID, Título, Área ou Descrição..."
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
                  active={sortConfig.key === 'titulo'} 
                  direction={sortConfig.key === 'titulo' ? sortConfig.direction : 'asc'} 
                  onClick={() => requestSort('titulo')}
                >
                  Título
                </TableSortLabel>
              </TableCell>
              <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f8fafc', width: isMobile ? '110px' : '160px' }}>
                <TableSortLabel 
                  active={sortConfig.key === 'area_cnpq'} 
                  direction={sortConfig.key === 'area_cnpq' ? sortConfig.direction : 'asc'} 
                  onClick={() => requestSort('area_cnpq')}
                >
                  Área CNPq
                </TableSortLabel>
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: 'bold', backgroundColor: '#f8fafc', width: isMobile ? '80px' : '120px' }}>
                Ações
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {processedData.map(demanda => (
              <TableRow key={demanda.id} hover>
                <TableCell sx={{ color: 'text.secondary', display: { xs: 'none', sm: 'table-cell' } }}>
                  #{demanda.id}
                </TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: isMobile ? '0.85rem' : '1rem' }}>
                  {demanda.titulo}
                </TableCell>
                <TableCell sx={{ fontSize: isMobile ? '0.75rem' : '0.875rem', color: 'text.secondary' }}>
                  {demanda.area_cnpq}
                </TableCell>
                <TableCell align="right" sx={{ paddingRight: isMobile ? 1 : 2 }}>
                  {mostrarInativos ? (
                    <Tooltip title="Restaurar Registro">
                      <IconButton size={isMobile ? "small" : "medium"} color="success" onClick={() => aoRestaurar(demanda.id)}>
                        <RestoreIcon fontSize={isMobile ? "small" : "medium"} />
                      </IconButton>
                    </Tooltip>
                  ) : (
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: isMobile ? 0 : 0.5 }}>
                      <Tooltip title="Editar">
                        <IconButton size={isMobile ? "small" : "medium"} color="primary" onClick={() => aoEditar(demanda)}>
                          <EditIcon fontSize={isMobile ? "small" : "medium"} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Arquivar">
                        <IconButton size={isMobile ? "small" : "medium"} color="error" onClick={() => aoInativar(demanda.id)}>
                          <DeleteIcon fontSize={isMobile ? "small" : "medium"} />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  )}
                </TableCell>
              </TableRow>
            ))}
            {processedData.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} align="center" sx={{ py: 3, color: 'text.secondary' }}>
                  Nenhum resultado encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default TabelaDemandas;