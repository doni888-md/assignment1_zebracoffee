/* =========================================================
   data.js — shared data (used by Home, Menu and Cart)
   Arrays with data + 3 tiny helper functions at the bottom.
   ========================================================= */

// Every item on the menu.
// "sizes" = price for 250 / 350 / 480 ml. Items without sizes have one "price".
const menuItems = [
  // ----- Hot drinks -----
  { id: 'espresso', name: 'Espresso', category: 'hot', taste: 'Short and strong, 30 ml', price: 900, image: 'images/americanoespresso.jpg', sugar: true },
  { id: 'americano', name: 'Americano', category: 'hot', taste: 'Espresso and hot water', sizes: [790, 890, 990], image: 'images/americanoespresso.jpg', sugar: true },
  { id: 'cappuccino', name: 'Cappuccino', category: 'hot', taste: 'Thick foam, classic', sizes: [990, 1040, 1090], image: 'images/cappuccinolatte.jpg', sugar: true },
  { id: 'latte', name: 'Latte', category: 'hot', taste: 'More milk, mild and soft', sizes: [990, 1040, 1090], image: 'images/cappuccinolatte.jpg', sugar: true },
  { id: 'raf', name: 'Raf', category: 'hot', taste: 'Creamy, vanilla, very soft', sizes: [1190, 1290, 1390], image: 'images/raf.jpg', badge: 'Hit' },
  { id: 'flat-white', name: 'Flat White', category: 'hot', taste: 'Double ristretto, velvet milk', sizes: [1090, 1190, 1290], image: 'images/flatwhite.jpg', badge: 'Hit' },
  { id: 'hot-chocolate', name: 'Hot Chocolate', category: 'hot', taste: 'Thick and chocolatey', price: 990, image: 'images/IMG_0932.jpg' },
  { id: 'cocoa', name: 'Cocoa', category: 'hot', taste: 'Light, milky, cozy', price: 990, image: 'images/IMG_0932.jpg' },

  // ----- Cold drinks -----
  { id: 'iced-latte', name: 'Ice Latte', category: 'cold', taste: 'Cold latte with your syrup', price: 1290, image: 'images/IMG_0931.jpg',
    optionLabel: 'Flavor / Syrup', options: ['Pomegranate', 'Raspberry', 'Mango', 'Cherry', 'Mint', 'Blackcurrant'] },
  { id: 'espresso-tonic', name: 'Espresso Tonic', category: 'cold', taste: 'Espresso over sparkling tonic', price: 1290, image: 'images/IMG_0753.jpg' },
  { id: 'limonade', name: 'Limonade', category: 'cold', taste: 'Fresh, fizzy, fruity', price: 990, image: 'images/IMG_0930.jpg',
    optionLabel: 'Flavor', options: ['Pomegranate-Rose', 'Strawberry-Watermelon', 'Tropical', 'Taiga Berries'] },
  { id: 'matcha', name: 'Matcha', category: 'cold', taste: 'Green, blue or mango', price: 1090, image: 'images/IMG_0754.jpg', badge: 'New',
    optionLabel: 'Type', options: ['Green Matcha', 'Blue Matcha', 'Mango Green Matcha'] },
  { id: 'frappe', name: 'Frappe', category: 'cold', taste: 'Blended ice and coffee', price: 1590, image: 'images/IMG_0929.jpg',
    optionLabel: 'Flavor', options: ['Chocolate', 'Salted Caramel', 'Hazelnut'] },

  // ----- Desserts -----
  { id: 'cinnabon', name: 'Cinnabon', category: 'desserts', taste: 'Warm roll, cream cheese', price: 990, image: 'images/IMG_0757.jpg' },
  { id: 'spanish-cheesecake', name: 'Spanish Cheesecake', category: 'desserts', taste: 'Creamy, not too sweet', price: 1390, image: 'images/IMG_0756.jpg', badge: 'Hit' },
  { id: 'mochi', name: 'Mochi', category: 'desserts', taste: 'Soft rice dough, cold filling', price: 850, image: 'images/IMG_0939.jpg',
    optionLabel: 'Flavor', options: ['Blackcurrant', 'Strawberry', 'Mango', 'Strawberry-Coconut', 'Vanilla', 'Nutella'] },
  { id: 'napoleon', name: 'Napoleon', category: 'desserts', taste: 'Thin layers, vanilla cream', price: 1390, image: 'images/IMG_0934.jpg' },
  { id: 'honey-cake', name: 'Honey Cake', category: 'desserts', taste: 'Soft honey layers', price: 1390, image: 'images/IMG_0933.jpg' },
  { id: 'syrniki', name: 'Syrniki', category: 'desserts', taste: 'Cottage cheese pancakes', price: 1390, image: 'images/IMG_0935.jpg' },
  { id: 'donut', name: 'Donut', category: 'desserts', taste: 'Glazed, fresh every day', price: 690, image: 'images/IMG_0936.jpg' },
  { id: 'art-desserts', name: 'Art Desserts', category: 'desserts', taste: 'Small edible art pieces', price: 1990, image: 'images/IMG_0937.jpg' }
];

const sizeNames = ['250 ml', '350 ml', '480 ml'];

// "Drink of the day" on the Home page: one drink from menuItems (by id).
// With a ZEB-#### promo code the Cart takes this % off THIS drink only.
const dailySpecials = [
  { id: 'raf', desc: 'Creamy, vanilla, very soft — our most loved drink', discount: 15 },
  { id: 'matcha', desc: 'Green, blue or mango — cold and fresh', discount: 10 },
  { id: 'latte', desc: 'More milk, mild and soft — for a slow morning', discount: 20 },
  { id: 'cappuccino', desc: 'Thick foam, classic — the barista favourite', discount: 15 }
];

// Today's special: day of the week (0–6) divided by 4, the remainder is the index.
function getTodaySpecial() {
  return dailySpecials[new Date().getDay() % dailySpecials.length];
}

// Find one menu item by its id, e.g. findMenuItem('raf')
function findMenuItem(id) {
  return menuItems.find(function (item) { return item.id === id; });
}

// 1290 -> "1 290 ₸"
function formatPrice(amount) {
  return Math.round(amount).toLocaleString('ru-RU').replace(/ /g, ' ') + ' ₸';
}
