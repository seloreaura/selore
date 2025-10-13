
import React from 'react';
import './form_cadastro.css';
import logoSelore from '../../../../assets/logo-selore.svg';
import setaEnviar from '../../../../assets/seta-enviar.svg';
import { useNavigate, useLocation } from 'react-router-dom';
import { insertUserFullToSupabase } from './supabase.form_cadastro';


const STEPS = [
  {
    title: 'Qual o nome da empresa que você trabalha?',
    placeholder: 'Exemplo: consultorias; panificadoras; escolas...'
  },
  {
    title: 'Qual a área de atuação da empresa?',
    placeholder: 'Exemplo: tecnologia; saúde; educação...'
  },
  {
    title: 'Quais são os principais produtos ou serviços?',
    placeholder: 'Exemplo: consultoria; software; pães artesanais...'
  },
  {
    title: 'Escreva outras informações sobre a empresa que você deseja compartilhar',
    placeholder: 'Exemplo: possuimos o selo de excelência em atendimento; temos o selo RA1000 do Reclame Aqui...'
  }
];

type Answers = Record<number, string>;


export const FormCadastro: React.FC = () => {
  const [step, setStep] = React.useState(0);
  const [answers, setAnswers] = React.useState<Answers>({});
  const [value, setValue] = React.useState('');

  React.useEffect(() => {
    document.title = 'Cadastro Completo - Selore';
  }, []);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string|null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Dados vindos do cadastro inicial
  const cadastroBase = location.state || {};

  const current = STEPS[step];

  React.useEffect(() => {
    setValue(answers[step] ?? '');
  }, [step, answers]);

  async function submitStep() {
    const v = value.trim();
    if (!v || loading) return;
    setAnswers(prev => ({ ...prev, [step]: v }));
    if (step < STEPS.length - 1) {
      setStep(s => s + 1);
    } else {
      // Finaliza e envia para o Supabase
      setLoading(true);
      setError(null);
      try {
        const dataToSend = {
          ...cadastroBase,
          empresa_nome: answers[0] ?? '',
          area_atuacao: answers[1] ?? '',
          servicos_produtos: answers[2] ?? '',
          diferencial: answers[3] ?? '',
          outros: answers[4] ?? v,
        };
        
        
        await insertUserFullToSupabase(dataToSend);
        setLoading(false);
        navigate('/success'); // Redireciona para a tela de sucesso
      } catch (err: any) {
        setLoading(false);
        setError(err.message || 'Erro ao salvar no banco de dados');
      }
    }
  }

  return (
    <div className="fm-root">
      <div className="fm-header-bar">
        <img className="fm-logo" aria-label="Logo" src={logoSelore} alt="Logo Selore" />
        <div className="fm-profile-wrap" aria-label="Perfil">
          <div className="fm-profile" />
        </div>
      </div>
      <main className="fm-center">
        <div className="fm-step-block">
          <h1 className="fm-title">{current.title}</h1>
          <div className="fm-input-wrap">
            <input
              value={value}
              onChange={e => setValue(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && value.trim() && !loading) submitStep(); }}
              className="fm-input"
              placeholder={current.placeholder}
              aria-label="Resposta"
              disabled={loading}
            />
            <button
              className="fm-send"
              type="button"
              aria-label="Próxima etapa"
              onClick={submitStep}
              disabled={!value.trim() || loading}
              style={!value.trim() || loading ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
            >
              {loading ? 'Enviando...' : <img className="fm-send-icon" aria-label="Seta" src={setaEnviar} alt="Seta Enviar" />}
            </button>
          </div>
          {step > 0 && (
            <button
              className="fm-back-step"
              type="button"
              onClick={() => {
                setAnswers(prev => {
                  const newAnswers = { ...prev };
                  delete newAnswers[step];
                  return newAnswers;
                });
                setStep(s => Math.max(0, s - 1));
              }}
            >
              Voltar
            </button>
          )}
        </div>
      </main>
  {error && <div className="cadastro-error">{error}</div>}
      <div className="fm-progress">
        {STEPS.map((_, i) => {
          const isFilled = answers[i]?.trim() && i < step;
          const isCurrent = i === step;
          const classes = [
            'fm-dot',
            isFilled ? 'is-filled' : '',
            isCurrent ? 'is-current' : ''
          ].filter(Boolean).join(' ');
          return (
            <button
              key={i}
              type="button"
              aria-label={`Ir para etapa ${i + 1}`}
              className={classes}
              onClick={() => setStep(i)}
            />
          );
        })}
      </div>
    </div>
  );
};

export default FormCadastro;

