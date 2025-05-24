<script>
    import Header from '$lib/components/Header.svelte';
    import Navigation from '$lib/components/Navigation.svelte';
    import FilterBar from '$lib/components/FilterBar.svelte';
    import BookGrid from '$lib/components/BookGrid.svelte';
    import { books as allBooks } from '$lib/data/books';

    let filteredBooks = allBooks;

    function handleSearch(event) {
        const searchTerm = event.detail.toLowerCase();
        filteredBooks = allBooks.filter(book => 
            book.title.toLowerCase().includes(searchTerm) ||
            book.author.toLowerCase().includes(searchTerm)
        );
    }

    function handleSort() {
        filteredBooks = [...filteredBooks].sort(() => Math.random() - 0.5);
    }
</script>

<Header />

<main class="container">
    <Navigation />
    <FilterBar on:search={handleSearch} on:sort={handleSort} />
    <BookGrid books={filteredBooks} />
</main>

<style>
    :global(body) {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
        background-color: #f5f5f5;
    }

    .container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 1rem;
    }
</style>
