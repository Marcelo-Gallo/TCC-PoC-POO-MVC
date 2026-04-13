import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import React, { useEffect } from 'react';

import theme from './theme';
import { getUsuarioLogado } from './utils/auth';

// Componentes e Páginas
import Layout from './components/Layout';
import TelaLogin from './pages/TelaLogin';
import TelaPrimeiroLogin from './pages/TelaPrimeiroLogin';
import GestaoGestores from './pages/GestaoGestores';
import GestaoAtores from './pages/GestaoAtores';
import TelaDemanda from './pages/TelaDemanda';
import TelaExpertise from './pages/TelaExpertise';
import TelaMatchmaking from './pages/TelaMatchmaking';

import TelaRecuperarSenha from './pages/TelaRecuperarSenha';
import TelaRedefinirSenha from './pages/TelaRedefinirSenha';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const usuario = getUsuarioLogado();
  
  if (!token) return <Navigate to="/login" replace />;
  
  if (usuario?.primeiro_login) return <Navigate to="/primeiro-login" replace />;
  
  return (
    <Layout>
      {children}
    </Layout>
  );
};

const SetupRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const usuario = getUsuarioLogado();
  
  if (!token) return <Navigate to="/login" replace />;
  
  if (!usuario?.primeiro_login) return <Navigate to="/atores" replace />;
  
  return children;
};

const App = () => {

  useEffect(() => {
    const vigiaSessao = setInterval(() => {
      const usuario = getUsuarioLogado();
      if (usuario && usuario.exp) {
        const dataAtual = Math.floor(Date.now() / 1000); 
        
        if (usuario.exp < dataAtual) {
          localStorage.removeItem('token');
          alert('Sua sessão expirou por tempo de inatividade. Por favor, faça login novamente.');
          window.location.href = '/login';
        }
      }
    }, 10000);

    return () => clearInterval(vigiaSessao);
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<TelaLogin />} />
          
          {/* Tela de segurança */}
          <Route path="/primeiro-login" element={<SetupRoute><TelaPrimeiroLogin /></SetupRoute>} />

          {/* Resto do sistema trancado com o ProtectedRoute */}
          <Route path="/gestores" element={<ProtectedRoute><GestaoGestores /></ProtectedRoute>} />
          <Route path="/atores" element={<ProtectedRoute><GestaoAtores /></ProtectedRoute>} />
          <Route path="/demandas" element={<ProtectedRoute><TelaDemanda /></ProtectedRoute>} />
          <Route path="/expertises" element={<ProtectedRoute><TelaExpertise /></ProtectedRoute>} />
          <Route path="/matchmaking" element={<ProtectedRoute><TelaMatchmaking /></ProtectedRoute>} />

          <Route path="/recuperar-senha" element={<TelaRecuperarSenha />} />
          <Route path="/redefinir-senha" element={<TelaRedefinirSenha />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;