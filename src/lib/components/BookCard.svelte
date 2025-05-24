<script>
    export let name;
    export let author;
    export let imgsrc;
</script>

<div class="book-card">
    <img src={imgsrc} alt={name} class="book-cover">
    <div class="book-info">
        <h3 class="book-title">{name}</h3>
        <p class="book-author">{author}</p>
    </div>
</div>

<style>
    .book-card {
        background: white;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        transition: transform 0.2s;
    }

    .book-card:hover {
        transform: translateY(-5px);
    }

    .book-cover {
        width: 100%;
        height: 300px;
        object-fit: cover;
    }

    .book-info {
        padding: 1rem;
    }

    .book-title {
        font-size: 1rem;
        font-weight: 600;
        margin-bottom: 0.5rem;
    }

    .book-author {
        font-size: 0.9rem;
        color: #666;
    }
</style> 