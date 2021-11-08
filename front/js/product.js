import { getCartFromLocalStorage, fetchProduct, saveCartInLocalStorage } from "./shared.js";

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

    fetchProduct(id)
        // On récupère les valeurs de l'api du produit
        .then(function(value) {
            pageProduct(value);
            imgProduct(value);
            priceProduct(value);
            descriptionProduct(value);
            updateColors(value.colors);
        })

}

// On appelle les id depuis l'html, pour définir leur nouvelle valeur depuis le DOM
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
// On ajoute dans l'html une nouvelle entrée "<option></option>" pour chaque couleur récupérer dans le DOM
function updateColors(colors) {
    let html = `<option value="">--SVP, choisissez une couleur --</option>`;

    colors.forEach(color => {
      html = html + `<option value="${color}">${color}</option>`
})
  const select = document.querySelector('#colors');
  select.innerHTML = html;
}


function addToCart() {
    const cart = getCartFromLocalStorage();
    const entry = createEntryForCart();

    if (!isEntryValidAndDisplayErrors(entry)) {
        return;
    }

    // Pour un produit de même couleur et de même id déjà présent dans le panier
    // > on l'ajoute à la quantité existante
    cart.forEach(item => {
        if (entry.id === item.id && entry.color === item.color) {
            entry.quantity = entry.quantity + item.quantity
        }
    });

    upsertProduct(cart, entry);

    saveCartInLocalStorage(cart);
}

// On spécifie les valeurs du produit qu'on ajoute au panier
function createEntryForCart() {
    const color = document.querySelector('#colors').value;
    const quantity = parseInt(document.querySelector('#quantity').value, 10);
    
    return {
        id,
        color,
        quantity
    };   
}

function isEntryValidAndDisplayErrors(entry) {
    const errors = [];

    if (entry.quantity == 0 || entry.quantity < 0 || isNaN(entry.quantity)) {
        errors.push('Quantité saisie incorrecte')
    }

    if (entry.color == '') {
        errors.push('Couleur manquante');
    }

    if (errors.length > 0) {
        alert(errors.join(', '));
        return false;
    }

    alert('Ajout au panier réussi !')
    return true;
    
}

// function alreadyEntry(entry) {
//     if (entry.color&entry.id === entry.color&entry.id) {
//         entry.quantity += entry.quantity
//         return;
//     }
    
// }

function upsertProduct(array, item) {
    const i = array.findIndex(_item => 
        _item.id === item.id && _item.color === item.color
    );
    if (i > -1) array[i] = item;
    else array.push(item);
}