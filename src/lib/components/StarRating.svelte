<script>
    /** @type {number} */
    export let rating = 0;
    
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
</script>

<div class="star-rating" title="{ratingInFive}/5">
    {#each stars as star}
        <span class="star">
            {#if star === 1}
                <span class="full">★</span>
            {:else if star === 0.5}
                <span class="empty">☆</span>
                <span class="half">★</span>
            {:else}
                <span class="empty">☆</span>
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

    .star {
        display: inline-block;
        cursor: help;
        position: relative;
        width: 1.2rem;
        height: 1.2rem;
    }

    .empty, .full, .half {
        position: absolute;
        left: 0;
        top: 0;
    }

    .half {
        width: 50%;
        overflow: hidden;
    }

    .empty {
        color: #ffd700;
        opacity: 0.3;
    }
</style> 