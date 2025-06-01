<script>
    import { createEventDispatcher } from 'svelte';
    import { fade } from 'svelte/transition';
    import { onMount } from 'svelte';
    import { BOOK_STATUS } from '$lib/constants/bookStatus';

    /** @type {import('$lib/types').Book} */
    export let book;
    /** @type {{ x: number, y: number }} */
    export let position;

    const dispatch = createEventDispatcher();
    let menuElement;
    let adjustedPosition = { x: position.x, y: position.y };

    $: isUnread = book.status === BOOK_STATUS.UNREAD;
    $: isReading = book.status === BOOK_STATUS.READING;
    $: isRead = book.status === BOOK_STATUS.READ;

    onMount(() => {
        // Ajusta a posição do menu para garantir que ele fique visível
        if (menuElement) {
            const menuRect = menuElement.getBoundingClientRect();
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;

            // Ajusta horizontalmente se necessário
            if (position.x + menuRect.width > viewportWidth) {
                adjustedPosition.x = position.x - menuRect.width;
            }

            // Ajusta verticalmente se necessário
            if (position.y + menuRect.height > viewportHeight) {
                adjustedPosition.y = position.y - menuRect.height;
            }

            // Garante que o menu não fique fora da tela à esquerda
            if (adjustedPosition.x < 0) {
                adjustedPosition.x = 0;
            }

            // Garante que o menu não fique fora da tela em cima
            if (adjustedPosition.y < 0) {
                adjustedPosition.y = 0;
            }
        }
    });

    // function handleEdit() {
    //     dispatch('edit', book);
    // }

    // function handleDelete() {
    //     dispatch('delete', book);
    // }

    function handleMoveToReading() {
        dispatch('moveToReading', book);
    }

    function handleMoveToRead() {
        dispatch('moveToRead', book);
    }

    function handleMoveToUnread() {
        dispatch('moveToUnread', book);
    }

    function handleRate() {
        dispatch('rate', book);
    }
</script>

<div 
    bind:this={menuElement}
    class="actions-menu"
    style="left: {adjustedPosition.x}px; top: {adjustedPosition.y}px;"
    transition:fade={{ duration: 150 }}
>
    {#if isUnread}
        <button class="action-button" on:click={handleMoveToReading}>
            <span class="icon">📖</span>
            Mover para "Lendo"
        </button>
    {:else if isReading}
        <button class="action-button" on:click={handleMoveToRead}>
            <span class="icon">📖</span>
            Mover para "Lidos"
        </button>
        <button class="action-button" on:click={handleMoveToUnread}>
            <span class="icon">↩️</span>
            Voltar para "Não lidos"
        </button>
    {:else if isRead}
        <button class="action-button" on:click={handleRate}>
            <span class="icon">⭐</span>
            Avaliar
        </button>
        <button class="action-button" on:click={handleMoveToReading}>
            <span class="icon">↩️</span>
            Voltar para "Lendo"
        </button>
    {/if}
    <!-- <button class="action-button delete" on:click={handleDelete}>
        <span class="icon">🗑️</span>
        Excluir
    </button> -->
</div>

<style>
    .actions-menu {
        position: fixed;
        background: white;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        padding: 0.5rem;
        min-width: 200px;
        z-index: 1000;
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
    }

    .action-button {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.5rem;
        border: none;
        background: none;
        width: 100%;
        text-align: left;
        cursor: pointer;
        border-radius: 4px;
        color: #333;
        font-size: 0.9rem;
    }

    .action-button:hover {
        background-color: #f5f5f5;
    }

    .action-button.delete {
        color: #dc3545;
    }

    .action-button.delete:hover {
        background-color: #fff5f5;
    }

    .icon {
        font-size: 1.2em;
    }
</style> 