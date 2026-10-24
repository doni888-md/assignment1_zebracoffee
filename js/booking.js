
'use strict';
// Booking: demo only. No data goes to a server.
(() => {
  const form = document.getElementById('booking-form');
  if (!form) return;
  form.noValidate = true;
  const $ = (id) => document.getElementById(id);
  const field = {
    name: $('full-name'), email: $('customer-email'), phone: $('customer-phone'),
    guests: $('guests-count'), date: $('booking-date'), time: $('booking-time'),
    seat: $('seating-area'), notes: $('special-requests')
  };
  const banner = $('booking-form-errors');
  const confirmation = $('booking-confirmation');
  const submit = $('booking-submit-btn');
  const seatNames = {
    'main-hall': 'Main Hall', 'window-side': 'Window Side Table',
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
      timeZone: 'Asia/Almaty', year: 'numeric', month: '2-digit',
      day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23'
    }).formatToParts(new Date());
    const p = Object.fromEntries(parts.map(x => [x.type, x.value]));
    return `${p.year}-${p.month}-${p.day}T${p.hour}:${p.minute}`;
  }
  function values() {
    return {
      name: field.name.value.trim(), email: field.email.value.trim(),
      phone: field.phone.value.trim(), guests: Number(field.guests.value),
      guestsText: field.guests.value.trim(), date: field.date.value,
      time: field.time.value, seat: field.seat.value,
      visit: form.querySelector('[name="visit_type"]:checked')?.value || '',
      wifi: $('vip-requested').checked, notes: field.notes.value.trim()
    };
  }
  function check(v) {
    const problems = [];
    const bad = (key, text) => problems.push([field[key], text]);
    if (v.name.length < 2 || v.name.length > 80) bad('name', 'Name: 2–80 characters.');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email)) bad('email', 'Enter a valid email.');
    if (!/^\d{10,15}$/.test(v.phone.replace(/\D/g, ''))) bad('phone', 'Phone: 10–15 digits.');
    if (!/^\d+$/.test(v.guestsText) || v.guests < 1 || v.guests > 10)
      bad('guests', 'Guests: whole number from 1 to 10.');
    const actualDate = /^\d{4}-\d\d-\d\d$/.test(v.date) &&
      !Number.isNaN(Date.parse(v.date)) &&
      new Date(v.date).toISOString().slice(0, 10) === v.date;
    if (!actualDate) bad('date', 'Choose a valid date.');
    if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(v.time)) bad('time', 'Choose a valid time.');
    if (actualDate && v.time && `${v.date}T${v.time}` <= localNow())
      bad('time', 'Choose a future time (Astana).');
    if (!seatNames[v.seat]) bad('seat', 'Choose a seating area.');
    if (v.notes.length > 500) bad('notes', 'Notes: maximum 500 characters.');
    if (saved.some(x => x.ref !== editing && x.email === v.email &&
      x.date === v.date && x.time === v.time))
      bad('time', 'You already have this demo request. Edit it below.');
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
      li.append(el('strong', 'me-2', `${label}:`), document.createTextNode(String(value)));
      target.append(li);
    }
    return entries.length;
  }
  function summary(v) {
    facts(previewList, [
      ['Name', v.name || '—'], ['Guests', v.guestsText || '—'],
      ['Visit', v.visit === 'business' ? 'Business Meeting' : 'Personal / Study'],
      ['Date', v.date || '—'], ['Time (Astana)', v.time || '—'],
      ['Seating', seatNames[v.seat] || '—'],
      ['Socket/Wi-Fi', v.wifi ? 'Requested, not guaranteed' : 'Not requested']
    ]);
    field.seat.classList.toggle('selected', Boolean(seatNames[v.seat]));
  }
  const preview = el('section', 'border rounded p-3 bg-light mb-3');
  preview.append(el('h4', 'h6 fw-bold', 'Live booking summary'));
  const previewList = el('ul', 'list-group mb-2');
  preview.append(previewList, el('p', 'small mb-0 text-muted',
    'Demo only: no live availability check, booking, or payment.'));
  submit.parentElement.before(preview);

  const manager = el('section', 'border rounded bg-white p-4 mb-4');
  manager.append(el('h3', 'h4', 'Manage demo requests'));
  const count = el('p', 'text-muted');
  const list = el('div', 'd-flex flex-column gap-2');
  const notice = el('p', 'small', 'Requests exist on this page only; refreshing clears them.');
  const feedback = el('p', 'small', '');
  feedback.setAttribute('role', 'status');
  const clearAll = el('button', 'btn btn-outline-danger btn-sm mt-3', 'Clear all'); clearAll.type = 'button';
  const prompt = el('div', 'alert alert-warning mt-3 hidden');
  const question = el('p', 'mb-2');
  const yes = el('button', 'btn btn-danger btn-sm me-2', 'Confirm');
  const no = el('button', 'btn btn-outline-secondary btn-sm', 'Cancel'); yes.type = no.type = 'button';
  prompt.append(question, yes, no);
  manager.append(count, notice, feedback, list, clearAll, prompt);
  $('reservation-form-section').after(manager);

  function render() {
    list.replaceChildren();
    count.textContent = `${saved.length} demo request(s), ` +
      `${saved.reduce((total, x) => total + x.guests, 0)} guest(s).`;
    clearAll.disabled = saved.length === 0;
    if (saved.length === 0) list.append(el('p', 'text-muted', 'No demo requests yet.'));
    for (const x of saved) {
      const card = el('article', 'card p-3');
      card.classList.toggle('selected', editing === x.ref);
      card.append(el('strong', '', `${x.ref} · ${x.name}`),
        el('p', 'mb-2', `${x.date}, ${x.time} · ${x.guests} guests · ${seatNames[x.seat]}`));
      for (const action of ['Edit', 'Remove']) {
        const button = el('button', 'btn btn-outline-secondary btn-sm me-2', action);
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
    do { ref = `ZC-DEMO-${Math.floor(100000 + Math.random() * 900000)}`; }
    while (saved.some(x => x.ref === ref));
    return ref;
  }
  function ask(type, ref = '') {
    pending = { type, ref };
    question.textContent = type === 'all'
      ? 'Remove all demo requests?' : `Remove demo request ${ref}?`;
    prompt.classList.remove('hidden'); yes.focus();
  }
  list.addEventListener('click', event => {
    const button = event.target.closest('button[data-action]');
    if (!button) return;
    const x = saved.find(item => item.ref === button.dataset.ref);
    if (!x) return;
    if (button.dataset.action === 'remove') { ask('one', x.ref); return; }
    for (const key of ['name', 'email', 'phone', 'guests', 'date', 'time', 'notes'])
      field[key].value = x[key];
    field.seat.value = x.seat; $('vip-requested').checked = x.wifi;
    form.querySelector(`[name="visit_type"][value="${x.visit}"]`).checked = true;
    editing = x.ref; submit.textContent = 'Save Demo Changes';
    confirmation.classList.add('hidden'); clearErrors();
    summary(values());
    render();
    field.name.focus();
    feedback.textContent = `Editing ${x.ref}. Save to update it.`;
  });
  clearAll.addEventListener('click', () => ask('all'));
  no.addEventListener('click', () => { pending = null; prompt.classList.add('hidden'); });
  yes.addEventListener('click', () => {
    if (!pending) return;
    if (pending.type === 'all') saved.length = 0;
    else saved.splice(saved.findIndex(x => x.ref === pending.ref), 1);
    if (pending.type === 'all' || editing === pending.ref) {
      editing = null;
      submit.textContent = 'Submit Reservation';
    }
    feedback.textContent = 'Demo request(s) removed. No real bookings affected.';
    pending = null; prompt.classList.add('hidden');
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
    if (problems.length) { confirmation.classList.add('hidden'); showErrors(problems); return; }
    clearErrors();
    for (const input of Object.values(field)) if (input.value) input.classList.add('success', 'is-valid');
    const ref = editing || newReference();
    const index = saved.findIndex(x => x.ref === editing);
    const item = { ...v, ref };
    if (index >= 0) saved[index] = item;
    else saved.push(item);
    editing = null; submit.textContent = 'Submit Reservation';
    confirmation.replaceChildren(
      el('h4', 'h5', index >= 0 ? 'Demo request updated' : 'Demo request saved'),
      el('p', '', `${v.name}: ${v.guests} guests, ${v.date} at ${v.time}, ${seatNames[v.seat]}.`),
      el('p', 'fw-bold', `Reference: ${ref}`),
      el('p', 'small mb-0', 'This is not a real reservation. No data was sent to a server.')
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
    banner.classList.add('hidden'); confirmation.classList.add('hidden');
    summary(values());
  });
  form.addEventListener('change', () => { confirmation.classList.add('hidden'); summary(values()); });
  form.addEventListener('reset', () => {
    editing = null; submit.textContent = 'Submit Reservation';
    confirmation.classList.add('hidden');
    clearErrors();
    feedback.textContent = 'Form reset. Saved demo requests remain.';
    setTimeout(() => { summary(values()); render(); }, 0);
  });
  field.date.min = localNow().slice(0, 10);
  summary(values());
  render();
})();
