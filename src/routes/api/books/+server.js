import { json } from '@sveltejs/kit';
import { createBook } from '$lib/server/db/queries.js';

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
    try {
        const bookData = await request.json();

        // Validação básica dos dados
        if (!bookData.name?.trim()) {
            return json({ error: 'Nome do livro é obrigatório' }, { status: 400 });
        }
        if (!bookData.author?.trim()) {
            return json({ error: 'Autor é obrigatório' }, { status: 400 });
        }
        if (!bookData.imgsrc?.trim()) {
            return json({ error: 'Link da imagem é obrigatório' }, { status: 400 });
        }

        // Tenta criar o livro no banco
        const newBook = await createBook(bookData);

        // Retorna o livro criado
        return json(newBook, { status: 201 });
    } catch (error) {
        console.error('Erro ao processar requisição:', error);
        return json(
            { error: 'Erro ao criar livro' },
            { status: 500 }
        );
    }
} 