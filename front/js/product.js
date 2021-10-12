const params = new URLSearchParams(window.location.search);
const id = params.get('id');

// On écoute le changement de valeur du select
const select = document.querySelector('#colors');
select.addEventListener('change', () => console.log(select.value));

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

function priceProduct(product) {
    const elt = document.querySelector('#price');
    elt.innerHTML = product.price;
}

function descriptionProduct (product) {
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
