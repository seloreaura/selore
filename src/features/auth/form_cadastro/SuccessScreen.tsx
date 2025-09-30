import React from 'react';
import { useNavigate } from 'react-router-dom';
import logoSelore from '../../../../assets/logo-selore.svg';
import saveIcon from '../../../../assets/save.svg';
import './SuccessScreen.css';

export const SuccessScreen: React.FC = () => {
  const navigate = useNavigate();

  React.useEffect(() => {
    document.title = 'Sucesso - Selore';
    
    // Redireciona para o dashboard após 1 segundos
    const timer = setTimeout(() => {
      navigate('/');
    }, 1000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="success-root">
      <div className="success-header-bar">
        <img className="success-logo" aria-label="Logo" src={logoSelore} alt="Logo Selore" />
        <div className="success-profile-wrap" aria-label="Perfil">
          <div className="success-profile" />
        </div>
      </div>
      <div className="success-text">
        Informações salvas!
      </div>
        <div className="success-check-container">
          <img className="success-save-icon" src={saveIcon} alt="Salvo" />
        </div>
    </div>
  );
};
