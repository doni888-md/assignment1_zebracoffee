/* ==========================================================================
   old-js-version.js
   Architecture: Pure Vanilla JavaScript implementations prior to jQuery migration.
   Note: This file is intentionally NOT linked in any HTML page.
   Purpose: Retained for side-by-side comparison during Assignment 4 defense.
   ========================================================================== */

/* --------------------------------------------------------------------------
   Feature 1: Career Form Validation (Original Vanilla JS from career.js)
   -------------------------------------------------------------------------- */
function generateApplicationId() {
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `APP-${randomSuffix}`;
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function isValidPhone(phone) {
  const phoneRegex = /^(\+7|8)?[\s-]?\(?[0-9]{3}\)?[\s-]?[0-9]{2}[\s-]?[0-9]{2}$/;
  return phoneRegex.test(phone.trim());
}

function isFutureOrTodayDate(dateString) {
  if (!dateString) return false;
  const selectedDate = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return selectedDate >= today;
}

function setFieldStatusVanilla(inputElement, isValid, errorMessage = '') {
  let feedback = inputElement.parentElement.querySelector('.invalid-feedback');
  if (!isValid) {
    inputElement.classList.add('is-invalid');
    inputElement.classList.remove('is-valid');
    if (!feedback) {
      feedback = document.createElement('div');
      feedback.className = 'invalid-feedback small';
      inputElement.parentElement.appendChild(feedback);
    }
    feedback.textContent = errorMessage;
  } else {
    inputElement.classList.remove('is-invalid');
    inputElement.classList.add('is-valid');
    if (feedback) feedback.textContent = '';
  }
}

/* --------------------------------------------------------------------------
   Feature 2: Table Generation from Array & Live Filter (Original about.js)
   -------------------------------------------------------------------------- */
const coffeeStandardsDataOriginal = [
  { id: 1, standard: 'Order Prep Time', target: '< 3 minutes', frequency: 'Every order', category: 'speed' },
  { id: 2, standard: 'Grinder Calibration', target: 'Exact double shot extraction', frequency: 'Twice per shift', category: 'quality' },
  { id: 3, standard: 'Milk Steaming Temp', target: '60°C – 65°C sweet spot', frequency: 'Every drink', category: 'quality' },
  { id: 4, standard: 'Workplace Seating & Wi-Fi', target: '24/7 continuous access', frequency: 'Continuous', category: 'hospitality' },
  { id: 5, standard: 'Steam Wand Sanitization', target: 'Purge and wipe instantly', frequency: 'After each cup', category: 'hygiene' },
  { id: 6, standard: 'Fresh Bean Rest Period', target: '7 to 21 days from roast', frequency: 'Weekly audit', category: 'quality' }
];

function renderStandardsTableVanilla(items, tbody) {
  tbody.textContent = '';
  if (items.length === 0) {
    const emptyRow = document.createElement('tr');
    const emptyCell = document.createElement('td');
    emptyCell.colSpan = 3;
    emptyCell.className = 'text-center text-muted py-4';
    emptyCell.textContent = 'No matching operational benchmarks found.';
    emptyRow.appendChild(emptyCell);
    tbody.appendChild(emptyRow);
    return;
  }
  items.forEach(item => {
    const row = document.createElement('tr');
    const nameCell = document.createElement('td');
    nameCell.className = 'fw-semibold text-dark';
    nameCell.textContent = item.standard;

    const targetCell = document.createElement('td');
    targetCell.textContent = item.target;

    const freqCell = document.createElement('td');
    const badge = document.createElement('span');
    badge.className = item.category === 'speed' ? 'badge bg-warning text-dark' : 'badge bg-secondary';
    badge.textContent = item.frequency;
    freqCell.appendChild(badge);

    row.appendChild(nameCell);
    row.appendChild(targetCell);
    row.appendChild(freqCell);
    tbody.appendChild(row);
  });
}

/* --------------------------------------------------------------------------
   Feature 3: Promo Banner & Dynamic Button Generation (Original homepage.js)
   -------------------------------------------------------------------------- */
const dailySpecialsOriginal = [
  { name: 'Raf Citrus', desc: 'Creamy espresso with natural orange zest', discount: '15%' },
  { name: 'Matcha Tonic', desc: 'Cold brew green tea with sparkling tonic', discount: '10%' },
  { name: 'Spanish Latte', desc: 'Silky milk with sweet condensed layers', discount: '20%' },
  { name: 'Filter Geisha', desc: 'Fresh local roast from Astana roastery', discount: '15%' }
];