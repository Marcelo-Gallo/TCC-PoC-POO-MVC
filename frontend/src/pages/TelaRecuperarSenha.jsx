import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

export default function TelaRecuperarSenha() {
    const [email, setEmail] = useState('');
    const [mensagem, setMensagem] = useState('');
    const [erro, setErro] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErro('');
        setMensagem('');

        try {
            const response = await api.post('/auth/recuperar-senha', { email });
            setMensagem(response.data.detail || "Se o e-mail existir, as instruções foram enviadas.");
        } catch (error) {
            setErro("Erro ao conectar com o servidor.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <div style={{ padding: '30px', border: '1px solid #ccc', borderRadius: '8px', width: '350px' }}>
                <h2>Recuperar Senha</h2>
                <p style={{ fontSize: '14px', color: '#666' }}>
                    Digite seu e-mail para receber as instruções de redefinição.
                </p>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <input 
                        type="email" 
                        placeholder="Seu e-mail cadastrado" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
                    />
                    <button type="submit" disabled={loading} style={{ padding: '10px', backgroundColor: '#3498db', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                        {loading ? 'Enviando...' : 'Enviar Link de Recuperação'}
                    </button>
                </form>

                {mensagem && <p style={{ color: 'green', marginTop: '15px', fontSize: '14px' }}>{mensagem}</p>}
                {erro && <p style={{ color: 'red', marginTop: '15px', fontSize: '14px' }}>{erro}</p>}

                <div style={{ marginTop: '20px', textAlign: 'center' }}>
                    <Link to="/login" style={{ fontSize: '14px', color: '#3498db' }}>Voltar para o Login</Link>
                </div>
            </div>
        </div>
    );
}