async function addComment(productId) {
    const name = document.getElementById('commentName').value;
    const email = document.getElementById('commentEmail').value;
    const body = document.getElementById('commentBody').value;

    if (!name || !email || !body) {
        alert('Пожалуйста, заполните все поля');
        return;
    }

    try {
        const response = await axios.post(`/api/comments`, {
            productId,
            name,
            email,
            body
        });

        if (response.status === 200) {
            alert('Комментарий добавлен');
            document.getElementById('commentName').value = '';
            document.getElementById('commentEmail').value = '';
            document.getElementById('commentBody').value = '';
            // Reload page to show new comment
            location.reload();
        }
    } catch (error) {
        console.error('Error adding comment:', error);
        alert('Ошибка при добавлении комментария');
    }
}

function filterProducts() {
    const searchInput = document.getElementById('titleFilter');
    const minPrice = document.getElementById('minPrice');
    const maxPrice = document.getElementById('maxPrice');

    if (!searchInput) return;

    const query = new URLSearchParams({
        search: searchInput.value,
        minPrice: minPrice ? minPrice.value : '',
        maxPrice: maxPrice ? maxPrice.value : ''
    }).toString();

    window.location.href = `/products-list?${query}`;
}
