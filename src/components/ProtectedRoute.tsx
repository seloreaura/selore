import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUserSession } from '../hooks/useUserSession';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, isLoading, validateSession } = useUserSession();

  // SEMPRE redireciona para login se não há usuário válido
  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontFamily: 'Suisse Int\'l, system-ui, sans-serif'
      }}>
        Carregando...
      </div>
    );
  }

  // VERIFICAÇÃO ULTRA RIGOROSA: Verificar TODOS os campos essenciais
  if (!user || !user.user_id || !user.email || !user.nome) {
    console.log('❌ ProtectedRoute: Usuário inválido, redirecionando para login');
    return <Navigate to="/login" replace />;
  }

  // VALIDAÇÃO DE SESSÃO: Verificar se a sessão ainda é válida
  if (!validateSession()) {
    console.log('❌ ProtectedRoute: Sessão inválida, redirecionando para login');
    return <Navigate to="/login" replace />;
  }

  // Log de acesso autorizado
  console.log('✅ ProtectedRoute: Acesso autorizado para usuário:', user.email);

  return <>{children}</>;
};
