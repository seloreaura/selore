export async function insertUserToSupabase({ email, password, name, sobrenome }: { email: string, password: string, name: string, sobrenome: string }) {
	const url = import.meta.env.VITE_SUPABASE_USERS_URL;
	const apiKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY;
	const payload = { email, password, name, sobrenome };
	const res = await fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'apikey': apiKey,
			'Authorization': `Bearer ${apiKey}`,
		},
		body: JSON.stringify(payload),
	});
	if (!res.ok) {
		const err = await res.text();
		throw new Error('Erro ao cadastrar usuário: ' + err);
	}
	return await res.json();
}
