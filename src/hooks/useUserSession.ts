import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Constantes para gerenciamento de sessão
const SESSION_KEY = 'user';
const SESSION_TIMEOUT = 24 * 60 * 60 * 1000; // 24 horas em millisegundos
const CURRENT_SESSION_KEY = 'current_session_id';

interface User {
  user_id: string;
  email: string;
  nome: string;
  sobrenome: string;
  nome_empresa?: string;
  area_atuacao?: string;
  servicos_produtos?: string;
  diferencial?: string;
  observacoes?: string;
  sessionTimestamp?: number; // Timestamp da sessão
}

// Funções utilitárias para gerenciamento de sessão
const generateSessionId = (): string => {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

const isSessionValid = (user: User): boolean => {
  if (!user.sessionTimestamp) return false;
  const now = Date.now();
  return (now - user.sessionTimestamp) < SESSION_TIMEOUT;
};

const clearAllSessions = (): void => {
  localStorage.removeItem(SESSION_KEY);
  localStorage.removeItem(CURRENT_SESSION_KEY);
  sessionStorage.clear();
};

const getCurrentSessionId = (): string | null => {
  return localStorage.getItem(CURRENT_SESSION_KEY);
};

const setCurrentSessionId = (sessionId: string): void => {
  localStorage.setItem(CURRENT_SESSION_KEY, sessionId);
};

export const useUserSession = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeSession = () => {
      try {
        console.log('🔍 Inicializando sessão...');
        
        // Verificar se há uma sessão atual válida
        const currentSessionId = getCurrentSessionId();
        const savedUser = localStorage.getItem(SESSION_KEY);
        
        if (savedUser && currentSessionId) {
          try {
            const parsedUser = JSON.parse(savedUser);
            
            // VALIDAÇÃO RIGOROSA: Verificar se todos os campos essenciais existem
            if (!parsedUser.user_id || !parsedUser.email || !parsedUser.nome) {
              console.log('❌ Dados de usuário inválidos, limpando sessão');
              clearAllSessions();
              navigate('/login', { replace: true });
              setIsLoading(false);
              return;
            }
            
            // Verificar se a sessão ainda é válida (não expirou)
            if (!isSessionValid(parsedUser)) {
              console.log('❌ Sessão expirada, limpando');
              clearAllSessions();
              navigate('/login', { replace: true });
              setIsLoading(false);
              return;
            }
            
            console.log('✅ Sessão válida encontrada para usuário:', parsedUser.email);
            setUser(parsedUser);
            setIsLoading(false);
            return;
          } catch (error) {
            console.log('❌ Erro ao parsear dados do usuário:', error);
            clearAllSessions();
          }
        }

        // Se não há sessão válida, limpar tudo e redirecionar para login
        console.log('❌ Nenhuma sessão válida encontrada');
        clearAllSessions();
        navigate('/login', { replace: true });
        setIsLoading(false);
      } catch (error) {
        console.log('❌ Erro na inicialização da sessão:', error);
        clearAllSessions();
        navigate('/login', { replace: true });
        setIsLoading(false);
      }
    };

    initializeSession();
  }, [navigate]);

  const login = (userData: User) => {
    console.log('🔐 Fazendo login para usuário:', userData.email);
    
    // Validar dados antes de salvar
    if (!userData.user_id || !userData.email || !userData.nome) {
      console.log('❌ Dados de usuário inválidos para login');
      return;
    }
    
    // Limpar qualquer sessão anterior
    clearAllSessions();
    
    // Criar nova sessão com timestamp
    const sessionId = generateSessionId();
    const userWithSession = {
      ...userData,
      sessionTimestamp: Date.now()
    };
    
    console.log('✅ Criando nova sessão:', sessionId);
    
    // Salvar nova sessão
    setUser(userWithSession);
    localStorage.setItem(SESSION_KEY, JSON.stringify(userWithSession));
    setCurrentSessionId(sessionId);
    
    // Redirecionar para dashboard
    navigate('/', { replace: true });
  };

  const logout = () => {
    console.log('🚪 Fazendo logout do usuário');
    setUser(null);
    clearAllSessions();
    navigate('/login', { replace: true });
  };

  const clearSession = () => {
    console.log('🧹 Limpando todas as sessões');
    setUser(null);
    clearAllSessions();
    navigate('/login', { replace: true });
  };

  // Listener para mudanças no localStorage (detectar logout em outras abas)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === SESSION_KEY && e.newValue === null) {
        console.log('🔍 Sessão removida em outra aba, fazendo logout');
        setUser(null);
        navigate('/login', { replace: true });
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [navigate]);

  // Função de emergência para limpar tudo
  useEffect(() => {
    // Expor função global para limpeza de emergência
    (window as any).clearAllSession = () => {
      console.log('🚨 Limpeza de emergência executada');
      setUser(null);
      clearAllSessions();
      navigate('/login', { replace: true });
      window.location.reload();
    };
    
  }, [navigate]);

  // Função para validar sessão em tempo real
  const validateSession = (): boolean => {
    if (!user) return false;
    
    const currentSessionId = getCurrentSessionId();
    if (!currentSessionId) {
      console.log('❌ Nenhuma sessão ativa encontrada');
      clearAllSessions();
      setUser(null);
      return false;
    }
    
    if (!isSessionValid(user)) {
      console.log('❌ Sessão expirada durante validação');
      clearAllSessions();
      setUser(null);
      return false;
    }
    
    return true;
  };

  return {
    user,
    isLoading,
    login,
    logout,
    clearSession,
    validateSession,
    userId: user?.user_id
  };
};

