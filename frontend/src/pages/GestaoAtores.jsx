import React, { useState, useEffect } from 'react';
import api from '../services/api';

const GestaoAtores = () => {
  const [atores, setAtores] = useState([]);
  const [nome, setNome] = useState('');
  const [tipoHelice, setTipoHelice] = useState('UNIVERSIDADE');
  const [editandoId, setEditandoId] = useState(null);
  const [mensagem, setMensagem] = useState('');
  const [mostrarInativos, setMostrarInativos] = useState(false);

  useEffect(() => {
    carregarAtores();
  }, [mostrarInativos]);

  const carregarAtores = async () => {
    try {
      const response = await api.get(`/atores?mostrar_inativos=${mostrarInativos}`);
      setAtores(response.data);
    } catch (error) {
      setMensagem('Erro ao carregar a lista de atores.');
    }
  };

  const salvarAtor = async (e) => {
    e.preventDefault();
    try {
      if (editandoId) {
        await api.put(`/atores/${editandoId}`, { nome, tipo_helice: tipoHelice });
        setMensagem('Ator atualizado com sucesso!');
      } else {
        await api.post('/atores', { nome, tipo_helice: tipoHelice });
        setMensagem('Ator cadastrado com sucesso!');
      }
      limparFormulario();
      carregarAtores();
    } catch (error) {
      setMensagem(error.response?.data?.detail || 'Erro ao salvar o ator.');
    }
  };

  const prepararEdicao = (ator) => {
    setEditandoId(ator.id);
    setNome(ator.nome);
    setTipoHelice(ator.tipo_helice);
    setMensagem('');
  };

  const inativarAtor = async (id) => {
    if (window.confirm('Deseja realmente inativar este ator?')) {
      try {
        await api.put(`/atores/${id}`, { is_deleted: true });
        setMensagem('Ator inativado com sucesso!');
        carregarAtores();
      } catch (error) {
        setMensagem('Erro ao inativar o ator.');
      }
    }
  };

  const restaurarAtor = async (id) => {
    if (window.confirm('Deseja realmente restaurar este ator e torná-lo ativo novamente?')) {
      try {
        await api.put(`/atores/${id}`, { is_deleted: false });
        setMensagem('Ator restaurado com sucesso!');
        carregarAtores();
      } catch (error) {
        setMensagem('Erro ao restaurar o ator.');
      }
    }
  };

  const limparFormulario = () => {
    setNome('');
    setTipoHelice('UNIVERSIDADE');
    setEditandoId(null);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '800px', margin: '0 auto' }}>
      <h2>Gestão do Ecossistema (Tríplice Hélice)</h2>
      
      {mensagem && <div style={{ padding: '10px', backgroundColor: '#e2e3e5', marginBottom: '15px' }}>{mensagem}</div>}

      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={() => setMostrarInativos(!mostrarInativos)}
          style={{ 
            padding: '10px 15px', 
            backgroundColor: mostrarInativos ? '#6c757d' : '#ffc107', 
            color: mostrarInativos ? 'white' : 'black',
            border: 'none', 
            borderRadius: '5px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          {mostrarInativos ? '← Voltar para Atores Ativos' : 'Ver Lixeira (Atores Arquivados)'}
        </button>
      </div>

      {!mostrarInativos && (
        <form onSubmit={salvarAtor} style={{ display: 'flex', gap: '10px', marginBottom: '30px', alignItems: 'flex-end' }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Nome da Instituição/Empresa:</label>
            <input 
              type="text" 
              value={nome} 
              onChange={(e) => setNome(e.target.value)} 
              required 
              style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Tipo de Hélice:</label>
            <select 
              value={tipoHelice} 
              onChange={(e) => setTipoHelice(e.target.value)}
              style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
            >
              <option value="UNIVERSIDADE">Universidade</option>
              <option value="INDUSTRIA">Indústria</option>
              <option value="GOVERNO">Governo</option>
            </select>
          </div>
          <button type="submit" style={{ padding: '9px 15px', backgroundColor: '#28a745', color: 'white', border: 'none', cursor: 'pointer' }}>
            {editandoId ? 'Atualizar' : 'Cadastrar'}
          </button>
          {editandoId && (
            <button type="button" onClick={limparFormulario} style={{ padding: '9px 15px', backgroundColor: '#6c757d', color: 'white', border: 'none', cursor: 'pointer' }}>
              Cancelar
            </button>
          )}
        </form>
      )}

      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
        <thead>
          <tr style={{ backgroundColor: '#f8f9fa', textAlign: 'left' }}>
            <th style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>ID</th>
            <th style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>Nome</th>
            <th style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>Hélice</th>
            <th style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {atores.map(ator => (
            <tr key={ator.id}>
              <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>{ator.id}</td>
              <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>{ator.nome}</td>
              <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>{ator.tipo_helice}</td>
              <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>
                {mostrarInativos ? (
                  <button 
                    onClick={() => restaurarAtor(ator.id)}
                    style={{ backgroundColor: '#28a745', color: 'white', padding: '5px 10px', border: 'none', borderRadius: '3px', cursor: 'pointer' }}
                  >
                    Restaurar
                  </button>
                ) : (
                  <>
                    <button onClick={() => prepararEdicao(ator)} style={{ marginRight: '5px', padding: '5px 10px', cursor: 'pointer' }}>Editar</button>
                    <button onClick={() => inativarAtor(ator.id)} style={{ padding: '5px 10px', backgroundColor: '#dc3545', color: 'white', border: 'none', cursor: 'pointer' }}>Inativar</button>
                  </>
                )}
              </td>
            </tr>
          ))}
          {atores.length === 0 && (
            <tr>
              <td colSpan="4" style={{ padding: '10px', textAlign: 'center' }}>
                {mostrarInativos ? 'Nenhum ator arquivado encontrado.' : 'Nenhum ator ativo encontrado.'}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default GestaoAtores;