import { query } from './client.js';

/**
 * Busca um usuário pela chave de acesso
 * @param {string} key - Chave de acesso do usuário
 * @returns {Promise<{user: string, key: string} | null>}
 */
export async function getUserByKey(key) {
    try {
        const result = await query(
            'SELECT user, key FROM passkeys WHERE key = $1',
            [key]
        );
        return result.rows[0] || null;
    } catch (err) {
        console.error('Erro ao buscar usuário:', err);
        throw new Error('Falha ao buscar usuário no banco de dados');
    }
} 