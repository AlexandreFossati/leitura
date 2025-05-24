<script>
    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();

    let searchTerm = '';

    function handleSearch(event) {
        searchTerm = event.target.value;
        dispatch('search', searchTerm);
    }

    function handleSort() {
        dispatch('sort');
    }
</script>

<div class="filters">
    <input 
        type="text" 
        class="filter-input" 
        placeholder="livro ou autor"
        bind:value={searchTerm}
        on:input={handleSearch}
    >
    <button class="sort-button" on:click={handleSort}>
        Sorteio
    </button>
</div>

<style>
    .filters {
        display: flex;
        justify-content: space-between;
        margin: 1rem 0;
        gap: 1rem;
    }

    .filter-input {
        flex-grow: 1;
        padding: 0.5rem;
        border: 1px solid #ddd;
        border-radius: 4px;
        font-size: 1rem;
    }

    .sort-button {
        padding: 0.5rem 1rem;
        border: 1px solid #ddd;
        border-radius: 4px;
        font-size: 1rem;
        background: white;
        cursor: pointer;
    }
</style> 