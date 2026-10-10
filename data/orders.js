function loadOrders() {
  try {
    const savedOrders = JSON.parse(localStorage.getItem('orders'));
    return Array.isArray(savedOrders) ? savedOrders : [];
  } catch (error) {
    console.error('Could not read saved orders:', error);
    return [];
  }
}

export const orders = loadOrders();

export function addOrder(order) {
  orders.unshift(order);

  try {
    localStorage.setItem('orders', JSON.stringify(orders));
  } catch (error) {
    orders.shift();
    throw new Error('Could not save the order. Check browser storage.', {
      cause: error
    });
  }
}