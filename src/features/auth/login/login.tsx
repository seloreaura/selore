


import React from 'react';
import logoSeloreMaior from '../../../../assets/logo-selore-maior.svg';
import './login.css';
import { useNavigate } from 'react-router-dom';
import { loginUser } from './supabase.login';
import { useUserSession } from '../../../hooks/useUserSession';


export const LoginForm: React.FC = () => {
  const [email, setEmail] = React.useState('');
  const [password, setpassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const navigate = useNavigate();
  const { login, clearSession } = useUserSession();

  React.useEffect(() => {
    document.title = 'Login - Selore';
  }, []);


  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const userData = await loginUser({ email, password });
      login(userData);
      navigate('/');
    } catch (e: any) {
      setError(e.message || 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  }

  const handleForceLogout = () => {
    console.log('🚪 Login: Forçando logout de sessão anterior');
    clearSession();
  };


  return (
    <div className="login-root">
      <div className="login-2col">
        <div className="login-logo-col">
          <img className="login-logo" src={logoSeloreMaior} alt="Logo Selore" />
        </div>
        <div className="login-form-col">
          <div className="login-content">
            <h1 className="login-title">Entrar</h1>
            <form className="login-form" onSubmit={handleSubmit} autoComplete="off">
              <div className="login-row">
                <div className="login-field login-field-full">
                  <label className="login-label">Email</label>
                  <input
                    type="email"
                    className="login-input"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    disabled={loading}
                    // placeholder="Digite seu email"
                    autoComplete="off"
                  />
                </div>
              </div>
              <div className="login-row">
                <div className="login-field login-field-full">
                  <label className="login-label">Senha</label>
                  <input
                    type="password"
                    className="login-input"
                    value={password}
                    onChange={e => setpassword(e.target.value)}
                    disabled={loading}
                    // placeholder="Digite sua senha"
                    autoComplete="new-password"
                  />
                </div>
              </div>
              <button type="submit" className="login-button" disabled={loading || !email || !password}>
                {loading ? 'Entrando...' : 'Entrar'}
              </button>
              <button
                type="button"
                className="login-link"
                onClick={() => navigate('/cadastro')}
              >
                Criar conta
              </button>
              <button
                type="button"
                className="login-link"
                onClick={handleForceLogout}
                style={{ 
                  marginTop: '10px',
                  fontSize: '12px',
                  color: '#666',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  textDecoration: 'underline'
                }}
              >
                Limpar sessão anterior
              </button>
            </form>
            {error && <div className="login-error">{error}</div>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
