import {
  cart,
  addToCart,
  getCartQuantity
} from '../data/cart.js';

import {
  products,
  loadProductsFetch
} from '../data/products.js';

const grid = document.querySelector('.js-products-grid');
const searchInput = document.querySelector('.search-bar');
const searchButton = document.querySelector('.search-button');

function updateCartQuantity() {
  const cartElement = document.querySelector('.js-cart-quantity');

  if (cartElement) {
    cartElement.textContent = getCartQuantity();
  }
}

function renderProducts(searchTerm = '') {
  const term = searchTerm.trim().toLowerCase();

  const filteredProducts = products.filter((product) => {
    const searchableText = [
      product.name,
      ...(product.keywords || [])
    ].join(' ').toLowerCase();

    return searchableText.includes(term);
  });

  if (filteredProducts.length === 0) {
    grid.innerHTML = `
      <p class="empty-search-message">
        No products found. Try another search.
      </p>
    `;
    return;
  }

  grid.innerHTML = filteredProducts.map((product) => `
    <div class="product-container">
      <div class="product-image-container">
        <img
          class="product-image"
          src="${product.image}"
          alt="${product.name}"
          loading="lazy"
        >
      </div>

      <div class="product-name limit-text-to-2-lines">
        ${product.name}
      </div>

      <div class="product-rating-container">
        <img
          class="product-rating-stars"
          src="${product.getStarsUrl()}"
          alt="${product.rating.stars} out of 5 stars"
        >
        <span class="product-rating-count">
          ${product.rating.count}
        </span>
      </div>

      <div class="product-price">${product.getPrice()}</div>

      <div class="product-quantity-container">
        <label>
          Quantity
          <select class="js-quantity">
            ${Array.from({ length: 10 }, (_, i) => `
              <option value="${i + 1}">${i + 1}</option>
            `).join('')}
          </select>
        </label>
      </div>

      ${product.extraInfoHTML()}

      <div class="product-spacer"></div>

      <div class="added-to-cart" aria-live="polite">
        <img src="images/icons/checkmark.png" alt="">
        Added to cart
      </div>

      <button
        class="add-to-cart-button button-primary js-add-to-cart"
        data-product-id="${product.id}"
      >
        Add to Cart
      </button>
    </div>
  `).join('');

  grid.querySelectorAll('.js-add-to-cart').forEach((button) => {
    button.addEventListener('click', () => {
      const productId = button.dataset.productId;
      const card = button.closest('.product-container');
      const quantity = Number(card.querySelector('.js-quantity').value);

      addToCart(productId, quantity);
      updateCartQuantity();

      const message = card.querySelector('.added-to-cart');
      message.style.opacity = '1';

      button.textContent = 'Added!';
      window.setTimeout(() => {
        message.style.opacity = '0';
        button.textContent = 'Add to Cart';
      }, 1500);
    });
  });
}

searchInput.addEventListener('input', () => {
  renderProducts(searchInput.value);
});

searchButton.addEventListener('click', () => {
  renderProducts(searchInput.value);
});

searchInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    renderProducts(searchInput.value);
  }
});

async function init() {
  try {
    await loadProductsFetch();
    renderProducts();
    updateCartQuantity();
  } catch (error) {
    grid.innerHTML = `
      <p class="empty-search-message">
        Products could not be loaded. Please refresh the page.
      </p>
    `;
    console.error(error);
  }
}

init();