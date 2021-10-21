const params = new URLSearchParams(window.location.search);
const id = params.get('id');

// On écoute le changement de valeur du select
const select = document.querySelector('#colors');
select.addEventListener('change', () => console.log(select.value));

const addToCartButton = document.querySelector('#addToCart');
addToCartButton.addEventListener('click', () => addToCart());

initPage();



// On récupère ici l'api des produits
function initPage() {
    fetch(`http://localhost:3000/api/products/${id}`)
        .then(function(res) {
            if (res.ok) {
                return res.json();
            }
        })

        .then(function(value) {
            pageProduct(value);
            imgProduct(value);
            priceProduct(value);
            descriptionProduct(value);
            updateColors(value.colors);
        })
        
        .catch(function(err) {
            console.error('There is an error on the request.');
        });

}

function pageProduct(product) {
    const elt = document.querySelector('#title');
    elt.innerHTML = product.name;
}

function imgProduct(product) { 
    const elt = document.querySelector('.item__img');
    elt.innerHTML = `<img src="${product.imageUrl}" alt="${product.altTxt}">`;
}


function priceProduct(product) {
    const elt = document.querySelector('#price');
    elt.innerHTML = product.price;
}

function descriptionProduct(product) {
    const elt = document.querySelector('#description');
    elt.innerHTML = product.description;
}

function updateColors(colors) {
    let html = `<option value="">--SVP, choisissez une couleur --</option>`;

    colors.forEach(color => {
      html = html + `<option value="${color}">${color}</option>`
})

  const select = document.querySelector('#colors');
  select.innerHTML = html;
}


function addToCart() {
    const cart = getCart();
    const entry = createEntryForCart();

    if (!isEntryValid(entry)) {
        return;
    }

    cart.push(entry);
    // +
    
    localStorage.setItem('cart', JSON.stringify(cart));

}

function getCart() {
    const cartJson = localStorage.getItem('cart');
    if (cartJson) {
        return JSON.parse(cartJson);
    }
    return [];

    // return cartJson ? JSON.parse(cartJson) : [];
}

function createEntryForCart() {
    const color = document.querySelector('#colors').value;
    const quantity = document.querySelector('#quantity').value;

    return {
        id,
        color,
        quantity
    };   
}

function isEntryValid(entry) {
    if (entry.quantity == 0) {
        return false;
    }

    if (entry.color == '') {
        return false;
    }

    return true;
}

