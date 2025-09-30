import React from 'react';
import { useNavigate } from 'react-router-dom';
import logoSelore from '../../../assets/logo-selore.svg';
import './LoadingScreen.css';
import { useUserSession } from '../../hooks/useUserSession';

export const LoadingScreen: React.FC = () => {
  const navigate = useNavigate();
  const { user, isLoading } = useUserSession();

  React.useEffect(() => {
    document.title = 'Processando - Selore';
    
    if (isLoading) return;
    
    if (!user) {
      navigate('/login');
      return;
    }
    
    // Redireciona para o dashboard após 3 segundos
    const timer = setTimeout(() => {
      navigate('/');
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate, user, isLoading]);

  return (
    <div className="loading-root">
      <div className="loading-header-bar">
        <img className="loading-logo" aria-label="Logo" src={logoSelore} alt="Logo Selore" />
        <div className="loading-profile-wrap" aria-label="Perfil">
          <div className="loading-profile" />
        </div>
      </div>
      <div className="loading-text">
        Procurando os leads que mais<br/>se encaixam com você
      </div>
      <div className="loading-spinner-container">
        <img className="loading-spinner" src={logoSelore} alt="Logo Selore" />
      </div>
    </div>
  );
};
