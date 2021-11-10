hydrateOrderId();

function hydrateOrderId() {
    const params = new URLSearchParams(window.location.search);
    const orderId = params.get('orderId');
    document.querySelector('#orderId').innerHTML = orderId;
}