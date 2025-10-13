import React from 'react';
import './cadastro.css';
import logoSeloreMaior from '../../../../assets/logo-selore-maior.svg';
import { useNavigate, Link } from 'react-router-dom';

export const Cadastro: React.FC<{ onSubmit?: (data: any) => void, loading?: boolean, error?: string | null }> = ({ onSubmit, loading, error }) => {
  const [name, setName] = React.useState('');
  const [sobrenome, setSobrenome] = React.useState('');
  const [email, setEmail] = React.useState('');

  React.useEffect(() => {
    document.title = 'Cadastro - Selore';
  }, []);
  const [password, setPassword] = React.useState('');
  const [confirmarSenha, setConfirmarSenha] = React.useState('');
  const [touched, setTouched] = React.useState(false);
  const navigate = useNavigate();

  const senhaMatch = password === confirmarSenha;
  const disabled = !name || !sobrenome || !email || !password || !confirmarSenha || !senhaMatch || loading;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setTouched(true);
    if (disabled) return;
    // Redireciona para o form_cadastro, levando os dados preenchidos (opcional: via state)
    navigate('/form-cadastro', {
      state: { name, sobrenome, email, password }
    });
    // Não salva nada no supabase aqui!
  }

  return (
    <div className="cadastro-root">
      <div className="cadastro-2col">
        <div className="cadastro-logo-col">
          <img className="cadastro-logo" src={logoSeloreMaior} alt="Logo Selore" />
        </div>
        <div className="cadastro-form-col">
          <div className="cadastro-content">
            <h1 className="cadastro-title">Crie sua conta</h1>
            <form className="cadastro-form" onSubmit={handleSubmit} autoComplete="off">
              <div className="cadastro-row">
                <div className="cadastro-field">
                  <label className="cadastro-label">Nome</label>
                  <input
                    type="text"
                    className="cadastro-input"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    disabled={loading}
                    // placeholder="Digite seu nome"
                    autoComplete="off"
                  />
                </div>
                <div className="cadastro-field">
                  <label className="cadastro-label">Sobrenome</label>
                  <input
                    type="text"
                    className="cadastro-input"
                    value={sobrenome}
                    onChange={e => setSobrenome(e.target.value)}
                    disabled={loading}
                    // placeholder="Digite seu sobrenome"
                    autoComplete="off"
                  />
                </div>
              </div>
              <div className="cadastro-row">
                <div className="cadastro-field cadastro-field-full">
                  <label className="cadastro-label">Email</label>
                  <input
                    type="email"
                    className="cadastro-input"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    disabled={loading}
                    // placeholder="Digite seu email"
                    autoComplete="off"
                  />
                </div>
              </div>
              <div className="cadastro-row">
                <div className="cadastro-field">
                  <label className="cadastro-label">Senha</label>
                  <input
                    type="password"
                    className="cadastro-input"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    disabled={loading}
                    // placeholder="Digite sua senha"
                    autoComplete="new-password"
                  />
                </div>
                <div className="cadastro-field">
                  <label className="cadastro-label">Confirmar Senha</label>
                  <input
                    type="password"
                    className="cadastro-input"
                    value={confirmarSenha}
                    onChange={e => setConfirmarSenha(e.target.value)}
                    disabled={loading}
                    // placeholder="Confirme sua senha"
                    autoComplete="new-password"
                  />
                </div>
              </div>
              <button type="submit" className="cadastro-button" disabled={disabled}>
                {loading ? 'Carregando...' : 'Cadastrar'}
              </button>
            </form>
            {error && <div className="cadastro-error">{error}</div>}
            <Link to="/login" className="cadastro-link">Já tenho uma conta</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cadastro;

