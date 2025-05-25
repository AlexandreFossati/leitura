<script>
    import { BOOK_STATUS } from '$lib/constants/bookStatus';
    import StarRating from './StarRating.svelte';

    /** @type {import('$lib/types').Book} */
    export let book;

    $: isRead = book.status === BOOK_STATUS.READ;
</script>

<div class="book-card">
    <img src={book.imgsrc} alt={book.name} class="book-image">
    <div class="book-info">
        <h3 class="book-title">{book.name}</h3>
        <p class="book-author">{book.author}</p>
        {#if isRead}
            <div class="rating-container">
                <StarRating rating={book.rating} />
            </div>
        {/if}
    </div>
</div>

<style>
    .book-card {
        background: white;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        transition: transform 0.2s, box-shadow 0.2s;
        height: 100%;
        display: flex;
        flex-direction: column;
    }

    .book-card:hover {
        transform: translateY(-4px);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
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
</style> 