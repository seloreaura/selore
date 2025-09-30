

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../navbar/Navbar';
import { fetchHistorico, RastreamentoRow } from './supabase.rest';
import './tracker.css';
import { TrackerPopup } from '../pop-up/Popup';
import popupIcon from '../../../../assets/popup-button.svg';
import refreshIcon from '../../../../assets/refresh.svg';
import { useUserSession } from '../../../hooks/useUserSession';


export const Tracker: React.FC = () => {
  const navigate = useNavigate();
  const { user, isLoading } = useUserSession();
  const [rows, setRows] = React.useState<RastreamentoRow[] | null>(null);
  const [err, setErr] = React.useState<string | null>(null);
  const [popupLead, setPopupLead] = React.useState<RastreamentoRow | null>(null);
  const [page, setPage] = React.useState<number>(1);
  const [isRefreshing, setIsRefreshing] = React.useState<boolean>(false);
  const pageSize = 6;

  React.useEffect(() => {
    document.title = 'Dashboard - Selore';
  }, []);

  React.useEffect(() => {
    if (isLoading) return;
    
    if (!user) {
      navigate('/login');
      return;
    }
    
    console.log('🔍 Tracker: Iniciando busca de leads para usuário:', user);
    console.log('🔍 Tracker: User ID:', user.user_id);
    
    let alive = true;
    fetchHistorico(user.user_id)
      .then((data) => {
        console.log('🔍 Tracker: Dados recebidos:', data);
        if (alive) {
          setRows(data);
          setErr(null);
        }
      })
      .catch((e) => {
        console.error('❌ Tracker: Erro ao buscar leads:', e);
        if (alive) {
          setErr(e.message);
        }
      });
    
    return () => { alive = false; };
  }, [user, isLoading, navigate]);

  React.useEffect(() => {
    const total = rows?.length ?? 0;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    if (page > totalPages) setPage(totalPages);
  }, [rows, page]);

  // Função para refresh dos dados
  const handleRefresh = async () => {
    if (!user || isRefreshing) return;
    
    setIsRefreshing(true);
    setErr(null);
    
    try {
      console.log('🔄 Atualizando dados dos leads...');
      const newData = await fetchHistorico(user.user_id);
      console.log('🔄 Dados atualizados:', newData);
      setRows(newData);
    } catch (e: any) {
      console.error('❌ Erro ao atualizar leads:', e);
      setErr(e.message);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Ordena: pendentes (message_sent null/false) primeiro
  const sortedRows = rows ? [...rows].sort((a, b) => {
    const aSent = a.message_sent === true ? 1 : 0;
    const bSent = b.message_sent === true ? 1 : 0;
    return aSent - bSent; // 0 (pendente) vem antes de 1 (enviado)
  }) : null;
  const totalRows = sortedRows?.length ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalRows / pageSize));
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const visibleRows = sortedRows ? sortedRows.slice(startIndex, endIndex) : null;

  return (
    <div className="tkr-root">
      <Navbar />

      <section className="tkr-hero">
        <h1 className="tkr-title">
          {user?.nome ? `${user.nome}, clique no botão para iniciar a prospecção!` : 'Clique no botão para iniciar a prospecção!'}
        </h1>
        <p className="tkr-sub">
          Nosso sistema irá achar os clientes com o perfil mais adequado ao que você está buscando, clique no botão abaixo!
        </p>
        <button
          className="tkr-cta"
          onClick={() => navigate('/form')}
        >
          FAZER BUSCA PERSONALIZADA
        </button>
        
      </section>

      <div className="tkr-sep" />

      <div className="tkr-card">
        <div className="tkr-card-header">
          <div className="tkr-card-title">
            <span className="tkr-card-icon" aria-hidden>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 14c2.761 0 5 2.239 5 5v1H3v-1c0-2.761 2.239-5 5-5h8Z" stroke="#1F2937" strokeWidth="1.5"/>
                <circle cx="12" cy="7" r="4" stroke="#1F2937" strokeWidth="1.5"/>
              </svg>
            </span>
            Leads Encontrados ({rows?.length ?? 0})
          </div>
          <button
            className="tkr-refresh-button"
            onClick={handleRefresh}
            disabled={isRefreshing}
            title="Atualizar lista de leads"
          >
            <img 
              src={refreshIcon} 
              alt="Atualizar" 
              className="tkr-refresh-icon"
              style={{ 
                animation: isRefreshing ? 'spin 1s linear infinite' : 'none'
              }}
            />
            {isRefreshing ? 'Atualizando...' : 'Atualizar'}
          </button>
        </div>

        <div className="tkr-table-wrap" style={{maxHeight: 8 * 56 + 2 + 'px', overflowY: 'auto'}}>
          <table className="tkr-table tkr-table-modern">
            <thead className="tkr-thead-sticky">
              <tr>
                <th className="tkr-th tkr-th-left">Nome</th>
                <th className="tkr-th tkr-th-left">Empresa</th>
                <th className="tkr-th tkr-th-left">Cargo</th>
                <th className="tkr-th">Data Contato</th>
                <th className="tkr-th">Status</th>
                <th className="tkr-th tkr-th-actions"></th>
              </tr>
            </thead>
            <tbody>
            {!visibleRows && !err && (
              <tr><td colSpan={6}>Carregando…</td></tr>
            )}
            {err && (
              <tr><td colSpan={6} style={{color:'#b00020'}}>Erro ao buscar dados: {err}</td></tr>
            )}
            {rows && rows.length === 0 && (
              <tr><td colSpan={6}>
                <div style={{padding: '20px', textAlign: 'center'}}>
                  <p>Nenhum lead prospectado ainda</p>
                  <p style={{fontSize: '14px', color: '#666', marginTop: '8px'}}>
                    Faça uma busca personalizada para encontrar leads que correspondam ao seu perfil
                  </p>
                  <p style={{fontSize: '12px', color: '#999', marginTop: '8px'}}>
                    User ID: {user?.user_id || 'N/A'}
                  </p>
                  <p style={{fontSize: '12px', color: '#999', marginTop: '4px'}}>
                    Verifique o console do navegador para logs de debug
                  </p>
                </div>
              </td></tr>
            )}
            {visibleRows && visibleRows.map(r => {
              let formattedDate = r.created_at;
              if (formattedDate) {
                const d = new Date(formattedDate);
                if (!isNaN(d.getTime())) {
                  formattedDate = d.toLocaleDateString('pt-BR');
                }
              }
              // message_sent: true = Enviado, false/null = Pendente
              const isSent = r.message_sent === true;
              return (
                <tr
                  key={r.full_name + r.created_at}
                  className="tkr-row-modern"
                  onClick={() => setPopupLead(r)}
                >
                  <td className="tkr-td tkr-td-left" title={r.full_name}><strong>{r.full_name}</strong></td>
                  <td className="tkr-td tkr-td-left" title={r.org_name}>{r.org_name}</td>
                  <td className="tkr-td tkr-td-left" title={r.title_current}>{r.title_current}</td>
                  <td className="tkr-td" title={formattedDate}>{formattedDate}</td>
                  <td className="tkr-td" title={isSent ? 'Enviado' : 'Pendente'}>
                    <span className={`tkr-pill ${isSent ? 'tkr-pill--sent' : 'tkr-pill--pending'}`}>
                      {isSent ? 'Enviado' : 'Pendente'}
                    </span>
                  </td>
                  <td className="tkr-td tkr-td-actions" onClick={e => {e.stopPropagation(); setPopupLead(r);}}>
                    <img src={popupIcon} alt="Ações" className="tkr-action-icon" />
                  </td>
                </tr>
              );
            })}
            </tbody>
          </table>
        </div>
        <div className="tkr-pagination tkr-pagination--minimal">
          <button
            className="tkr-page-icon"
            aria-label="Página anterior"
            disabled={page <= 1}
            onClick={() => setPage(p => Math.max(1, p - 1))}
          >
            ‹
          </button>
          <span className="tkr-page-compact">{page} de {totalPages}</span>
          <button
            className="tkr-page-icon"
            aria-label="Próxima página"
            disabled={page >= totalPages}
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
          >
            ›
          </button>
        </div>
      </div>

      {popupLead && (
        <TrackerPopup lead={popupLead} onClose={() => setPopupLead(null)} />
      )}
    </div>
  );
};
