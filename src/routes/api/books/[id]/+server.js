import { json } from '@sveltejs/kit';
import { updateBookStatus } from '$lib/server/db/queries.js';
import { BOOK_STATUS } from '$lib/constants/bookStatus.js';

/** @type {import('./$types').RequestHandler} */
export async function PUT({ params, request }) {
    try {
        const { id } = params;
        const { status } = await request.json();

        // Validação do ID
        const bookId = parseInt(id);
        if (isNaN(bookId) || bookId <= 0) {
            return json({ error: 'ID do livro inválido' }, { status: 400 });
        }

        // Validação do status
        if (!status) {
            return json({ error: 'Status é obrigatório' }, { status: 400 });
        }

        // Validação do valor do status
        const validStatuses = Object.values(BOOK_STATUS);
        if (!validStatuses.includes(status)) {
            return json({ 
                error: `Status inválido. Valores permitidos: ${validStatuses.join(', ')}` 
            }, { status: 400 });
        }

        const updatedBook = await updateBookStatus(bookId, status);
        return json(updatedBook);
    } catch (error) {
        console.error('Erro ao processar requisição:', error);
        
        if (error.message === 'Livro não encontrado') {
            return json({ error: 'Livro não encontrado' }, { status: 404 });
        }

        return json(
            { error: 'Erro ao atualizar livro' },
            { status: 500 }
        );
    }
} 