import React, { useState, useEffect } from 'react';
import api from '../services/api';

const GestaoPortfolio = ({ expertiseId, onClose, onAtualizar }) => {
  const [portfolios, setPortfolios] = useState([]);
  const [nomePesquisador, setNomePesquisador] = useState('');
  const [modo, setModo] = useState('lista');
  const [mensagem, setMensagem] = useState('');

  const [idEditando, setIdEditando] = useState(null);
  const [tipo, setTipo] = useState('ARTIGO');
  const [titulo, setTitulo] = useState('');
  const [ano, setAno] = useState('');
  const [resumo, setResumo] = useState('');

  useEffect(() => {
    carregarPortfolios();
  }, [expertiseId]);

  const carregarPortfolios = async () => {
    try {
      const response = await api.get('/expertises');
      const expertiseAtual = response.data.find(e => e.id === expertiseId);
      
      if (expertiseAtual) {
        setPortfolios(expertiseAtual.portfolios);
        setNomePesquisador(expertiseAtual.pesquisador_responsavel);
      } else {
        setPortfolios([]);
        setNomePesquisador('');
      }
    } catch (error) {
      setMensagem('Erro ao recarregar portfólios.');
    }
  };

  const abrirFormularioNovo = () => {
    limparFormulario();
    setModo('novo');
  };

  const abrirFormularioEdicao = (port) => {
    setIdEditando(port.id);
    setTipo(port.tipo);
    setTitulo(port.titulo);
    setAno(port.ano_publicacao);
    setResumo(port.resumo);
    setModo('editar');
  };

  const limparFormulario = () => {
    setIdEditando(null);
    setTipo('ARTIGO');
    setTitulo('');
    setAno('');
    setResumo('');
  };

  const salvarPortfolio = async (e) => {
    e.preventDefault();
    const payload = {
      tipo,
      titulo,
      ano_publicacao: parseInt(ano),
      resumo
    };

    try {
      if (modo === 'novo') {
        payload.expertise_id = expertiseId;
        await api.post(`/expertises/${expertiseId}/portfolios`, payload);
        setMensagem('Portfólio adicionado com sucesso!');
      } else if (modo === 'editar') {
        await api.put(`/expertises/portfolios/${idEditando}`, payload);
        setMensagem('Portfólio atualizado com sucesso!');
      }
      
      setModo('lista');
      carregarPortfolios();
      onAtualizar();
    } catch (error) {
      setMensagem(error.response?.data?.detail || 'Erro ao guardar portfólio.');
    }
  };

  const inativarPortfolio = async (id) => {
    if (window.confirm('Deseja inativar este item? Ele não será mais considerado na IA.')) {
      try {
        await api.put(`/expertises/portfolios/${id}`, { is_deleted: true });
        setMensagem('Item inativado!');
        carregarPortfolios();
        onAtualizar();
      } catch (error) {
        setMensagem('Erro ao inativar.');
      }
    }
  };

  return (
    <div style={{ padding: '15px', border: '1px solid #0056b3', borderRadius: '5px', backgroundColor: '#f8f9fa', height: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #ddd', paddingBottom: '10px', marginBottom: '15px' }}>
        <h3 style={{ margin: 0, color: '#0056b3' }}>
          Portfólios ({nomePesquisador || `Investigador #${expertiseId}`})
        </h3>
        <button onClick={onClose} style={{ padding: '5px 10px', backgroundColor: '#6c757d', color: 'white', border: 'none', cursor: 'pointer' }}>X</button>
      </div>

      {mensagem && <div style={{ padding: '8px', backgroundColor: '#d4edda', color: '#155724', marginBottom: '10px', fontSize: '14px' }}>{mensagem}</div>}

      {modo === 'lista' && (
        <>
          <button onClick={abrirFormularioNovo} style={{ width: '100%', padding: '10px', backgroundColor: '#0056b3', color: 'white', border: 'none', marginBottom: '15px', cursor: 'pointer', fontWeight: 'bold' }}>
            + Adicionar Novo Trabalho
          </button>

          <div style={{ overflowY: 'auto', maxHeight: '400px' }}>
            {portfolios.length > 0 ? (
              portfolios.map(port => (
                <div key={port.id} style={{ backgroundColor: 'white', padding: '15px', marginBottom: '10px', border: '1px solid #ddd', borderRadius: '5px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#666', textTransform: 'uppercase' }}>{port.tipo} • {port.ano_publicacao}</span>
                      <h4 style={{ margin: '5px 0', color: '#333' }}>{port.titulo}</h4>
                    </div>
                    <div style={{ display: 'flex', gap: '5px' }}>
                      <button onClick={() => abrirFormularioEdicao(port)} style={{ padding: '4px 8px', backgroundColor: '#ffc107', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}>Editar</button>
                      <button onClick={() => inativarPortfolio(port.id)} style={{ padding: '4px 8px', backgroundColor: '#dc3545', color: 'white', border: 'none', cursor: 'pointer', fontSize: '12px' }}>Inativar</button>
                    </div>
                  </div>
                  <p style={{ fontSize: '14px', color: '#555', marginTop: '10px', backgroundColor: '#f1f1f1', padding: '10px', borderRadius: '4px', fontStyle: 'italic' }}>
                    "{port.resumo}"
                  </p>
                </div>
              ))
            ) : (
              <p style={{ textAlign: 'center', color: '#666' }}>Nenhum portfólio registado.</p>
            )}
          </div>
        </>
      )}

      {(modo === 'novo' || modo === 'editar') && (
        <form onSubmit={salvarPortfolio} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <h4>{modo === 'novo' ? 'Novo Trabalho' : 'Editar Trabalho'}</h4>
          
          <div style={{ display: 'flex', gap: '10px' }}>
            <select value={tipo} onChange={(e) => setTipo(e.target.value)} style={{ flex: 1, padding: '8px' }}>
              <option value="ARTIGO">Artigo Científico</option>
              <option value="PATENTE">Patente</option>
              <option value="PROJETO">Projeto</option>
              <option value="TESE">Tese/Dissertação</option>
            </select>
            <input type="number" placeholder="Ano" value={ano} onChange={(e) => setAno(e.target.value)} required style={{ flex: 1, padding: '8px' }} />
          </div>
          
          <input type="text" placeholder="Título" value={titulo} onChange={(e) => setTitulo(e.target.value)} required style={{ padding: '8px' }} />
          
          <textarea placeholder="Resumo do trabalho (Insumo para a IA)" value={resumo} onChange={(e) => setResumo(e.target.value)} required rows="5" style={{ padding: '8px', resize: 'vertical' }} />
          
          <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
            <button type="submit" style={{ flex: 1, padding: '10px', backgroundColor: '#28a745', color: 'white', border: 'none', cursor: 'pointer' }}>Guardar</button>
            <button type="button" onClick={() => setModo('lista')} style={{ flex: 1, padding: '10px', backgroundColor: '#6c757d', color: 'white', border: 'none', cursor: 'pointer' }}>Cancelar</button>
          </div>
        </form>
      )}
    </div>
  );
};

export default GestaoPortfolio;