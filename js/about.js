'use strict';

const coffeeStandardsData = [
  { id: 1, standard: 'Order Prep Time', target: '< 3 minutes', frequency: 'Every order', category: 'speed' },
  { id: 2, standard: 'Grinder Calibration', target: 'Exact double shot extraction', frequency: 'Twice per shift', category: 'quality' },
  { id: 3, standard: 'Milk Steaming Temp', target: '60°C – 65°C sweet spot', frequency: 'Every drink', category: 'quality' },
  { id: 4, standard: 'Workplace Seating & Wi-Fi', target: '24/7 continuous access', frequency: 'Continuous', category: 'hospitality' },
  { id: 5, standard: 'Steam Wand Sanitization', target: 'Purge and wipe instantly', frequency: 'After each cup', category: 'hygiene' },
  { id: 6, standard: 'Fresh Bean Rest Period', target: '7 to 21 days from roast', frequency: 'Weekly audit', category: 'quality' }
];

function renderStandardsTable(items, tbody) {
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

document.addEventListener('DOMContentLoaded', () => {
  const tableBody = document.getElementById('standards-table-body');
  const controlBox = document.getElementById('standards-status-container');
  const standardsTable = document.getElementById('standards-table');

  if (!tableBody || !controlBox || !standardsTable) {
    console.error('Не найдены элементы таблицы или контейнера в HTML');
    return;
  }

  const tableWrapper = standardsTable.closest('.table-responsive');
  if (tableWrapper) {
    tableWrapper.before(controlBox);
  }

  controlBox.className = 'card p-3 mb-3 bg-light border-0 shadow-sm rounded-3';


  const row = document.createElement('div');
  row.className = 'row g-2 align-items-center';

  const colSearch = document.createElement('div');
  colSearch.className = 'col-12 col-md-5';
  const searchInput = document.createElement('input');
  searchInput.type = 'text';
  searchInput.className = 'form-control form-control-sm';
  searchInput.placeholder = 'Search benchmark (e.g. Grinder, 24/7)...';
  colSearch.appendChild(searchInput);

  const colSelect = document.createElement('div');
  colSelect.className = 'col-8 col-md-4';
  const categorySelect = document.createElement('select');
  categorySelect.className = 'form-select form-select-sm';

  const cats = [
    { id: 'all', label: 'All Benchmarks' },
    { id: 'quality', label: 'Quality' },
    { id: 'speed', label: 'Speed' },
    { id: 'hospitality', label: 'Hospitality' },
    { id: 'hygiene', label: 'Hygiene' }
  ];
  cats.forEach(c => {
    const opt = document.createElement('option');
    opt.value = c.id;
    opt.textContent = c.label;
    categorySelect.appendChild(opt);
  });
  colSelect.appendChild(categorySelect);

  const colReset = document.createElement('div');
  colReset.className = 'col-4 col-md-3';
  const resetBtn = document.createElement('button');
  resetBtn.type = 'button';
  resetBtn.className = 'btn btn-outline-secondary btn-sm w-100';
  resetBtn.textContent = 'Reset';
  colReset.appendChild(resetBtn);

  row.appendChild(colSearch);
  row.appendChild(colSelect);
  row.appendChild(colReset);

  const counter = document.createElement('div');
  counter.className = 'small text-muted mt-2';
  counter.textContent = `Showing all ${coffeeStandardsData.length} standards`;

  controlBox.appendChild(row);
  controlBox.appendChild(counter);

  function applyFilter() {
    const q = searchInput.value.trim().toLowerCase();
    const cat = categorySelect.value;

    const filtered = coffeeStandardsData.filter(item => {
      const matchText = item.standard.toLowerCase().includes(q) || item.target.toLowerCase().includes(q);
      const matchCat = (cat === 'all') || (item.category === cat);
      return matchText && matchCat;
    });

    renderStandardsTable(filtered, tableBody);
    counter.textContent = `Showing ${filtered.length} of ${coffeeStandardsData.length} standards`;
  }

  searchInput.addEventListener('input', applyFilter);
  categorySelect.addEventListener('change', applyFilter);
  resetBtn.addEventListener('click', () => {
    searchInput.value = '';
    categorySelect.value = 'all';
    applyFilter();
  });

  renderStandardsTable(coffeeStandardsData, tableBody);
});