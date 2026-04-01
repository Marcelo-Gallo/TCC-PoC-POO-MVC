import React from 'react';
import { Box, Typography } from '@mui/material';

const Footer = () => {
  return (
    <Box 
      component="footer" 
      sx={{
        backgroundColor: 'rgba(248, 250, 252, 0.9)',
        borderTop: '1px solid #e2e8f0',
        py: 3,
        textAlign: 'center',
        mt: 'auto'
      }}
    >
      <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'text.secondary', mb: 0.5 }}>
        &copy; {new Date().getFullYear()} - Plataforma de Corretagem Digital de Inovação
      </Typography>
      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
        Trabalho protótipo desenvolvido para defesa de TCC no curso de Bacharelado em Sistemas de Informação (BSI).
      </Typography>
    </Box>
  );
};

export default Footer;