import React, { useState, useEffect } from 'react';
import api from '../services/api';
import GestaoPortfolio from '../components/GestaoPortfolio';

const TelaMatchmaking = () => {
  const [demandas, setDemandas] = useState([]);
  const [demandaSelecionada, setDemandaSelecionada] = useState('');
  const [resultados, setResultados] = useState(null);
  const [carregando, setCarregando] = useState(false);
  const [mensagem, setMensagem] = useState('');
  const [expertiseSelecionada, setExpertiseSelecionada] = useState(null);

  useEffect(() => {
    carregarDemandas();
  }, []);

  const carregarDemandas = async () => {
    try {
      const response = await api.get('/demandas');
      setDemandas(response.data);
    } catch (error) {
      setMensagem('Erro ao carregar as demandas disponíveis.');
    }
  };

  const gerarRanking = async (e) => {
    e.preventDefault();
    if (!demandaSelecionada) {
      setMensagem('Por favor, selecione uma demanda para análise.');
      return;
    }

    setCarregando(true);
    setMensagem('');
    setResultados(null);

    try {
      const response = await api.get(`/demandas/${demandaSelecionada}/matchmaking`);
      setResultados(response.data);
      
      if (response.data.stemming.resultados.length === 0 && response.data.lematizacao.resultados.length === 0) {
        setMensagem('Nenhum investigador compatível encontrado para esta demanda.');
      }
    } catch (error) {
      setMensagem(error.response?.data?.detail || 'Erro ao processar o algoritmo de similaridade.');
    } finally {
      setCarregando(false);
    }
  };

  const renderTabela = (titulo, metricas, corDestaque) => (
    <div style={{ flex: '1 1 48%', minWidth: '400px', backgroundColor: 'white', padding: '15px', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `3px solid ${corDestaque}`, paddingBottom: '10px', marginBottom: '15px' }}>
        <h3 style={{ margin: 0, color: '#333' }}>{titulo}</h3>
        <span style={{ backgroundColor: '#e9ecef', padding: '5px 10px', borderRadius: '15px', fontSize: '14px', fontWeight: 'bold', color: '#495057' }}>
          ⏱️ {metricas.tempo_execucao_segundos}s
        </span>
      </div>
      
      {metricas.resultados.length > 0 ? (
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8f9fa', textAlign: 'left' }}>
              <th style={{ padding: '10px' }}>Ranking</th>
              <th style={{ padding: '10px' }}>Investigador</th>
              <th style={{ padding: '10px', textAlign: 'center' }}>Score</th>
              <th style={{ padding: '10px', textAlign: 'center' }}>Lattes</th>
              <th style={{ padding: '10px', textAlign: 'center' }}>Trabalhos</th>
            </tr>
          </thead>
          <tbody>
            {metricas.resultados.map((resultado, index) => (
              <tr key={index} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '10px', fontWeight: 'bold', color: corDestaque }}>{index + 1}º</td>
                <td style={{ padding: '10px' }}>
                  <strong>{resultado.pesquisador_responsavel}</strong><br/>
                  <span style={{ fontSize: '12px', color: '#666' }}>{resultado.area_conhecimento}</span>
                </td>
                <td style={{ padding: '10px', textAlign: 'center' }}>
                  <span style={{ 
                    padding: '4px 8px', 
                    backgroundColor: resultado.score > 0.5 ? '#d4edda' : '#fff3cd',
                    color: resultado.score > 0.5 ? '#155724' : '#856404',
                    borderRadius: '12px',
                    fontWeight: 'bold'
                  }}>
                    {(resultado.score * 100).toFixed(1)}%
                  </span>
                </td>
                <td style={{ padding: '10px', textAlign: 'center' }}>
                  {resultado.link_lattes ? (
                    <a href={resultado.link_lattes} target="_blank" rel="noopener noreferrer" style={{ color: '#0056b3', textDecoration: 'none' }}>Ver</a>
                  ) : '-'}
                </td>
                <td style={{ padding: '10px', textAlign: 'center' }}>
                  <button 
                    onClick={() => setExpertiseSelecionada(resultado.expertise_id)}
                    style={{ padding: '5px 10px', backgroundColor: '#17a2b8', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '3px', fontSize: '12px', fontWeight: 'bold' }}
                  >
                    Abrir App
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p style={{ textAlign: 'center', color: '#777', padding: '20px 0' }}>Nenhum match encontrado.</p>
      )}
    </div>
  );

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '1200px', margin: '0 auto' }}>
      <h2>Motor de NLP - Corretagem Digital de Inovação</h2>
      <p style={{ color: '#666', marginBottom: '25px' }}>Análise comparativa em tempo real: Stemming (NLTK) vs. Lematização (SpaCy)</p>
      
      {mensagem && <div style={{ padding: '12px', backgroundColor: '#e2e3e5', borderRadius: '5px', marginBottom: '20px', fontWeight: 'bold' }}>{mensagem}</div>}

      <form onSubmit={gerarRanking} style={{ display: 'flex', gap: '15px', marginBottom: '30px', alignItems: 'flex-end', backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '8px' }}>
        <div style={{ flex: 1 }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#333' }}>Selecione o Problema / Demanda (Governo/Indústria):</label>
          <select 
            value={demandaSelecionada} 
            onChange={(e) => setDemandaSelecionada(e.target.value)}
            required
            style={{ width: '100%', padding: '12px', boxSizing: 'border-box', fontSize: '16px', borderRadius: '4px', border: '1px solid #ccc' }}
          >
            <option value="" disabled>Escolha uma demanda na base de dados...</option>
            {demandas.map(demanda => (
              <option key={demanda.id} value={demanda.id}>
                #{demanda.id} - {demanda.titulo} ({demanda.area_cnpq})
              </option>
            ))}
          </select>
        </div>
        <button 
          type="submit" 
          disabled={carregando}
          style={{ 
            padding: '12px 25px', 
            backgroundColor: carregando ? '#6c757d' : '#0056b3', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px',
            cursor: carregando ? 'not-allowed' : 'pointer',
            fontSize: '16px',
            fontWeight: 'bold',
            transition: 'background-color 0.3s'
          }}
        >
          {carregando ? 'Processando Modelos IA...' : 'Executar Matchmaking Comparativo'}
        </button>
      </form>

      {resultados && (
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginTop: '20px' }}>
          {renderTabela('Abordagem 1: Stemming (NLTK)', resultados.stemming, '#17a2b8')}
          {renderTabela('Abordagem 2: Lematização (SpaCy)', resultados.lematizacao, '#28a745')}
        </div>
      )}

      {expertiseSelecionada && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center',
          alignItems: 'center', zIndex: 9999
        }}>
          <div style={{ width: '550px', maxHeight: '90vh', backgroundColor: 'white', borderRadius: '8px', overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: '0 5px 15px rgba(0,0,0,0.3)' }}>
            <div style={{ flex: 1, overflowY: 'auto' }}>
              <GestaoPortfolio 
                expertiseId={expertiseSelecionada} 
                onClose={() => setExpertiseSelecionada(null)}
                onAtualizar={() => {}}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TelaMatchmaking;