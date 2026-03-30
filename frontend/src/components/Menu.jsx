import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Menu = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav style={{ 
      backgroundColor: '#0056b3', 
      padding: '15px 30px', 
      display: 'flex', 
      gap: '20px', 
      alignItems: 'center',
      boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
    }}>
      <span style={{ color: 'white', fontWeight: 'bold', marginRight: '20px', fontSize: '18px' }}>
        Tríplice Hélice
      </span>
      <Link to="/atores" style={{ color: 'white', textDecoration: 'none' }}>Atores</Link>
      <Link to="/demandas" style={{ color: 'white', textDecoration: 'none' }}>Demandas</Link>
      <Link to="/expertises" style={{ color: 'white', textDecoration: 'none' }}>Expertises</Link>
      <Link to="/matchmaking" style={{ color: '#ffc107', textDecoration: 'none', fontWeight: 'bold' }}>Matchmaking (IA)</Link>
      
      <button onClick={handleLogout} style={{ 
        marginLeft: 'auto', 
        padding: '8px 15px', 
        backgroundColor: '#dc3545', 
        color: 'white', 
        border: 'none', 
        borderRadius: '4px',
        cursor: 'pointer' 
      }}>
        Sair
      </button>
    </nav>
  );
};

export default Menu;