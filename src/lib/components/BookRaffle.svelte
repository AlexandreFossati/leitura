<script>
    import { onMount, onDestroy } from 'svelte';
    import { fade } from 'svelte/transition';
    import confetti from 'canvas-confetti';
    import { BOOK_STATUS } from '$lib/constants/bookStatus';

    /** @type {import('$lib/types').Book[]} */
    export let books = [];

    $: unreadBooks = books.filter(book => book.status === BOOK_STATUS.UNREAD);
    
    let visible = false;
    let contentVisible = false;
    let currentBook = null;
    let showOkButton = false;
    let raffleInterval;
    let selectedBook = null;

    // Duração das animações em ms
    const FADE_DURATION = 2000;
    const CONTENT_FADE_DURATION = 100;
    const RAFFLE_DURATION = 6000;
    const CONFETTI_DURATION = 5000;
    const BOOK_CHANGE_INTERVAL = 250; // 4x por segundo

    function selectRandomBook() {
        const randomIndex = Math.floor(Math.random() * unreadBooks.length);
        currentBook = unreadBooks[randomIndex];
    }

    async function updateBookStatus(book) {
        try {
            const response = await fetch(`/api/books/${book.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    status: BOOK_STATUS.READING
                })
            });

            if (!response.ok) {
                throw new Error('Failed to update book status');
            }

            return await response.json();
        } catch (error) {
            console.error('Error updating book status:', error);
            throw error;
        }
    }

    function startConfetti() {
        const duration = CONFETTI_DURATION;
        const animationEnd = Date.now() + duration;
        const defaults = { 
            startVelocity: 30, 
            spread: 360, 
            ticks: 60, 
            zIndex: 1100,
            position: 'fixed'
        };

        function randomInRange(min, max) {
            return Math.random() * (max - min) + min;
        }

        const interval = setInterval(function() {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);
            confetti(Object.assign({}, defaults, {
                particleCount,
                origin: { x: randomInRange(0.1, 0.9), y: Math.random() - 0.2 }
            }));
        }, 250);
    }

    async function startRaffle() {
        // Iniciar troca de livros
        raffleInterval = setInterval(selectRandomBook, BOOK_CHANGE_INTERVAL);

        // Após RAFFLE_DURATION, parar o sorteio e mostrar o resultado
        setTimeout(async () => {
            clearInterval(raffleInterval);
            selectedBook = currentBook;

            try {
                selectedBook = await updateBookStatus(selectedBook);
                startConfetti();
                setTimeout(() => {
                    showOkButton = true;
                }, 500);
            } catch (error) {
                console.error('Failed to update book status:', error);
                alert('Erro ao atualizar o status do livro. Por favor, tente novamente.');
                visible = false;
                dispatch('close', { selectedBook: null });
            }
        }, RAFFLE_DURATION);
    }

    function handleOkClick() {
        contentVisible = false;
        visible = false;
        setTimeout(() => {
            dispatch('close', { selectedBook });
        }, FADE_DURATION);
    }

    onMount(() => {
        if (unreadBooks.length > 0) {
            visible = true;
            selectRandomBook();
            setTimeout(() => {
                contentVisible = true;
                setTimeout(startRaffle, CONTENT_FADE_DURATION);
            }, FADE_DURATION);
        }
    });

    onDestroy(() => {
        if (raffleInterval) {
            clearInterval(raffleInterval);
        }
    });

    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();
</script>

{#if visible}
    <div 
        class="raffle-overlay"
        transition:fade={{ duration: FADE_DURATION }}
    >
        {#if contentVisible}
            <div 
                class="raffle-content"
                transition:fade={{ duration: CONTENT_FADE_DURATION }}
            >
                {#if currentBook}
                    <div class="book-image-container">
                        <img 
                            src={currentBook.imgsrc} 
                            alt={currentBook.name}
                            class="book-image"
                        >
                    </div>
                    <h2 class="book-title">{currentBook.name}</h2>
                    {#if showOkButton}
                        <button class="ok-button" on:click={handleOkClick}>
                            OK
                        </button>
                    {/if}
                {/if}
            </div>
        {/if}
    </div>
{/if}

<style>
    .raffle-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.8);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
        backdrop-filter: blur(5px);
    }

    .raffle-content {
        background: white;
        padding: 2rem;
        border-radius: 1rem;
        text-align: center;
        width: 400px;
        height: 600px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .book-image-container {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        overflow: hidden;
        margin-bottom: 1rem;
    }

    .book-image {
        max-height: 100%;
        max-width: 100%;
        width: auto;
        height: auto;
        object-fit: contain;
        border-radius: 0.5rem;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .book-title {
        margin: 0;
        font-size: 1.5rem;
        color: #333;
        margin-bottom: 1rem;
        padding: 0 1rem;
        width: 100%;
        overflow-wrap: break-word;
    }

    .ok-button {
        background-color: rgb(0, 209, 178);
        color: white;
        border: none;
        padding: 0.75rem 2rem;
        border-radius: 0.5rem;
        font-size: 1.1rem;
        cursor: pointer;
        transition: background-color 0.2s;
        margin-top: auto;
    }

    .ok-button:hover {
        background-color: rgb(0, 188, 160);
    }
</style> 