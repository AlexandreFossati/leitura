import { BOOK_STATUS } from '$lib/constants/bookStatus.js';
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

/**
 * Cria um novo livro no banco de dados
 * @param {{
 *   name: string,
 *   author: string,
 *   imgsrc: string
 * }} bookData
 * @returns {Promise<{
 *   id: number,
 *   name: string,
 *   author: string,
 *   imgsrc: string,
 *   status: string,
 *   rating: number
 * }>}
 */
export async function createBook({ name, author, imgsrc }) {
    const FIXED_USER_ID = 1; //TODO: atualizar com usuário de fato
    const FIXED_STATUS = BOOK_STATUS.UNREAD;
    const FIXED_RATING = 0;

    try {
        const now = new Date();
        const query_text = `
            INSERT INTO books (
                name, author, imgsrc,
                created_at, created_by,
                last_modified_at, last_modified_by,
                status, rating
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            RETURNING id, name, author, imgsrc, status, rating
        `;
        
        const values = [
            name,
            author,
            imgsrc,
            now,
            FIXED_USER_ID,
            now,
            FIXED_USER_ID,
            FIXED_STATUS,
            FIXED_RATING
        ];

        const result = await query(query_text, values);
        return result.rows[0];
    } catch (err) {
        console.error('Erro ao criar livro:', err);
        throw new Error('Falha ao criar livro no banco de dados');
    }
}

/**
 * Atualiza o status de um livro
 * @param {number} id - ID do livro
 * @param {string} status - Novo status do livro
 * @returns {Promise<{
 *   id: number,
 *   name: string,
 *   author: string,
 *   imgsrc: string,
 *   status: string,
 *   rating: number
 * }>}
 */
export async function updateBookStatus(id, status) {
    try {
        const query_text = `
            UPDATE books 
            SET status = $1,
                last_modified_at = NOW(),
                last_modified_by = 1
            WHERE id = $2
            RETURNING id, name, author, imgsrc, status, rating
        `;
        
        const result = await query(query_text, [status, id]);

        if (result.rows.length === 0) {
            throw new Error('Livro não encontrado');
        }

        return result.rows[0];
    } catch (err) {
        console.error('Erro ao atualizar status do livro:', err);
        throw new Error('Falha ao atualizar status do livro no banco de dados');
    }
}

/**
 * Atualiza os dados de um livro
 * @param {number} id - ID do livro
 * @param {{
 *   name?: string,
 *   author?: string,
 *   imgsrc?: string
 * }} data - Dados para atualizar
 * @returns {Promise<{
 *   id: number,
 *   name: string,
 *   author: string,
 *   imgsrc: string,
 *   status: string,
 *   rating: number
 * }>}
 */
export async function updateBook(id, data) {
    try {
        const updates = [];
        const values = [id];
        let paramCount = 1;

        // Constrói a query dinamicamente baseado nos campos fornecidos
        Object.entries(data).forEach(([key, value]) => {
            if (value !== undefined) {
                updates.push(`${key} = $${++paramCount}`);
                values.push(value);
            }
        });

        // Adiciona campos de auditoria
        updates.push(`last_modified_at = NOW()`);
        updates.push(`last_modified_by = 1`);

        const query_text = `
            UPDATE books 
            SET ${updates.join(', ')}
            WHERE id = $1
            RETURNING id, name, author, imgsrc, status, rating
        `;
        
        const result = await query(query_text, values);

        if (result.rows.length === 0) {
            throw new Error('Livro não encontrado');
        }

        return result.rows[0];
    } catch (err) {
        console.error('Erro ao atualizar livro:', err);
        throw new Error('Falha ao atualizar livro no banco de dados');
    }
}

/**
 * Exclui um livro do banco de dados
 * @param {number} id - ID do livro
 * @returns {Promise<void>}
 */
export async function deleteBook(id) {
    try {
        const query_text = 'DELETE FROM books WHERE id = $1';
        await query(query_text, [id]);
    } catch (err) {
        console.error('Erro ao excluir livro:', err);
        throw new Error('Falha ao excluir livro do banco de dados');
    }
} 