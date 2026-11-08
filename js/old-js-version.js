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
];/* --------------------------------------------------------------------------
   Booking page: original vanilla JavaScript from commit c23156a.
   Preserved for comparison; never link this archive to a page.
   -------------------------------------------------------------------------- */

'use strict';

// Booking: demo only. No data goes to a server.
(() => {
  const form = document.getElementById('booking-form');
  if (!form) return;

  form.noValidate = true;

  const $ = (id) => document.getElementById(id);

  const field = {
    name: $('full-name'),
    email: $('customer-email'),
    phone: $('customer-phone'),
    guests: $('guests-count'),
    date: $('booking-date'),
    time: $('booking-time'),
    seat: $('seating-area'),
    notes: $('special-requests')
  };

  const banner = $('booking-form-errors');
  const confirmation = $('booking-confirmation');
  const submit = $('booking-submit-btn');

  const seatNames = {
    'main-hall': 'Main Hall',
    'window-side': 'Window Side Table',
    'quiet-corner': 'Quiet Workspace Corner'
  };

  const saved = [];
  const errors = new Map();

  let editing = null;
  let pending = null;

  function el(tag, classes = '', text = '') {
    const item = document.createElement(tag);
    if (classes) item.className = classes;
    item.textContent = text;
    return item;
  }

  function localNow() {
    const parts = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Asia/Almaty',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hourCycle: 'h23'
    }).formatToParts(new Date());

    const p = Object.fromEntries(
      parts.map(x => [x.type, x.value])
    );

    return `${p.year}-${p.month}-${p.day}T${p.hour}:${p.minute}`;
  }

  function values() {
    return {
      name: field.name.value.trim(),
      email: field.email.value.trim(),
      phone: field.phone.value.trim(),
      guests: Number(field.guests.value),
      guestsText: field.guests.value.trim(),
      date: field.date.value,
      time: field.time.value,
      seat: field.seat.value,
      visit: form.querySelector('[name="visit_type"]:checked')?.value || '',
      wifi: $('vip-requested').checked,
      notes: field.notes.value.trim()
    };
  }

  function check(v) {
    const problems = [];
    const bad = (key, text) => problems.push([field[key], text]);

    if (v.name.length < 2 || v.name.length > 80) {
      bad('name', 'Name: 2–80 characters.');
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email)) {
      bad('email', 'Enter a valid email.');
    }

    if (!/^\d{10,15}$/.test(v.phone.replace(/\D/g, ''))) {
      bad('phone', 'Phone: 10–15 digits.');
    }

    if (!/^\d+$/.test(v.guestsText) || v.guests < 1 || v.guests > 10) {
      bad('guests', 'Guests: whole number from 1 to 10.');
    }

    const actualDate =
      /^\d{4}-\d\d-\d\d$/.test(v.date) &&
      !Number.isNaN(Date.parse(v.date)) &&
      new Date(v.date).toISOString().slice(0, 10) === v.date;

    if (!actualDate) {
      bad('date', 'Choose a valid date.');
    }

    if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(v.time)) {
      bad('time', 'Choose a valid time.');
    }

    if (actualDate && v.time && `${v.date}T${v.time}` <= localNow()) {
      bad('time', 'Choose a future time (Astana).');
    }

    if (!seatNames[v.seat]) {
      bad('seat', 'Choose a seating area.');
    }

    if (v.notes.length > 500) {
      bad('notes', 'Notes: maximum 500 characters.');
    }

    if (saved.some(x =>
      x.ref !== editing &&
      x.email === v.email &&
      x.date === v.date &&
      x.time === v.time
    )) {
      bad('time', 'You already have this demo request. Edit it below.');
    }

    return problems;
  }

  function clearErrors() {
    for (const [input, message] of errors) {
      input.classList.remove('error', 'success', 'is-invalid', 'is-valid');
      input.removeAttribute('aria-invalid');
      message.textContent = '';
      message.classList.add('hidden');
    }

    banner.classList.add('hidden');
  }

  function showErrors(problems) {
    clearErrors();

    banner.textContent = 'Please correct the fields below. Nothing was submitted.';
    banner.classList.remove('hidden');

    for (const [input, text] of problems) {
      input.classList.add('error', 'is-invalid');
      input.setAttribute('aria-invalid', 'true');
      errors.get(input).textContent = text;
      errors.get(input).classList.remove('hidden');
    }

    problems[0][0].focus();
  }

  function facts(target, entries) {
    target.replaceChildren();

    for (const [label, value] of entries) {
      const li = el('li', 'list-group-item');

      li.append(
        el('strong', 'me-2', `${label}:`),
        document.createTextNode(String(value))
      );

      target.append(li);
    }

    return entries.length;
  }

  function summary(v) {
    facts(previewList, [
      ['Name', v.name || '—'],
      ['Guests', v.guestsText || '—'],
      ['Visit', v.visit === 'business' ? 'Business Meeting' : 'Personal / Study'],
      ['Date', v.date || '—'],
      ['Time (Astana)', v.time || '—'],
      ['Seating', seatNames[v.seat] || '—'],
      ['Socket/Wi-Fi', v.wifi ? 'Requested, not guaranteed' : 'Not requested']
    ]);

    field.seat.classList.toggle('selected', Boolean(seatNames[v.seat]));
  }

  const preview = el('section', 'border rounded p-3 bg-light mb-3');
  preview.append(el('h4', 'h6 fw-bold', 'Live booking summary'));

  const previewList = el('ul', 'list-group mb-2');

  preview.append(
    previewList,
    el(
      'p',
      'small mb-0 text-muted',
      'Demo only: no live availability check, booking, or payment.'
    )
  );

  submit.parentElement.before(preview);

  const manager = el('section', 'border rounded bg-white p-4 mb-4');
  manager.append(el('h3', 'h4', 'Manage demo requests'));

  const count = el('p', 'text-muted');
  const list = el('div', 'd-flex flex-column gap-2');

  const notice = el(
    'p',
    'small',
    'Requests exist on this page only; refreshing clears them.'
  );

  const feedback = el('p', 'small', '');
  feedback.setAttribute('role', 'status');

  const clearAll = el(
    'button',
    'btn btn-outline-danger btn-sm mt-3',
    'Clear all'
  );

  clearAll.type = 'button';

  const prompt = el('div', 'alert alert-warning mt-3 hidden');
  const question = el('p', 'mb-2');
  const yes = el('button', 'btn btn-danger btn-sm me-2', 'Confirm');
  const no = el('button', 'btn btn-outline-secondary btn-sm', 'Cancel');

  yes.type = no.type = 'button';

  prompt.append(question, yes, no);
  manager.append(count, notice, feedback, list, clearAll, prompt);
  $('reservation-form-section').after(manager);

  function render() {
    list.replaceChildren();

    count.textContent = `${saved.length} demo request(s), ` +
      `${saved.reduce((total, x) => total + x.guests, 0)} guest(s).`;

    clearAll.disabled = saved.length === 0;

    if (saved.length === 0) {
      list.append(el('p', 'text-muted', 'No demo requests yet.'));
    }

    for (const x of saved) {
      const card = el('article', 'card p-3');

      card.classList.toggle('selected', editing === x.ref);

      card.append(
        el('strong', '', `${x.ref} · ${x.name}`),
        el(
          'p',
          'mb-2',
          `${x.date}, ${x.time} · ${x.guests} guests · ${seatNames[x.seat]}`
        )
      );

      for (const action of ['Edit', 'Remove']) {
        const button = el(
          'button',
          'btn btn-outline-secondary btn-sm me-2',
          action
        );

        button.type = 'button';
        button.dataset.action = action.toLowerCase();
        button.dataset.ref = x.ref;

        card.append(button);
      }

      list.append(card);
    }
  }

  function newReference() {
    let ref;

    do {
      ref = `ZC-DEMO-${Math.floor(100000 + Math.random() * 900000)}`;
    } while (saved.some(x => x.ref === ref));

    return ref;
  }

  function ask(type, ref = '') {
    pending = { type, ref };

    question.textContent = type === 'all'
      ? 'Remove all demo requests?'
      : `Remove demo request ${ref}?`;

    prompt.classList.remove('hidden');
    yes.focus();
  }

  list.addEventListener('click', event => {
    const button = event.target.closest('button[data-action]');
    if (!button) return;

    const x = saved.find(item => item.ref === button.dataset.ref);
    if (!x) return;

    if (button.dataset.action === 'remove') {
      ask('one', x.ref);
      return;
    }

    for (const key of ['name', 'email', 'phone', 'guests', 'date', 'time', 'notes']) {
      field[key].value = x[key];
    }

    field.seat.value = x.seat;
    $('vip-requested').checked = x.wifi;
    form.querySelector(`[name="visit_type"][value="${x.visit}"]`).checked = true;

    editing = x.ref;
    submit.textContent = 'Save Demo Changes';

    confirmation.classList.add('hidden');
    clearErrors();
    summary(values());
    render();

    field.name.focus();
    feedback.textContent = `Editing ${x.ref}. Save to update it.`;
  });

  clearAll.addEventListener('click', () => ask('all'));

  no.addEventListener('click', () => {
    pending = null;
    prompt.classList.add('hidden');
  });

  yes.addEventListener('click', () => {
    if (!pending) return;

    if (pending.type === 'all') {
      saved.length = 0;
    } else {
      saved.splice(
        saved.findIndex(x => x.ref === pending.ref),
        1
      );
    }

    if (pending.type === 'all' || editing === pending.ref) {
      editing = null;
      submit.textContent = 'Submit Reservation';
    }

    feedback.textContent = 'Demo request(s) removed. No real bookings affected.';

    pending = null;
    prompt.classList.add('hidden');
    confirmation.classList.add('hidden');

    render();
  });

  for (const input of Object.values(field)) {
    const message = el('div', 'small text-danger mt-1 hidden');

    input.after(message);
    errors.set(input, message);
  }

  form.addEventListener('submit', event => {
    event.preventDefault();

    const v = values();
    const problems = check(v);

    if (problems.length) {
      confirmation.classList.add('hidden');
      showErrors(problems);
      return;
    }

    clearErrors();

    for (const input of Object.values(field)) {
      if (input.value) {
        input.classList.add('success', 'is-valid');
      }
    }

    const ref = editing || newReference();
    const index = saved.findIndex(x => x.ref === editing);
    const item = { ...v, ref };

    if (index >= 0) {
      saved[index] = item;
    } else {
      saved.push(item);
    }

    editing = null;
    submit.textContent = 'Submit Reservation';

    confirmation.replaceChildren(
      el('h4', 'h5', index >= 0 ? 'Demo request updated' : 'Demo request saved'),
      el(
        'p',
        '',
        `${v.name}: ${v.guests} guests, ${v.date} at ${v.time}, ${seatNames[v.seat]}.`
      ),
      el('p', 'fw-bold', `Reference: ${ref}`),
      el(
        'p',
        'small mb-0',
        'This is not a real reservation. No data was sent to a server.'
      )
    );

    confirmation.classList.remove('hidden');
    feedback.textContent = 'You can edit or remove this demo request below.';

    render();
  });

  form.addEventListener('input', event => {
    const input = event.target;

    if (errors.has(input)) {
      input.classList.remove('error', 'success', 'is-invalid', 'is-valid');
      errors.get(input).classList.add('hidden');
      input.removeAttribute('aria-invalid');
    }

    banner.classList.add('hidden');
    confirmation.classList.add('hidden');
    summary(values());
  });

  form.addEventListener('change', () => {
    confirmation.classList.add('hidden');
    summary(values());
  });

  form.addEventListener('reset', () => {
    editing = null;
    submit.textContent = 'Submit Reservation';
    confirmation.classList.add('hidden');

    clearErrors();

    feedback.textContent = 'Form reset. Saved demo requests remain.';

    setTimeout(() => {
      summary(values());
      render();
    }, 0);
  });

  field.date.min = localNow().slice(0, 10);

  summary(values());
  render();
})();

