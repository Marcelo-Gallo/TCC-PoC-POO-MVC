import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import theme from './theme';
import TelaLogin from './pages/TelaLogin';
import GestaoAtores from './pages/GestaoAtores';
import TelaDemanda from './pages/TelaDemanda';
import TelaExpertise from './pages/TelaExpertise';
import TelaMatchmaking from './pages/TelaMatchmaking';
import Layout from './components/Layout';

const PrivateRoute = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem('token');
  
  return isAuthenticated ? (
    <Layout>
      {children}
    </Layout>
  ) : <Navigate to="/login" replace />;
};

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<TelaLogin />} />
          <Route path="/atores" element={<PrivateRoute><GestaoAtores /></PrivateRoute>} />
          <Route path="/demandas" element={<PrivateRoute><TelaDemanda /></PrivateRoute>} />
          <Route path="/expertises" element={<PrivateRoute><TelaExpertise /></PrivateRoute>} />
          <Route path="/matchmaking" element={<PrivateRoute><TelaMatchmaking /></PrivateRoute>} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;