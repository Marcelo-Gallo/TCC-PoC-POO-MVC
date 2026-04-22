import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  AppBar, Toolbar, Typography, Button, Box, Avatar, Chip, 
  IconButton, Drawer, List, ListItem, ListItemText, useTheme, useMediaQuery, Divider 
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { getUsuarioLogado } from '../utils/auth';

const Menu = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  
  const usuario = getUsuarioLogado();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const navLinkStyle = ({ isActive }) => ({
    textDecoration: 'none',
    color: isActive ? '#2563eb' : '#475569',
    fontWeight: isActive ? 700 : 500,
    borderBottom: isActive && !isMobile ? '3px solid #2563eb' : '3px solid transparent',
    padding: isMobile ? '12px 16px' : '6px 4px',
    display: 'block',
    transition: 'all 0.2s',
  });

  const inicial = usuario?.nome ? usuario.nome.charAt(0).toUpperCase() : 'G';

  const rotas = [
    { nome: 'Equipe', path: '/gestores' },
    { nome: 'Atores', path: '/atores' },
    { nome: 'Demandas', path: '/demandas' },
    { nome: 'Expertises', path: '/expertises' },
    { nome: 'Matchmaking (IA)', path: '/matchmaking' },
  ];

  const drawerContent = (
    <Box sx={{ width: 250 }} role="presentation" onClick={handleDrawerToggle}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2 }}>
        <Typography variant="h6" color="primary" fontWeight="bold">Menu</Typography>
        <IconButton onClick={handleDrawerToggle}><CloseIcon /></IconButton>
      </Box>
      <Divider />
      <List>
        {rotas.map((rota) => (
          <ListItem key={rota.nome} disablePadding>
            <NavLink to={rota.path} style={navLinkStyle} className="w-full">
              {rota.nome}
            </NavLink>
          </ListItem>
        ))}
      </List>
      <Divider sx={{ my: 2 }} />
      <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
         {usuario && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Avatar sx={{ width: 32, height: 32, bgcolor: usuario.is_master ? '#f59e0b' : 'primary.main', fontSize: '14px', fontWeight: 'bold' }}>
                {inicial}
              </Avatar>
              <Typography variant="body2" fontWeight="bold">
                {usuario.nome.split(' ')[0]}
              </Typography>
            </Box>
          )}
          <Button variant="outlined" color="error" fullWidth onClick={handleLogout}>
            Sair
          </Button>
      </Box>
    </Box>
  );

  return (
    <AppBar position="sticky" elevation={0} sx={{ backgroundColor: 'rgba(255, 255, 255, 0.85)', backdropFilter: 'blur(10px)', borderBottom: '1px solid #e2e8f0' }}>
      <Toolbar sx={{ maxWidth: '1200px', width: '100%', margin: '0 auto', justifyContent: 'space-between' }}>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <img src="/TH.svg" alt="InovaHelix Logo" style={{ width: '32px', height: '32px' }} />
          <Typography variant="h6" component="div" sx={{ fontWeight: 900, color: 'primary.main', letterSpacing: '-0.5px' }}>
            InovaHelix
          </Typography>
        </Box>

        {isMobile ? (
          <>
            <IconButton color="inherit" aria-label="open drawer" edge="end" onClick={handleDrawerToggle} sx={{ color: 'text.primary' }}>
              <MenuIcon />
            </IconButton>
            <Drawer anchor="right" open={mobileOpen} onClose={handleDrawerToggle}>
              {drawerContent}
            </Drawer>
          </>
        ) : (
          <>
            <Box sx={{ flexGrow: 1, display: 'flex', gap: 3, ml: 4 }}>
              {rotas.map((rota) => (
                <NavLink key={rota.nome} to={rota.path} style={navLinkStyle}>{rota.nome}</NavLink>
              ))}
            </Box>

            {usuario && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mr: 3, borderLeft: '1px solid #e2e8f0', pl: 3 }}>
                <Avatar sx={{ width: 32, height: 32, bgcolor: usuario.is_master ? '#f59e0b' : 'primary.main', fontSize: '14px', fontWeight: 'bold' }}>{inicial}</Avatar>
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  <Typography variant="caption" sx={{ fontWeight: 'bold', lineHeight: 1, color: '#1e293b' }}>
                    Olá, {usuario.nome.split(' ')[0]}
                  </Typography>
                  <Chip label={usuario.is_master ? "Master" : "Admin"} size="small" color={usuario.is_master ? "warning" : "default"} sx={{ height: '16px', fontSize: '0.6rem', mt: 0.5, fontWeight: 'bold' }} />
                </Box>
              </Box>
            )}

            <Button variant="outlined" color="error" size="small" onClick={handleLogout} sx={{ borderWidth: 2, '&:hover': { borderWidth: 2 } }}>
              Sair
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Menu;