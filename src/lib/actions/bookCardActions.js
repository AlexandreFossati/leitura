import { BOOK_STATUS } from '$lib/constants/bookStatus';

/**
 * Moves a book to "Reading" status
 * @param {Object} book - The book to update
 * @param {Function} dispatch - Function to dispatch events
 * @returns {Promise<void>}
 */
export async function handleMoveToReading(book, dispatch) {
    try {
        const response = await fetch(`/api/books/${book.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                ...book,
                status: BOOK_STATUS.READING 
            })
        });

        if (!response.ok) {
            throw new Error('Falha ao mover livro para "Lendo"');
        }

        dispatch('statusChange', { 
            bookId: book.id, 
            newStatus: BOOK_STATUS.READING 
        });

        dispatch('notification', {
            message: 'Livro movido para "Lendo" com sucesso!',
            type: 'success'
        });

        return { success: true };
    } catch (error) {
        dispatch('notification', { 
            message: error.message, 
            type: 'error' 
        });
        return { success: false, error };
    }
}

/**
 * Moves a book to "Read" status
 * @param {Object} book - The book to update
 * @param {Function} dispatch - Function to dispatch events
 * @returns {Promise<void>}
 */
export async function handleMoveToRead(book, dispatch) {
    try {
        const response = await fetch(`/api/books/${book.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                ...book,
                status: BOOK_STATUS.READ 
            })
        });

        if (!response.ok) {
            throw new Error('Falha ao mover livro para "Lidos"');
        }

        dispatch('statusChange', { 
            bookId: book.id, 
            newStatus: BOOK_STATUS.READ 
        });

        dispatch('notification', {
            message: 'Livro movido para "Lidos" com sucesso!',
            type: 'success'
        });

        return { success: true };
    } catch (error) {
        dispatch('notification', { 
            message: error.message, 
            type: 'error' 
        });
        return { success: false, error };
    }
}

/**
 * Moves a book to "Unread" status
 * @param {Object} book - The book to update
 * @param {Function} dispatch - Function to dispatch events
 * @returns {Promise<void>}
 */
export async function handleMoveToUnread(book, dispatch) {
    try {
        const response = await fetch(`/api/books/${book.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                ...book,
                status: BOOK_STATUS.UNREAD 
            })
        });

        if (!response.ok) {
            throw new Error('Falha ao mover livro para "Não lidos"');
        }

        dispatch('statusChange', { 
            bookId: book.id, 
            newStatus: BOOK_STATUS.UNREAD 
        });

        dispatch('notification', {
            message: 'Livro movido para "Não lidos" com sucesso!',
            type: 'success'
        });

        return { success: true };
    } catch (error) {
        dispatch('notification', { 
            message: error.message, 
            type: 'error' 
        });
        return { success: false, error };
    }
}

/**
 * Updates a book's rating
 * @param {Object} book - The book to update
 * @param {number} rating - New rating value
 * @param {Function} dispatch - Function to dispatch events
 * @returns {Promise<void>}
 */
export async function handleUpdateRating(book, rating, dispatch) {
    try {
        const response = await fetch(`/api/books/${book.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ rating })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Falha ao atualizar avaliação');
        }

        dispatch('notification', {
            message: 'Avaliação atualizada com sucesso!',
            type: 'success'
        });

        return { success: true, data };
    } catch (error) {
        console.error('Erro ao atualizar avaliação:', error);
        dispatch('notification', { 
            message: error.message, 
            type: 'error' 
        });
        return { success: false, error };
    }
} 