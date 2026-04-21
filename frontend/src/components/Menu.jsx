import React, { useState } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Box, 
  IconButton, 
  Drawer, 
  List, 
  ListItem, 
  ListItemText, 
  Avatar, 
  Menu as MuiMenu, 
  MenuItem, 
  useTheme, 
  useMediaQuery 
} from '@mui/material';
import { 
  Menu as MenuIcon, 
  ChevronLeft as ChevronLeftIcon,
  AccountCircle 
} from '@mui/icons-material';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Menu = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { text: 'Atores', path: '/atores' },
    { text: 'Gestores', path: '/gestores' },
    { text: 'Demandas', path: '/demandas' },
    { text: 'Expertises', path: '/expertises' },
    { text: 'Matchmaking', path: '/matchmaking' },
  ];

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);
  
  const handleProfileMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleProfileMenuClose = () => setAnchorEl(null);

  const handleLogout = () => {
    handleProfileMenuClose();
    localStorage.removeItem('token');
    navigate('/login');
  };

  const drawer = (
    <Box sx={{ width: 280, pt: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2, mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <img src="/TH.svg" alt="Logo" style={{ height: '30px' }} />
          <Typography variant="h6" sx={{ fontWeight: 800, color: 'primary.main', fontSize: '1.1rem' }}>
            InovaHelix
          </Typography>
        </Box>
        <IconButton onClick={handleDrawerToggle}><ChevronLeftIcon /></IconButton>
      </Box>
      <List>
        {menuItems.map((item) => (
          <ListItem 
            button 
            key={item.text} 
            component={Link} 
            to={item.path} 
            onClick={handleDrawerToggle}
            selected={location.pathname === item.path}
            sx={{
              mx: 1,
              borderRadius: 1,
              '&.Mui-selected': { backgroundColor: 'primary.light', '& .MuiListItemText-primary': { color: 'primary.main', fontWeight: 700 } }
            }}
          >
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar position="sticky" elevation={0} sx={{ borderBottom: '1px solid', borderColor: 'divider', backgroundColor: 'background.paper', color: 'text.primary' }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {isMobile && (
              <IconButton color="inherit" edge="start" onClick={handleDrawerToggle} sx={{ mr: 1 }}><MenuIcon /></IconButton>
            )}
            <Box component={Link} to="/" sx={{ display: 'flex', alignItems: 'center', gap: 1.5, textDecoration: 'none', color: 'inherit' }}>
              <img src="/TH.svg" alt="InovaHelix Logo" style={{ height: '35px' }} />
              {!isMobile && (
                <Typography variant="h6" noWrap sx={{ fontWeight: 800, color: 'primary.main', letterSpacing: '-0.5px' }}>
                  InovaHelix
                </Typography>
              )}
            </Box>
          </Box>

          {!isMobile && (
            <Box sx={{ display: 'flex', gap: 0.5 }}>
              {menuItems.map((item) => (
                <Button 
                  key={item.text} 
                  component={Link} 
                  to={item.path} 
                  sx={{ 
                    px: 2,
                    fontWeight: location.pathname === item.path ? 700 : 500,
                    color: location.pathname === item.path ? 'primary.main' : 'text.secondary',
                    borderBottom: location.pathname === item.path ? '2px solid' : '2px solid transparent',
                    borderColor: 'primary.main',
                    borderRadius: 0,
                    '&:hover': { backgroundColor: 'transparent', color: 'primary.main' }
                  }}
                >
                  {item.text}
                </Button>
              ))}
            </Box>
          )}

          <Box>
            <IconButton onClick={handleProfileMenuOpen} sx={{ p: 0.5, border: '2px solid', borderColor: 'divider' }}>
              <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                <AccountCircle fontSize="small" />
              </Avatar>
            </IconButton>
            <MuiMenu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleProfileMenuClose}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              PaperProps={{ sx: { mt: 1.5, minWidth: 150, boxShadow: '0 4px 20px rgba(0,0,0,0.1)', borderRadius: 2 } }}
            >
              <MenuItem onClick={handleProfileMenuClose} component={Link} to="/perfil" sx={{ fontSize: '0.875rem' }}>Meu Perfil</MenuItem>
              <Divider />
              <MenuItem onClick={handleLogout} sx={{ fontSize: '0.875rem', color: 'error.main' }}>Sair do Sistema</MenuItem>
            </MuiMenu>
          </Box>
        </Toolbar>
      </AppBar>
      <Drawer anchor="left" open={mobileOpen} onClose={handleDrawerToggle}>{drawer}</Drawer>
    </>
  );
};

export default Menu;