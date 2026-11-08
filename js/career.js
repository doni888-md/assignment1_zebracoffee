'use strict';

/**
 * Zebra Coffee - Career Application Script
 * Pure Vanilla JavaScript implementation.
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Vacancies dataset (Array of objects)
  const vacancies = [
    {
      id: 'barista',
      title: 'Express Barista',
      hourlyRate: 1400,
      schedule: 'Flexible (4–8 hour shifts)',
      experience: 'No experience required (training provided)',
      isOpen: true
    },
    {
      id: 'shift-lead',
      title: 'Shift Lead',
      hourlyRate: 1900,
      schedule: 'Full-time (rotational)',
      experience: '1+ year in specialty coffee',
      isOpen: true
    },
    {
      id: 'intern',
      title: 'Student Intern',
      hourlyRate: 1100,
      schedule: 'Part-time (15–20 hrs/week)',
      experience: 'Enrolled undergraduate student',
      isOpen: true
    },
    {
      id: 'roastery-assistant',
      title: 'Roastery Assistant',
      hourlyRate: 1600,
      schedule: 'Part-time (weekends)',
      experience: 'Basic understanding of coffee roasting',
      isOpen: false // Position filled
    }
  ];

  // DOM Elements
  const form = document.getElementById('career-application-form');
  const vacanciesTbody = document.getElementById('vacancies-table-body');
  const openCountBadge = document.getElementById('open-roles-count');
  const confirmationAlert = document.getElementById('career-confirmation-message');

  if (!form) return;

  form.noValidate = true;

  const fields = {
    name: document.getElementById('full-name'),
    email: document.getElementById('email-addr'),
    phone: document.getElementById('phone-num'),
    hours: document.getElementById('hours-available'),
    startDate: document.getElementById('start-date'),
    role: document.getElementById('desired-role'),
    terms: document.getElementById('terms'),
    coverLetter: document.getElementById('cover-letter')
  };

  // -------------------------------------------------------------------------
  // Reusable Functions with return statements (called from 2+ places)
  // -------------------------------------------------------------------------

  /**
   * Finds role object from vacancies array by ID.
   * Calls:
   * 1. Inside calculateWeeklyPay()
   * 2. Inside vacancies table delegated click handler
   * 3. Inside form submit event listener (validation & confirmation payload)
   */
  function findRoleById(roleId) {
    return vacancies.find(role => role.id === roleId) || null;
  }

  /**
   * Calculates estimated weekly earnings based on rate, hours, and night diff.
   * Condition: Shift Lead receives a +15% night/rotation shift differential.
   * Calls:
   * 1. Inside updatePayDisplay() (triggered on hours input & role change)
   * 2. Inside form submit handler (builds confirmation message data)
   */
  function calculateWeeklyPay(roleId, hours) {
    const role = findRoleById(roleId);
    const numHours = Number(hours);

    if (!role || isNaN(numHours) || numHours <= 0) {
      return 0;
    }

    let rate = role.hourlyRate;
    if (role.id === 'shift-lead') {
      rate = Math.round(rate * 1.15);
    }

    return rate * numHours;
  }

    /**
   * Counts currently open positions in vacancies array.
   * Calls:
   * 1. Inside updateOpenVacanciesBadge()
   */
  function countOpenVacancies(list) {
    return list.filter(item => item.isOpen).length;
  }

  /**
   * Writes "Open roles: X of Y" into the badge above the table.
   * Calls:
   * 1. Inside renderVacanciesTable() (first page load)
   * 2. Inside form reset handler
   */
  function updateOpenVacanciesBadge() {
    if (openCountBadge) {
      const openCount = countOpenVacancies(vacancies);
      openCountBadge.textContent = `Open roles: ${openCount} of ${vacancies.length}`;
    }
  }

  /**
   * Formats numbers into KZT currency string.
   * Calls:
   * 1. Inside renderVacanciesTable() (hourly rates)
   * 2. Inside populateRoleSelect() (option labels)
   * 3. Inside updatePayDisplay() (live calculation)
   * 4. Inside form submit handler (confirmation card)
   */
  function formatKzt(amount) {
    return `${Number(amount).toLocaleString('en-US')} ₸`;
  }

  /**
   * Returns today's date formatted as YYYY-MM-DD.
   * Calls:
   * 1. Sets min attribute for startDate input
   * 2. Inside isFutureOrTodayDate()
   */
  function todayAsInputValue() {
    const now = new Date();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${now.getFullYear()}-${month}-${day}`;
  }

  /**
   * Formats YYYY-MM-DD into a human-readable string.
   * Calls:
   * 1. Inside form submit handler (confirmation card)
   */
  function formatDate(dateString) {
    const [year, month, day] = dateString.split('-').map(Number);
    return new Date(year, month - 1, day).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  }

  function generateApplicationId() {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    return `APP-${randomSuffix}`;
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function isValidPhone(phone) {
    return /^(\+7|8)?[\s-]?\(?[0-9]{3}\)?[\s-]?[0-9]{2,3}[\s-]?[0-9]{2}[\s-]?[0-9]{2}$/.test(phone.trim());
  }

  function isFutureOrTodayDate(dateString) {
    if (!dateString) return false;
    return dateString >= todayAsInputValue();
  }

  // Set minimum selectable date
  if (fields.startDate) {
    fields.startDate.min = todayAsInputValue();
  }

  // -------------------------------------------------------------------------
  // UI Injections: Live Calculator Display & Character Counter
  // -------------------------------------------------------------------------
  const charCounter = document.createElement('small');
  charCounter.className = 'text-muted d-block mt-1 text-end';
  charCounter.textContent = 'Characters: 0 / 300';
  if (fields.coverLetter) {
    fields.coverLetter.after(charCounter);
  }

  const payPreviewWrapper = document.createElement('div');
  payPreviewWrapper.className = 'mt-2 p-2 bg-white border rounded small text-secondary';

  const payPreviewLabel = document.createTextNode('Estimated weekly earnings: ');
  const weeklyPayDisplay = document.createElement('strong');
  weeklyPayDisplay.className = 'text-dark';
  weeklyPayDisplay.id = 'weekly-pay-display';
  weeklyPayDisplay.textContent = '—';

  payPreviewWrapper.append(payPreviewLabel, weeklyPayDisplay);
  if (fields.hours) {
    fields.hours.parentElement.appendChild(payPreviewWrapper);
  }

  function updatePayDisplay() {
    if (!weeklyPayDisplay || !fields.hours || !fields.role) return;

    const hours = fields.hours.value.trim();
    if (!hours || Number(hours) <= 0) {
      weeklyPayDisplay.textContent = '— (enter hours)';
      return;
    }

    const pay = calculateWeeklyPay(fields.role.value, hours);
    const selectedRole = findRoleById(fields.role.value);
    const bonusNotice = selectedRole && selectedRole.id === 'shift-lead' ? ' (incl. 15% night diff.)' : '';

    weeklyPayDisplay.textContent = `${formatKzt(pay)}${bonusNotice}`;
  }

  // -------------------------------------------------------------------------
  // Table & Select Dynamic Population
  // -------------------------------------------------------------------------
  function renderVacanciesTable() {
    if (!vacanciesTbody) return;
    vacanciesTbody.replaceChildren();

    vacancies.forEach(job => {
      const tr = document.createElement('tr');

      const titleTd = document.createElement('td');
      titleTd.className = 'fw-semibold';
      titleTd.textContent = job.title;

      const rateTd = document.createElement('td');
      rateTd.textContent = `${formatKzt(job.hourlyRate)} / hr`;

      const schedTd = document.createElement('td');
      schedTd.textContent = job.schedule;

      const expTd = document.createElement('td');
      expTd.className = 'd-none d-md-table-cell';
      expTd.textContent = job.experience;

      const statusTd = document.createElement('td');
      const badge = document.createElement('span');
      if (job.isOpen) {
        badge.className = 'badge bg-success';
        badge.textContent = 'Hiring Now';
      } else {
        badge.className = 'badge bg-secondary';
        badge.textContent = 'Position Filled';
      }
      statusTd.appendChild(badge);

      const actionTd = document.createElement('td');
      actionTd.className = 'text-end';
      if (job.isOpen) {
        const applyBtn = document.createElement('button');
        applyBtn.type = 'button';
        applyBtn.className = 'btn btn-sm btn-outline-primary apply-role-btn';
        applyBtn.dataset.roleId = job.id;
        applyBtn.textContent = 'Apply';
        actionTd.appendChild(applyBtn);
      } else {
        const filledText = document.createElement('span');
        filledText.className = 'text-muted small fst-italic';
        filledText.textContent = 'Closed';
        actionTd.appendChild(filledText);
      }

      tr.append(titleTd, rateTd, schedTd, expTd, statusTd, actionTd);
      vacanciesTbody.appendChild(tr);
    });

    updateOpenVacanciesBadge();
    populateRoleSelect();
  }

  function populateRoleSelect() {
    if (!fields.role) return;
    fields.role.replaceChildren();

    vacancies.forEach(job => {
      const option = document.createElement('option');
      option.value = job.id;
      option.textContent = job.isOpen
        ? `${job.title} (${formatKzt(job.hourlyRate)}/hr)`
        : `${job.title} — Position Filled`;

      if (!job.isOpen) {
        option.disabled = true;
      }

      fields.role.appendChild(option);
    });

    const firstOpen = vacancies.find(v => v.isOpen);
    if (firstOpen) {
      fields.role.value = firstOpen.id;
    }
  }

  // -------------------------------------------------------------------------
  // Delegated Event: Apply Button Click on tbody
  // -------------------------------------------------------------------------
  if (vacanciesTbody) {
    vacanciesTbody.addEventListener('click', event => {
      const button = event.target.closest('.apply-role-btn');
      if (!button) return;

      const roleId = button.dataset.roleId;
      const role = findRoleById(roleId);

      if (role && role.isOpen) {
        fields.role.value = role.id;
        updatePayDisplay();

        const formSection = document.getElementById('apply-form-wrapper');
        if (formSection) {
          formSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        fields.name.focus();
      }
    });
  }

  // -------------------------------------------------------------------------
  // Validation Helpers
  // -------------------------------------------------------------------------
  function setFieldStatus(field, isValid, errorMsg = '') {
    let feedback = field.parentElement.querySelector('.invalid-feedback');

    if (!isValid) {
      field.classList.add('is-invalid');
      field.classList.remove('is-valid');
      if (!feedback) {
        feedback = document.createElement('div');
        feedback.className = 'invalid-feedback small';
        field.parentElement.appendChild(feedback);
      }
      feedback.textContent = errorMsg;
    } else {
      field.classList.remove('is-invalid');
      field.classList.add('is-valid');
      if (feedback) {
        feedback.textContent = '';
      }
    }
  }

  function clearFormStatus() {
    form.querySelectorAll('.form-control, .form-select, .form-check-input').forEach(input => {
      input.classList.remove('is-invalid', 'is-valid');
      const feedback = input.parentElement.querySelector('.invalid-feedback');
      if (feedback) {
        feedback.textContent = '';
      }
    });
  }

  // -------------------------------------------------------------------------
  // Form Events
  // -------------------------------------------------------------------------
  if (fields.coverLetter) {
    fields.coverLetter.addEventListener('input', function () {
      const len = this.value.length;
      charCounter.textContent = `Characters: ${len} / 300`;
      if (len > 300) {
        charCounter.classList.remove('text-muted');
        charCounter.classList.add('text-danger', 'fw-bold');
      } else {
        charCounter.classList.remove('text-danger', 'fw-bold');
        charCounter.classList.add('text-muted');
      }
    });
  }

  if (fields.hours) {
    fields.hours.addEventListener('input', updatePayDisplay);
  }
  if (fields.role) {
    fields.role.addEventListener('change', updatePayDisplay);
  }

  form.addEventListener('input', event => {
    const target = event.target;
    if (target.classList.contains('is-invalid')) {
      target.classList.remove('is-invalid');
      const feedback = target.parentElement.querySelector('.invalid-feedback');
      if (feedback) {
        feedback.textContent = '';
      }
    }
  });

  form.addEventListener('reset', () => {
    if (confirmationAlert) {
      confirmationAlert.classList.add('hidden');
    }
    clearFormStatus();
    charCounter.textContent = 'Characters: 0 / 300';
    charCounter.classList.remove('text-danger', 'fw-bold');
    charCounter.classList.add('text-muted');

    setTimeout(() => {
      populateRoleSelect();
      updatePayDisplay();
      updateOpenVacanciesBadge();
    }, 0);
  });

  form.addEventListener('submit', event => {
    event.preventDefault();

    let isFormValid = true;
    let firstInvalid = null;

    const nameVal = fields.name.value.trim();
    if (nameVal.length < 3) {
      setFieldStatus(fields.name, false, 'Please enter your full name (minimum 3 characters).');
      isFormValid = false;
      if (!firstInvalid) firstInvalid = fields.name;
    } else {
      setFieldStatus(fields.name, true);
    }

    const emailVal = fields.email.value.trim();
    if (!isValidEmail(emailVal)) {
      setFieldStatus(fields.email, false, 'Please enter a valid email address.');
      isFormValid = false;
      if (!firstInvalid) firstInvalid = fields.email;
    } else {
      setFieldStatus(fields.email, true);
    }

    const phoneVal = fields.phone.value.trim();
    if (!isValidPhone(phoneVal)) {
      setFieldStatus(fields.phone, false, 'Please enter a valid phone number (+7...).');
      isFormValid = false;
      if (!firstInvalid) firstInvalid = fields.phone;
    } else {
      setFieldStatus(fields.phone, true);
    }

    const hoursVal = parseInt(fields.hours.value.trim(), 10);
    if (isNaN(hoursVal) || hoursVal < 10 || hoursVal > 40) {
      setFieldStatus(fields.hours, false, 'Hours per week must be between 10 and 40.');
      isFormValid = false;
      if (!firstInvalid) firstInvalid = fields.hours;
    } else {
      setFieldStatus(fields.hours, true);
    }

    // Date validation: separate check for empty input vs past date
    const dateVal = fields.startDate.value;
    if (!dateVal) {
      setFieldStatus(fields.startDate, false, 'Please choose a start date.');
      isFormValid = false;
      if (!firstInvalid) firstInvalid = fields.startDate;
    } else if (!isFutureOrTodayDate(dateVal)) {
      setFieldStatus(fields.startDate, false, 'Start date cannot be in the past.');
      isFormValid = false;
      if (!firstInvalid) firstInvalid = fields.startDate;
    } else {
      setFieldStatus(fields.startDate, true);
    }

    if (fields.coverLetter && fields.coverLetter.value.trim().length > 300) {
      setFieldStatus(fields.coverLetter, false, 'Please keep your motivation within 300 characters.');
      isFormValid = false;
      if (!firstInvalid) firstInvalid = fields.coverLetter;
    } else if (fields.coverLetter && fields.coverLetter.value.trim().length > 0) {
      setFieldStatus(fields.coverLetter, true);
    }

    const chosenRole = findRoleById(fields.role.value);
    if (!chosenRole || !chosenRole.isOpen) {
      setFieldStatus(fields.role, false, 'This role is currently filled and not accepting applications.');
      isFormValid = false;
      if (!firstInvalid) firstInvalid = fields.role;
    } else {
      setFieldStatus(fields.role, true);
    }

    if (fields.role.value === 'shift-lead' && hoursVal < 30) {
      setFieldStatus(fields.hours, false, 'Shift Lead position requires at least 30 hours per week.');
      isFormValid = false;
      if (!firstInvalid) firstInvalid = fields.hours;
    }

        if (!fields.terms.checked) {
      setFieldStatus(fields.terms, false, 'You must confirm that your details are accurate.');
      isFormValid = false;
      if (!firstInvalid) firstInvalid = fields.terms;
    } else {
      setFieldStatus(fields.terms, true);
    }

    if (!isFormValid) {
      if (firstInvalid) {
        firstInvalid.focus();
        firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    // Success: Generate confirmation card safely via DOM API (no innerHTML with user input)
    const demoAppId = generateApplicationId();
    const roleTitle = chosenRole ? chosenRole.title : fields.role.value;
    const estPay = calculateWeeklyPay(fields.role.value, hoursVal);
    
    form.reset();
    clearFormStatus();

    if (confirmationAlert) {
      confirmationAlert.replaceChildren();

      const topRow = document.createElement('div');
      topRow.className = 'd-flex justify-content-between align-items-start mb-2';

      const header = document.createElement('h4');
      header.className = 'alert-heading fw-bold mb-0 text-success';
      header.textContent = 'Application Submitted Successfully!';

      const closeBtn = document.createElement('button');
      closeBtn.type = 'button';
      closeBtn.className = 'btn-close';
      closeBtn.id = 'close-confirmation-btn';
      closeBtn.setAttribute('aria-label', 'Close');

      topRow.append(header, closeBtn);

      const greeting = document.createElement('p');
      greeting.className = 'fs-6 mb-2';

      const strongName = document.createElement('strong');
      strongName.textContent = nameVal;

      const idMark = document.createElement('mark');
      idMark.className = 'fw-bold px-2 py-1 rounded bg-white shadow-sm';
      idMark.textContent = demoAppId;

      greeting.append('Thank you, ', strongName, '! Your application ID is: ', idMark, '.');

      const detailsBox = document.createElement('div');
      detailsBox.className = 'p-3 bg-white rounded-3 border mb-3';

      const pRole = document.createElement('p');
      pRole.className = 'mb-1';
      const roleLabel = document.createElement('strong');
      roleLabel.textContent = 'Selected Position: ';
      pRole.append(roleLabel, roleTitle);

      const pHours = document.createElement('p');
      pHours.className = 'mb-1';
      const hoursLabel = document.createElement('strong');
      hoursLabel.textContent = 'Commitment: ';
      pHours.append(hoursLabel, `${hoursVal} hours/week (Est. Pay: ${formatKzt(estPay)})`);

      const pDate = document.createElement('p');
      pDate.className = 'mb-0';
      const dateLabel = document.createElement('strong');
      dateLabel.textContent = 'Earliest Start: ';
      pDate.append(dateLabel, formatDate(dateVal));

      detailsBox.append(pRole, pHours, pDate);

      const note = document.createElement('p');
      note.className = 'small text-secondary mb-0';
      const pPhone = document.createElement('strong');
      pPhone.textContent = phoneVal;
      note.append('Our barista team manager will reach out via ', pPhone, ' within 3 business days.');

      confirmationAlert.append(topRow, greeting, detailsBox, note);
      confirmationAlert.classList.remove('hidden');
      confirmationAlert.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    updatePayDisplay();
  });

  if (confirmationAlert) {
    confirmationAlert.addEventListener('click', event => {
      if (event.target.closest('#close-confirmation-btn')) {
        confirmationAlert.classList.add('hidden');
      }
    });
  }

  // -------------------------------------------------------------------------
  // Initialization
  // -------------------------------------------------------------------------
  renderVacanciesTable();
  updatePayDisplay();
});