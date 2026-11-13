/* =========================================================
   cart.js — the shopping cart, saved in localStorage
   (vanilla JavaScript; used on every page because of the
   cart badge in the menu)

   One cart line looks like this:
   { key: 'raf|350 ml · No sugar', id: 'raf', name: 'Raf',
     details: '350 ml · No sugar', price: 1290, qty: 1, image: 'images/raf.jpg' }
   ========================================================= */

const CART_KEY = 'zebraCart';

// Read the cart from localStorage. If nothing is saved yet -> empty array.
function getCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  } catch (error) {
    return []; // saved text was broken — start with an empty cart
  }
}

// Save the whole cart array back to localStorage (as a JSON string).
function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartBadge(true);
}

// Build one cart line from a menu item and the chosen options.
// choice = { sizeIndex: 0-2, sugar: 'No sugar', option: 'Mango', qty: 1 } — everything optional
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

// Add a drink/dessert. The same drink with the same options is merged into one line.
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

// +1 / -1 for one line. If quantity becomes 0, the line is removed.
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

// Total number of items (2 Cinnabons + 1 Raf = 3)
function getCartCount() {
  return getCart().reduce(function (sum, item) { return sum + item.qty; }, 0);
}

// Sum of all lines in tenge, before discounts
function getCartSubtotal() {
  return getCart().reduce(function (sum, item) { return sum + item.price * item.qty; }, 0);
}

// Update the yellow number next to "Cart" in the menu (on every page).
function updateCartBadge(withBump) {
  const count = getCartCount();
  document.querySelectorAll('.cart-badge').forEach(function (badge) {
    badge.textContent = count;
    if (withBump) {
      badge.classList.remove('bump');
      void badge.offsetWidth;        // restart the CSS animation
      badge.classList.add('bump');
    }
  });
  document.querySelectorAll('.cart-link').forEach(function (link) {
    link.setAttribute('aria-label', 'Cart, ' + count + ' items');
  });
}
