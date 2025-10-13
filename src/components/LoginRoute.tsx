import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUserSession } from '../hooks/useUserSession';

interface LoginRouteProps {
  children: React.ReactNode;
}

export const LoginRoute: React.FC<LoginRouteProps> = ({ children }) => {
  const { user, isLoading, validateSession } = useUserSession();

  // Mostrar carregamento enquanto verifica a sessão
  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontFamily: 'Suisse Int\'l, system-ui, sans-serif'
      }}>
        Verificando sessão...
      </div>
    );
  }

  // Se há um usuário válido e a sessão é válida, redirecionar para dashboard
  if (user && user.user_id && user.email && user.nome && validateSession()) {
    console.log('✅ LoginRoute: Usuário já logado, redirecionando para dashboard');
    return <Navigate to="/" replace />;
  }

  // Se não há sessão válida, permitir acesso ao login
  console.log('❌ LoginRoute: Nenhuma sessão válida, permitindo acesso ao login');
  return <>{children}</>;
};
