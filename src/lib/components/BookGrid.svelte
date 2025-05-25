<script>
    import BookCard from './BookCard.svelte';

    /** @type {import('$lib/types').Book[]} */
    export let books = [];
</script>

<div class="book-grid">
    {#each books as book (book.id)}
        <BookCard 
            {book}
            on:notification
            on:statusChange
        />
    {/each}
</div>

<style>
    .book-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: 1.5rem;
        padding: 1rem 0;
    }
</style> 