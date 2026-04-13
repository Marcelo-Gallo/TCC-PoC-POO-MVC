import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import api from '../services/api';

export default function TelaRedefinirSenha() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const navigate = useNavigate();

    const [novaSenha, setNovaSenha] = useState('');
    const [confirmarSenha, setConfirmarSenha] = useState('');
    const [mensagem, setMensagem] = useState('');
    const [erro, setErro] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErro('');
        setMensagem('');

        if (!token) {
            setErro("Token de segurança ausente. Use o link enviado por e-mail.");
            return;
        }

        if (novaSenha !== confirmarSenha) {
            setErro("As senhas não coincidem.");
            return;
        }

        setLoading(true);
        try {
            await api.post('/auth/redefinir-senha', { token, nova_senha: novaSenha });
            setMensagem("Senha atualizada com sucesso! Redirecionando para o login...");
            setTimeout(() => {
                navigate('/login');
            }, 3000);
        } catch (error) {
            setErro(error.response?.data?.detail || "O link expirou ou é inválido. Solicite novamente.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <div style={{ padding: '30px', border: '1px solid #ccc', borderRadius: '8px', width: '350px' }}>
                <h2>Criar Nova Senha</h2>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <input 
                        type="password" 
                        placeholder="Nova senha" 
                        value={novaSenha}
                        onChange={(e) => setNovaSenha(e.target.value)}
                        required
                        style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
                    />
                    <input 
                        type="password" 
                        placeholder="Confirme a nova senha" 
                        value={confirmarSenha}
                        onChange={(e) => setConfirmarSenha(e.target.value)}
                        required
                        style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
                    />
                    <button type="submit" disabled={loading} style={{ padding: '10px', backgroundColor: '#2ecc71', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                        {loading ? 'Salvando...' : 'Salvar Nova Senha'}
                    </button>
                </form>

                {mensagem && <p style={{ color: 'green', marginTop: '15px', fontSize: '14px' }}>{mensagem}</p>}
                {erro && (
                    <div style={{ marginTop: '15px' }}>
                        <p style={{ color: 'red', fontSize: '14px' }}>{erro}</p>
                        <Link to="/recuperar-senha" style={{ fontSize: '14px', color: '#3498db' }}>Pedir novo link</Link>
                    </div>
                )}
            </div>
        </div>
    );
}