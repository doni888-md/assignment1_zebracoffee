'use strict';

/**
 * Zebra Coffee - Booking Form & Demo Request Manager
 * jQuery Version: 3.7.1 (full build, including effects).
 * $(function () { ... }) waits for the DOM before finding fields or attaching handlers.
 * Browser validation improves feedback but can be bypassed; a real server must validate again.
 * This page is a front-end demonstration: requests stay in memory and are not real bookings.
 */
$(function () {
  const $form = $('#booking-form');
  if (!$form.length) return;

  const $fields = {
    name: $('#full-name'),
    email: $('#customer-email'),
    phone: $('#customer-phone'),
    guests: $('#guests-count'),
    date: $('#booking-date'),
    time: $('#booking-time'),
    seat: $('#seating-area'),
    notes: $('#special-requests')
  };

  const $visitOptions = $form.find('input[name="visit_type"]');
  const $wifi = $('#vip-requested');
  const $banner = $('#booking-form-errors');
  const $confirmation = $('#booking-confirmation').addClass('text-break');
  const $submit = $('#booking-submit-btn');

  const seatNames = {
    'main-hall': 'Main Hall',
    'window-side': 'Window Side Table',
    'quiet-corner': 'Quiet Workspace Corner'
  };

  const saved = [];
  const feedbackById = new Map();

  let editing = null;
  let pending = null;
  let validationStarted = false;
  let invalidCheckQueued = false;
  let resetAfterSuccess = false;
  let $returnFocus = $submit;

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

    const value = Object.fromEntries(
      parts.map(part => [part.type, part.value])
    );

    return `${value.year}-${value.month}-${value.day}T${value.hour}:${value.minute}`;
  }

  // Rewrite 1: .val(), .prop() and .find() replace value/checked/querySelector reads.
  // Reading the form is shorter; the actual validation rules still need explicit checks.
  function readValues() {
    return {
      name: $fields.name.val().trim(),
      email: $fields.email.val().trim(),
      phone: $fields.phone.val().trim(),
      guests: Number($fields.guests.val()),
      guestsText: $fields.guests.val().trim(),
      date: $fields.date.val().trim(),
      time: $fields.time.val().trim(),
      seat: $fields.seat.val() || '',
      visit: $form.find('input[name="visit_type"]:checked').val() || '',

      // .prop('checked') is the live boolean; .attr('checked') describes the HTML default.
      wifi: $wifi.prop('checked'),

      notes: $fields.notes.val().trim()
    };
  }

  function isValidPhone(phone) {
    const validCharacters = /^\+?(?:\d|\(\d{2,4}\))[\d ()-]*\d$/.test(phone);

    const validBrackets =
      !/[()]/.test(phone) ||
      /^[^()]*\(\d{2,4}\)[^()]*$/.test(phone);

    const digits = phone.replace(/[ ()-]/g, '');

    return validCharacters &&
      validBrackets &&
      /^\+?\d{10,15}$/.test(digits);
  }

  function validate(values) {
    const problems = {};
    const now = localNow();

    if (values.name.length < 2 || values.name.length > 80) {
      problems.name = 'Please enter a name with 2–80 characters.';
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
      problems.email = 'Please enter a valid email address.';
    }

    if (!isValidPhone(values.phone)) {
      problems.phone =
        'Use 10–15 digits, with an optional leading +, spaces, hyphens or area-code brackets.';
    }

    if (
      !/^\d+$/.test(values.guestsText) ||
      values.guests < 1 ||
      values.guests > 10
    ) {
      problems.guests = 'Choose a whole number of guests from 1 to 10.';
    }

    const dateIsValid =
      /^\d{4}-\d{2}-\d{2}$/.test(values.date) &&
      !Number.isNaN(Date.parse(values.date)) &&
      new Date(values.date).toISOString().slice(0, 10) === values.date;

    if (!dateIsValid) {
      problems.date = 'Please choose a valid date.';
    } else if (values.date < now.slice(0, 10)) {
      problems.date = 'The booking date cannot be in the past (Astana time).';
    }

    const timeIsValid = /^([01]\d|2[0-3]):[0-5]\d$/.test(values.time);

    if (!timeIsValid) {
      problems.time = 'Please choose a valid time.';
    } else if (
      dateIsValid &&
      !problems.date &&
      `${values.date}T${values.time}` <= now
    ) {
      problems.time = 'Please choose a future time in Astana.';
    }

    if (!Object.hasOwn(seatNames, values.seat)) {
      problems.seat = 'Choose a seating area.';
    }

    if (!['personal', 'business'].includes(values.visit)) {
      problems.visit = 'Choose a visit type.';
    }

    if (values.notes.length > 500) {
      problems.notes = 'Notes must contain at most 500 characters.';
    }

    if (
      !problems.email &&
      !problems.date &&
      !problems.time &&
      saved.some(item =>
        item.ref !== editing &&
        item.email.toLowerCase() === values.email.toLowerCase() &&
        item.date === values.date &&
        item.time === values.time
      )
    ) {
      problems.time =
        'You already have this demo request. Use Edit in the list below.';
    }

    // Keep native required/type/min/max constraints effective.
    Object.entries($fields).forEach(([key, $field]) => {
      const validity = $field.prop('validity');

      if (!problems[key] && validity && !validity.valid) {
        problems[key] =
          $field.prop('validationMessage') ||
          'Please check this field.';
      }
    });

    return problems;
  }

  // Feedback is created in code; no new error elements are handwritten in HTML.
  $form.find('.form-control, .form-select').each(function () {
    const $field = $(this);
    const id = $field.attr('id');

    const $message = $('<div>')
      .attr('id', `${id}-error`)
      .addClass('small text-danger mt-1 hidden');

    const descriptions = [
      $field.attr('aria-describedby'),
      $message.attr('id')
    ].filter(Boolean);

    $field
      .attr('aria-describedby', descriptions.join(' '))
      .after($message);

    feedbackById.set(id, $message);
  });

  const $visitMessage = $('<div>')
    .attr('id', 'booking-visit-error')
    .addClass('small text-danger mt-1 hidden');

  $visitOptions.last().parent().after($visitMessage);

  $visitOptions
    .attr('aria-describedby', 'booking-visit-error')
    .prop('required', true);

  function setFieldStatus($field, $message, message) {
    if (message) {
      $field
        .removeClass('success is-valid')
        .addClass('error is-invalid')
        .attr('aria-invalid', 'true');

      $message.text(message).removeClass('hidden');
    } else {
      const wasInvalid = $field.hasClass('is-invalid');

      $field
        .removeClass('error is-invalid')
        .removeAttr('aria-invalid');

      $message.text('').addClass('hidden');

      if (wasInvalid) {
        $field.addClass('success is-valid');
      }
    }
  }

  function displayProblems(problems, focusFirst = false) {
    let $firstInvalid = null;

    Object.entries($fields).forEach(([key, $field]) => {
      setFieldStatus(
        $field,
        feedbackById.get($field.attr('id')),
        problems[key]
      );

      if (problems[key] && !$firstInvalid) {
        $firstInvalid = $field;
      }
    });

    setFieldStatus($visitOptions, $visitMessage, problems.visit);

    if (problems.visit && !$firstInvalid) {
      $firstInvalid = $visitOptions.first();
    }

    $banner
      .text('Please correct the fields below. Nothing was submitted.')
      .toggleClass('hidden', !$firstInvalid);

    if (focusFirst && $firstInvalid) {
      $firstInvalid.trigger('focus');
    }
  }

  function clearErrors() {
    $form.find('input, select, textarea')
      .removeClass('error success is-invalid is-valid')
      .removeAttr('aria-invalid');

    feedbackById.forEach($message => {
      $message.text('').addClass('hidden');
    });

    $visitMessage.text('').addClass('hidden');
    $banner.addClass('hidden');
  }

  const $preview = $('<section>')
    .attr('id', 'booking-preview')
    .addClass('border rounded p-3 bg-light mb-3');

  const $previewList = $('<ul>').addClass('list-group mb-2');

  $preview.append(
    $('<h4>').addClass('h6 fw-bold').text('Live booking summary'),
    $previewList,
    $('<p>')
      .addClass('small mb-0 text-muted')
      .text('Demo only: no live availability check, booking or payment.')
  );

  $submit.parent().before($preview);

  // Rewrite 2: .empty(), .append() and .text() replace replaceChildren/createElement/textContent.
  // The list builder is shorter and treats visitor-provided values as plain text.
  function updateSummary(values) {
    const visitName = values.visit === 'business'
      ? 'Business Meeting'
      : values.visit === 'personal'
        ? 'Personal / Study'
        : '—';

    const entries = [
      ['Name', values.name || '—'],
      ['Guests', values.guestsText || '—'],
      ['Visit', visitName],
      ['Date', values.date || '—'],
      ['Time (Astana)', values.time || '—'],
      ['Seating', seatNames[values.seat] || '—'],
      ['Socket/Wi-Fi', values.wifi ? 'Requested, not guaranteed' : 'Not requested']
    ];

    $previewList.empty();

    entries.forEach(([label, value]) => {
      $('<li>')
        .addClass('list-group-item text-break')
        .append(
          $('<strong>').addClass('me-2').text(`${label}:`),
          $('<span>').text(String(value))
        )
        .appendTo($previewList);
    });

    $fields.seat.toggleClass(
      'selected',
      Object.hasOwn(seatNames, values.seat)
    );
  }

  const $manager = $('<section>')
    .attr('id', 'booking-manager')
    .addClass('border rounded bg-white p-4 mb-4');

  const $count = $('<p>')
    .attr({
      id: 'booking-request-count',
      'aria-live': 'polite'
    })
    .addClass('text-muted');

  const $list = $('<div>')
    .attr('id', 'booking-request-list')
    .addClass('d-flex flex-column gap-2');

  const $feedback = $('<p>')
    .attr({
      role: 'status',
      'aria-live': 'polite'
    })
    .addClass('small');

  const $clearAll = $('<button>')
    .attr({
      type: 'button',
      id: 'booking-clear-all'
    })
    .addClass('btn btn-outline-danger btn-sm mt-3')
    .text('Clear all');

  const $prompt = $('<div>')
    .attr({
      id: 'booking-delete-prompt',
      role: 'group',
      'aria-labelledby': 'booking-delete-question'
    })
    .addClass('alert alert-warning mt-3 hidden');

  const $question = $('<p>')
    .attr('id', 'booking-delete-question')
    .addClass('mb-2');

  const $yes = $('<button>')
    .attr({
      type: 'button',
      id: 'booking-confirm-delete'
    })
    .addClass('btn btn-danger btn-sm me-2')
    .text('Confirm');

  const $no = $('<button>')
    .attr({
      type: 'button',
      id: 'booking-cancel-delete'
    })
    .addClass('btn btn-outline-secondary btn-sm')
    .text('Cancel');

  $prompt.append($question, $yes, $no);

  $manager.append(
    $('<h3>').addClass('h4').text('Manage demo requests'),
    $count,
    $('<p>')
      .addClass('small')
      .text('Requests exist on this page only; refreshing clears them.'),
    $feedback,
    $list,
    $clearAll,
    $prompt
  ).insertAfter('#reservation-form-section');

  // Rewrite 3: .append() and a delegated .on() replace manual nodes and native click handling.
  // Rendering is clearer; the saved-array and edit/remove rules remain explicit.
  function renderRequests() {
    $list.empty();

    const totalGuests = saved.reduce(
      (sum, item) => sum + item.guests,
      0
    );

    $count.text(
      `${saved.length} demo request(s), ${totalGuests} guest(s).`
    );

    $clearAll.prop('disabled', saved.length === 0);

    if (!saved.length) {
      $list.append(
        $('<p>').addClass('text-muted').text('No demo requests yet.')
      );
    }

    saved.forEach(item => {
      const $card = $('<article>')
        .attr('data-ref', item.ref)
        .addClass('card p-3 text-break')
        .toggleClass('selected', editing === item.ref);

      $card.append(
        $('<strong>').text(`${item.ref} · ${item.name}`),
        $('<p>')
          .addClass('mb-2')
          .text(
            `${item.date}, ${item.time} · ${item.guests} guests · ${seatNames[item.seat]}`
          )
      );

      const $actions = $('<div>').addClass('d-flex gap-2');

      ['Edit', 'Remove'].forEach(action => {
        $('<button>')
          .attr({
            type: 'button',
            'data-action': action.toLowerCase(),
            'data-ref': item.ref
          })
          .addClass('btn btn-outline-secondary btn-sm')
          .text(action)
          .appendTo($actions);
      });

      $card.append($actions).appendTo($list);
    });
  }

  function newReference() {
    let reference;

    do {
      reference = `ZC-DEMO-${Math.floor(100000 + Math.random() * 900000)}`;
    } while (saved.some(item => item.ref === reference));

    return reference;
  }

  function hideConfirmation() {
    $confirmation.stop(true, true).fadeOut(150, function () {
      $(this).addClass('hidden');
    });
  }

  function closePrompt(restoreFocus = false) {
    pending = null;

    $prompt.stop(true, true).slideUp(180, function () {
      $(this).addClass('hidden');

      if (restoreFocus) {
        $returnFocus.trigger('focus');
      }
    });
  }

  // Rewrite 4: .slideDown()/.slideUp() replace abrupt classList visibility changes.
  // This is longer, but the callback focuses confirmation only after it becomes visible.
  function askToRemove(type, reference, $button) {
    pending = { type, reference };
    $returnFocus = $button;

    $question.text(
      type === 'all'
        ? 'Remove all demo requests?'
        : `Remove demo request ${reference}?`
    );

    $prompt
      .stop(true, true)
      .removeClass('hidden')
      .slideUp(0)
      .slideDown(220, function () {
        $yes.trigger('focus');
      });
  }

  // The list exists now, but renderRequests() creates and replaces its buttons later.
  // Direct binding would miss future buttons; delegation handles every generated button.
  $list.on('click', 'button[data-action]', function () {
    const $button = $(this);
    const $card = $button.closest('article');
    const reference = $card.attr('data-ref');
    const item = saved.find(request => request.ref === reference);

    if (!item) return;

    if ($button.attr('data-action') === 'remove') {
      askToRemove('one', reference, $button);
      return;
    }

    closePrompt();
    editing = reference;

    Object.entries($fields).forEach(([key, $field]) => {
      $field.val(item[key]);
    });

    $visitOptions
      .prop('checked', false)
      .filter(`[value="${item.visit}"]`)
      .prop('checked', true);

    $wifi.prop('checked', item.wifi);
    $submit.text('Save Demo Changes');

    validationStarted = false;
    clearErrors();
    hideConfirmation();
    updateSummary(readValues());

    // addClass selects this card, siblings finds other cards, removeClass clears their selection.
    $card
      .addClass('selected')
      .siblings('article')
      .removeClass('selected');

    $feedback.text(`Editing ${reference}. Save to update it.`);
    $fields.name.trigger('focus');
  });

  $clearAll.on('click', function () {
    if (saved.length) {
      askToRemove('all', '', $(this));
    }
  });

  $no.on('click', function () {
    closePrompt(true);
  });

  $yes.on('click', function () {
    if (!pending) return;

    const removingEdited =
      pending.type === 'all' ||
      pending.reference === editing;

    if (pending.type === 'all') {
      saved.length = 0;
    } else {
      const index = saved.findIndex(
        item => item.ref === pending.reference
      );

      if (index >= 0) {
        saved.splice(index, 1);
      }
    }

    if (removingEdited) {
      $form.trigger('reset');
    }

    closePrompt();
    hideConfirmation();
    renderRequests();

    if (validationStarted) {
      displayProblems(validate(readValues()));
    }

    $feedback.text(
      'Demo request(s) removed. No real bookings were affected.'
    );

    $submit.trigger('focus');
  });

  $form.on('submit', function (event) {
    // Without preventDefault(), the browser would POST to booking.html and leave this page.
    event.preventDefault();

    validationStarted = true;

    const values = readValues();
    const problems = validate(values);

    displayProblems(problems, true);

    if (Object.keys(problems).length) {
      hideConfirmation();
      return;
    }

    const reference = editing || newReference();
    const index = saved.findIndex(item => item.ref === editing);
    const request = { ...values, ref: reference };

    if (index >= 0) {
      saved[index] = request;
    } else {
      saved.push(request);
    }

    resetAfterSuccess = true;
    $form.trigger('reset');
    resetAfterSuccess = false;

    updateSummary(readValues());
    renderRequests();

    // .html() is for fixed, trusted markup; visitor input always uses .text().
    $confirmation.empty().append(
      $('<div>')
        .addClass('d-flex justify-content-between align-items-start gap-2')
        .append(
          $('<h4>')
            .addClass('h5')
            .text(index >= 0 ? 'Demo request updated' : 'Demo request saved'),

          $('<button>')
            .attr({
              type: 'button',
              id: 'booking-close-confirmation',
              'aria-label': 'Close confirmation'
            })
            .addClass('btn-close')
        ),

      $('<p>').text(
        `${values.name}: ${values.guests} guests, ${values.date} at ${values.time}, ${seatNames[values.seat]}.`
      ),

      $('<p>')
        .html('<strong>Reference:</strong> ')
        .append($('<span>').text(reference)),

      $('<p>')
        .addClass('small mb-0')
        .text('This is not a real reservation. No data was sent to a server.')
    );

    $confirmation
      .stop(true, true)
      .removeClass('hidden')
      .fadeOut(0)
      .fadeIn(250);

    $feedback.text('You can edit or remove this demo request below.');
  });

  // Native validation runs before submit. Required/type/min/max remain enabled.
  $form.find('input, select, textarea').on('invalid', function (event) {
    // Suppress only the browser tooltip; the browser still blocks invalid submission.
    event.preventDefault();

    validationStarted = true;

    if (invalidCheckQueued) return;
    invalidCheckQueued = true;

    setTimeout(function () {
      invalidCheckQueued = false;

      if (!validationStarted) return;

      hideConfirmation();
      displayProblems(validate(readValues()), true);
    }, 0);
  });

  $form.on(
    'input change',
    '.form-control, .form-select, .form-check-input',
    function () {
      const $field = $(this);

      if ($field.is('[type="date"]')) {
        $field.attr('min', localNow().slice(0, 10));
      }

      hideConfirmation();
      updateSummary(readValues());

      // Recheck all rules so date/email changes also clear dependent errors.
      if (validationStarted) {
        displayProblems(validate(readValues()));
      }
    }
  );

  $form.on('reset', function () {
    editing = null;
    validationStarted = false;

    $submit.text('Submit Reservation');
    clearErrors();
    closePrompt();

    if (!resetAfterSuccess) {
      hideConfirmation();
      $feedback.text('Form reset. Saved demo requests remain.');
    }

    // The reset event happens before the browser restores default values.
    setTimeout(function () {
      updateSummary(readValues());
      renderRequests();
    }, 0);
  });

  $confirmation.on('click', '#booking-close-confirmation', function () {
    hideConfirmation();
    $submit.trigger('focus');
  });

  $fields.date.attr('min', localNow().slice(0, 10));

  updateSummary(readValues());
  renderRequests();
});