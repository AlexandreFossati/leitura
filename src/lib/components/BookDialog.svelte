<script>
    import { createEventDispatcher } from 'svelte';
    import { fade } from 'svelte/transition';

    /** @type {import('$lib/types').Book | null} */
    export let book = null;
    export let show = false;

    // Se book for fornecido, estamos em modo de edição
    $: isEditing = !!book;

    // Inicializa os campos com valores do livro se estiver editando
    let name = book?.name ?? '';
    let author = book?.author ?? '';
    let imgsrc = book?.imgsrc ?? '';
    let loading = false;
    let errors = {
        name: '',
        author: '',
        imgsrc: ''
    };

    // Reseta os campos quando o dialog é fechado
    $: if (!show) {
        if (!isEditing) {
            name = '';
            author = '';
            imgsrc = '';
        } else {
            name = book?.name ?? '';
            author = book?.author ?? '';
            imgsrc = book?.imgsrc ?? '';
        }
        errors = {
            name: '',
            author: '',
            imgsrc: ''
        };
    }

    const dispatch = createEventDispatcher();

    function validateForm() {
        let isValid = true;
        errors = {
            name: '',
            author: '',
            imgsrc: ''
        };

        if (!name.trim()) {
            errors.name = 'Nome do livro é obrigatório';
            isValid = false;
        }

        if (!author.trim()) {
            errors.author = 'Autor é obrigatório';
            isValid = false;
        }

        if (!imgsrc.trim()) {
            errors.imgsrc = 'Link da imagem é obrigatório';
            isValid = false;
        } else if (!isValidUrl(imgsrc)) {
            errors.imgsrc = 'Link da imagem inválido';
            isValid = false;
        }

        return isValid;
    }

    function isValidUrl(string) {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    }

    function handleClose() {
        dispatch('close');
    }

    async function handleSubmit() {
        if (!validateForm()) return;

        loading = true;
        try {
            const data = { name, author, imgsrc };
            if (isEditing) {
                dispatch('submit', { id: book.id, ...data });
            } else {
                dispatch('submit', data);
            }
        } catch (error) {
            console.error('Erro ao salvar livro:', error);
        } finally {
            loading = false;
        }
    }
</script>

{#if show}
    <div class="dialog-overlay" on:click={handleClose} transition:fade>
        <div class="dialog" on:click|stopPropagation>
            <div class="dialog-header">
                <h2>{isEditing ? 'Editar' : 'Novo'} Livro</h2>
                <button class="close-button" on:click={handleClose}>×</button>
            </div>

            <div class="dialog-content">
                <div class="form-group">
                    <label for="name">Nome</label>
                    <input
                        type="text"
                        id="name"
                        bind:value={name}
                        placeholder="Nome do livro"
                        class:error={errors.name}
                    >
                    {#if errors.name}
                        <span class="error-message">{errors.name}</span>
                    {/if}
                </div>

                <div class="form-group">
                    <label for="author">Autor</label>
                    <input
                        type="text"
                        id="author"
                        bind:value={author}
                        placeholder="Nome do autor"
                        class:error={errors.author}
                    >
                    {#if errors.author}
                        <span class="error-message">{errors.author}</span>
                    {/if}
                </div>

                <div class="form-group">
                    <label for="imgsrc">Link da imagem</label>
                    <input
                        type="text"
                        id="imgsrc"
                        bind:value={imgsrc}
                        placeholder="URL da imagem"
                        class:error={errors.imgsrc}
                    >
                    {#if errors.imgsrc}
                        <span class="error-message">{errors.imgsrc}</span>
                    {/if}
                </div>
            </div>

            <div class="dialog-footer">
                <button 
                    class="cancel-button" 
                    on:click={handleClose}
                    disabled={loading}
                >
                    Cancelar
                </button>
                <button 
                    class="save-button" 
                    on:click={handleSubmit}
                    disabled={loading}
                >
                    {loading ? 'Salvando...' : 'Salvar'}
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
        z-index: 1000;
    }

    .dialog {
        background: white;
        border-radius: 8px;
        width: 90%;
        max-width: 500px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        box-sizing: border-box;
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

    .form-group {
        margin-bottom: 1rem;
        box-sizing: border-box;
    }

    .form-group label {
        display: block;
        margin-bottom: 0.5rem;
        color: #333;
    }

    .form-group input {
        width: 100%;
        padding: 0.5rem;
        border: 1px solid #ddd;
        border-radius: 4px;
        font-size: 1rem;
        box-sizing: border-box;
    }

    .form-group input.error {
        border-color: #dc3545;
    }

    .error-message {
        color: #dc3545;
        font-size: 0.875rem;
        margin-top: 0.25rem;
        display: block;
    }

    .dialog-footer {
        padding: 1rem;
        border-top: 1px solid #eee;
        display: flex;
        justify-content: flex-end;
        gap: 1rem;
    }

    .cancel-button, .save-button {
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

    .save-button {
        background-color: rgb(0, 209, 178);
        color: white;
    }

    .cancel-button:hover {
        background-color: #e9ecef;
    }

    .save-button:hover {
        background-color: rgb(0, 188, 160);
    }

    button:disabled {
        opacity: 0.7;
        cursor: not-allowed;
    }
</style> 