/* =========================================================
   forms.js — shared form helpers (jQuery)
   Used by: Careers, Reviews, Booking, Contacts, Cart

   How a page uses it:
     const rules = [
       { field: '#full-name', check: function () { ...return 'error text' or ''... } },
       ...
     ];
     setupForm('#my-form', rules, function () { ...everything is valid... });

   - Red text appears in <div class="invalid-feedback" id="<field id>-error">
   - Red border = Bootstrap class .is-invalid, green border = .is-valid
   ========================================================= */

// ---------- Regular expressions used in several forms ----------
const NAME_RE = /^[A-Za-zА-Яа-яЁёӘәҒғҚқҢңӨөҰұҮүҺһІі' .-]+$/;  // letters, space, ' . -
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;                 // name@mail.kz
const PHONE_CHARS_RE = /^[\d\s()+-]+$/;                          // only allowed symbols
const PHONE_RE = /^(\+?7|8)[\s(-]*7\d{2}[\s)-]*\d{3}[\s-]?\d{2}[\s-]?\d{2}$/; // +7 7XX XXX XX XX or 8 7XX...

// Value of a field without spaces at the start/end
function fieldValue(selector) {
  return $.trim($(selector).val() || '');
}

// ---------- Ready-made checks (return error text or '') ----------
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

// "2026-11-20" -> Date at 00:00 (or null if the text is not a date)
function parseDate(value) {
  const date = new Date(value + 'T00:00');
  return isNaN(date) ? null : date;
}

function todayAtMidnight() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
}

// ---------- Showing errors ----------
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

// Runs every rule, paints the fields, returns how many errors were found.
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

// Connects a form with its rules.
// onValid() runs only when there are 0 errors.
function setupForm(formSelector, rules, onValid) {
  const $form = $(formSelector);

  $form.on('submit', function (event) {
    event.preventDefault();                 // never reload the page
    $form.data('submitted', true);

    const errors = runValidation(rules);
    $form.find('.form-alert').toggleClass('d-none', errors === 0);

    if (errors > 0) {
      // move the cursor to the first wrong field
      $form.find('.is-invalid').first().trigger('focus');
      return;
    }
    onValid();
  });

  // After the first "Send" click, check again while the user types.
  $form.on('input change', 'input, select, textarea', function () {
    if ($form.data('submitted')) {
      const errors = runValidation(rules);
      $form.find('.form-alert').toggleClass('d-none', errors === 0);
    }
  });
}

// ---------- Success window ----------
// Random number like "ZB-4821"
function makeNumber(prefix) {
  return prefix + '-' + Math.floor(1000 + Math.random() * 9000);
}

// details = { title, label, number, text, lines: [['Zone', 'Main Hall'], ...] }
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
