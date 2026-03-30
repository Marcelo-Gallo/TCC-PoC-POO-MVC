import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const TelaLogin = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErro('');

    try {
      const formData = new URLSearchParams();
      formData.append('username', email);
      formData.append('password', senha);

      const response = await api.post('/auth/login', formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      localStorage.setItem('token', response.data.access_token);
      navigate('/atores');
    } catch (error) {
      setErro('Credenciais inválidas. Verifique seu e-mail e senha.');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '100px auto', fontFamily: 'sans-serif' }}>
      <h2>Acesso do Gestor</h2>
      <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '5px' }}>E-mail corporativo:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '5px' }}>Senha:</label>
          <input
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        {erro && <span style={{ color: 'red', fontSize: '14px' }}>{erro}</span>}
        <button type="submit" style={{ padding: '10px', backgroundColor: '#0056b3', color: 'white', border: 'none', cursor: 'pointer' }}>
          Entrar no Sistema
        </button>
      </form>
    </div>
  );
};

export default TelaLogin;