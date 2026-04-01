import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';

const Menu = () => {
  const navigate = useNavigate();

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

  return (
    <AppBar 
      position="sticky" 
      elevation={0} 
      sx={{ 
        backgroundColor: 'rgba(255, 255, 255, 0.85)', 
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid #e2e8f0'
      }}
    >
      <Toolbar sx={{ maxWidth: '1200px', width: '100%', margin: '0 auto' }}>
        <Typography 
          variant="h6" 
          component="div" 
          sx={{ 
            fontWeight: 900, 
            color: 'primary.main', 
            letterSpacing: '-0.5px',
            mr: 4 
          }}
        >
          InovaHelix
        </Typography>

        <Box sx={{ flexGrow: 1, display: 'flex', gap: 3 }}>
          <NavLink to="/atores" style={navLinkStyle}>Atores</NavLink>
          <NavLink to="/demandas" style={navLinkStyle}>Demandas</NavLink>
          <NavLink to="/expertises" style={navLinkStyle}>Expertises</NavLink>
          <NavLink to="/matchmaking" style={navLinkStyle}>
            Matchmaking (IA)
          </NavLink>
        </Box>

        <Button 
          variant="outlined" 
          color="error" 
          size="small"
          onClick={handleLogout}
          sx={{ borderWidth: 2, '&:hover': { borderWidth: 2 } }}
        >
          Sair
        </Button>

      </Toolbar>
    </AppBar>
  );
};

export default Menu;