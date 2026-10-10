import { getCartQuantity } from '../data/cart.js';
import { loadProductsFetch } from '../data/products.js';
import { renderOrderSummary } from './checkout/orderSummary.js';
import { renderPaymentSummary } from './checkout/paymentSummary.js';

async function loadPage() {
  const orderSummary = document.querySelector('.js-order-summary');

  try {
    await loadProductsFetch();

    const quantityElement = document.querySelector('.js-checkout-quantity');
    if (quantityElement) {
      quantityElement.textContent = getCartQuantity();
    }

    renderOrderSummary();
    renderPaymentSummary();
  } catch (error) {
    console.error('Checkout could not load:', error);

    orderSummary.textContent =
      'Checkout could not load. Please refresh the page.';
  }
}

loadPage();