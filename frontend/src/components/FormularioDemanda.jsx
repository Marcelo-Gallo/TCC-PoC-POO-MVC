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

const FormularioDemanda = ({
  demandaParaEditar,
  aoSucesso,
  aoCancelar,
  mostrarInativos,
  setMostrarInativos,
  onOpenHelp,
  setMensagem,
  atores
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [atorId, setAtorId] = useState('');
  const [areaCnpq, setAreaCnpq] = useState('');

  useEffect(() => {
    if (demandaParaEditar) {
      setTitulo(demandaParaEditar.titulo);
      setDescricao(demandaParaEditar.descricao);
      setAtorId(demandaParaEditar.ator_id);
      setAreaCnpq(demandaParaEditar.area_cnpq);
    } else {
      limparCampos();
    }
  }, [demandaParaEditar]);

  const limparCampos = () => {
    setTitulo('');
    setDescricao('');
    setAtorId('');
    setAreaCnpq('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        titulo,
        descricao,
        ator_id: parseInt(atorId),
        area_cnpq: areaCnpq
      };

      if (demandaParaEditar) {
        await api.put(`/demandas/${demandaParaEditar.id}`, payload);
        setMensagem({ texto: 'Demanda atualizada com sucesso!', tipo: 'success' });
      } else {
        await api.post('/demandas', payload);
        setMensagem({ texto: 'Demanda registrada com sucesso!', tipo: 'success' });
      }
      limparCampos();
      aoSucesso();
      if (demandaParaEditar) aoCancelar();
    } catch (error) {
      setMensagem({
        texto: error.response?.data?.detail || 'Erro ao salvar a demanda.',
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
                {demandaParaEditar ? 'Editar Demanda' : 'Nova Demanda'}
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
              label="Título da Demanda"
              fullWidth
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              required
              variant="filled"
            />

            <TextField
              label="Área CNPq"
              fullWidth
              placeholder="Ex: 1.03.00.00-7"
              value={areaCnpq}
              onChange={(e) => setAreaCnpq(e.target.value)}
              required
              variant="filled"
            />

            <FormControl fullWidth required variant="filled">
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
              variant="filled"
            />

            <Button type="submit" variant="contained" color="primary" fullWidth sx={{ height: '48px', mt: 1 }}>
              {demandaParaEditar ? 'Salvar Alterações' : 'Cadastrar Demanda'}
            </Button>
            {demandaParaEditar && !isMobile && (
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
            Demandas arquivadas não aparecem no motor de matchmaking.
          </Alert>
        </>
      )}
    </Paper>
  );
};

export default FormularioDemanda;