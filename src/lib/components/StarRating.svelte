<script>
    import { createEventDispatcher } from 'svelte';
    
    /** @type {number} */
    export let rating = 0;
    /** @type {boolean} */
    export let readonly = true;
    
    const dispatch = createEventDispatcher();
    
    // Converte o rating (0-10) para um array de 5 estrelas
    // Cada estrela representa 2 pontos
    // Números ímpares resultam em meia estrela
    $: stars = Array(5).fill(0).map((_, index) => {
        const starValue = rating - (index * 2);
        if (starValue >= 2) return 1;     // estrela cheia (2 pontos)
        if (starValue === 1) return 0.5;  // meia estrela (1 ponto)
        return 0;                         // estrela vazia (0 pontos)
    });

    // Converte o rating de 0-10 para 0-5
    $: ratingInFive = (rating / 2).toFixed(1);

    let hoverRating = 0;

    function handleStarClick(index) {
        if (readonly) return;
        const newRating = (index + 1) * 2;
        dispatch('ratingChange', newRating);
    }

    function handleStarHover(index) {
        if (readonly) return;
        hoverRating = (index + 1) * 2;
    }

    function handleMouseLeave() {
        if (readonly) return;
        hoverRating = 0;
    }
</script>

<div 
    class="star-rating" 
    class:interactive={!readonly}
    title="{ratingInFive}/5"
    on:mouseleave={handleMouseLeave}
>
    {#each stars as star, index}
        <span 
            class="star"
            on:click={() => handleStarClick(index)}
            on:mouseenter={() => handleStarHover(index)}
        >
            {#if hoverRating > 0}
                {#if hoverRating > index * 2}
                    <span class="full hover">★</span>
                {:else}
                    <span class="empty hover">☆</span>
                {/if}
            {:else}
                {#if star === 1}
                    <span class="full">★</span>
                {:else if star === 0.5}
                    <span class="empty">☆</span>
                    <span class="half">★</span>
                {:else}
                    <span class="empty">☆</span>
                {/if}
            {/if}
        </span>
    {/each}
</div>

<style>
    .star-rating {
        display: flex;
        gap: 2px;
        color: #ffd700;
        font-size: 1.2rem;
        line-height: 1;
    }

    .star-rating.interactive .star {
        cursor: pointer;
    }

    .star {
        display: inline-block;
        position: relative;
        width: 1.2rem;
        height: 1.2rem;
    }

    .empty, .full, .half {
        position: absolute;
        left: 0;
        top: 0;
        transition: transform 0.2s;
    }

    .half {
        width: 50%;
        overflow: hidden;
    }

    .empty {
        color: #ffd700;
        opacity: 0.3;
    }

    .interactive .star:hover .full,
    .interactive .star:hover ~ .star .full {
        transform: scale(1.1);
    }

    .hover {
        transform: scale(1.1);
    }
</style> 