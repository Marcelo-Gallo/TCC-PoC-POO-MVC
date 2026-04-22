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

const FormularioExpertise = ({
  expertiseParaEditar,
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

  const [pesquisadorResponsavel, setPesquisadorResponsavel] = useState('');
  const [areaConhecimento, setAreaConhecimento] = useState('');
  const [areaCnpq, setAreaCnpq] = useState('');
  const [linkLattes, setLinkLattes] = useState('');
  const [atorId, setAtorId] = useState('');

  useEffect(() => {
    if (expertiseParaEditar) {
      setPesquisadorResponsavel(expertiseParaEditar.pesquisador_responsavel);
      setAreaConhecimento(expertiseParaEditar.area_conhecimento);
      setAreaCnpq(expertiseParaEditar.area_cnpq);
      setLinkLattes(expertiseParaEditar.link_lattes || '');
      setAtorId(expertiseParaEditar.ator_id);
    } else {
      limparCampos();
    }
  }, [expertiseParaEditar]);

  const limparCampos = () => {
    setPesquisadorResponsavel('');
    setAreaConhecimento('');
    setAreaCnpq('');
    setLinkLattes('');
    setAtorId('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        pesquisador_responsavel: pesquisadorResponsavel,
        area_conhecimento: areaConhecimento,
        area_cnpq: areaCnpq,
        link_lattes: linkLattes,
        ator_id: parseInt(atorId)
      };

      if (expertiseParaEditar) {
        await api.put(`/expertises/${expertiseParaEditar.id}`, payload);
        setMensagem({ texto: 'Investigador atualizado com sucesso!', tipo: 'success' });
      } else {
        await api.post('/expertises', payload);
        setMensagem({ texto: 'Investigador registrado com sucesso!', tipo: 'success' });
      }
      limparCampos();
      aoSucesso();
      if (expertiseParaEditar) aoCancelar();
    } catch (error) {
      setMensagem({
        texto: error.response?.data?.detail || 'Erro ao salvar o investigador.',
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
                {expertiseParaEditar ? 'Editar Investigador' : 'Novo Investigador'}
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
              label="Nome do Investigador"
              fullWidth
              value={pesquisadorResponsavel}
              onChange={(e) => setPesquisadorResponsavel(e.target.value)}
              required
              variant="filled"
            />

            <FormControl fullWidth required variant="filled">
              <InputLabel>Universidade</InputLabel>
              <Select
                value={atorId}
                label="Universidade"
                onChange={(e) => setAtorId(e.target.value)}
              >
                <MenuItem value="" disabled>Selecione a Universidade...</MenuItem>
                {atores.map(a => (
                  <MenuItem key={a.id} value={a.id}>
                    {a.nome} {a.is_deleted ? ' - (ARQUIVADO)' : ''}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="Área de Conhecimento"
              fullWidth
              value={areaConhecimento}
              onChange={(e) => setAreaConhecimento(e.target.value)}
              required
              variant="filled"
            />

            <TextField
              label="Área CNPq"
              fullWidth
              value={areaCnpq}
              onChange={(e) => setAreaCnpq(e.target.value)}
              required
              variant="filled"
            />

            <TextField
              label="Link do Currículo Lattes (Opcional)"
              type="url"
              fullWidth
              value={linkLattes}
              onChange={(e) => setLinkLattes(e.target.value)}
              variant="filled"
            />

            <Button type="submit" variant="contained" color="primary" fullWidth sx={{ height: '48px', mt: 1 }}>
              {expertiseParaEditar ? 'Salvar Alterações' : 'Cadastrar Investigador'}
            </Button>
            {expertiseParaEditar && !isMobile && (
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
            Investigadores arquivados não aparecem no motor de matchmaking.
          </Alert>
        </>
      )}
    </Paper>
  );
};

export default FormularioExpertise;