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
  useMediaQuery,
  Typography,
  Button
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Search as SearchIcon,
  Key as KeyIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import { useTableData } from '../hooks/useTableData';

const TabelaGestores = ({ 
  dados, 
  aoTransferirMaster, 
  aoDeletar, 
  usuarioLogado 
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
          placeholder="Pesquisar por nome ou e-mail..."
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
                  active={sortConfig.key === 'nome'} 
                  direction={sortConfig.key === 'nome' ? sortConfig.direction : 'asc'} 
                  onClick={() => requestSort('nome')}
                >
                  Colaborador
                </TableSortLabel>
              </TableCell>
              <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f8fafc', display: { xs: 'none', sm: 'table-cell' } }}>
                <TableSortLabel 
                  active={sortConfig.key === 'email'} 
                  direction={sortConfig.key === 'email' ? sortConfig.direction : 'asc'} 
                  onClick={() => requestSort('email')}
                >
                  E-mail
                </TableSortLabel>
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold', backgroundColor: '#f8fafc', width: isMobile ? '90px' : '150px' }}>
                Nível
              </TableCell>
              {usuarioLogado?.is_master && (
                <TableCell align="right" sx={{ fontWeight: 'bold', backgroundColor: '#f8fafc', width: isMobile ? '100px' : '180px' }}>
                  Ações
                </TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {processedData.map(gestor => (
              <TableRow 
                key={gestor.id} 
                hover 
                sx={{ backgroundColor: gestor.is_master ? '#fffbeb' : 'inherit' }}
              >
                <TableCell sx={{ fontWeight: gestor.is_master ? 800 : 500, fontSize: isMobile ? '0.85rem' : '1rem' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {gestor.is_master ? '👑' : <PersonIcon fontSize="small" color="disabled" />}
                    <Box>
                      {gestor.nome}
                      {usuarioLogado?.email === gestor.email && (
                        <Typography variant="caption" sx={{ display: 'block', color: 'primary.main', fontWeight: 700 }}>
                          (Você)
                        </Typography>
                      )}
                      {isMobile && (
                        <Typography variant="caption" sx={{ display: 'block', color: 'text.secondary' }}>
                          {gestor.email}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                </TableCell>
                <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' }, color: 'text.secondary' }}>
                  {gestor.email}
                </TableCell>
                <TableCell align="center">
                  <Chip 
                    label={gestor.is_master ? "Master" : "Admin"} 
                    color={gestor.is_master ? "warning" : "default"}
                    size="small"
                    variant={gestor.is_master ? "filled" : "outlined"}
                    sx={{ fontWeight: 'bold', fontSize: isMobile ? '0.65rem' : '0.75rem' }}
                  />
                </TableCell>
                
                {usuarioLogado?.is_master && (
                  <TableCell align="right">
                    {!gestor.is_master && (
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 0.5 }}>
                        <Tooltip title="Transferir Master">
                          <IconButton 
                            size="small" 
                            color="warning" 
                            onClick={() => aoTransferirMaster(gestor)}
                          >
                            <KeyIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Remover">
                          <IconButton 
                            size="small" 
                            color="error" 
                            onClick={() => aoDeletar(gestor.id)}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    )}
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default TabelaGestores;