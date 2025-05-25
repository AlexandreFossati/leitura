<script>
    import { fade } from 'svelte/transition';
    import { createEventDispatcher } from 'svelte';

    export let show = false;
    export let title = '';
    export let message = '';
    export let confirmText = 'Confirmar';
    export let cancelText = 'Cancelar';
    export let isDanger = false;

    const dispatch = createEventDispatcher();

    function handleConfirm() {
        dispatch('confirm');
    }

    function handleCancel() {
        dispatch('cancel');
    }

    function handleClose() {
        dispatch('cancel');
    }
</script>

{#if show}
    <div class="dialog-overlay" on:click={handleClose} transition:fade>
        <div class="dialog" on:click|stopPropagation>
            <div class="dialog-header">
                <h2>{title}</h2>
                <button class="close-button" on:click={handleClose}>×</button>
            </div>

            <div class="dialog-content">
                <p>{message}</p>
            </div>

            <div class="dialog-footer">
                <button 
                    class="cancel-button" 
                    on:click={handleCancel}
                >
                    {cancelText}
                </button>
                <button 
                    class="confirm-button"
                    class:danger={isDanger}
                    on:click={handleConfirm}
                >
                    {confirmText}
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
        padding: 1rem;
    }

    .dialog-content p {
        margin: 0;
        color: #666;
        line-height: 1.5;
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

    .cancel-button {
        background-color: #f8f9fa;
        color: #333;
    }

    .confirm-button {
        background-color: rgb(0, 209, 178);
        color: white;
    }

    .confirm-button.danger {
        background-color: #dc3545;
    }

    .cancel-button:hover {
        background-color: #e9ecef;
    }

    .confirm-button:hover {
        opacity: 0.9;
    }
</style> 