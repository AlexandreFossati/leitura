<script>
    import { BOOK_STATUS } from '$lib/constants/bookStatus';
    import StarRating from './StarRating.svelte';
    import BookActions from './BookActions.svelte';
    import RatingDialog from './RatingDialog.svelte';
    import { activeMenu } from '$lib/stores/menuStore';
    import { fade } from 'svelte/transition';
    import { createEventDispatcher } from 'svelte';
    import { handleMoveToReading, handleMoveToRead, handleMoveToUnread, handleUpdateRating } from '$lib/actions/bookCardActions';

    /** @type {import('$lib/types').Book} */
    export let book;

    const dispatch = createEventDispatcher();
    
    $: isRead = book.status === BOOK_STATUS.READ;
    $: isUnread = book.status === BOOK_STATUS.UNREAD;
    $: isReading = book.status === BOOK_STATUS.READING;

    let actionsPosition = { x: 0, y: 0 };
    let isLoading = false;
    let error = null;
    let showRatingDialog = false;

    // Subscreve ao store para saber se este card tem o menu ativo
    $: showActions = $activeMenu === book.id;

    function handleClick(event) {
        if (isLoading) return;

        if (isUnread || isReading) {
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
        } else if (isRead) {
            showRatingDialog = true;
        }
    }

    async function handleMoveToReadingClick() {
        isLoading = true;
        const result = await handleMoveToReading(book, dispatch);
        if (result.success) {
            book.status = BOOK_STATUS.READING;
        }
        isLoading = false;
        activeMenu.set(null);
    }

    async function handleMoveToReadClick() {
        isLoading = true;
        const result = await handleMoveToRead(book, dispatch);
        if (result.success) {
            book.status = BOOK_STATUS.READ;
        }
        isLoading = false;
        activeMenu.set(null);
    }

    async function handleMoveToUnreadClick() {
        isLoading = true;
        const result = await handleMoveToUnread(book, dispatch);
        if (result.success) {
            book.status = BOOK_STATUS.UNREAD;
        }
        isLoading = false;
        activeMenu.set(null);
    }

    async function handleRatingConfirm(event) {
        const newRating = event.detail;
        isLoading = true;
        showRatingDialog = false;
        const result = await handleUpdateRating(book, newRating, dispatch);
        if (result.success) {
            book.rating = newRating;
        }
        isLoading = false;
    }

    function handleRatingDialogClose() {
        showRatingDialog = false;
    }
</script>

<div 
    class="book-card"
    class:clickable={(isUnread || isReading || isRead) && !isLoading}
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
                <StarRating rating={book.rating} readonly={true} />
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
        on:moveToReading={handleMoveToReadingClick}
        on:moveToRead={handleMoveToReadClick}
        on:moveToUnread={handleMoveToUnreadClick}
    />
{/if}

{#if showRatingDialog}
    <RatingDialog
        show={true}
        bookTitle={book.name}
        currentRating={book.rating}
        on:confirm={handleRatingConfirm}
        on:cancel={handleRatingDialogClose}
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