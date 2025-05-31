<script>
    import { fade } from 'svelte/transition';
    import { createEventDispatcher } from 'svelte';
    import StarRating from './StarRating.svelte';

    export let show = false;
    export let bookTitle = '';
    export let currentRating = 0;

    const dispatch = createEventDispatcher();

    function handleConfirm() {
        dispatch('confirm', currentRating);
    }

    function handleCancel() {
        dispatch('cancel');
    }

    function handleRatingChange(event) {
        currentRating = event.detail;
    }
</script>

{#if show}
    <div class="dialog-overlay" on:click={handleCancel} transition:fade>
        <div class="dialog" on:click|stopPropagation>
            <div class="dialog-header">
                <h2>Avaliar Livro</h2>
                <button class="close-button" on:click={handleCancel}>×</button>
            </div>

            <div class="dialog-content">
                <p class="book-title">{bookTitle}</p>
                <div class="rating-container">
                    <StarRating 
                        rating={currentRating} 
                        readonly={false}
                        on:ratingChange={handleRatingChange}
                    />
                </div>
            </div>

            <div class="dialog-footer">
                <button 
                    class="cancel-button" 
                    on:click={handleCancel}
                >
                    Cancelar
                </button>
                <button 
                    class="save-button" 
                    on:click={handleConfirm}
                    disabled={currentRating === 0}
                >
                    Salvar avaliação
                </button>
            </div>
        </div>
    </div>
{/if}

<style>
    .dialog-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1100;
    }

    .dialog {
        background: white;
        border-radius: 8px;
        width: 90%;
        max-width: 400px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }

    .dialog-header {
        padding: 1rem;
        border-bottom: 1px solid #eee;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .dialog-header h2 {
        margin: 0;
        font-size: 1.25rem;
        color: #333;
    }

    .close-button {
        background: none;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        padding: 0;
        color: #666;
    }

    .dialog-content {
        padding: 1.5rem 1rem;
        text-align: center;
    }

    .book-title {
        margin: 0 0 1rem 0;
        color: #666;
        font-size: 1.1rem;
    }

    .rating-container {
        display: flex;
        justify-content: center;
        padding: 0.5rem 0;
    }

    .dialog-footer {
        padding: 1rem;
        border-top: 1px solid #eee;
        display: flex;
        justify-content: flex-end;
        gap: 1rem;
    }

    button {
        padding: 0.5rem 1rem;
        border-radius: 4px;
        font-size: 1rem;
        cursor: pointer;
        border: none;
    }

    button:disabled {
        opacity: 0.7;
        cursor: not-allowed;
    }

    .cancel-button {
        background-color: #f8f9fa;
        color: #333;
    }

    .save-button {
        background-color: rgb(0, 209, 178);
        color: white;
    }

    .cancel-button:hover {
        background-color: #e9ecef;
    }

    .save-button:hover:not(:disabled) {
        background-color: rgb(0, 188, 160);
    }
</style> 