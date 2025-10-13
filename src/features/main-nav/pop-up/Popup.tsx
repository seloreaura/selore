import React from 'react';
import './popup.css';

export type Lead = {
  full_name: string;
  email: string;
  org_name: string;
  created_at: string;
  linkedin_url: string;
  title_current: string;
  situation: string;
  message_text: string;
  status: string; // 'ativo' | 'inativo' etc.
  message_sent?: boolean | null;
};

interface PopupProps {
  lead: Lead;
  onClose: () => void;
}

export const TrackerPopup: React.FC<PopupProps> = ({ lead, onClose }) => {
  if (!lead) return null;

  const formattedDate = (() => {
    const d = new Date(lead.created_at);
    if (isNaN(d.getTime())) return lead.created_at ?? '';
    return d.toLocaleDateString('pt-BR');
  })();

  const isSent = lead.message_sent === true;
  const statusLabel = isSent ? 'Mensagem Enviada' : 'Mensagem Pendente';
  const statusClass = isSent ? 'tkr-badge-sent' : 'tkr-badge-pending';

  // Permite clicar fora para fechar
  const handleOverlayClick: React.MouseEventHandler<HTMLDivElement> = (e) => {
    e.stopPropagation();
    onClose();
  };

  const stop: React.MouseEventHandler<HTMLDivElement> = (e) => e.stopPropagation();

  const normalizedLinkedin = lead.linkedin_url?.startsWith('http')
    ? lead.linkedin_url
    : lead.linkedin_url
    ? `https://${lead.linkedin_url}`
    : '';

  return (
    <div className="popup-modal-overlay" onClick={handleOverlayClick}>
      <div className="popup-modal" onClick={stop} role="dialog" aria-modal="true" aria-label="Detalhes do Cliente">
        {/* Header com título e badge */}
        <div className="popup-header">
          <div className="popup-header-left">
            <span className="popup-icon popup-icon-user" aria-hidden>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 12c2.761 0 5-2.239 5-5s-2.239-5-5-5-5 2.239-5 5 2.239 5 5 5Z" stroke="#111827" strokeWidth="1.5"/>
                <path d="M3 22c0-3.866 3.582-7 9-7s9 3.134 9 7" stroke="#111827" strokeWidth="1.5"/>
              </svg>
            </span>
            <div className="popup-header-text">Detalhes do Lead</div>
          </div>
          <button className="popup-modal-close" onClick={onClose} aria-label="Fechar">×</button>
        </div>

        {/* Nome e status */}
        <div className="popup-identification">
          <div>
            <div className="popup-modal-name">{lead.full_name}</div>
            <div className="popup-modal-role">{lead.title_current}</div>
          </div>
          <span className={`popup-badge ${statusClass.replace('tkr-badge', 'popup-badge')}`}>{statusLabel}</span>
        </div>

  <div className="popup-divider" />

        {/* Card com informações */}
        <div className="popup-card">
          <div className="popup-row">
            <span className="popup-icon" aria-hidden>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 4h16v16H4z" stroke="#667085" strokeWidth="1.5"/>
                <path d="m4 7 8 6 8-6" stroke="#667085" strokeWidth="1.5"/>
              </svg>
            </span>
            <div>
              <div className="popup-info-label">Email</div>
              <div className="popup-info-text">{lead.email}</div>
            </div>
          </div>
          <div className="popup-row">
            <span className="popup-icon" aria-hidden>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 21h18V7H3v14Z" stroke="#667085" strokeWidth="1.5"/>
                <path d="M7 7V3h10v4" stroke="#667085" strokeWidth="1.5"/>
              </svg>
            </span>
            <div>
              <div className="popup-info-label">Empresa</div>
              <div className="popup-info-text">{lead.org_name}</div>
            </div>
          </div>
          <div className="popup-row">
            <span className="popup-icon" aria-hidden>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="4" width="18" height="18" rx="2" stroke="#667085" strokeWidth="1.5"/>
                <path d="M8 2v4M16 2v4M3 10h18" stroke="#667085" strokeWidth="1.5"/>
              </svg>
            </span>
            <div>
              <div className="popup-info-label">Data do Primeiro Contato</div>
              <div className="popup-info-text">{formattedDate}</div>
            </div>
          </div>
          {normalizedLinkedin && (
            <div className="popup-row">
              <span className="popup-icon" aria-hidden>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15 3h6v6" stroke="#667085" strokeWidth="1.5"/>
                  <path d="M10 14 21 3" stroke="#667085" strokeWidth="1.5"/>
                  <path d="M21 14v7H3V3h7" stroke="#667085" strokeWidth="1.5"/>
                </svg>
              </span>
              <div>
                <div className="popup-info-label">LinkedIn</div>
                <a className="popup-link" href={normalizedLinkedin} target="_blank" rel="noreferrer noopener">
                  {lead.linkedin_url}
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Card de mensagem */}
        <div className="popup-card">
          <div className="popup-row popup-row-top">
            <span className="popup-icon" aria-hidden>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 12c0 3.866-3.582 7-8 7H8l-5 4 1.5-5.5A7.8 7.8 0 0 1 3 12c0-3.866 3.582-7 8-7h2c4.418 0 8 3.134 8 7Z" stroke="#667085" strokeWidth="1.5"/>
              </svg>
            </span>
            <div>
               <div className="popup-message-title">{isSent ? 'Mensagem Enviada' : 'Mensagem Pendente'}</div>
              <div className="popup-message-text">
                {lead.message_text
                  ? lead.message_text.split(/<br\s*\/?>/i).map((line, idx, arr) =>
                      idx < arr.length - 1 ? <React.Fragment key={idx}>{line}<br /></React.Fragment> : line
                    )
                  : ''}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackerPopup;

