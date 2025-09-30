import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import logoSelore from '../../../../assets/logo-selore.svg';
import './navbar.css';
import { useUserSession } from '../../../hooks/useUserSession';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const path = location.pathname;
  const { user, logout } = useUserSession();
  return (
    <header className="tkr-header">
      <img className="tkr-logo" aria-label="Logo" src={logoSelore} alt="Logo Selore" />
      <nav className="tkr-nav" aria-label="Navegação principal">
        <Link to="/" className={`tkr-tab ${path === '/' ? 'active' : ''}`}>Rastrear</Link>
        <Link to="/metricas" className={`tkr-tab ${path === '/metricas' ? 'active' : ''}`}>Métricas</Link>
      </nav>
      <div className="tkr-profile-wrap" aria-label="Perfil">
        <div className="tkr-profile" onClick={user ? logout : undefined} style={{ cursor: user ? 'pointer' : 'default' }} title={user ? 'Sair' : ''} />
      </div>
    </header>
  );
};