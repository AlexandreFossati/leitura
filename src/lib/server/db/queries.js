import { query } from './client.js';

/**
 * Busca todos os livros do banco de dados
 * @returns {Promise<Array<{
 *   id: number,
 *   name: string,
 *   author: string,
 *   imgsrc: string,
 *   status: 'unread' | 'read' | 'reading',
 *   rating: number
 * }>>}
 */
export async function getAllBooks() {
    try {
        const result = await query('SELECT id, name, author, imgsrc, status, rating FROM books');
        return result.rows;
    } catch (err) {
        console.error('Erro ao buscar livros:', err);
        throw new Error('Falha ao buscar livros do banco de dados');
    }
} 