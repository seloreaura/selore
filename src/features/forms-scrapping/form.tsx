import React from 'react';
import './form.css';
import logoSelore from '../../../assets/logo-selore.svg';
import setaEnviar from '../../../assets/seta-enviar.svg';
import { sendToSupabaseScrapeTeste } from './supabase.scrape';
import { useNavigate } from 'react-router-dom';
import { useUserSession } from '../../hooks/useUserSession';


const STEPS = [
  {
    title: "Qual o setor/mercado deseja atacar?",
    placeholder: "Exemplo: consultorias; indústria têxtil; escolas..."
  },
  {
    title: "Qual porte da empresa a ser atacada?",
    placeholder: "Exemplo: micro; pequena; média; de 0 a 100 funcionários..."
  },
  {
    title: "Qual a localização ideal?",
    placeholder: "Exemplo: Rio de Janeiro; Sul do Brasil, Minas Gerais"
  },
  {
    title: "Qual objetivo do primeiro contato com o cliente frio?",
    placeholder: "Ex.: marcar uma reunião de 10 minutos, visita técnica..."
  }
] as const;

type Answers = Record<number, string>;

const Form: React.FC = () => {
  const [step, setStep] = React.useState(0);
  const [answers, setAnswers] = React.useState<Answers>({});
  const [value, setValue] = React.useState('');

  React.useEffect(() => {
    document.title = 'Prospecção - Selore';
  }, []);
  const navigate = useNavigate();
  const { user, isLoading } = useUserSession();

  const current = STEPS[step];

  React.useEffect(() => {
    setValue(answers[step] ?? '');
  }, [step, answers]);

  async function submitStep() {
    if (isLoading) return;
    
    if (!user) {
      navigate('/login');
      return;
    }

    const v = value.trim();
    if (!v) return; // Não avança se vazio
    setAnswers(prev => ({ ...prev, [step]: v }));
    if (step < STEPS.length - 1) {
      setStep(s => s + 1);
    } else {
      // Monta o JSON para o n8n
      const submittedAt = new Date().toISOString();
      const payload = {
        industry: answers[0] ?? '',
        company_size: answers[1] ?? '',
        location: answers[2] ?? '',
        aditional: answers[3] ?? v,
      };

      // Envia webhook simples para n8n
      try {
        const webhookData = {
          empresa_nome: user.nome_empresa || '',
          area_atuacao: user.area_atuacao || '',
          servicos_produtos: user.servicos_produtos || '',
          industry: answers[0] ?? '',
          location: answers[2] ?? '',
          company_size: answers[1] ?? '',
          aditional: answers[3] ?? v,
          submittedAt: submittedAt,
          user_id: user.user_id
        };
        
        
        // Formato nativo do n8n: estrutura items/json para manipulação linha a linha
        const n8nPayload = {
          items: [
            {
              json: {
                empresa_nome: webhookData.empresa_nome,
                area_atuacao: webhookData.area_atuacao,
                servicos_produtos: webhookData.servicos_produtos,
                industry: webhookData.industry,
                location: webhookData.location,
                company_size: webhookData.company_size,
                aditional: webhookData.aditional,
                submittedAt: webhookData.submittedAt,
                user_id: webhookData.user_id
              }
            }
          ]
        };
        
        
        // Tentativa 1: FormData com campos separados
        const formData = new FormData();
        formData.append('empresa_nome', webhookData.empresa_nome);
        formData.append('area_atuacao', webhookData.area_atuacao);
        formData.append('servicos_produtos', webhookData.servicos_produtos);
        formData.append('industry', webhookData.industry);
        formData.append('location', webhookData.location);
        formData.append('company_size', webhookData.company_size);
        formData.append('aditional', webhookData.aditional);
        formData.append('submittedAt', webhookData.submittedAt);
        formData.append('user_id', webhookData.user_id);
        formData.append('username', user.nome || 'Usuário');
        formData.append('user_email', user.email || '');
        formData.append('scrape_id', submittedAt); // ID único para rastrear esta requisição
        
        // Tentativa 1: FormData
        fetch('http://localhost:5678/webhook-test/9a08d0b7-35ad-4469-8b2b-08dd7c3f23a5', {
          method: 'POST',
          body: formData,
          mode: 'no-cors'
        }).then(() => {
        }).catch((e) => {
          // Tentativa 2: Query parameters com campos separados
          const queryParams = new URLSearchParams({
            empresa_nome: webhookData.empresa_nome,
            area_atuacao: webhookData.area_atuacao,
            servicos_produtos: webhookData.servicos_produtos,
            industry: webhookData.industry,
            location: webhookData.location,
            company_size: webhookData.company_size,
            aditional: webhookData.aditional,
            submittedAt: webhookData.submittedAt,
            user_id: webhookData.user_id,
            username: user.nome || 'Usuário',
            user_email: user.email || '',
            scrape_id: submittedAt
          });
          
          fetch(`http://localhost:5678/webhook-test/9a08d0b7-35ad-4469-8b2b-08dd7c3f23a5?${queryParams.toString()}`, {
            method: 'POST',
            mode: 'no-cors'
          }).then(() => {
          }).catch((e2) => {
          });
        });
      } catch (e) {
      }
      
      // Redireciona para a tela de loading após salvar no Supabase
      navigate('/loading');
    }
  }

  return (
    <div className="fm-root">
      {/* Header fixo, fora do fluxo do conteúdo central */}
      <div className="fm-header-bar">
        <button
          className="fm-logo-btn"
          aria-label="Ir para rastrear"
          onClick={() => navigate('/')}
          style={{ background: 'none', border: 'none', padding: 0, margin: 0, cursor: 'pointer' }}
        >
          <img className="fm-logo" aria-label="Logo" src={logoSelore} alt="Logo Selore" />
        </button>
        <div className="fm-profile-wrap" aria-label="Perfil">
          <div className="fm-profile" />
        </div>
      </div>

      {/* conteúdo central */}
      <main className="fm-center">
        <div className="fm-step-block">
          <h1 className="fm-title">{current.title}</h1>
          <div className="fm-input-wrap">
            <input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && value.trim()) submitStep(); }}
              className="fm-input"
              placeholder={current.placeholder}
              aria-label="Resposta"
            />
            <button
              className="fm-send"
              type="button"
              aria-label="Próxima etapa"
              onClick={submitStep}
              disabled={!value.trim()}
              style={!value.trim() ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
            >
              {/* seta minimalista como no layout */}
              <img className="fm-send-icon" aria-label="Seta" src={setaEnviar} alt="Seta Enviar" />
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

      {/* progresso (4 bolinhas) */}
      <div className="fm-progress">
        {STEPS.map((_, i) => {
          // Preenchida: resposta da etapa existe, mas só mostra preenchida se já passou dessa etapa
          const isFilled = answers[i]?.trim() && i < step;
          // Ativa: etapa atual
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
export default Form;
