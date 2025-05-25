<script>
    import BookCard from './BookCard.svelte';
    export let books = [];
</script>

<div class="books-grid">
    {#each books as book}
        <BookCard {book} />
    {/each}
</div>

<style>
    .books-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: 2rem;
        padding: 1rem 0;
    }
</style> 