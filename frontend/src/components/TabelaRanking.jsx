import React from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Button,
  Link,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { Launch as LaunchIcon } from '@mui/icons-material';

const TabelaRanking = ({ titulo, metricas, corDestaque, isPrimary = false, aoAbrirPortfolio }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Paper sx={{ p: isMobile ? 2 : 3, height: '100%', borderRadius: 2, borderTop: `4px solid ${corDestaque}` }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 800, color: 'text.primary', fontSize: isMobile ? '1.1rem' : '1.25rem' }}>
          {titulo}
        </Typography>
        <Chip 
          label={`⏱️ ${metricas.tempo_execucao_segundos}s`} 
          size="small" 
          sx={{ fontWeight: 'bold', backgroundColor: '#f1f5f9' }} 
        />
      </Box>
      
      {metricas.resultados.length > 0 ? (
        <TableContainer sx={{ overflowX: 'hidden' }}>
          <Table size={isMobile ? "small" : "medium"}>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f8fafc' }}>
                <TableCell sx={{ fontWeight: 'bold', width: isMobile ? '40px' : '60px', px: isMobile ? 1 : 2 }}>Rank</TableCell>
                <TableCell sx={{ fontWeight: 'bold', px: isMobile ? 1 : 2 }}>Investigador / Interseção</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold', px: isMobile ? 1 : 2 }}>Score</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold', px: isMobile ? 1 : 2 }}>Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {metricas.resultados.map((resultado, index) => (
                <TableRow key={index} hover>
                  <TableCell sx={{ fontWeight: 800, color: corDestaque, fontSize: isMobile ? '1rem' : '1.1rem', px: isMobile ? 1 : 2 }}>
                    {index + 1}º
                  </TableCell>
                  <TableCell sx={{ px: isMobile ? 1 : 2 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, fontSize: isMobile ? '0.8rem' : '0.875rem' }}>
                      {resultado.pesquisador_responsavel}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1, fontSize: isMobile ? '0.65rem' : '0.75rem' }}>
                      {resultado.area_conhecimento}
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {resultado.termos_explicativos.map((termo, i) => (
                        <Chip 
                          key={i} 
                          label={termo} 
                          size="small" 
                          variant="outlined"
                          sx={{ fontSize: isMobile ? '0.6rem' : '0.65rem', height: isMobile ? '18px' : '20px' }} 
                        />
                      ))}
                    </Box>
                  </TableCell>
                  <TableCell align="center" sx={{ px: isMobile ? 1 : 2 }}>
                    <Chip 
                      label={`${(resultado.score * 100).toFixed(1)}%`}
                      color={resultado.score > 0.4 ? 'success' : 'warning'}
                      size="small"
                      sx={{ fontWeight: 'bold', fontSize: isMobile ? '0.65rem' : '0.8125rem', height: isMobile ? '20px' : '24px' }}
                    />
                  </TableCell>
                  <TableCell align="center" sx={{ px: isMobile ? 1 : 2 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'center' }}>
                      <Button 
                        size="small" 
                        variant={isPrimary ? "contained" : "outlined"} 
                        color={isPrimary ? "primary" : "inherit"}
                        onClick={() => aoAbrirPortfolio(resultado.expertise_id)}
                        sx={{ fontSize: isMobile ? '0.6rem' : '0.65rem', py: 0.2, minWidth: isMobile ? '60px' : '70px' }}
                      >
                        Portfolio
                      </Button>
                      {resultado.link_lattes && (
                        <Link 
                          href={resultado.link_lattes} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          sx={{ fontSize: isMobile ? '0.65rem' : '0.7rem', display: 'flex', alignItems: 'center', gap: 0.5 }}
                        >
                          Lattes <LaunchIcon sx={{ fontSize: '0.65rem' }} />
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
};

export default TabelaRanking;