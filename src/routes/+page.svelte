<script>
    import Header from '$lib/components/Header.svelte';
    import { goto } from '$app/navigation';
    
    let accessKey = '';
    let isLoading = false;
    let error = null;

    async function handleSubmit() {
        if (!accessKey.trim()) return;

        isLoading = true;
        error = null;

        try {
            const response = await fetch('/api/auth', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ key: accessKey })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Erro ao validar chave de acesso');
            }

            // Redireciona para a página principal
            goto('/mybooks');
        } catch (err) {
            error = err.message;
        } finally {
            isLoading = false;
        }
    }
</script>

<Header title="Leitura" />

<main class="container">
    <div class="login-container">
        <h1>Bem-vindo à Leitura</h1>
        <p class="description">
            Acompanhe sua jornada literária de forma simples e elegante
        </p>
        
        <form class="input-group" on:submit|preventDefault={handleSubmit}>
            <input
                type="text"
                bind:value={accessKey}
                placeholder="Digite sua chave de acesso"
                class="access-key-input"
                disabled={isLoading}
            />
            <button 
                class="access-button" 
                type="submit"
                disabled={isLoading}
            >
                {#if isLoading}
                    <div class="loading-spinner"></div>
                {:else}
                    Acessar
                {/if}
            </button>

            {#if error}
                <p class="error-message">{error}</p>
            {/if}
        </form>

        <p class="help-text">
            Para acessar o Leitura, você precisa de uma chave de acesso.
        </p>
    </div>
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
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: calc(100vh - 200px);
    }

    .login-container {
        background: white;
        padding: 2rem;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        width: 100%;
        max-width: 400px;
        text-align: center;
    }

    h1 {
        margin: 0 0 1rem;
        color: #333;
        font-size: 2rem;
    }

    .description {
        color: #666;
        margin-bottom: 2rem;
    }

    .input-group {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        margin-bottom: 1.5rem;
    }

    .access-key-input {
        padding: 0.75rem 1rem;
        border: 1px solid #ddd;
        border-radius: 4px;
        font-size: 1rem;
        width: 100%;
        box-sizing: border-box;
        transition: border-color 0.2s ease;
    }

    .access-key-input:focus {
        outline: none;
        border-color: #666;
    }

    .access-key-input:disabled {
        background-color: #f5f5f5;
        cursor: not-allowed;
    }

    .access-button {
        padding: 0.75rem 1rem;
        background-color: #333;
        color: white;
        border: none;
        border-radius: 4px;
        font-size: 1rem;
        cursor: pointer;
        transition: background-color 0.2s ease;
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 2.75rem;
    }

    .access-button:hover:not(:disabled) {
        background-color: #444;
    }

    .access-button:disabled {
        opacity: 0.7;
        cursor: not-allowed;
    }

    .help-text {
        color: #888;
        font-size: 0.875rem;
        margin: 0;
    }

    .error-message {
        color: #dc3545;
        font-size: 0.875rem;
        margin: 0;
    }

    .loading-spinner {
        width: 20px;
        height: 20px;
        border: 2px solid #ffffff;
        border-top: 2px solid transparent;
        border-radius: 50%;
        animation: spin 1s linear infinite;
    }

    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }

    @media (max-width: 480px) {
        .login-container {
            padding: 1.5rem;
            margin: 1rem;
        }

        h1 {
            font-size: 1.5rem;
        }
    }
</style> 