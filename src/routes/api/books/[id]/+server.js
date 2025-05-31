import { json } from '@sveltejs/kit';
import { updateBookStatus, updateBook, deleteBook } from '$lib/server/db/queries.js';
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

/** @type {import('./$types').RequestHandler} */
export async function PATCH({ params, request }) {
    try {
        const { id } = params;
        const data = await request.json();

        // Validação do ID
        const bookId = parseInt(id);
        if (isNaN(bookId) || bookId <= 0) {
            return json({ error: 'ID do livro inválido' }, { status: 400 });
        }

        // Validação do rating, se presente
        if (data.rating !== undefined) {
            const rating = parseInt(data.rating);
            if (isNaN(rating) || rating < 0 || rating > 10) {
                return json({ 
                    error: 'Rating deve ser um número entre 0 e 10' 
                }, { status: 400 });
            }
            data.rating = rating;
        }

        // Validação dos campos permitidos
        const allowedFields = ['name', 'author', 'imgsrc', 'rating'];
        const updates = {};
        
        Object.entries(data).forEach(([key, value]) => {
            if (allowedFields.includes(key)) {
                updates[key] = value;
            }
        });

        if (Object.keys(updates).length === 0) {
            return json({ 
                error: 'Nenhum campo válido para atualização' 
            }, { status: 400 });
        }

        const updatedBook = await updateBook(bookId, updates);
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

/** @type {import('./$types').RequestHandler} */
export async function DELETE({ params }) {
    try {
        const { id } = params;

        // Validação do ID
        const bookId = parseInt(id);
        if (isNaN(bookId) || bookId <= 0) {
            return json({ error: 'ID do livro inválido' }, { status: 400 });
        }

        await deleteBook(bookId);
        return new Response(null, { status: 204 });
    } catch (error) {
        console.error('Erro ao processar requisição:', error);
        return json(
            { error: 'Erro ao excluir livro' },
            { status: 500 }
        );
    }
} 