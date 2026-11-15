
const CART_KEY = 'zebraCart';

function getCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  } catch (error) {
    return []; 
  }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartBadge(true);
}

function makeCartLine(item, choice) {
  choice = choice || {};
  const sizeIndex = choice.sizeIndex || 0;
  const parts = [];

  if (item.sizes) parts.push(sizeNames[sizeIndex]);
  if (item.options) parts.push(choice.option || item.options[0]);
  if (item.sugar) parts.push(choice.sugar || 'No sugar');

  const details = parts.join(' · ');
  return {
    key: item.id + '|' + details,
    id: item.id,
    name: item.name,
    details: details,
    price: item.sizes ? item.sizes[sizeIndex] : item.price,
    qty: choice.qty || 1,
    image: item.image
  };
}

function addToCart(line) {
  const cart = getCart();
  const existing = cart.find(function (item) { return item.key === line.key; });

  if (existing) {
    existing.qty += line.qty;
  } else {
    cart.push(line);
  }
  saveCart(cart);
}

function changeQty(key, delta) {
  const cart = getCart()
    .map(function (item) {
      if (item.key === key) item.qty += delta;
      return item;
    })
    .filter(function (item) { return item.qty > 0; });
  saveCart(cart);
}

function removeFromCart(key) {
  const cart = getCart().filter(function (item) { return item.key !== key; });
  saveCart(cart);
}

function clearCart() {
  saveCart([]);
}

function getCartCount() {
  return getCart().reduce(function (sum, item) { return sum + item.qty; }, 0);
}

function getCartSubtotal() {
  return getCart().reduce(function (sum, item) { return sum + item.price * item.qty; }, 0);
}

function updateCartBadge(withBump) {
  const count = getCartCount();
  document.querySelectorAll('.cart-badge').forEach(function (badge) {
    badge.textContent = count;
    if (withBump) {
      badge.classList.remove('bump');
      void badge.offsetWidth;        
      badge.classList.add('bump');
    }
  });
  document.querySelectorAll('.cart-link').forEach(function (link) {
    link.setAttribute('aria-label', 'Cart, ' + count + ' items');
  });
}
