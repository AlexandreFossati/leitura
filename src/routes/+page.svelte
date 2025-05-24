<script>
    import Header from '$lib/components/Header.svelte';
    import Navigation from '$lib/components/Navigation.svelte';
    import FilterBar from '$lib/components/FilterBar.svelte';
    import BookGrid from '$lib/components/BookGrid.svelte';
    import { BOOK_STATUS } from '$lib/constants/bookStatus';

    /** @type {import('./$types').PageData} */
    export let data;

    let currentStatus = BOOK_STATUS.READ;
    let filteredBooks = filterBooks(data.books, currentStatus, '');

    function filterBooks(books, status, searchTerm) {
        return books
            .filter(book => book.status === status)
            .filter(book => 
                searchTerm === '' || 
                book.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                book.author.toLowerCase().includes(searchTerm.toLowerCase())
            );
    }

    function handleSearch(event) {
        const searchTerm = event.detail;
        filteredBooks = filterBooks(data.books, currentStatus, searchTerm);
    }

    function handleStatusChange(event) {
        currentStatus = event.detail;
        filteredBooks = filterBooks(data.books, currentStatus, '');
    }

    function handleSort() {
        filteredBooks = [...filteredBooks].sort(() => Math.random() - 0.5);
    }
</script>

<Header />

<main class="container">
    <Navigation on:statusChange={handleStatusChange}/>
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
