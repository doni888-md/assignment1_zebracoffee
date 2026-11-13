const NAME_RE = /^[A-Za-zА-Яа-яЁёӘәҒғҚқҢңӨөҰұҮүҺһІі' .-]+$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;
const PHONE_CHARS_RE = /^[\d\s()+-]+$/;
const PHONE_RE = /^(\+?7|8)[\s(-]*7\d{2}[\s)-]*\d{3}[\s-]?\d{2}[\s-]?\d{2}$/;

function fieldValue(selector) {
  return $.trim($(selector).val() || '');
}

function checkName(value, maxLength) {
  if (value === '') return 'Please enter your name.';
  if (value.length < 2) return 'At least 2 letters.';
  if (!NAME_RE.test(value)) return 'Use letters only — no numbers or symbols.';
  if (value.length > maxLength) return 'Max ' + maxLength + ' characters.';
  return '';
}

function checkEmail(value) {
  if (value === '') return 'Please enter your email.';
  if (/\s/.test(value)) return 'Email cannot contain spaces.';
  if (!EMAIL_RE.test(value)) return 'Email should look like name@mail.kz';
  return '';
}

function checkPhone(value, required) {
  if (value === '') return required ? 'Please enter your phone number.' : '';
  if (!PHONE_CHARS_RE.test(value)) return 'Only digits, spaces, +, ( ) and - are allowed.';
  if (!PHONE_RE.test(value)) return 'Kazakhstan mobile: +7 7XX XXX XX XX or 8 7XX XXX XX XX';
  return '';
}

function parseDate(value) {
  const date = new Date(value + 'T00:00');
  return isNaN(date) ? null : date;
}

function todayAtMidnight() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
}

function showFieldError($field, message) {
  $field.addClass('is-invalid').removeClass('is-valid');
  $field.find('.form-check-input').addClass('is-invalid');      // for radio/checkbox groups
  $('#' + $field.attr('id') + '-error').text(message).addClass('d-block');
}

function showFieldOk($field) {
  $field.removeClass('is-invalid').addClass('is-valid');
  $field.find('.form-check-input').removeClass('is-invalid');
  $('#' + $field.attr('id') + '-error').text('').removeClass('d-block');
}

function clearFormState($form) {
  $form.find('.is-invalid, .is-valid').removeClass('is-invalid is-valid');
  $form.find('.invalid-feedback').text('').removeClass('d-block');
  $form.find('.form-alert').addClass('d-none');
  $form.data('submitted', false);
}

function runValidation(rules) {
  let errorCount = 0;

  rules.forEach(function (rule) {
    const $field = $(rule.field);
    const message = rule.check();

    if (message) {
      showFieldError($field, message);
      errorCount++;
    } else {
      showFieldOk($field);
    }
  });

  return errorCount;
}

function setupForm(formSelector, rules, onValid) {
  const $form = $(formSelector);

  $form.on('submit', function (event) {
    event.preventDefault();
    $form.data('submitted', true);

    const errors = runValidation(rules);
    $form.find('.form-alert').toggleClass('d-none', errors === 0);

    if (errors > 0) {
      $form.find('.is-invalid').first().trigger('focus');
      return;
    }
    onValid();
  });

  $form.on('input change', 'input, select, textarea', function () {
    if ($form.data('submitted')) {
      const errors = runValidation(rules);
      $form.find('.form-alert').toggleClass('d-none', errors === 0);
    }
  });
}

function makeNumber(prefix) {
  return prefix + '-' + Math.floor(1000 + Math.random() * 9000);
}

function showSuccessModal(details) {
  const $modal = $('#successModal');

  $modal.find('.success-title').text(details.title);
  $modal.find('.success-label').text(details.label);
  $modal.find('.success-number').text(details.number);
  $modal.find('.success-text').text(details.text);

  const $lines = $modal.find('.success-lines').empty();
  details.lines.forEach(function (pair) {
    $('<div>')
      .append($('<span>').addClass('text-muted-zebra').text(pair[0]))
      .append($('<strong>').addClass('text-end').text(pair[1]))
      .appendTo($lines);
  });

  bootstrap.Modal.getOrCreateInstance($modal[0]).show();
}
