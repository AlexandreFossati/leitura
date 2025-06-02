import { getAllBooks } from '$lib/server/db/queries.js';
import { error, redirect } from '@sveltejs/kit';
import { getUserByKey } from '$lib/server/db/auth.js';
import { AUTH_COOKIE } from '$lib/constants/auth.js';
import { isEndpointLocked, registerAuthFailure } from '$lib/server/security/authLock.js';

/** @type {import('./$types').PageServerLoad} */
export async function load({ cookies }) {
    // Verifica se o endpoint está bloqueado
    if (isEndpointLocked()) {
        throw redirect(303, '/');
    }

    const authKey = cookies.get(AUTH_COOKIE);

    // Se não houver cookie de autenticação, registra falha e redireciona
    if (!authKey) {
        registerAuthFailure();
        throw redirect(303, '/');
    }

    try {
        // Verifica se a key é válida
        const user = await getUserByKey(authKey);
        
        if (!user) {
            // Se a key não for válida, remove o cookie, registra falha e redireciona
            cookies.delete(AUTH_COOKIE, { path: '/' });
            registerAuthFailure();
            throw redirect(303, '/');
        }

        // Carrega os livros
        const books = await getAllBooks();

        // Retorna os dados do usuário e os livros
        return {
            user: user.user,
            books
        };
    } catch (error) {
        console.error('Erro ao carregar dados:', error);
        throw error(500, {
            message: 'Erro ao carregar dados do usuário'
        });
    }
} 