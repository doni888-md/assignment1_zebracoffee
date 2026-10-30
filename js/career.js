'use strict';

/**
 * Zebra Coffee - Career Application Script
 * jQuery Version: 3.7.1
 * Initialized via $(function() { ... }) to guarantee full DOM availability.
 *
 * Comparison Comment (Feature Rewrite: Form Validation & Interactive Feedback):
 * Replaced vanilla element queries and manual DOM manipulation with jQuery selectors,
 * traversal (.closest, .parent), .slideDown() animation, and event delegation.
 * The jQuery approach is more expressive, resilient, and enables seamless dynamic feedback.
 *
 * Security Note:
 * Browser-side validation is solely for instant UX and does not guarantee security.
 * Malicious actors can bypass client JS easily, so the server must always perform its own checks.
 */

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
  const selectedDate = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return selectedDate >= today;
}

$(function () {
  const $form =$('#career-application-form');
  const $confirmationAlert =$('#career-confirmation-message');

  if (!$form.length) return;

  $form.attr('novalidate', 'true');

  const $fullName =$('#full-name');
  const $email =$('#email-addr');
  const $phone =$('#phone-num');
  const $hours =$('#hours-available');
  const $startDate =$('#start-date');
  const $role =$('#desired-role');
  const $terms =$('#terms');
  const $coverLetter =$('#cover-letter');

  const $charCounter =$('<small>')
    .addClass('text-muted d-block mt-1 text-end')
    .text('Characters: 0 / 300');
  $coverLetter.after($charCounter);

  $coverLetter.on('input', function () {
    const len = $(this).val().length;
    $charCounter.text(`Characters: ${len} / 300`);
    if (len > 300) {
      $charCounter.removeClass('text-muted').addClass('text-danger fw-bold');
    } else {
      $charCounter.removeClass('text-danger fw-bold').addClass('text-muted');
    }
  });

  function setFieldStatus($field, isValid, errorMsg = '') {
    let $feedback =$field.parent().find('.invalid-feedback');

    if (!isValid) {
      $field.addClass('is-invalid').removeClass('is-valid');
      if (!$feedback.length) {
        $feedback =$('<div>').addClass('invalid-feedback small');
        $field.parent().append($feedback);
      }
      $feedback.text(errorMsg).slideDown(200); } else {$field.removeClass('is-invalid').addClass('is-valid');
      if ($feedback.length) {
        $feedback.slideUp(150, function () {$(this).text('');
        });
      }
    }
  }

  $form.on('input change', '.form-control, .form-select, .form-check-input', function () {
    const $field =$(this);
    if ($field.hasClass('is-invalid')) {
      $field.removeClass('is-invalid');$field.parent().find('.invalid-feedback').slideUp(150);
    }
  });

  $form.on('reset', function () {$form.find('.form-control, .form-select, .form-check-input').removeClass('is-invalid is-valid');
    $form.find('.invalid-feedback').hide();$charCounter.text('Characters: 0 / 300').removeClass('text-danger fw-bold').addClass('text-muted');
  });

  $form.on('submit', function (event) {
    event.preventDefault();

    let isFormValid = true;
    let $firstInvalid = null;

    const nameVal = $fullName.val().trim();
    if (nameVal.length < 3) {
      setFieldStatus($fullName, false, 'Please enter your full name (minimum 3 characters).');
      isFormValid = false;
      if (!$firstInvalid) $firstInvalid =$fullName;
    } else {
      setFieldStatus($fullName, true);
    }

    const emailVal = $email.val().trim();
    if (!isValidEmail(emailVal)) {
      setFieldStatus($email, false, 'Please enter a valid email address.');
      isFormValid = false;
      if (!$firstInvalid) $firstInvalid =$email;
    } else {
      setFieldStatus($email, true);
    }

    const phoneVal = $phone.val().trim();
    if (!isValidPhone(phoneVal)) {
      setFieldStatus($phone, false, 'Please enter a valid phone number (+7...).');
      isFormValid = false;
      if (!$firstInvalid) $firstInvalid =$phone;
    } else {
      setFieldStatus($phone, true);
    }

    const hoursVal = parseInt($hours.val().trim(), 10);
    if (isNaN(hoursVal) || hoursVal < 10 || hoursVal > 40) {
      setFieldStatus($hours, false, 'Hours per week must be between 10 and 40.');
      isFormValid = false;
      if (!$firstInvalid) $firstInvalid =$hours;
    } else {
      setFieldStatus($hours, true);
    }

    const dateVal = $startDate.val();
    if (!isFutureOrTodayDate(dateVal)) {
      setFieldStatus($startDate, false, 'Start date cannot be in the past.');
      isFormValid = false;
      if (!$firstInvalid) $firstInvalid =$startDate;
    } else {
      setFieldStatus($startDate, true);
    }

    if ($role.val() === 'shift-lead' && hoursVal < 30) {
      setFieldStatus($hours, false, 'Shift Lead position requires at least 30 hours per week.');
      isFormValid = false;
      if (!$firstInvalid) $firstInvalid =$hours;
    }

    if (!$terms.prop('checked')) {$terms.addClass('is-invalid');
      isFormValid = false;
      if (!$firstInvalid) $firstInvalid =$terms;
    } else {
      $terms.removeClass('is-invalid');
    }
    if (!isFormValid) {
      if ($firstInvalid) {$firstInvalid.focus();
      }
      return;
    }

    const demoAppId = generateApplicationId();
    const selectedRoleTitle = $role.find('option:selected').text();

    $confirmationAlert
      .removeClass('hidden')
      .hide()
      .html(`
        <div class="d-flex justify-content-between align-items-start mb-2">
          <h4 class="alert-heading fw-bold mb-0 text-success">Application Submitted Successfully!</h4>
          <button type="button" class="btn-close" id="close-confirmation-btn" aria-label="Close"></button>
        </div>
        <p class="fs-6 mb-2">Thank you, <strong>${nameVal}</strong>! Your application ID is: <mark class="fw-bold px-2 py-1 rounded bg-white shadow-sm">${demoAppId}</mark>.</p>
        <div class="p-3 bg-white rounded-3 border mb-3">
          <p class="mb-1"><strong>Selected Position:</strong> ${selectedRoleTitle}</p>
          <p class="mb-1"><strong>Commitment:</strong> ${hoursVal} hours/week</p>
          <p class="mb-0"><strong>Earliest Start:</strong> ${dateVal}</p>
        </div>
        <p class="small text-secondary mb-0">Our barista team manager will reach out via <strong>${phoneVal}</strong> within 3 business days.</p>
      `)
      
      .slideDown(500, function () {
        
        $('html, body').animate({
          scrollTop: $confirmationAlert.offset().top - 40
        }, 400);
      });

    $form[0].reset();
    $form.find('.form-control, .form-select, .form-check-input').removeClass('is-valid is-invalid');$charCounter.text('Characters: 0 / 300');
  });

  $confirmationAlert.on('click', '#close-confirmation-btn', function () {
    $confirmationAlert.slideUp(400);
  });
});