
// Busca o nome do usuário na tabela users
export async function fetchUserName(): Promise<string | null> {
  const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
  const SERVICE_ROLE_KEY = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY;
  const url = `${SUPABASE_URL}/rest/v1/users?select=nome&limit=1`;
  const res = await fetch(url, {
    headers: {
      apikey: SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
      Accept: 'application/json',
    },
  });
  if (!res.ok) return null;
  const data = await res.json();
  if (Array.isArray(data) && data.length > 0 && data[0].nome) {
    return data[0].nome;
  }
  return null;
}

export type RastreamentoRow = {
  full_name: string,
  email: string,
  created_at: string,
  org_name: string,
  linkedin_url: string,
  title_current: string,
  situation: string,
  message_text: string,
  status: string,
  message_sent?: boolean | null;
};


const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SERVICE_ROLE_KEY = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

// Função utilitária para limpar user_id de aspas extras
function cleanUserId(userId: string): string {
  return userId.replace(/^"(.*)"$/, '$1');
}


export async function fetchHistorico(userId: string, limit?: number): Promise<RastreamentoRow[]> {
  console.log('🔍 Buscando leads para o usuário:', userId);
  
  // Limpar aspas extras do user_id se existirem
  const cleanedUserId = cleanUserId(userId);
  console.log('🔍 User ID original:', userId);
  console.log('🔍 User ID limpo:', cleanedUserId);
  
  // Construir a URL de busca - usar filtro correto para user_id
  let url = `${SUPABASE_URL}/rest/v1/leads?select=*&user_id=eq.${cleanedUserId}`;
  
  if (limit) {
    url += `&limit=${limit}`;
  }
  
  // Ordenar por created_at descendente para mostrar os mais recentes primeiro
  url += `&order=created_at.desc`;
  
  console.log('🔍 URL completa:', url);
  
  const res = await fetch(url, {
    headers: {
      apikey: SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
      Accept: 'application/json',
    },
  });
  
  console.log('🔍 Status da resposta:', res.status);
  
  if (!res.ok) {
    const errorText = await res.text();
    console.log('❌ Erro ao buscar leads:', res.status, errorText);
    return [];
  }
  
  const leads = await res.json();
  console.log('🔍 Leads encontrados para o usuário:', leads.length);
  console.log('🔍 Dados dos leads:', leads);
  
  return leads;
}

