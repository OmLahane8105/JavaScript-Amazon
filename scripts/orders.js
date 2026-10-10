import { orders } from '../data/orders.js';
import { products, loadProductsFetch, getProduct } from '../data/products.js';
import { formatCurrency } from './utils/money.js';
import { getCartQuantity, addToCart } from '../data/cart.js';

const ordersGrid = document.querySelector('.js-orders-grid');

function renderOrders() {
  const cartQuantity = document.querySelector('.js-cart-quantity');

  if (cartQuantity) {
    cartQuantity.textContent = getCartQuantity();
  }

  if (orders.length === 0) {
    ordersGrid.innerHTML = `
      <div class="empty-orders">
        <h2>You haven't placed any orders yet.</h2>
        <a href="amazon.html">Start shopping</a>
      </div>
    `;
    return;
  }

  ordersGrid.innerHTML = orders.map((order) => {
    const orderDate = new Date(order.orderTimeMs).toLocaleDateString();

    const productsHTML = order.products.map((item) => {
      const product = getProduct(item.productId);

      if (!product) return '';

      const arrivalDate = new Date(
        item.estimatedDeliveryTimeMs
      ).toLocaleDateString();

      return `
        <div class="order-details-grid">
          <div class="product-image-container">
            <img src="${product.image}" alt="${product.name}">
          </div>

          <div class="product-details">
            <div class="product-name">${product.name}</div>
            <div class="product-delivery-date">
              Arriving by: ${arrivalDate}
            </div>
            <div class="product-quantity">
              Quantity: ${item.quantity}
            </div>

            <button
              class="button-primary buy-again-button"
              data-product-id="${product.id}"
              data-quantity="${item.quantity}"
            >
              Buy it again
            </button>
          </div>

          <div class="product-actions">
            <a href="tracking.html?orderId=${encodeURIComponent(order.id)}&productId=${encodeURIComponent(product.id)}">
              <button class="button-secondary track-package-button">
                Track package
              </button>
            </a>
          </div>
        </div>
      `;
    }).join('');

    return `
      <section class="order-container">
        <div class="order-header">
          <div class="order-header-left-section">
            <div class="order-date">
              <div class="order-header-label">Order placed:</div>
              <div>${orderDate}</div>
            </div>
            <div class="order-total">
              <div class="order-header-label">Total:</div>
              <div>$${formatCurrency(order.totalCents)}</div>
            </div>
          </div>

          <div class="order-header-right-section">
            <div class="order-header-label">Order ID:</div>
            <div>${order.id}</div>
          </div>
        </div>

        ${productsHTML}
      </section>
    `;
  }).join('');

  ordersGrid.querySelectorAll('.buy-again-button').forEach((button) => {
    button.addEventListener('click', () => {
      addToCart(
        button.dataset.productId,
        Number(button.dataset.quantity)
      );
      window.location.href = 'checkout.html';
    });
  });
}

async function init() {
  try {
    await loadProductsFetch();
    renderOrders();
  } catch (error) {
    console.error(error);
    ordersGrid.textContent = 'Could not load your orders. Please refresh.';
  }
}

init();