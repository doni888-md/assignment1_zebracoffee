'use strict';

/**
 * Zebra Coffee - Career Application Script
 * Features: Form validation, field-level feedback, logic checks, demo confirmation
 */

function generateApplicationId() {
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `APP-${randomSuffix}`;
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function isValidPhone(phone) {
  const phoneRegex = /^(\+7|8)?[\s-]?\(?[0-9]{3}\)?[\s-]?[0-9]{3}[\s-]?[0-9]{2}[\s-]?[0-9]{2}$/;
  return phoneRegex.test(phone.trim());
}

function isFutureOrTodayDate(dateString) {
  if (!dateString) return false;
  const selectedDate = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return selectedDate >= today;
}

function setFieldStatus(inputElement, isValid, errorMessage = '') {
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
    if (feedback) {
      feedback.textContent = '';
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('career-application-form');
  const errorAlert = document.getElementById('career-form-errors');
  const confirmationAlert = document.getElementById('career-confirmation-message');

  if (!form) return;

  // Отключаем стандартные HTML5 подсказки браузера, чтобы работала наша кастомная JS-валидация
  form.setAttribute('novalidate', 'true');

  const fullNameInput = document.getElementById('full-name');
  const emailInput = document.getElementById('email-addr');
  const phoneInput = document.getElementById('phone-num');
  const hoursInput = document.getElementById('hours-available');
  const startDateInput = document.getElementById('start-date');
  const roleSelect = document.getElementById('desired-role');
  const termsCheckbox = document.getElementById('terms');

  form.addEventListener('reset', () => {
    const inputs = form.querySelectorAll('.form-control, .form-select, .form-check-input');
    inputs.forEach(input => {
      input.classList.remove('is-invalid', 'is-valid');
    });
    if (errorAlert) {
      errorAlert.classList.add('hidden');
      errorAlert.textContent = '';
    }
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    let isFormValid = true;
    let firstInvalidField = null;
    const errorsList = [];

    // 1. Full Name
    const trimmedName = fullNameInput.value.trim();
    if (trimmedName.length < 3) {
      setFieldStatus(fullNameInput, false, 'Please enter your full name (minimum 3 characters).');
      isFormValid = false;
      errorsList.push('Full Name is required (min 3 chars).');
      if (!firstInvalidField) firstInvalidField = fullNameInput;
    } else {
      setFieldStatus(fullNameInput, true);
    }

    // 2. Email
    if (!isValidEmail(emailInput.value)) {
      setFieldStatus(emailInput, false, 'Please enter a valid email address.');
      isFormValid = false;
      errorsList.push('Valid Email address is required.');
      if (!firstInvalidField) firstInvalidField = emailInput;
    } else {
      setFieldStatus(emailInput, true);
    }

    // 3. Phone
    if (!isValidPhone(phoneInput.value)) {
      setFieldStatus(phoneInput, false, 'Please enter a valid phone number.');
      isFormValid = false;
      errorsList.push('Valid Phone Number is required.');
      if (!firstInvalidField) firstInvalidField = phoneInput;
    } else {
      setFieldStatus(phoneInput, true);
    }

    // 4. Hours
    const hours = parseInt(hoursInput.value, 10);
    if (isNaN(hours) || hours < 10 || hours > 40) {
      setFieldStatus(hoursInput, false, 'Available hours must be between 10 and 40.');
      isFormValid = false;
      errorsList.push('Hours per week must be between 10 and 40.');
      if (!firstInvalidField) firstInvalidField = hoursInput;
    } else {
      setFieldStatus(hoursInput, true);
    }

    // 5. Start Date
    if (!isFutureOrTodayDate(startDateInput.value)) {
      setFieldStatus(startDateInput, false, 'Earliest start date cannot be in the past.');
      isFormValid = false;
      errorsList.push('Start Date must be today or in the future.');
      if (!firstInvalidField) firstInvalidField = startDateInput;
    } else {
      setFieldStatus(startDateInput, true);
    }

    // 6. Role Rule
    if (roleSelect.value === 'shift-lead' && hours < 30) {
      setFieldStatus(hoursInput, false, 'Shift Lead requires at least 30 hours per week.');
      isFormValid = false;
      errorsList.push('Shift Lead requires at least 30 hours per week.');
      if (!firstInvalidField) firstInvalidField = hoursInput;
    }

    // 7. Terms
    if (!termsCheckbox.checked) {
      termsCheckbox.classList.add('is-invalid');
      isFormValid = false;
      errorsList.push('You must confirm that details are accurate.');
      if (!firstInvalidField) firstInvalidField = termsCheckbox;
    } else {
      termsCheckbox.classList.remove('is-invalid');
    }

    // Если есть ошибки — показываем красный блок
    if (!isFormValid) {
      if (errorAlert) {
        errorAlert.classList.remove('hidden');
        errorAlert.className = 'alert alert-danger mb-4 shadow-sm rounded-3';
        errorAlert.innerHTML = `<strong>Please correct the following:</strong><ul class="mb-0 mt-2 ps-3">${errorsList.map(err => `<li>${err}</li>`).join('')}</ul>`;
        errorAlert.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      if (firstInvalidField) {
        firstInvalidField.focus();
      }
      return;
    }

    // Если всё верно — скрываем ошибки и показываем успех
    if (errorAlert) {
      errorAlert.classList.add('hidden');
      errorAlert.textContent = '';
    }

    const demoAppId = generateApplicationId();

    if (confirmationAlert) {
      confirmationAlert.classList.remove('hidden');
      confirmationAlert.className = 'alert alert-success mt-4 p-4 rounded-3 shadow-sm';
      confirmationAlert.innerHTML = `
        <h4 class="alert-heading fw-bold mb-2">🎉 Application Submitted! (Demo Mode)</h4>
        <p class="mb-1">Thank you, <strong>${fullNameInput.value.trim()}</strong>! Application ID: <mark class="fw-bold px-2 py-1 rounded">${demoAppId}</mark>.</p>
        <p class="mb-1"><strong>Position:</strong> ${roleSelect.options[roleSelect.selectedIndex].text}</p>
        <p class="mb-1"><strong>Availability:</strong> ${hours} hrs/week, starting from ${startDateInput.value}</p>
        <hr>
        <p class="mb-0 small text-muted"><em>Notice: Academic front-end simulation. No real data has been sent to a server.</em></p>
      `;
      confirmationAlert.scrollIntoView({ behavior: 'smooth' });
    }

    form.reset();
    const inputs = form.querySelectorAll('.form-control, .form-select, .form-check-input');
    inputs.forEach(input => input.classList.remove('is-valid'));
  });
});