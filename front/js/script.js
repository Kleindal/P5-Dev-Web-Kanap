
initPage();

// On récupère ici l'api des produits
function initPage() {
fetch('http://localhost:3000/api/products')
    .then(function(res) {
        if (res.ok) {
            return res.json();
        }
    })
    .then(function(value) {
        refreshItems(value);
    })
    .catch(function(err) {
        console.error('There is an error on the request.');
    });
}

function refreshItems(items) {
    let newHtml = '';
    items.forEach(item => {
        const html = renderVignet(item);
        newHtml = newHtml + html;
    });

    let elt = document.getElementById('items');
    elt.innerHTML = newHtml;
}

function renderVignet(product) {
    return `
    <a href="./product.html?id=${product._id}">
    <article>
      <img src="${product.imageUrl}" alt="${product.altTxt}">
      <h3 class="productName">${product.name}</h3>
      <p class="productDescription">${product.description}</p>
    </article>
  </a>
  `
}

