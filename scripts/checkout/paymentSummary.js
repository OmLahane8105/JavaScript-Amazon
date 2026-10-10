import { cart, clearCart, getCartQuantity } from '../../data/cart.js';
import { getProduct } from '../../data/products.js';
import { getDeliveryOption } from '../../data/deliveryOptions.js';
import { formatCurrency } from '../utils/money.js';
import { addOrder } from '../../data/orders.js';

export function renderPaymentSummary() {
  const summaryElement = document.querySelector('.js-payment-summary');

  if (cart.length === 0) {
    summaryElement.innerHTML = `
      <div class="payment-summary-title">Order Summary</div>
      <p>Your cart is empty.</p>
      <a href="amazon.html">Continue shopping</a>
    `;
    return;
  }

  let productPriceCents = 0;
  let shippingPriceCents = 0;

  cart.forEach((item) => {
    const product = getProduct(item.productId);

    if (!product) return;

    productPriceCents += product.priceCents * item.quantity;

    const delivery = getDeliveryOption(item.deliveryOptionId);
    shippingPriceCents += delivery.priceCents;
  });

  const totalBeforeTaxCents = productPriceCents + shippingPriceCents;
  const taxCents = Math.round(totalBeforeTaxCents * 0.1);
  const totalCents = totalBeforeTaxCents + taxCents;

  summaryElement.innerHTML = `
    <div class="payment-summary-title">Order Summary</div>

    <div class="payment-summary-row">
      <div>Items (${getCartQuantity()}):</div>
      <div class="payment-summary-money">
        $${formatCurrency(productPriceCents)}
      </div>
    </div>

    <div class="payment-summary-row">
      <div>Shipping &amp; handling:</div>
      <div class="payment-summary-money">
        $${formatCurrency(shippingPriceCents)}
      </div>
    </div>

    <div class="payment-summary-row subtotal-row">
      <div>Total before tax:</div>
      <div class="payment-summary-money">
        $${formatCurrency(totalBeforeTaxCents)}
      </div>
    </div>

    <div class="payment-summary-row">
      <div>Estimated tax (10% demo):</div>
      <div class="payment-summary-money">
        $${formatCurrency(taxCents)}
      </div>
    </div>

    <div class="payment-summary-row total-row">
      <div>Order total:</div>
      <div class="payment-summary-money">
        $${formatCurrency(totalCents)}
      </div>
    </div>

    <button class="place-order-button button-primary js-place-order">
      Place demo order
    </button>

    <p class="checkout-note">
      Demo only. No payment will be collected.
    </p>
  `;

  document.querySelector('.js-place-order').addEventListener('click', (event) => {
    const button = event.currentTarget;

    if (cart.length === 0) return;

    button.disabled = true;
    button.textContent = 'Placing order...';

    const order = {
      id: crypto.randomUUID
        ? crypto.randomUUID()
        : `order-${Date.now()}`,
      orderTimeMs: Date.now(),
      totalCents,
      products: cart.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        estimatedDeliveryTimeMs:
          Date.now() +
          getDeliveryOption(item.deliveryOptionId).deliveryDays *
            24 * 60 * 60 * 1000
      }))
    };

    try {
      addOrder(order);
      clearCart();
      window.location.href = 'orders.html';
    } catch (error) {
      console.error('Could not save the order:', error);
      button.disabled = false;
      button.textContent = 'Try again';
    }
  });
}