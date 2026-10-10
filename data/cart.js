export let cart = [];

loadFromStorage();

export function loadFromStorage() {
  try {
    const savedCart = JSON.parse(localStorage.getItem('cart'));
    cart = Array.isArray(savedCart) ? savedCart : [];
  } catch {
    cart = [];
  }
}

function saveToStorage() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

export function addToCart(productId, quantity = 1) {
  const amount = Number(quantity);

  if (!productId || !Number.isInteger(amount) || amount < 1) {
    return;
  }

  const matchingItem = cart.find(
    (item) => item.productId === productId
  );

  if (matchingItem) {
    matchingItem.quantity += amount;
  } else {
    cart.push({
      productId,
      quantity: amount,
      deliveryOptionId: '1'
    });
  }

  saveToStorage();
}

export function removeFromCart(productId) {
  cart = cart.filter((item) => item.productId !== productId);
  saveToStorage();
}

export function updateDeliveryOption(productId, deliveryOptionId) {
  const item = cart.find(
    (cartItem) => cartItem.productId === productId
  );

  if (!item) return;

  item.deliveryOptionId = deliveryOptionId;
  saveToStorage();
}

export function clearCart() {
  cart = [];
  saveToStorage();
}

export function getCartQuantity() {
  return cart.reduce((total, item) => total + item.quantity, 0);
}