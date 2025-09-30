const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SERVICE_ROLE_KEY = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

// Função utilitária para limpar user_id de aspas extras
function cleanUserId(userId: string): string {
  return userId.replace(/^"(.*)"$/, '$1');
}

export async function sendToSupabaseScrapeTeste(data: {
  industry: string,
  company_size: string,
  location: string,
  aditional: string
}, userId: string) {
  const url = `${SUPABASE_URL}/rest/v1/scrape`;
  const dataWithUser = {
    ...data,
    user_id: userId
  };
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      apikey: SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(dataWithUser),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Erro Supabase: ${res.status} ${text}`);
  }
  // Se não houver body, retorna null
  const text = await res.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

// Função para salvar leads diretamente no Supabase com user_id
export async function saveLeadToSupabase(leadData: any, userId: string) {
  console.log('🔍 Salvando lead no Supabase:', leadData);
  console.log('🔍 User ID original:', userId);
  
  // Limpar aspas extras do user_id se existirem
  const cleanedUserId = cleanUserId(userId);
  console.log('🔍 User ID limpo:', cleanedUserId);
  
  const url = `${SUPABASE_URL}/rest/v1/leads`;
  const dataWithUser = {
    ...leadData,
    user_id: cleanedUserId,
    message_sent: false, // Sempre inicia como não enviado
    created_at: new Date().toISOString() // Garante timestamp atual
  };
  
  console.log('🔍 Dados completos a serem enviados:', dataWithUser);
  console.log('🔍 URL:', url);
  
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      apikey: SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Prefer': 'return=representation' // Para retornar os dados inseridos
    },
    body: JSON.stringify(dataWithUser),
  });
  
  console.log('🔍 Status da resposta:', res.status);
  
  if (!res.ok) {
    const text = await res.text();
    console.log('❌ Erro ao salvar lead:', res.status, text);
    throw new Error(`Erro Supabase: ${res.status} ${text}`);
  }
  
  const text = await res.text();
  console.log('✅ Lead salvo com sucesso:', text);
  
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

// Função para salvar múltiplos leads de uma vez
export async function saveMultipleLeadsToSupabase(leadsData: any[], userId: string) {
  console.log('🔍 Salvando múltiplos leads no Supabase:', leadsData.length, 'leads');
  console.log('🔍 User ID original:', userId);
  
  // Limpar aspas extras do user_id se existirem
  const cleanedUserId = cleanUserId(userId);
  console.log('🔍 User ID limpo:', cleanedUserId);
  
  const url = `${SUPABASE_URL}/rest/v1/leads`;
  
  // Processar cada lead para garantir que tenha user_id e timestamp
  const processedLeads = leadsData.map(lead => ({
    ...lead,
    user_id: cleanedUserId,
    message_sent: lead.message_sent || false,
    created_at: lead.created_at || new Date().toISOString()
  }));
  
  console.log('🔍 Dados processados:', processedLeads);
  
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      apikey: SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Prefer': 'return=representation' // Para retornar os dados inseridos
    },
    body: JSON.stringify(processedLeads),
  });
  
  console.log('🔍 Status da resposta:', res.status);
  
  if (!res.ok) {
    const text = await res.text();
    console.log('❌ Erro ao salvar múltiplos leads:', res.status, text);
    throw new Error(`Erro Supabase: ${res.status} ${text}`);
  }
  
  const text = await res.text();
  console.log('✅ Múltiplos leads salvos com sucesso:', text);
  
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}
