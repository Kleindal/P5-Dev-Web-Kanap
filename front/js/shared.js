export function getCartFromLocalStorage() {
    const cartJson = localStorage.getItem('cart');
    if (cartJson) {
        return JSON.parse(cartJson);
    }
    return [];
    // return cartJson ? JSON.parse(cartJson) : [];
}

export function saveCartInLocalStorage(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
}

export async function fetchProduct(id) {
    return await fetch(`http://localhost:3000/api/products/${id}`)
        .then(function(res) {
            if (res.ok) {
                return res.json();
            }
        })
        .catch(function(err) {
            console.error('There is an error on the request.');
        });
}