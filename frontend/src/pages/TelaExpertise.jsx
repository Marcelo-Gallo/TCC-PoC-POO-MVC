import React, { useState, useEffect } from 'react';
import api from '../services/api';
import GestaoPortfolio from '../components/GestaoPortfolio';

const TelaExpertise = () => {
  const [atores, setAtores] = useState([]);
  const [expertises, setExpertises] = useState([]);
  
  const [areaConhecimento, setAreaConhecimento] = useState('');
  const [areaCnpq, setAreaCnpq] = useState('');
  const [pesquisadorResponsavel, setPesquisadorResponsavel] = useState('');
  const [linkLattes, setLinkLattes] = useState('');
  const [atorId, setAtorId] = useState('');
  const [mensagem, setMensagem] = useState('');

  const [editandoId, setEditandoId] = useState(null);
  const [expertiseSelecionada, setExpertiseSelecionada] = useState(null);
  const [mostrarInativos, setMostrarInativos] = useState(false);

  useEffect(() => {
    carregarAtoresUniversidade();
    carregarExpertises();
  }, [mostrarInativos]);

  const carregarAtoresUniversidade = async () => {
    try {
      const resAtivos = await api.get('/atores');
      const resInativos = await api.get('/atores?mostrar_inativos=true');
      
      const todosAtores = [...resAtivos.data, ...resInativos.data];
      setAtores(todosAtores.filter(a => a.tipo_helice === 'UNIVERSIDADE'));
    } catch (error) {
      setMensagem('Erro ao carregar atores.');
    }
  };

  const carregarExpertises = async () => {
    try {
      const response = await api.get(`/expertises?mostrar_inativos=${mostrarInativos}`);
      setExpertises(response.data);
    } catch (error) {
      setMensagem('Erro ao carregar expertises.');
    }
  };

  const limparFormulario = () => {
    setEditandoId(null);
    setPesquisadorResponsavel('');
    setAreaConhecimento('');
    setAreaCnpq('');
    setLinkLattes('');
    setAtorId('');
  };

  const prepararEdicao = (exp) => {
    setEditandoId(exp.id);
    setPesquisadorResponsavel(exp.pesquisador_responsavel);
    setAreaConhecimento(exp.area_conhecimento);
    setAreaCnpq(exp.area_cnpq);
    setLinkLattes(exp.link_lattes || '');
    setAtorId(exp.ator_id);
    setMensagem('');
    setExpertiseSelecionada(null);
  };

  const salvarExpertise = async (e) => {
    e.preventDefault();
    const payload = {
      area_conhecimento: areaConhecimento,
      area_cnpq: areaCnpq,
      pesquisador_responsavel: pesquisadorResponsavel,
      link_lattes: linkLattes,
      ator_id: parseInt(atorId)
    };

    try {
      if (editandoId) {
        await api.put(`/expertises/${editandoId}`, payload);
        setMensagem('Investigador atualizado com sucesso!');
      } else {
        await api.post('/expertises', payload);
        setMensagem('Investigador registado com sucesso!');
      }
      limparFormulario();
      carregarExpertises();
    } catch (error) {
      setMensagem(error.response?.data?.detail || 'Erro ao guardar a expertise.');
    }
  };

  const inativarExpertise = async (id) => {
    if (window.confirm('Deseja realmente inativar este investigador? Todos os trabalhos do portfólio serão ocultados (Exclusão em Cascata).')) {
      try {
        await api.put(`/expertises/${id}`, { is_deleted: true });
        setMensagem('Investigador inativado com sucesso!');
        if (expertiseSelecionada === id) setExpertiseSelecionada(null);
        carregarExpertises();
      } catch (error) {
        setMensagem('Erro ao inativar investigador.');
      }
    }
  };

  const restaurarExpertise = async (id) => {
    if (window.confirm('Deseja restaurar este investigador?')) {
      try {
        await api.put(`/expertises/${id}`, { is_deleted: false });
        setMensagem('Investigador restaurado com sucesso!');
        carregarExpertises();
      } catch (error) {
        setMensagem('Erro ao restaurar investigador.');
      }
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '1100px', margin: '0 auto' }}>
      <h2>Catálogo de Investigadores (Expertises)</h2>
      
      {mensagem && <div style={{ padding: '10px', backgroundColor: '#e2e3e5', marginBottom: '15px' }}>{mensagem}</div>}

      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={() => {
            setMostrarInativos(!mostrarInativos);
            setExpertiseSelecionada(null);
            limparFormulario();
          }}
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
          {mostrarInativos ? '← Voltar para Investigadores Ativos' : 'Ver Lixeira (Investigadores Arquivados)'}
        </button>
      </div>

      <div style={{ display: 'flex', gap: '30px', alignItems: 'flex-start' }}>
        <div style={{ flex: expertiseSelecionada ? '0 0 55%' : '1', transition: 'all 0.3s' }}>
          
          {!mostrarInativos && (
            <form onSubmit={salvarExpertise} style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap', backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '5px' }}>
              <input type="text" placeholder="Nome do Investigador" value={pesquisadorResponsavel} onChange={(e) => setPesquisadorResponsavel(e.target.value)} required style={{ flex: '1 1 45%', padding: '8px' }} />
              <select value={atorId} onChange={(e) => setAtorId(e.target.value)} required style={{ flex: '1 1 45%', padding: '8px' }}>
                <option value="" disabled>Selecione a Universidade...</option>
                {atores.map(a => (
                  <option key={a.id} value={a.id}>
                    {a.nome} {a.is_deleted ? ' - (ARQUIVADO)' : ''}
                  </option>
                ))}
              </select>
              <input type="text" placeholder="Área de Conhecimento" value={areaConhecimento} onChange={(e) => setAreaConhecimento(e.target.value)} required style={{ flex: '1 1 45%', padding: '8px' }} />
              <input type="text" placeholder="Área CNPq" value={areaCnpq} onChange={(e) => setAreaCnpq(e.target.value)} required style={{ flex: '1 1 45%', padding: '8px' }} />
              <input type="url" placeholder="Link do Currículo Lattes (Opcional)" value={linkLattes} onChange={(e) => setLinkLattes(e.target.value)} style={{ flex: '1 1 100%', padding: '8px' }} />
              
              <div style={{ flex: '1 1 100%', display: 'flex', gap: '10px' }}>
                <button type="submit" style={{ flex: 1, padding: '10px', backgroundColor: '#28a745', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>
                  {editandoId ? 'Atualizar Investigador' : 'Registar Investigador'}
                </button>
                {editandoId && (
                  <button type="button" onClick={limparFormulario} style={{ flex: 1, padding: '10px', backgroundColor: '#6c757d', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>
                    Cancelar
                  </button>
                )}
              </div>
            </form>
          )}

          <table style={{ width: '100%', borderCollapse: 'collapse', boxShadow: '0 0 5px rgba(0,0,0,0.1)' }}>
            <thead style={{ backgroundColor: '#0056b3', color: 'white' }}>
              <tr>
                <th style={{ padding: '10px', textAlign: 'left' }}>Investigador</th>
                <th style={{ padding: '10px', textAlign: 'left' }}>Área</th>
                <th style={{ padding: '10px', textAlign: 'center' }}>Trabalhos</th>
                <th style={{ padding: '10px', textAlign: 'center' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {expertises.map(exp => (
                <tr key={exp.id} style={{ borderBottom: '1px solid #ddd', backgroundColor: expertiseSelecionada === exp.id ? '#e9ecef' : 'white' }}>
                  <td style={{ padding: '10px' }}>{exp.pesquisador_responsavel}</td>
                  <td style={{ padding: '10px' }}>{exp.area_conhecimento}</td>
                  <td style={{ padding: '10px', textAlign: 'center' }}>{exp.portfolios?.length || 0}</td>
                  <td style={{ padding: '10px', textAlign: 'center', display: 'flex', justifyContent: 'center', gap: '5px' }}>
                    {mostrarInativos ? (
                      <button 
                        onClick={() => restaurarExpertise(exp.id)} 
                        style={{ padding: '5px 10px', backgroundColor: '#28a745', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '3px' }}
                      >
                        Restaurar
                      </button>
                    ) : (
                      <>
                        <button onClick={() => prepararEdicao(exp)} style={{ padding: '5px 10px', backgroundColor: '#ffc107', color: 'black', border: 'none', cursor: 'pointer', borderRadius: '3px' }}>
                          Editar
                        </button>
                        <button onClick={() => setExpertiseSelecionada(exp.id)} style={{ padding: '5px 10px', backgroundColor: '#17a2b8', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '3px' }}>
                          Abrir Portfólio
                        </button>
                        <button onClick={() => inativarExpertise(exp.id)} style={{ padding: '5px 10px', backgroundColor: '#dc3545', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '3px' }}>
                          Inativar
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
              {expertises.length === 0 && (
                <tr>
                  <td colSpan="4" style={{ padding: '10px', textAlign: 'center' }}>
                    {mostrarInativos ? 'Nenhum investigador arquivado encontrado.' : 'Nenhum investigador ativo encontrado.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {expertiseSelecionada && !mostrarInativos && (
          <div style={{ flex: '0 0 40%' }}>
            <GestaoPortfolio 
              expertiseId={expertiseSelecionada} 
              onClose={() => setExpertiseSelecionada(null)}
              onAtualizar={carregarExpertises}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default TelaExpertise;