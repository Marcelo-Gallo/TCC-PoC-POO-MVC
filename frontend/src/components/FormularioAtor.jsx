import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Paper,
  IconButton,
  Tooltip,
  Divider,
  Alert,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Inventory as InventoryIcon,
  ArrowBack as BackIcon,
  HelpOutline as HelpIcon
} from '@mui/icons-material';
import api from '../services/api';

const FormularioAtor = ({ 
  atorParaEditar, 
  aoSucesso, 
  aoCancelar, 
  mostrarInativos, 
  setMostrarInativos, 
  onOpenHelp,
  setMensagem 
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [nome, setNome] = useState('');
  const [tipoHelice, setTipoHelice] = useState('UNIVERSIDADE');

  useEffect(() => {
    if (atorParaEditar) {
      setNome(atorParaEditar.nome);
      setTipoHelice(atorParaEditar.tipo_helice);
    } else {
      limparCampos();
    }
  }, [atorParaEditar]);

  const limparCampos = () => {
    setNome('');
    setTipoHelice('UNIVERSIDADE');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (atorParaEditar) {
        await api.put(`/atores/${atorParaEditar.id}`, { nome, tipo_helice: tipoHelice });
        setMensagem({ texto: 'Ator atualizado com sucesso!', tipo: 'success' });
      } else {
        await api.post('/atores', { nome, tipo_helice: tipoHelice });
        setMensagem({ texto: 'Ator cadastrado com sucesso!', tipo: 'success' });
      }
      limparCampos();
      aoSucesso();
      if (atorParaEditar) aoCancelar();
    } catch (error) {
      setMensagem({ 
        texto: error.response?.data?.detail || 'Erro ao salvar o ator.', 
        tipo: 'error' 
      });
    }
  };

  return (
    <Paper 
      elevation={isMobile ? 0 : 1}
      sx={{ 
        p: isMobile ? 0 : 3, 
        borderRadius: isMobile ? 0 : 2, 
        position: isMobile ? 'static' : 'sticky', 
        top: '0', 
        boxShadow: isMobile ? 'none' : '0 4px 12px rgba(0,0,0,0.05)',
        backgroundColor: 'transparent'
      }}
    >
      {!mostrarInativos ? (
        <>
          {!isMobile && (
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>
                {atorParaEditar ? 'Editar Registro' : 'Novo Ator'}
              </Typography>
              <Tooltip title="Sobre este painel">
                <IconButton size="small" onClick={onOpenHelp}>
                  <HelpIcon fontSize="small" color="action" />
                </IconButton>
              </Tooltip>
            </Box>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: isMobile ? 1 : 0 }}>
            <TextField 
              label="Nome da Instituição/Empresa" 
              fullWidth 
              value={nome} 
              onChange={(e) => setNome(e.target.value)} 
              required 
              variant="filled" 
            />
            <FormControl fullWidth required variant="filled">
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
            <Button type="submit" variant="contained" color="primary" fullWidth sx={{ height: '48px', mt: 1 }}>
              {atorParaEditar ? 'Salvar Alterações' : 'Cadastrar no Sistema'}
            </Button>
            {atorParaEditar && !isMobile && (
              <Button variant="text" color="secondary" onClick={aoCancelar} fullWidth>
                Cancelar Edição
              </Button>
            )}
          </Box>
          
          {!isMobile && (
            <>
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
          )}
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
  );
};

export default FormularioAtor;