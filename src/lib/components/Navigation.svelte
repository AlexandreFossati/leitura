<script>
    let activeTab = 'lidos';

    function setActiveTab(tab) {
        activeTab = tab;
    }
</script>

<div class="tabs">
    <button 
        class="tab" 
        class:active={activeTab === 'lidos'} 
        on:click={() => setActiveTab('lidos')}
    >
        Lidos
    </button>
    <button 
        class="tab" 
        class:active={activeTab === 'lendo'} 
        on:click={() => setActiveTab('lendo')}
    >
        Lendo
    </button>
    <button 
        class="tab" 
        class:active={activeTab === 'nao-lidos'} 
        on:click={() => setActiveTab('nao-lidos')}
    >
        Não lidos
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