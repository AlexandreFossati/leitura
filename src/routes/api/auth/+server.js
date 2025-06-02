import { json } from '@sveltejs/kit';
import { getUserByKey } from '$lib/server/db/auth.js';

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
    try {
        const { key } = await request.json();

        // Validação básica
        if (!key || typeof key !== 'string') {
            return json({ error: 'Chave de acesso inválida' }, { status: 401 });
        }

        // Validação do formato (apenas letras e números)
        const keyRegex = /^[a-zA-Z0-9]+$/;
        if (!keyRegex.test(key)) {
            return json({ error: 'Chave de acesso inválida' }, { status: 401 });
        }

        // Busca o usuário no banco de dados
        const user = await getUserByKey(key);

        if (!user) {
            return json({ error: 'Chave de acesso inválida' }, { status: 401 });
        }

        // Retorna os dados do usuário
        return json({ user: user.user });
    } catch (error) {
        console.error('Erro na autenticação:', error);
        return json(
            { error: 'Erro ao processar autenticação' },
            { status: 500 }
        );
    }
} 