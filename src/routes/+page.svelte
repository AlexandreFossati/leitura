<script>
    import Header from '$lib/components/Header.svelte';
    import Navigation from '$lib/components/Navigation.svelte';
    import FilterBar from '$lib/components/FilterBar.svelte';
    import BookGrid from '$lib/components/BookGrid.svelte';
    import FloatingButton from '$lib/components/FloatingButton.svelte';
    import BookDialog from '$lib/components/BookDialog.svelte';
    import BookRaffle from '$lib/components/BookRaffle.svelte';
    import { BOOK_STATUS } from '$lib/constants/bookStatus';
    import { dialogVisible, showDialog, hideDialog } from '$lib/stores/dialog';

    /** @type {import('./$types').PageData} */
    export let data;

    let currentStatus = BOOK_STATUS.READ;
    let filteredBooks = filterBooks(data.books, currentStatus, '');
    let showRaffle = false;

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
        showRaffle = true;
    }

    function handleRaffleClose(event) {
        showRaffle = false;
        const { selectedBook } = event.detail;
        if (selectedBook) {
            // Atualiza a lista de livros local
            data.books = data.books.map(book => 
                book.id === selectedBook.id ? selectedBook : book
            );
            filteredBooks = filterBooks(data.books, currentStatus, '');
        }
    }

    async function handleBookSubmit(event) {
        try {
            const response = await fetch('/api/books', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(event.detail)
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Erro ao criar livro');
            }

            const newBook = await response.json();
            data.books = [...data.books, newBook];
            filteredBooks = filterBooks(data.books, currentStatus, '');

            // Aqui você poderia adicionar uma notificação de sucesso
            alert('Livro criado com sucesso!');
        } catch (error) {
            console.error('Erro ao salvar livro:', error);
            alert('Erro ao criar livro: ' + error.message);
        }
    }
</script>

<Header />

<main class="container">
    <Navigation on:statusChange={handleStatusChange}/>
    <FilterBar on:search={handleSearch} on:sort={handleSort} />
    <BookGrid books={filteredBooks} />
    <FloatingButton on:click={showDialog} />
    <BookDialog 
        show={$dialogVisible} 
        on:close={hideDialog}
        on:submit={handleBookSubmit}
    />
    {#if showRaffle}
        <BookRaffle
            books={data.books}
            on:close={handleRaffleClose}
        />
    {/if}
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
