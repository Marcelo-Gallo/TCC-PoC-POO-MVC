import React from 'react';
import { Box } from '@mui/material';
import Menu from './Menu';
import Footer from './Footer';

const Layout = ({ children }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      <Menu />
      
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1, 
          py: 4, 
          overflow: 'hidden', // Mudança crucial: o main não rola mais, ele apenas contém
          display: 'flex',
          flexDirection: 'column',
          position: 'relative'
        }}
      >
        {children}
      </Box>
      
      <Footer />
    </Box>
  );
};

export default Layout;