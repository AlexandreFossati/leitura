<script>
    import { createEventDispatcher } from 'svelte';
    import { BOOK_STATUS, BOOK_STATUS_LABELS } from '$lib/constants/bookStatus';
    
    const dispatch = createEventDispatcher();

    let activeTab = BOOK_STATUS.READ;

    function setActiveTab(tab) {
        activeTab = tab;
        dispatch('statusChange', tab);
    }
</script>

<div class="tabs">
    <button 
        class="tab" 
        class:active={activeTab === BOOK_STATUS.READ} 
        on:click={() => setActiveTab(BOOK_STATUS.READ)}
    >
        {BOOK_STATUS_LABELS[BOOK_STATUS.READ]}
    </button>
    <button 
        class="tab" 
        class:active={activeTab === BOOK_STATUS.READING} 
        on:click={() => setActiveTab(BOOK_STATUS.READING)}
    >
        {BOOK_STATUS_LABELS[BOOK_STATUS.READING]}
    </button>
    <button 
        class="tab" 
        class:active={activeTab === BOOK_STATUS.UNREAD} 
        on:click={() => setActiveTab(BOOK_STATUS.UNREAD)}
    >
        {BOOK_STATUS_LABELS[BOOK_STATUS.UNREAD]}
    </button>
</div>

<style>
    .tabs {
        display: flex;
        gap: 1rem;
        margin: 1rem 0;
        padding: 0;
    }

    .tab {
        padding: 0.5rem 1rem;
        cursor: pointer;
        border: none;
        background: none;
        font-size: 1rem;
        color: #666;
    }

    .tab.active {
        color: #0066ff;
        border-bottom: 2px solid #0066ff;
    }
</style> 