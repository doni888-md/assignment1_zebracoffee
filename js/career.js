
document.addEventListener('DOMContentLoaded', function () {

  const vacancies = [
    { id: 'barista', title: 'Express Barista', hourlyRate: 1400, schedule: 'Flexible (4–8 hour shifts)', experience: 'No experience required (training provided)', isOpen: true },
    { id: 'shift-lead', title: 'Shift Lead', hourlyRate: 1900, schedule: 'Full-time (rotational)', experience: '1+ year in specialty coffee', isOpen: true },
    { id: 'intern', title: 'Student Intern', hourlyRate: 1100, schedule: 'Part-time (15–20 hrs/week)', experience: 'Enrolled undergraduate student', isOpen: true },
    { id: 'roastery-assistant', title: 'Roastery Assistant', hourlyRate: 1600, schedule: 'Part-time (weekends)', experience: 'Basic understanding of coffee roasting', isOpen: false }
  ];

  const grid = document.getElementById('vacancy-grid');
  const roleSelect = document.getElementById('desired-role');
  const chosenBox = document.getElementById('chosen-role');

  function findRoleById(id) {
    return vacancies.find(function (v) { return v.id === id; });
  }

  function calculateWeeklyPay(role, hours) {
    const bonus = role.id === 'shift-lead' ? 1.15 : 1;
    return role.hourlyRate * hours * bonus;
  }

  function renderVacancies() {
    grid.innerHTML = '';

    vacancies.forEach(function (role) {
      const col = document.createElement('div');
      col.className = 'col-sm-6 col-lg-3';

      const card = document.createElement('article');
      card.className = 'vacancy-card hover-lift' + (role.isOpen ? '' : ' is-closed');
      card.dataset.id = role.id;

      const status = document.createElement('span');
      status.className = 'tag align-self-start';
      status.textContent = role.isOpen ? 'Open' : 'Closed';

      const title = document.createElement('h2');
      title.className = 'font-display h4 mb-0';
      title.textContent = role.title;

      const rate = document.createElement('div');
      rate.className = 'vacancy-rate';
      rate.innerHTML = formatPrice(role.hourlyRate) + ' <small>/ hour</small>';

      const list = document.createElement('ul');
      list.className = 'vacancy-list';
      [role.schedule, role.experience].forEach(function (text) {
        const li = document.createElement('li');
        li.textContent = text;
        list.appendChild(li);
      });

      card.append(status, title, rate, list);

      if (role.isOpen) {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'btn btn-zebra mt-auto apply-btn';
        button.dataset.id = role.id;
        button.textContent = 'Apply';
        card.appendChild(button);
      } else {
        const filled = document.createElement('span');
        filled.className = 'vacancy-filled';
        filled.textContent = 'Position filled';
        card.appendChild(filled);
      }

      col.appendChild(card);
      grid.appendChild(col);
    });

    const openCount = vacancies.filter(function (v) { return v.isOpen; }).length;
    document.getElementById('open-count').textContent = openCount;
  }

  function populateRoleSelect() {
    vacancies.forEach(function (role) {
      if (!role.isOpen) return;
      const option = document.createElement('option');
      option.value = role.id;
      option.textContent = role.title;
      roleSelect.appendChild(option);
    });
  }

  function showChosenRole(id) {
    document.querySelectorAll('.vacancy-card').forEach(function (card) {
      const chosen = card.dataset.id === id;
      card.classList.toggle('is-chosen', chosen);
      const button = card.querySelector('.apply-btn');
      if (button) {
        button.textContent = chosen ? '✓ Selected' : 'Apply';
        button.classList.toggle('btn-zebra-teal', chosen);
        button.classList.toggle('btn-zebra', !chosen);
      }
    });

    const role = findRoleById(id);
    if (role) {
      chosenBox.textContent = 'Applying for: ' + role.title + ' · ' + formatPrice(role.hourlyRate) + ' / hour';
      chosenBox.classList.remove('d-none');
    } else {
      chosenBox.classList.add('d-none');
    }
  }

  renderVacancies();
  populateRoleSelect();

  grid.addEventListener('click', function (event) {
    const button = event.target.closest('.apply-btn');
    if (!button) return;

    roleSelect.value = button.dataset.id;
    roleSelect.dispatchEvent(new Event('change', { bubbles: true })); // re-check the form if needed
    document.getElementById('apply').scrollIntoView({ behavior: 'smooth' });
  });

  roleSelect.addEventListener('change', function () {
    showChosenRole(roleSelect.value);
  });


  const cover = document.getElementById('cover-letter');
  cover.addEventListener('input', function () {
    document.getElementById('cover-count').textContent = cover.value.length;
  });

  const rules = [
    {
      field: '#full-name',
      check: function () {
        const name = fieldValue('#full-name');
        if (name === '') return 'Please enter your full name.';
        if (!NAME_RE.test(name)) return 'Use letters only — no numbers or symbols.';
        if (name.split(/\s+/).length < 2) return 'Write first and last name.';
        if (name.length > 60) return 'Name is too long (max 60 characters).';
        return '';
      }
    },
    { field: '#email-addr', check: function () { return checkEmail(fieldValue('#email-addr')); } },
    { field: '#phone-num', check: function () { return checkPhone(fieldValue('#phone-num'), true); } },
    {
      field: '#hours-available',
      check: function () {
        const hours = fieldValue('#hours-available');
        if (hours === '') return 'How many hours can you work?';
        if (!/^\d+$/.test(hours)) return 'Whole number only.';
        if (Number(hours) < 10 || Number(hours) > 40) return 'From 10 to 40 hours per week.';
        return '';
      }
    },
    {
      field: '#start-date',
      check: function () {
        const value = fieldValue('#start-date');
        if (value === '') return 'Choose a start date.';
        const date = parseDate(value);
        if (!date) return 'Please choose a valid date.';
        const today = todayAtMidnight();
        const max = new Date(today);
        max.setMonth(max.getMonth() + 6);
        if (date < today) return 'Start date cannot be in the past.';
        if (date > max) return 'Choose a date within the next 6 months.';
        return '';
      }
    },
    { field: '#desired-role', check: function () { return roleSelect.value === '' ? 'Choose a role.' : ''; } },
    {
      field: '#schedule-group',
      check: function () {
        return document.querySelector('input[name="schedule"]:checked') ? '' : 'Choose part-time or full-time.';
      }
    },
    {
      field: '#resume-file',
      check: function () {
        const file = document.getElementById('resume-file').files[0];
        if (!file) return '';
        if (!/\.(pdf|docx)$/i.test(file.name)) return 'Only .pdf or .docx files.';
        if (file.size > 5 * 1024 * 1024) return 'File is too big (max 5 MB).';
        return '';
      }
    },
    {
      field: '#cover-letter',
      check: function () {
        return cover.value.length > 500 ? 'Max 500 characters (now ' + cover.value.length + ').' : '';
      }
    },
    {
      field: '#terms',
      check: function () { return document.getElementById('terms').checked ? '' : 'Please accept to continue.'; }
    }
  ];

  const form = document.getElementById('career-form');

  setupForm('#career-form', rules, function () {
    const role = findRoleById(roleSelect.value);
    const hours = Number(fieldValue('#hours-available'));
    const file = document.getElementById('resume-file').files[0];
    const schedule = document.querySelector('input[name="schedule"]:checked').value;

    showSuccessModal({
      title: 'Application sent!',
      label: 'Application number',
      number: makeNumber('ZC'),
      text: 'Thank you, ' + fieldValue('#full-name').split(/\s+/)[0] + '! We will call you within 3 working days.',
      lines: [
        ['Role', role.title],
        ['Hours per week', String(hours)],
        ['Estimated weekly pay', formatPrice(calculateWeeklyPay(role, hours))],
        ['Start date', fieldValue('#start-date')],
        ['Schedule', schedule === 'full-time' ? 'Full-time' : 'Part-time'],
        ['Resume', file ? file.name : 'not attached']
      ]
    });

    form.reset();
    clearFormState($(form));
    showChosenRole('');
    document.getElementById('cover-count').textContent = '0';
  });
});
