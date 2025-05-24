<script>
    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();

    function handleClick() {
        dispatch('click');
    }
</script>

<button class="floating-button" on:click={handleClick}>
    <span class="plus-icon">+</span>
    <span class="button-text">Novo Livro</span>
</button>

<style>
    .floating-button {
        position: fixed;
        bottom: 2rem;
        right: 2rem;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 1rem 1.5rem;
        background-color: rgb(0, 209, 178);
        color: white;
        border: none;
        border-radius: 2rem;
        font-size: 1rem;
        font-weight: 500;
        cursor: pointer;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        transition: transform 0.2s, box-shadow 0.2s;
    }

    .floating-button:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        background-color: rgb(0, 188, 160);
    }

    .plus-icon {
        font-size: 1.5rem;
        line-height: 1;
    }

    .button-text {
        margin-top: 2px;
    }
</style> 