import { getCartFromLocalStorage, fetchProduct, saveCartInLocalStorage } from "./shared.js";

let products = [];
const cart = getCartFromLocalStorage();
refreshCart(cart);

document.querySelector('#order').addEventListener('click', (e) => order(e));


// const removeAProductButton = document.querySelector('.deleteItem');
// removeAProductButton.addEventListener('click', () => removeAProduct());
// function storageAvailable(type) {
//     try {
//         var storage = window[type],
//             x = '__storage_test__';
//         storage.setItem(x, x);
//         storage.removeItem(x);
//         return true;
//     }
//     catch(e) {
//         return e instanceof DOMException && (
//             // everything except Firefox
//             e.code === 22 ||
//             // Firefox
//             e.code === 1014 ||
//             // test name field too, because code might not be present
//             // everything except Firefox
//             e.name === 'QuotaExceededError' ||
//             // Firefox
//             e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
//             // acknowledge QuotaExceededError only if there's something already stored
//             storage.length !== 0;
//     }

// }


async function refreshCart(cart) {
    let newHtml = '';
    products = [];
    
    // get product details from API
    await Promise.all(cart.map(async(item) => {
        products.push(await fetchProduct(item.id));
    }));

    const productsDetails = cart.map((item, i) => Object.assign({}, item, products[i]));
        
    // Generate each line
    productsDetails.forEach(product => { 
        const html = renderHtmlForAProduct(product);
        newHtml = newHtml + html;
    });

    let elt = document.getElementById('cart__items');
    elt.innerHTML = newHtml;

    // Add event listener on delete buttons
    const deleteButtons = document.querySelectorAll('.deleteItem');
    deleteButtons.forEach(button => {
        button.addEventListener('click', () => onClickDelete(button));
    });

    const selectItemQuantity = document.querySelectorAll('.itemQuantity');
    selectItemQuantity.forEach(select => {
        select.addEventListener('change', () => updateTotal(select));
    });

    // Sum
    calculateTotal(cart);

}

function calculateTotal(cart) {
    const productsDetails = cart.map((item, i) => Object.assign({}, item, products[i]));

    let totalPrice = 0;
    let totalQuantity = 0;
    productsDetails.forEach(productDetail => {
        const lineCost = productDetail.price * productDetail.quantity;
        totalPrice = totalPrice + lineCost;

        totalQuantity = totalQuantity + productDetail.quantity;
    })
    document.getElementById('totalPrice').innerHTML = totalPrice;
    document.getElementById('totalQuantity').innerHTML = totalQuantity;
}

function renderHtmlForAProduct(product) {
    return `
    <article class="cart__item" data-id="{product-ID}" product-id="${product.id}" product-color="${product.color}"> 
    <div class="cart__item__img">
        <img src="${product.imageUrl}" alt="${product.altTxt}">
    </div>
    <div class="cart__item__content">
        <div class="cart__item__content__titlePrice">
        <h2>${product.name}</h2>
        <p>${product.color}</p>        
        <p>${product.price}€</p>
        </div>
        <div class="cart__item__content__settings">
        <div class="cart__item__content__settings__quantity">
        
            <p>Qté : </p>
            <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${product.quantity}">
        </div>
        <div class="cart__item__content__settings__delete">
            <p class="deleteItem" data-action="delete">Supprimer</p>
        </div>
        </div>
    </div>
    </article>
    `;
}



function onClickDelete(button) {
    const article = button.closest('article'); 
    const productId = article.getAttribute('product-id');
    const productColor = article.getAttribute('product-color');

    const index = cart.findIndex((product) => product.id == productId && product.color == productColor);
    cart.splice(index, 1);
    
    saveCartInLocalStorage(cart);
    article.remove();
    calculateTotal(cart);
}

function updateTotal(select) {
    const article = select.closest('article'); 
    const productId = article.getAttribute('product-id');
    const productColor = article.getAttribute('product-color');
    const newQuantity = parseInt(select.value, 10);
    console.log(productId, productColor, newQuantity)

    const index = cart.findIndex((product) => product.id == productId && product.color == productColor);
    cart[index].quantity = newQuantity;

    saveCartInLocalStorage(cart);
    calculateTotal(cart);

}

async function order(event) {
    event.preventDefault();

    const firstName = document.querySelector('#firstName').value;
    const lastName = document.querySelector('#lastName').value;
    const address = document.querySelector('#address').value;
    const city = document.querySelector('#city').value;
    const email = document.querySelector('#email').value;
    const products = getCartFromLocalStorage().map(product => product.id);

    if (products.length < 1) {
        alert("Votre panier est vide. Veuillez ajouter des articles pour commander.");
    }

    const contact = { firstName, lastName, address, city, email };
    const body = {contact, products};

    const resOrder = await fetch("http://localhost:3000/api/products/order", {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      })
        .then(function(res) {
            if (res.ok) {
                return res.json();
            }
        })
        .catch(function(err) {
            console.error('There is an error on the request.');
        });

    saveCartInLocalStorage([]);

    document.location = './confirmation.html?orderId=' + resOrder.orderId;
}
