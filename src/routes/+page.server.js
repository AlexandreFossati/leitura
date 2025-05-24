import { getAllBooks } from '$lib/server/db/queries.js';
import { error } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
export async function load() {
    try {
        const books = await getAllBooks();
        console.log('Dados obtidos do banco:', books); // Log para verificar os dados
        return {
            books
        };
    } catch (err) {
        console.error('Erro ao carregar livros:', err);
        throw error(500, {
            message: 'Erro ao carregar os livros do banco de dados'
        });
    }
} 