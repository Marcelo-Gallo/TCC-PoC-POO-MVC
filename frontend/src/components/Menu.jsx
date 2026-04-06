import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box, Avatar, Chip } from '@mui/material';
import { getUsuarioLogado } from '../utils/auth';

const Menu = () => {
  const navigate = useNavigate();
  const usuario = getUsuarioLogado();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const navLinkStyle = ({ isActive }) => ({
    textDecoration: 'none',
    color: isActive ? '#2563eb' : '#475569',
    fontWeight: isActive ? 700 : 500,
    borderBottom: isActive ? '3px solid #2563eb' : '3px solid transparent',
    padding: '6px 4px',
    transition: 'all 0.2s',
  });

  const inicial = usuario?.nome ? usuario.nome.charAt(0).toUpperCase() : 'G';

  return (
    <AppBar position="sticky" elevation={0} sx={{ backgroundColor: 'rgba(255, 255, 255, 0.85)', backdropFilter: 'blur(10px)', borderBottom: '1px solid #e2e8f0' }}>
      <Toolbar sx={{ maxWidth: '1200px', width: '100%', margin: '0 auto' }}>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mr: 4 }}>
          <img 
            src="/TH.svg" 
            alt="InovaHelix Logo" 
            style={{ width: '32px', height: '32px' }} 
          />
          <Typography variant="h6" component="div" sx={{ fontWeight: 900, color: 'primary.main', letterSpacing: '-0.5px' }}>
            InovaHelix
          </Typography>
        </Box>

        <Box sx={{ flexGrow: 1, display: 'flex', gap: 3 }}>
          <NavLink to="/gestores" style={navLinkStyle}>Equipe</NavLink>
          <NavLink to="/atores" style={navLinkStyle}>Atores</NavLink>
          <NavLink to="/demandas" style={navLinkStyle}>Demandas</NavLink>
          <NavLink to="/expertises" style={navLinkStyle}>Expertises</NavLink>
          <NavLink to="/matchmaking" style={navLinkStyle}>Matchmaking (IA)</NavLink>
        </Box>

        {usuario && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mr: 3, borderLeft: '1px solid #e2e8f0', pl: 3 }}>
            <Avatar sx={{ width: 32, height: 32, bgcolor: usuario.is_master ? '#f59e0b' : 'primary.main', fontSize: '14px', fontWeight: 'bold' }}>
              {inicial}
            </Avatar>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography variant="caption" sx={{ fontWeight: 'bold', lineHeight: 1, color: '#1e293b' }}>
                Olá, {usuario.nome.split(' ')[0]}
              </Typography>
              <Chip 
                label={usuario.is_master ? "Master" : "Admin"} 
                size="small" 
                color={usuario.is_master ? "warning" : "default"}
                sx={{ height: '16px', fontSize: '0.6rem', mt: 0.5, fontWeight: 'bold' }} 
              />
            </Box>
          </Box>
        )}

        <Button variant="outlined" color="error" size="small" onClick={handleLogout} sx={{ borderWidth: 2, '&:hover': { borderWidth: 2 } }}>
          Sair
        </Button>

      </Toolbar>
    </AppBar>
  );
};

export default Menu;