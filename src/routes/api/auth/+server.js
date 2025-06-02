import { json } from '@sveltejs/kit';
import { getUserByKey } from '$lib/server/db/auth.js';
import { isEndpointLocked, registerAuthFailure } from '$lib/server/security/authLock.js';
import { AUTH_COOKIE, COOKIE_MAX_AGE } from '$lib/constants/auth.js';

/** @type {import('./$types').RequestHandler} */
export async function POST({ request, cookies }) {
    try {
        // Verifica se o endpoint está bloqueado
        if (isEndpointLocked()) {
            return json({ error: 'Chave de acesso inválida' }, { status: 401 });
        }

        const { key } = await request.json();

        // Validação básica
        if (!key || typeof key !== 'string') {
            registerAuthFailure();
            return json({ error: 'Chave de acesso inválida' }, { status: 401 });
        }

        // Validação do formato (apenas letras e números)
        const keyRegex = /^[a-zA-Z0-9]+$/;
        if (!keyRegex.test(key)) {
            registerAuthFailure();
            return json({ error: 'Chave de acesso inválida' }, { status: 401 });
        }

        // Busca o usuário no banco de dados
        const user = await getUserByKey(key);

        if (!user) {
            registerAuthFailure();
            return json({ error: 'Chave de acesso inválida' }, { status: 401 });
        }

        // Define o cookie de autenticação
        cookies.set(AUTH_COOKIE, user.key, {
            path: '/',
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: COOKIE_MAX_AGE
        });

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