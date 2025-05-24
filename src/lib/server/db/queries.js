import { query } from './client.js';

export async function getAllBooks() {
    try {
        const result = await query('SELECT * FROM books');
        return result.rows;
    } catch (err) {
        console.error('Erro ao buscar livros:', err);
        throw new Error('Falha ao buscar livros do banco de dados');
    }
} 