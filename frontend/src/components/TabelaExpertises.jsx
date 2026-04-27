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
  Badge,
  useTheme,
  useMediaQuery,
  Typography
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  RestoreFromTrash as RestoreIcon,
  Search as SearchIcon,
  FolderOpen as FolderIcon
} from '@mui/icons-material';
import { useTableData } from '../hooks/useTableData';

const TabelaExpertises = ({ 
  dados, 
  aoEditar, 
  aoInativar, 
  aoRestaurar, 
  aoAbrirPortfolio,
  expertiseSelecionada,
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
          placeholder="Buscar por pesquisador ou área..."
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
              <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f8fafc' }}>
                <TableSortLabel 
                  active={sortConfig.key === 'pesquisador_responsavel'} 
                  direction={sortConfig.key === 'pesquisador_responsavel' ? sortConfig.direction : 'asc'} 
                  onClick={() => requestSort('pesquisador_responsavel')}
                >
                  Pesquisador
                </TableSortLabel>
              </TableCell>
              <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f8fafc', display: { xs: 'none', sm: 'table-cell' } }}>
                <TableSortLabel 
                  active={sortConfig.key === 'area_conhecimento'} 
                  direction={sortConfig.key === 'area_conhecimento' ? sortConfig.direction : 'asc'} 
                  onClick={() => requestSort('area_conhecimento')}
                >
                  Área
                </TableSortLabel>
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold', backgroundColor: '#f8fafc', width: '80px' }}>
                Trabalhos
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: 'bold', backgroundColor: '#f8fafc', width: isMobile ? '100px' : '140px' }}>
                Ações
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {processedData.map(exp => (
              <TableRow 
                key={exp.id} 
                hover
                sx={{ backgroundColor: expertiseSelecionada === exp.id ? '#f1f5f9' : 'inherit' }}
              >
                <TableCell sx={{ fontWeight: 600, fontSize: isMobile ? '0.85rem' : '1rem' }}>
                  {exp.pesquisador_responsavel}
                  {isMobile && (
                    <Typography variant="caption" display="block" color="text.secondary">
                      {exp.area_conhecimento}
                    </Typography>
                  )}
                </TableCell>
                <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' }, color: 'text.secondary' }}>
                  {exp.area_conhecimento}
                </TableCell>
                <TableCell align="center">
                  <Badge badgeContent={exp.portfolios?.length || 0} color="primary" showZero />
                </TableCell>
                <TableCell align="right" sx={{ paddingRight: isMobile ? 1 : 2 }}>
                  {mostrarInativos ? (
                    <Tooltip title="Restaurar Registro">
                      <IconButton size={isMobile ? "small" : "medium"} color="success" onClick={() => aoRestaurar(exp.id)}>
                        <RestoreIcon fontSize={isMobile ? "small" : "medium"} />
                      </IconButton>
                    </Tooltip>
                  ) : (
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: isMobile ? 0 : 0.5 }}>
                      <Tooltip title="Editar">
                        <IconButton size={isMobile ? "small" : "medium"} color="primary" onClick={() => aoEditar(exp)}>
                          <EditIcon fontSize={isMobile ? "small" : "medium"} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Abrir Portfólio">
                        <IconButton size={isMobile ? "small" : "medium"} color="info" onClick={() => aoAbrirPortfolio(exp.id)}>
                          <FolderIcon fontSize={isMobile ? "small" : "medium"} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Inativar">
                        <IconButton size={isMobile ? "small" : "medium"} color="error" onClick={() => aoInativar(exp.id)}>
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

export default TabelaExpertises;