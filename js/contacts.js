
'use strict';

(() => {
  const main = document.querySelector('main');
  const anchor = document.getElementById('cozy-corner');
  if (!main || !anchor) return;
  const topics = [
    { title: 'Book a table', category: 'Visit', info: 'Choose date, time and guests.', keywords: 'booking reservation', url: 'booking.html' },
    { title: 'View our menu', category: 'Menu', info: 'See coffee drinks and prices.', keywords: 'coffee latte drinks', url: 'menu.html' },
    { title: 'Share a review', category: 'Feedback', info: 'Read or write customer reviews.', keywords: 'rating comments review', url: 'reviews.html' },
    { title: 'Find a job', category: 'Careers', info: 'See available positions.', keywords: 'job work barista', url: 'career.html' },
    { title: 'Get directions', category: 'Visit', info: 'Mangilik El 38, Astana.', keywords: 'address map directions', url: 'https://2gis.kz/astana/geo/70000001045554424' },
    { title: 'Call the cafe', category: 'Contact', info: '+7 747 029 00 43', keywords: 'phone telephone', url: 'tel:+77470290043' },
    { title: 'Email the cafe', category: 'Contact', info: 'info@zebracoffee.kz', keywords: 'email message', url: 'mailto:info@zebracoffee.kz' },
    { title: 'Working hours', category: 'Visit', info: 'Listed schedule: open 24/7.', keywords: 'opening time schedule', url: '#opening-hours' }
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
      a.target = '_blank'; a.rel = 'noopener noreferrer';
    }
    return a;
  }
  function fieldRow(label, input, size = 'col-12 col-md-6') {
    const box = el('div', size);
    const caption = el('label', 'form-label fw-semibold', label);
    caption.htmlFor = input.id;
    const error = el('div', 'text-danger small hidden'); error.id = `${input.id}-error`;
    input.setAttribute('aria-describedby', error.id);
    box.append(caption, input, error);
    return { box, input, error };
  }

  const guide = el('section', 'p-4 rounded border bg-white shadow-sm mb-4');
  guide.append(el('h3', 'h4', 'How can we help?'));
  const controls = el('div', 'row g-3 mb-3');
  const search = el('input', 'form-control');
  search.type = 'search'; search.id = 'help-search';
  search.placeholder = 'Search: booking, menu, phone...';
  const category = optionList(el('select', 'form-select'), [
    ['all', 'All categories'], ['Visit', 'Visit'], ['Menu', 'Menu'],
    ['Feedback', 'Feedback'], ['Careers', 'Careers'], ['Contact', 'Contact']
  ]);
  category.id = 'help-category';
  const sorting = optionList(el('select', 'form-select'), [
    ['default', 'Recommended'], ['az', 'A–Z'], ['za', 'Z–A']
  ]);
  sorting.id = 'help-sort';
  controls.append(
    fieldRow('Search', search, 'col-12 col-md-5').box,
    fieldRow('Category', category, 'col-12 col-md-4').box,
    fieldRow('Sort', sorting, 'col-12 col-md-3').box
  );
  const count = el('p', 'fw-semibold');
  count.setAttribute('role', 'status'); count.setAttribute('aria-live', 'polite');
  const cards = el('div', 'row g-3');
  const noResults = el('p', 'alert alert-info hidden mt-3', 'No matches. Try another search.');
  const resetSearch = el('button', 'btn btn-outline-secondary mt-3', 'Reset search'); resetSearch.type = 'button';
  guide.append(controls, count, cards, noResults, resetSearch);
  function filterTopics(query, group, order) {
    const text = query.trim().toLowerCase();
    const found = topics.filter(item =>
      (group === 'all' || item.category === group) &&
      `${item.title} ${item.info} ${item.keywords}`.toLowerCase().includes(text)
    );
    if (order === 'az') found.sort((a, b) => a.title.localeCompare(b.title));
    if (order === 'za') found.sort((a, b) => b.title.localeCompare(a.title));
    return found;
  }
  function updateCards() {
    const found = filterTopics(search.value, category.value, sorting.value);
    cards.replaceChildren();
    for (const item of found) {
      const column = el('div', 'col-12 col-md-6');
      const card = el('article', 'card h-100 p-3');
      card.append(el('h4', 'h6 fw-bold', item.title),
        el('p', 'small', `${item.category} — ${item.info}`),
        link('Open', item.url));
      column.append(card);
      cards.append(column);
    }
    count.textContent = `Showing ${found.length} of ${topics.length} actions`;
    noResults.classList.toggle('hidden', found.length !== 0);
    category.classList.toggle('selected', category.value !== 'all');
    return found.length;
  }
  search.addEventListener('input', updateCards);
  category.addEventListener('change', updateCards); sorting.addEventListener('change', updateCards);
  resetSearch.addEventListener('click', () => {
    search.value = '';
    category.value = 'all'; sorting.value = 'default';
    updateCards();
    search.focus();
  });

  // Feature 2: interactive enquiry preview with field-level validation.
  const section = el('section', 'p-4 rounded border bg-white shadow-sm mb-4');
  section.append(el('h3', 'h4', 'Prepare an enquiry'),
    el('p', 'text-muted', 'Demo only. No form is sent to a server.'));
  const form = el('form');
  form.noValidate = true;
  const formError = el('p', 'alert alert-danger hidden');
  formError.setAttribute('role', 'alert');
  const grid = el('div', 'row g-3');
  const name = el('input', 'form-control');
  name.id = 'contact-name'; name.type = 'text'; name.placeholder = 'Your name';
  const email = el('input', 'form-control');
  email.id = 'contact-email'; email.type = 'email'; email.placeholder = 'name@mail.kz';
  const topic = optionList(el('select', 'form-select'), [
    ['', 'Choose a topic'], ['general', 'General question'],
    ['booking', 'Booking'], ['feedback', 'Feedback'],
    ['lost', 'Lost item'], ['careers', 'Careers'],
    ['partner', 'Partnership']
  ]);
  topic.id = 'contact-topic';
  const method = optionList(el('select', 'form-select'), [
    ['email', 'Email'], ['phone', 'Phone']
  ]);
  method.id = 'contact-method';
  const phone = el('input', 'form-control');
  phone.id = 'contact-phone'; phone.type = 'tel'; phone.placeholder = '+7 700 000 00 00';
  const message = el('textarea', 'form-control');
  message.id = 'contact-message';
  message.rows = 5; message.maxLength = 800; message.placeholder = 'Explain your question (20–800 characters)';
  const rows = [
    fieldRow('Full name', name), fieldRow('Email address', email),
    fieldRow('Topic', topic), fieldRow('Preferred reply', method),
    fieldRow('Telephone (if phone reply chosen)', phone, 'col-12'),
    fieldRow('Message', message, 'col-12')
  ];
  rows.forEach(row => grid.append(row.box));
  const phoneRow = rows[4].box;
  const counter = el('p', 'small text-muted mt-1', '0 / 800 characters');
  counter.setAttribute('aria-live', 'polite');
  rows[5].box.append(counter);
  const buttons = el('div', 'd-flex gap-2 flex-wrap mt-3');
  const previewBtn = el('button', 'btn btn-primary', 'Preview enquiry'); previewBtn.type = 'submit';
  const resetBtn = el('button', 'btn btn-outline-secondary', 'Clear form'); resetBtn.type = 'reset';
  buttons.append(previewBtn, resetBtn);
  const result = el('section', 'alert alert-success hidden mt-3');
  result.setAttribute('role', 'status'); result.setAttribute('aria-live', 'polite');
  form.append(formError, grid, buttons);
  section.append(form, result);
  anchor.before(guide, section);

  function values() {
    return {
      name: name.value.trim(), email: email.value.trim(), topic: topic.value,
      method: method.value, phone: phone.value.trim(), message: message.value.trim()
    };
  }
  function validate(v) {
    const bad = [];
    if (v.name.length < 2 || v.name.length > 80) bad.push([name, 'Name: 2–80 characters.']);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email)) bad.push([email, 'Enter a valid email.']);
    if (!['general', 'booking', 'feedback', 'lost', 'careers', 'partner'].includes(v.topic))
      bad.push([topic, 'Choose a topic.']);
    if (v.method !== 'email' && v.method !== 'phone') bad.push([method, 'Choose a reply method.']);
    if (v.method === 'phone' && !/^\d{10,15}$/.test(v.phone.replace(/\D/g, '')))
      bad.push([phone, 'Telephone: 10–15 digits.']);
    if (v.message.length < 20 || v.message.length > 800)
      bad.push([message, 'Message: 20–800 characters.']);
    return bad;
  }
  function clearErrors() {
    rows.forEach(row => {
      row.input.classList.remove('error', 'success', 'is-invalid', 'is-valid');
      row.input.removeAttribute('aria-invalid');
      row.error.textContent = ''; row.error.classList.add('hidden');
    });
    formError.classList.add('hidden');
  }
  function updatePhone() {
    phoneRow.classList.toggle('hidden', method.value !== 'phone');
    phone.required = method.value === 'phone';
    return phone.required;
  }
  function showPreview(v) {
    result.replaceChildren(el('h4', 'h5', 'Demo enquiry — NOT sent'));
    const list = el('ul');
    for (const [title, value] of [
      ['Name', v.name], ['Email', v.email], ['Topic', v.topic],
      ['Reply by', v.method === 'phone' ? v.phone : 'Email'],
      ['Message', v.message]
    ]) list.append(el('li', '', `${title}: ${value}`));
    result.append(list, el('p', 'small', 'No message was sent; this is a front-end demonstration.'),
      link('Use real email instead', 'mailto:info@zebracoffee.kz'));
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
      formError.textContent = 'Please correct the marked fields. No message was sent.';
      formError.classList.remove('hidden');
      bad[0][0].focus();
      return;
    }
    rows.forEach(row => { if (row.input.value) row.input.classList.add('success', 'is-valid'); });
    showPreview(v);
  });
  form.addEventListener('input', event => {
    const row = rows.find(item => item.input === event.target);
    if (row) {
      row.error.classList.add('hidden');
      row.input.classList.remove('error', 'success', 'is-invalid', 'is-valid');
      row.input.removeAttribute('aria-invalid');
    }
    counter.textContent = `${message.value.length} / 800 characters`;
    result.classList.add('hidden');
    formError.classList.add('hidden');
  });
  form.addEventListener('change', () => { updatePhone(); result.classList.add('hidden'); });
  form.addEventListener('reset', () => {
    clearErrors();
    result.classList.add('hidden');
    setTimeout(() => { updatePhone(); counter.textContent = '0 / 800 characters'; }, 0);
  });
  const store = document.getElementById('store-status');
  if (store) store.textContent = 'Listed hours: 24/7 (not live)';
  updateCards();
  updatePhone();
})();
