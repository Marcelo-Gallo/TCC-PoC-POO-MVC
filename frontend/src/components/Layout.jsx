import React from 'react';
import { Box } from '@mui/material';
import Menu from './Menu';
import Footer from './Footer';

const Layout = ({ children }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Menu />
      
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1, 
          py: { xs: 2, md: 4 }, 
          px: { xs: 1, sm: 2, md: 3 },
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          overflowX: 'hidden'
        }}
      >
        {children}
      </Box>
      
      <Footer />
    </Box>
  );
};

export default Layout;