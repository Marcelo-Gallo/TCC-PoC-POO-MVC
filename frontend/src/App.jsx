import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import TelaLogin from './pages/TelaLogin';
import GestaoAtores from './pages/GestaoAtores';
import TelaDemanda from './pages/TelaDemanda';
import TelaExpertise from './pages/TelaExpertise';
import TelaMatchmaking from './pages/TelaMatchmaking';
import Menu from './components/Menu';

const PrivateRoute = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem('token');
  return isAuthenticated ? (
    <>
      <Menu />
      {children}
    </>
  ) : <Navigate to="/login" replace />;
};

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        <Route path="/login" element={<TelaLogin />} />
        
        <Route 
          path="/atores" 
          element={
            <PrivateRoute>
              <GestaoAtores />
            </PrivateRoute>
          } 
        />
        
        <Route 
          path="/demandas" 
          element={
            <PrivateRoute>
              <TelaDemanda />
            </PrivateRoute>
          } 
        />
        
        <Route 
          path="/expertises" 
          element={
            <PrivateRoute>
              <TelaExpertise />
            </PrivateRoute>
          } 
        />
        
        <Route 
          path="/matchmaking" 
          element={
            <PrivateRoute>
              <TelaMatchmaking />
            </PrivateRoute>
          } 
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;