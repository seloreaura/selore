const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SERVICE_ROLE_KEY = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY;


export async function loginUser({ email, password }: { email: string, password: string }) {
  if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
    throw new Error('Configuração do Supabase não encontrada');
  }
  
  try {
    // Buscar todos os usuários (já que a query específica não funciona)
    const url = `${SUPABASE_URL}/rest/v1/users?select=*&limit=100`;
    
    const response = await fetch(url, {
      headers: {
        apikey: SERVICE_ROLE_KEY,
        Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
        Accept: 'application/json',
      },
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Erro ao buscar usuários: ${response.status} - ${errorText}`);
    }
    
    const allUsers = await response.json();
    
    // Procurar o usuário pelo email
    const user = allUsers.find((u: any) => u.email === email);
  
    
    if (!user) {
      throw new Error('Email não encontrado');
    }
    
    // Verificar senha
    if (user.password === password) {
      
      // Mapear campos para o formato esperado
      const mappedUser = {
        user_id: user.user_id,
        email: user.email,
        nome: user.nome || user.name || 'Usuário', // Usar 'name' se 'nome' não existir
        sobrenome: user.sobrenome || user.lastName || '',
        nome_empresa: user.nome_empresa || user.empresa_nome || '',
        area_atuacao: user.area_atuacao || '',
        servicos_produtos: user.servicos_produtos || '',
        diferencial: user.diferencial || '',
        observacoes: user.observacoes || ''
      };

      return mappedUser;
    } else {
      throw new Error('Senha incorreta');
    }
    
  } catch (error) {
    throw error;
  }
}
