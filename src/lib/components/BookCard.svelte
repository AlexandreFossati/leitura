<script>
    import { BOOK_STATUS } from '$lib/constants/bookStatus';
    import StarRating from './StarRating.svelte';
    import BookActions from './BookActions.svelte';
    import { activeMenu } from '$lib/stores/menuStore';
    import { fade } from 'svelte/transition';
    import { createEventDispatcher } from 'svelte';
    import ConfirmDialog from './ConfirmDialog.svelte';

    /** @type {import('$lib/types').Book} */
    export let book;

    const dispatch = createEventDispatcher();
    
    $: isRead = book.status === BOOK_STATUS.READ;
    $: isUnread = book.status === BOOK_STATUS.UNREAD;
    $: isReading = book.status === BOOK_STATUS.READING;

    let actionsPosition = { x: 0, y: 0 };
    let isLoading = false;
    let error = null;
    let showConfirmDialog = false;

    // Subscreve ao store para saber se este card tem o menu ativo
    $: showActions = $activeMenu === book.id;

    function handleClick(event) {
        if (isLoading) return;

        if (isUnread) {
            if (showActions) {
                // Se o menu já está aberto neste card, fecha
                activeMenu.set(null);
            } else {
                // Se o menu está fechado ou aberto em outro card, abre neste
                actionsPosition = {
                    x: event.clientX,
                    y: event.clientY
                };
                activeMenu.set(book.id);
            }
        } else if (isReading) {
            showConfirmDialog = true;
        }
    }

    async function handleMoveToReading() {
        if (isLoading) return;

        isLoading = true;
        error = null;

        try {
            book.status = BOOK_STATUS.READING;
            activeMenu.set(null);

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

            // Notifica o componente pai sobre a mudança
            dispatch('statusChange', { 
                bookId: book.id, 
                newStatus: BOOK_STATUS.READING 
            });

            // Mostra notificação de sucesso
            showNotification('Livro movido para "Lendo" com sucesso!');
        } catch (e) {
            // Reverte a atualização otimista em caso de erro
            book.status = BOOK_STATUS.UNREAD;
            error = e.message;
            showNotification(error, 'error');
        } finally {
            isLoading = false;
        }
    }

    async function handleMoveToRead() {
        if (isLoading) return;

        isLoading = true;
        error = null;
        showConfirmDialog = false;

        try {
            book.status = BOOK_STATUS.READ;

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

            // Notifica o componente pai sobre a mudança
            dispatch('statusChange', { 
                bookId: book.id, 
                newStatus: BOOK_STATUS.READ 
            });

            // Mostra notificação de sucesso
            showNotification('Livro movido para "Lidos" com sucesso!');
        } catch (e) {
            // Reverte a atualização otimista em caso de erro
            book.status = BOOK_STATUS.READING;
            error = e.message;
            showNotification(error, 'error');
        } finally {
            isLoading = false;
        }
    }

    function handleConfirmDialogClose() {
        showConfirmDialog = false;
    }

    function showNotification(message, type = 'success') {
        // Dispara evento para mostrar notificação
        dispatch('notification', { message, type });
    }
</script>

<div 
    class="book-card"
    class:clickable={(isUnread || isReading) && !isLoading}
    class:loading={isLoading}
    on:click={handleClick}
    transition:fade={{ duration: 200 }}
>
    <img src={book.imgsrc} alt={book.name} class="book-image">
    <div class="book-info">
        <h3 class="book-title">{book.name}</h3>
        <p class="book-author">{book.author}</p>
        {#if isRead}
            <div class="rating-container">
                <StarRating rating={book.rating} />
            </div>
        {/if}
        {#if isLoading}
            <div class="loading-overlay">
                <div class="loading-spinner"></div>
                <span>Movendo...</span>
            </div>
        {/if}
    </div>
</div>

{#if showActions && !isLoading}
    <BookActions
        {book}
        position={actionsPosition}
        on:edit={() => activeMenu.set(null)}
        on:delete={() => activeMenu.set(null)}
        on:moveToReading={handleMoveToReading}
    />
{/if}

{#if showConfirmDialog}
    <ConfirmDialog
        show={true}
        title="Finalizar Livro"
        message="Deseja marcar este livro como lido?"
        confirmText="Concluir leitura"
        cancelText="Cancelar"
        on:confirm={handleMoveToRead}
        on:cancel={handleConfirmDialogClose}
    />
{/if}

<style>
    .book-card {
        background: white;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        transition: transform 0.2s, box-shadow 0.2s, opacity 0.2s;
        height: 100%;
        display: flex;
        flex-direction: column;
        position: relative;
    }

    .book-card.clickable {
        cursor: pointer;
    }

    .book-card.clickable:hover {
        transform: translateY(-4px);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    }

    .book-card.loading {
        opacity: 0.7;
        cursor: not-allowed;
    }

    .book-image {
        width: 100%;
        aspect-ratio: 2/3;
        object-fit: cover;
    }

    .book-info {
        padding: 1rem;
        flex: 1;
        display: flex;
        flex-direction: column;
        position: relative;
    }

    .book-title {
        margin: 0;
        font-size: 1rem;
        font-weight: 600;
        color: #333;
        margin-bottom: 0.5rem;
    }

    .book-author {
        margin: 0;
        font-size: 0.9rem;
        color: #666;
    }

    .rating-container {
        margin-top: auto;
        padding-top: 0.5rem;
    }

    .loading-overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(255, 255, 255, 0.9);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
    }

    .loading-spinner {
        width: 24px;
        height: 24px;
        border: 3px solid #f3f3f3;
        border-top: 3px solid rgb(0, 209, 178);
        border-radius: 50%;
        animation: spin 1s linear infinite;
    }

    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
</style> 