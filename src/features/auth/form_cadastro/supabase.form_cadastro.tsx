
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SERVICE_ROLE_KEY = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

export async function insertUserFullToSupabase(data: any) {
  // Ajuste o endpoint para o correto da sua tabela
  const url = `${SUPABASE_URL}/rest/v1/users`;
  const userData = {
    name: data.name,
    sobrenome: data.sobrenome,
    email: data.email,
    password: data.password,
    empresa_nome: data.empresa_nome,
    area_atuacao: data.area_atuacao,
    servicos_produtos: data.servicos_produtos,
    diferencial: data.diferencial,
    outros: data.outros
  };
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      apikey: SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Erro Supabase: ${res.status} ${text}`);
  }
  const text = await res.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}
