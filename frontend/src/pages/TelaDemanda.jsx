import React, { useState, useEffect } from 'react';
import api from '../services/api';

const TelaDemanda = () => {
  const [demandas, setDemandas] = useState([]);
  const [atores, setAtores] = useState([]);
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [atorId, setAtorId] = useState('');
  const [areaCnpq, setAreaCnpq] = useState('');
  const [editandoId, setEditandoId] = useState(null);
  const [mensagem, setMensagem] = useState('');
  const [mostrarInativos, setMostrarInativos] = useState(false);

  useEffect(() => {
    carregarDemandas();
    carregarAtores();
  }, [mostrarInativos]);

  const carregarDemandas = async () => {
    try {
      const response = await api.get(`/demandas?mostrar_inativos=${mostrarInativos}`);
      setDemandas(response.data);
    } catch (error) {
      setMensagem('Erro ao carregar as demandas.');
    }
  };

  const carregarAtores = async () => {
    try {
      const resAtivos = await api.get('/atores');
      const resInativos = await api.get('/atores?mostrar_inativos=true');
      
      setAtores([...resAtivos.data, ...resInativos.data]);
    } catch (error) {
      setMensagem('Erro ao carregar os atores.');
    }
  };

  const salvarDemanda = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        titulo,
        descricao,
        ator_id: parseInt(atorId),
        area_cnpq: areaCnpq
      };

      if (editandoId) {
        await api.put(`/demandas/${editandoId}`, payload);
        setMensagem('Demanda atualizada com sucesso!');
      } else {
        await api.post('/demandas', payload);
        setMensagem('Demanda registada com sucesso!');
      }
      limparFormulario();
      carregarDemandas();
    } catch (error) {
      setMensagem(error.response?.data?.detail || 'Erro ao guardar a demanda.');
    }
  };

  const prepararEdicao = (demanda) => {
    setEditandoId(demanda.id);
    setTitulo(demanda.titulo);
    setDescricao(demanda.descricao);
    setAtorId(demanda.ator_id);
    setAreaCnpq(demanda.area_cnpq);
    setMensagem('');
  };

  const inativarDemanda = async (id) => {
    if (window.confirm('Deseja realmente inativar esta demanda?')) {
      try {
        await api.put(`/demandas/${id}`, { is_deleted: true });
        setMensagem('Demanda inativada com sucesso!');
        carregarDemandas();
      } catch (error) {
        setMensagem('Erro ao inativar a demanda.');
      }
    }
  };

  const restaurarDemanda = async (id) => {
    if (window.confirm('Deseja realmente restaurar esta demanda?')) {
      try {
        await api.put(`/demandas/${id}`, { is_deleted: false });
        setMensagem('Demanda restaurada com sucesso!');
        carregarDemandas();
      } catch (error) {
        setMensagem('Erro ao restaurar a demanda.');
      }
    }
  };

  const limparFormulario = () => {
    setTitulo('');
    setDescricao('');
    setAtorId('');
    setAreaCnpq('');
    setEditandoId(null);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '900px', margin: '0 auto' }}>
      <h2>Gestão de Demandas (Problemas e Oportunidades)</h2>
      
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
          {mostrarInativos ? '← Voltar para Demandas Ativas' : 'Ver Lixeira (Demandas Arquivadas)'}
        </button>
      </div>

      {!mostrarInativos && (
        <form onSubmit={salvarDemanda} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '30px' }}>
          <div style={{ display: 'flex', gap: '10px' }}>
            <div style={{ flex: 2 }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>Título da Demanda:</label>
              <input 
                type="text" 
                value={titulo} 
                onChange={(e) => setTitulo(e.target.value)} 
                required 
                style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>Área CNPq:</label>
              <input 
                type="text" 
                value={areaCnpq} 
                onChange={(e) => setAreaCnpq(e.target.value)} 
                required 
                placeholder="Ex: 1.03.00.00-7"
                style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px' }}>Ator Vinculado (Indústria/Governo):</label>
            <select 
              value={atorId} 
              onChange={(e) => setAtorId(e.target.value)}
              required
              style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
            >
              <option value="" disabled>Selecione um ator...</option>
              {atores.map(ator => (
                <option key={ator.id} value={ator.id}>
                  {ator.nome} ({ator.tipo_helice}) {ator.is_deleted ? ' - (ARQUIVADO)' : ''}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px' }}>Descrição Detalhada:</label>
            <textarea 
              value={descricao} 
              onChange={(e) => setDescricao(e.target.value)} 
              required 
              rows="5"
              style={{ width: '100%', padding: '8px', boxSizing: 'border-box', resize: 'vertical' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button type="submit" style={{ padding: '9px 15px', backgroundColor: '#28a745', color: 'white', border: 'none', cursor: 'pointer' }}>
              {editandoId ? 'Atualizar Demanda' : 'Registar Demanda'}
            </button>
            {editandoId && (
              <button type="button" onClick={limparFormulario} style={{ padding: '9px 15px', backgroundColor: '#6c757d', color: 'white', border: 'none', cursor: 'pointer' }}>
                Cancelar
              </button>
            )}
          </div>
        </form>
      )}

      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
        <thead>
          <tr style={{ backgroundColor: '#f8f9fa', textAlign: 'left' }}>
            <th style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>ID</th>
            <th style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>Título</th>
            <th style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>Área CNPq</th>
            <th style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {demandas.map(demanda => (
            <tr key={demanda.id}>
              <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>{demanda.id}</td>
              <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>{demanda.titulo}</td>
              <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>{demanda.area_cnpq}</td>
              <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>
                {mostrarInativos ? (
                  <button 
                    onClick={() => restaurarDemanda(demanda.id)} 
                    style={{ backgroundColor: '#28a745', color: 'white', padding: '5px 10px', border: 'none', borderRadius: '3px', cursor: 'pointer' }}
                  >
                    Restaurar
                  </button>
                ) : (
                  <>
                    <button onClick={() => prepararEdicao(demanda)} style={{ marginRight: '5px', padding: '5px 10px', cursor: 'pointer' }}>Editar</button>
                    <button onClick={() => inativarDemanda(demanda.id)} style={{ padding: '5px 10px', backgroundColor: '#dc3545', color: 'white', border: 'none', cursor: 'pointer' }}>Inativar</button>
                  </>
                )}
              </td>
            </tr>
          ))}
          {demandas.length === 0 && (
            <tr>
              <td colSpan="4" style={{ padding: '10px', textAlign: 'center' }}>
                {mostrarInativos ? 'Nenhuma demanda arquivada encontrada.' : 'Nenhuma demanda ativa encontrada.'}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TelaDemanda;