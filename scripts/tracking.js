import { orders } from '../data/orders.js';
import { loadProductsFetch, getProduct } from '../data/products.js';
import { getCartQuantity } from '../data/cart.js';

const container = document.querySelector('.js-tracking-content');
const params = new URLSearchParams(window.location.search);
const orderId = params.get('orderId');
const productId = params.get('productId');

async function init() {
  try {
    await loadProductsFetch();

    const cartQuantity = document.querySelector('.js-cart-quantity');
    if (cartQuantity) {
      cartQuantity.textContent = getCartQuantity();
    }

    const order = orders.find((item) => item.id === orderId);
    const orderedItem = order?.products.find(
      (item) => item.productId === productId
    );
    const product = getProduct(productId);

    if (!order || !orderedItem || !product) {
      container.innerHTML = `
        <h2>Tracking information not found</h2>
        <p>Open tracking from one of your saved orders.</p>
        <a href="orders.html">Back to your orders</a>
      `;
      return;
    }

    const arrivalDate = new Date(
      orderedItem.estimatedDeliveryTimeMs
    ).toLocaleDateString();

    container.innerHTML = `
      <a class="back-to-orders-link link-primary" href="orders.html">
        View all orders
      </a>

      <div class="delivery-date">
        Estimated arrival: ${arrivalDate}
      </div>

      <div class="product-info">${product.name}</div>
      <div class="product-info">Quantity: ${orderedItem.quantity}</div>

      <img
        class="product-image"
        src="${product.image}"
        alt="${product.name}"
      >

      <p class="tracking-demo-note">
        Demo tracking status — this is not connected to a real courier.
      </p>

      <div class="progress-labels-container">
        <div class="progress-label">Preparing</div>
        <div class="progress-label current-status">Shipped</div>
        <div class="progress-label">Delivered</div>
      </div>

      <div class="progress-bar-container">
        <div class="progress-bar"></div>
      </div>
    `;
  } catch (error) {
    console.error(error);
    container.textContent = 'Could not load tracking information.';
  }
}

init();