/* --------------------------------------------------------------------------
   Contacts page: original vanilla JavaScript from commit c23156a.
   Preserved for comparison; never link this archive to a page.
   -------------------------------------------------------------------------- */

'use strict';

(() => {
  const main = document.querySelector('main');
  const anchor = document.getElementById('cozy-corner');

  if (!main || !anchor) return;

  const topics = [
    {
      title: 'Book a table',
      category: 'Visit',
      info: 'Choose date, time and guests.',
      keywords: 'booking reservation',
      url: 'booking.html'
    },
    {
      title: 'View our menu',
      category: 'Menu',
      info: 'See coffee drinks and prices.',
      keywords: 'coffee latte drinks',
      url: 'menu.html'
    },
    {
      title: 'Share a review',
      category: 'Feedback',
      info: 'Read or write customer reviews.',
      keywords: 'rating comments review',
      url: 'reviews.html'
    },
    {
      title: 'Find a job',
      category: 'Careers',
      info: 'See available positions.',
      keywords: 'job work barista',
      url: 'career.html'
    },
    {
      title: 'Get directions',
      category: 'Visit',
      info: 'Mangilik El 38, Astana.',
      keywords: 'address map directions',
      url: 'https://2gis.kz/astana/geo/70000001045554424'
    },
    {
      title: 'Call the cafe',
      category: 'Contact',
      info: '+7 747 029 00 43',
      keywords: 'phone telephone',
      url: 'tel:+77470290043'
    },
    {
      title: 'Email the cafe',
      category: 'Contact',
      info: 'info@zebracoffee.kz',
      keywords: 'email message',
      url: 'mailto:info@zebracoffee.kz'
    },
    {
      title: 'Working hours',
      category: 'Visit',
      info: 'Listed schedule: open 24/7.',
      keywords: 'opening time schedule',
      url: '#opening-hours'
    }
  ];

  function el(tag, classes = '', text = '') {
    const node = document.createElement(tag);

    if (classes) node.className = classes;

    node.textContent = text;
    return node;
  }

  function optionList(select, choices) {
    choices.forEach(([value, title]) => {
      const option = el('option', '', title);

      option.value = value;
      select.append(option);
    });

    return select;
  }

  function link(title, url) {
    const a = el('a', 'btn btn-outline-primary btn-sm', title);
    a.href = url;

    if (url.startsWith('https://')) {
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
    }

    return a;
  }

  function fieldRow(label, input, size = 'col-12 col-md-6') {
    const box = el('div', size);
    const caption = el('label', 'form-label fw-semibold', label);

    caption.htmlFor = input.id;

    const error = el('div', 'text-danger small hidden');
    error.id = `${input.id}-error`;

    input.setAttribute('aria-describedby', error.id);
    box.append(caption, input, error);

    return { box, input, error };
  }

  const guide = el(
    'section',
    'p-4 rounded border bg-white shadow-sm mb-4'
  );

  guide.append(el('h3', 'h4', 'How can we help?'));

  const controls = el('div', 'row g-3 mb-3');
  const search = el('input', 'form-control');

  search.type = 'search';
  search.id = 'help-search';
  search.placeholder = 'Search: booking, menu, phone...';

  const category = optionList(el('select', 'form-select'), [
    ['all', 'All categories'],
    ['Visit', 'Visit'],
    ['Menu', 'Menu'],
    ['Feedback', 'Feedback'],
    ['Careers', 'Careers'],
    ['Contact', 'Contact']
  ]);

  category.id = 'help-category';

  const sorting = optionList(el('select', 'form-select'), [
    ['default', 'Recommended'],
    ['az', 'A–Z'],
    ['za', 'Z–A']
  ]);

  sorting.id = 'help-sort';

  controls.append(
    fieldRow('Search', search, 'col-12 col-md-5').box,
    fieldRow('Category', category, 'col-12 col-md-4').box,
    fieldRow('Sort', sorting, 'col-12 col-md-3').box
  );

  const count = el('p', 'fw-semibold');

  count.setAttribute('role', 'status');
  count.setAttribute('aria-live', 'polite');

  const cards = el('div', 'row g-3');

  const noResults = el(
    'p',
    'alert alert-info hidden mt-3',
    'No matches. Try another search.'
  );

  const resetSearch = el(
    'button',
    'btn btn-outline-secondary mt-3',
    'Reset search'
  );

  resetSearch.type = 'button';

  guide.append(
    controls,
    count,
    cards,
    noResults,
    resetSearch
  );

  function filterTopics(query, group, order) {
    const text = query.trim().toLowerCase();

    const found = topics.filter(item =>
      (group === 'all' || item.category === group) &&
      `${item.title} ${item.info} ${item.keywords}`
        .toLowerCase()
        .includes(text)
    );

    if (order === 'az') {
      found.sort((a, b) => a.title.localeCompare(b.title));
    }

    if (order === 'za') {
      found.sort((a, b) => b.title.localeCompare(a.title));
    }

    return found;
  }

  function updateCards() {
    const found = filterTopics(
      search.value,
      category.value,
      sorting.value
    );

    cards.replaceChildren();

    for (const item of found) {
      const column = el('div', 'col-12 col-md-6');
      const card = el('article', 'card h-100 p-3');

      card.append(
        el('h4', 'h6 fw-bold', item.title),
        el('p', 'small', `${item.category} — ${item.info}`),
        link('Open', item.url)
      );

      column.append(card);
      cards.append(column);
    }

    count.textContent = `Showing ${found.length} of ${topics.length} actions`;

    noResults.classList.toggle('hidden', found.length !== 0);
    category.classList.toggle('selected', category.value !== 'all');

    return found.length;
  }

  search.addEventListener('input', updateCards);
  category.addEventListener('change', updateCards);
  sorting.addEventListener('change', updateCards);

  resetSearch.addEventListener('click', () => {
    search.value = '';
    category.value = 'all';
    sorting.value = 'default';

    updateCards();
    search.focus();
  });

  // Feature 2: interactive enquiry preview with field-level validation.
  const section = el(
    'section',
    'p-4 rounded border bg-white shadow-sm mb-4'
  );

  section.append(
    el('h3', 'h4', 'Prepare an enquiry'),
    el('p', 'text-muted', 'Demo only. No form is sent to a server.')
  );

  const form = el('form');
  form.noValidate = true;

  const formError = el('p', 'alert alert-danger hidden');
  formError.setAttribute('role', 'alert');

  const grid = el('div', 'row g-3');
  const name = el('input', 'form-control');

  name.id = 'contact-name';
  name.type = 'text';
  name.placeholder = 'Your name';

  const email = el('input', 'form-control');

  email.id = 'contact-email';
  email.type = 'email';
  email.placeholder = 'name@mail.kz';

  const topic = optionList(el('select', 'form-select'), [
    ['', 'Choose a topic'],
    ['general', 'General question'],
    ['booking', 'Booking'],
    ['feedback', 'Feedback'],
    ['lost', 'Lost item'],
    ['careers', 'Careers'],
    ['partner', 'Partnership']
  ]);

  topic.id = 'contact-topic';

  const method = optionList(el('select', 'form-select'), [
    ['email', 'Email'],
    ['phone', 'Phone']
  ]);

  method.id = 'contact-method';

  const phone = el('input', 'form-control');

  phone.id = 'contact-phone';
  phone.type = 'tel';
  phone.placeholder = '+7 700 000 00 00';

  const message = el('textarea', 'form-control');

  message.id = 'contact-message';
  message.rows = 5;
  message.maxLength = 800;
  message.placeholder = 'Explain your question (20–800 characters)';

  const rows = [
    fieldRow('Full name', name),
    fieldRow('Email address', email),
    fieldRow('Topic', topic),
    fieldRow('Preferred reply', method),
    fieldRow('Telephone (if phone reply chosen)', phone, 'col-12'),
    fieldRow('Message', message, 'col-12')
  ];

  rows.forEach(row => grid.append(row.box));

  const phoneRow = rows[4].box;

  const counter = el(
    'p',
    'small text-muted mt-1',
    '0 / 800 characters'
  );

  counter.setAttribute('aria-live', 'polite');
  rows[5].box.append(counter);

  const buttons = el('div', 'd-flex gap-2 flex-wrap mt-3');

  const previewBtn = el(
    'button',
    'btn btn-primary',
    'Preview enquiry'
  );

  previewBtn.type = 'submit';

  const resetBtn = el(
    'button',
    'btn btn-outline-secondary',
    'Clear form'
  );

  resetBtn.type = 'reset';
  buttons.append(previewBtn, resetBtn);

  const result = el('section', 'alert alert-success hidden mt-3');

  result.setAttribute('role', 'status');
  result.setAttribute('aria-live', 'polite');

  form.append(formError, grid, buttons);
  section.append(form, result);

  anchor.before(guide, section);

  function values() {
    return {
      name: name.value.trim(),
      email: email.value.trim(),
      topic: topic.value,
      method: method.value,
      phone: phone.value.trim(),
      message: message.value.trim()
    };
  }

  function validate(v) {
    const bad = [];

    if (v.name.length < 2 || v.name.length > 80) {
      bad.push([name, 'Name: 2–80 characters.']);
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email)) {
      bad.push([email, 'Enter a valid email.']);
    }

    if (!['general', 'booking', 'feedback', 'lost', 'careers', 'partner'].includes(v.topic)) {
      bad.push([topic, 'Choose a topic.']);
    }

    if (v.method !== 'email' && v.method !== 'phone') {
      bad.push([method, 'Choose a reply method.']);
    }

    if (
      v.method === 'phone' &&
      !/^\d{10,15}$/.test(v.phone.replace(/\D/g, ''))
    ) {
      bad.push([phone, 'Telephone: 10–15 digits.']);
    }

    if (v.message.length < 20 || v.message.length > 800) {
      bad.push([message, 'Message: 20–800 characters.']);
    }

    return bad;
  }

  function clearErrors() {
    rows.forEach(row => {
      row.input.classList.remove(
        'error',
        'success',
        'is-invalid',
        'is-valid'
      );

      row.input.removeAttribute('aria-invalid');

      row.error.textContent = '';
      row.error.classList.add('hidden');
    });

    formError.classList.add('hidden');
  }

  function updatePhone() {
    phoneRow.classList.toggle('hidden', method.value !== 'phone');
    phone.required = method.value === 'phone';

    return phone.required;
  }

  function showPreview(v) {
    result.replaceChildren(
      el('h4', 'h5', 'Demo enquiry — NOT sent')
    );

    const list = el('ul');

    for (const [title, value] of [
      ['Name', v.name],
      ['Email', v.email],
      ['Topic', v.topic],
      ['Reply by', v.method === 'phone' ? v.phone : 'Email'],
      ['Message', v.message]
    ]) {
      list.append(el('li', '', `${title}: ${value}`));
    }

    result.append(
      list,
      el(
        'p',
        'small',
        'No message was sent; this is a front-end demonstration.'
      ),
      link('Use real email instead', 'mailto:info@zebracoffee.kz')
    );

    result.classList.remove('hidden');
  }

  form.addEventListener('submit', event => {
    event.preventDefault();
    clearErrors();

    const v = values();
    const bad = validate(v);

    result.classList.add('hidden');

    if (bad.length > 0) {
      for (const [input, text] of bad) {
        const row = rows.find(item => item.input === input);

        row.error.textContent = text;
        row.error.classList.remove('hidden');

        input.classList.add('error', 'is-invalid');
        input.setAttribute('aria-invalid', 'true');
      }

      formError.textContent =
        'Please correct the marked fields. No message was sent.';

      formError.classList.remove('hidden');
      bad[0][0].focus();
      return;
    }

    rows.forEach(row => {
      if (row.input.value) {
        row.input.classList.add('success', 'is-valid');
      }
    });

    showPreview(v);
  });

  form.addEventListener('input', event => {
    const row = rows.find(item => item.input === event.target);

    if (row) {
      row.error.classList.add('hidden');

      row.input.classList.remove(
        'error',
        'success',
        'is-invalid',
        'is-valid'
      );

      row.input.removeAttribute('aria-invalid');
    }

    counter.textContent = `${message.value.length} / 800 characters`;

    result.classList.add('hidden');
    formError.classList.add('hidden');
  });

  form.addEventListener('change', () => {
    updatePhone();
    result.classList.add('hidden');
  });

  form.addEventListener('reset', () => {
    clearErrors();
    result.classList.add('hidden');

    setTimeout(() => {
      updatePhone();
      counter.textContent = '0 / 800 characters';
    }, 0);
  });

  const store = document.getElementById('store-status');

  if (store) {
    store.textContent = 'Listed hours: 24/7 (not live)';
  }

  updateCards();
  updatePhone();
})();