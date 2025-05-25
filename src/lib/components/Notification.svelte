<script>
    import { fade, fly } from 'svelte/transition';

    export let message = '';
    export let type = 'success';
    export let duration = 3000;

    let visible = true;

    // Auto-hide after duration
    if (duration > 0) {
        setTimeout(() => {
            visible = false;
        }, duration);
    }
</script>

{#if visible}
    <div 
        class="notification"
        class:success={type === 'success'}
        class:error={type === 'error'}
        transition:fly={{ y: 50, duration: 200 }}
    >
        <span class="icon">
            {#if type === 'success'}
                ✓
            {:else if type === 'error'}
                ✕
            {/if}
        </span>
        <span class="message">{message}</span>
    </div>
{/if}

<style>
    .notification {
        position: fixed;
        bottom: 2rem;
        left: 50%;
        transform: translateX(-50%);
        padding: 1rem 2rem;
        border-radius: 8px;
        display: flex;
        align-items: center;
        gap: 0.75rem;
        color: white;
        font-size: 0.9rem;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 1200;
    }

    .success {
        background-color: rgb(0, 209, 178);
    }

    .error {
        background-color: #dc3545;
    }

    .icon {
        font-size: 1.2em;
        font-weight: bold;
    }

    .message {
        font-weight: 500;
    }
</style> 