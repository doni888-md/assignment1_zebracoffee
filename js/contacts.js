'use strict';

/**
 * Zebra Coffee - Contacts, Help Finder & Enquiry Preview
 * jQuery Version: 3.7.1 (full build, including effects).
 * $(function () { ... }) waits until the DOM is ready before finding page elements.
 * This is a demo: enquiries are previewed locally and never sent or stored.
 * Browser validation improves feedback; a real server must validate again because client checks can be bypassed.
 */
$(function () {
  const $main = $('main');
  const $anchor = $('#cozy-corner');

  if (!$main.length || !$anchor.length) return;

  const topics = [
    {
      title: 'Book a table',
      category: 'Visit',
      info: 'Choose date, time and guests.',
      keywords: 'booking reservation',
      url: 'booking.html',
      enquiryTopic: 'booking'
    },
    {
      title: 'View our menu',
      category: 'Menu',
      info: 'See coffee drinks and prices.',
      keywords: 'coffee latte drinks',
      url: 'menu.html',
      enquiryTopic: 'general'
    },
    {
      title: 'Share a review',
      category: 'Feedback',
      info: 'Read or write customer reviews.',
      keywords: 'rating comments review',
      url: 'reviews.html',
      enquiryTopic: 'feedback'
    },
    {
      title: 'Find a job',
      category: 'Careers',
      info: 'See available positions.',
      keywords: 'job work barista',
      url: 'career.html',
      enquiryTopic: 'careers'
    },
    {
      title: 'Get directions',
      category: 'Visit',
      info: 'Mangilik El 38, Astana.',
      keywords: 'address map directions',
      url: 'https://2gis.kz/astana/geo/70000001045554424',
      enquiryTopic: 'general'
    },
    {
      title: 'Call the cafe',
      category: 'Contact',
      info: '+7 747 029 00 43',
      keywords: 'phone telephone',
      url: 'tel:+77470290043',
      enquiryTopic: 'general'
    },
    {
      title: 'Email the cafe',
      category: 'Contact',
      info: 'info@zebracoffee.kz',
      keywords: 'email message',
      url: 'mailto:info@zebracoffee.kz',
      enquiryTopic: 'general'
    },
    {
      title: 'Working hours',
      category: 'Visit',
      info: 'Listed schedule: open 24/7.',
      keywords: 'opening time schedule',
      url: '#opening-hours',
      enquiryTopic: 'general'
    }
  ];

  const enquiryTopics = [
    ['', 'Choose a topic'],
    ['general', 'General question'],
    ['booking', 'Booking'],
    ['feedback', 'Feedback'],
    ['lost', 'Lost item'],
    ['careers', 'Careers'],
    ['partner', 'Partnership']
  ];

  let hasAttemptedSubmit = false;
  let resettingAfterSuccess = false;

  function createElement(tag, classes = '', text = '') {
    return $(`<${tag}>`).addClass(classes).text(text);
  }

  function addOptions($select, choices) {
    choices.forEach(function ([value, label]) {
      $('<option>')
        .attr('value', value)
        .text(label)
        .appendTo($select);
    });

    return $select;
  }

  function createLink(label, url) {
    const $link = $('<a>')
      .attr('href', url)
      .addClass('btn btn-outline-primary btn-sm')
      .text(label);

    if (url.startsWith('https://')) {
      $link.attr({
        target: '_blank',
        rel: 'noopener noreferrer'
      });
    }

    return $link;
  }

  function createFieldRow(
    label,
    $input,
    columns = 'col-12 col-md-6',
    withError = true
  ) {
    const $row = createElement('div', columns);

    $('<label>')
      .attr('for', $input.attr('id'))
      .addClass('form-label fw-semibold')
      .text(label)
      .appendTo($row);

    $row.append($input);

    if (withError) {
      const errorId = `${$input.attr('id')}-error`;

      $input.attr('aria-describedby', errorId);

      $('<div>')
        .attr({
          id: errorId,
          'aria-live': 'polite'
        })
        .addClass('invalid-feedback small hidden')
        .appendTo($row);
    }

    return $row;
  }

  // Rewrite 1: .val(), .empty() and .append() replace input.value, replaceChildren and appendChild.
  // DOM updates are clearer; this version is longer because cards also connect to the enquiry form.
  const $guide = createElement(
    'section',
    'p-4 rounded border bg-white shadow-sm mb-4'
  ).attr('id', 'contact-help-guide');

  const $controls = createElement('div', 'row g-3 mb-3');

  const $search = $('<input>')
    .attr({
      type: 'search',
      id: 'help-search',
      placeholder: 'Search: booking, menu, phone...'
    })
    .addClass('form-control');

  const $category = addOptions(
    $('<select>')
      .attr('id', 'help-category')
      .addClass('form-select'),
    [
      ['all', 'All categories'],
      ['Visit', 'Visit'],
      ['Menu', 'Menu'],
      ['Feedback', 'Feedback'],
      ['Careers', 'Careers'],
      ['Contact', 'Contact']
    ]
  );

  const $sorting = addOptions(
    $('<select>')
      .attr('id', 'help-sort')
      .addClass('form-select'),
    [
      ['default', 'Recommended'],
      ['az', 'A–Z'],
      ['za', 'Z–A']
    ]
  );

  const $count = createElement('p', 'fw-semibold')
    .attr({
      id: 'help-result-count',
      role: 'status',
      'aria-live': 'polite'
    });

  const $cards = createElement('div', 'row g-3')
    .attr('id', 'help-cards');

  const $noResults = createElement(
    'p',
    'alert alert-info hidden mt-3',
    'No matches. Try another search.'
  ).attr('id', 'help-no-results');

  const $resetSearch = createElement(
    'button',
    'btn btn-outline-secondary mt-3',
    'Reset search'
  ).attr({
    type: 'button',
    id: 'help-reset-btn'
  });

  $controls.append(
    createFieldRow('Search', $search, 'col-12 col-md-5', false),
    createFieldRow('Category', $category, 'col-12 col-md-4', false),
    createFieldRow('Sort', $sorting, 'col-12 col-md-3', false)
  );

  $guide.append(
    createElement('h3', 'h4', 'How can we help?'),
    $controls,
    $count,
    $cards,
    $noResults,
    $resetSearch
  );

  function updateCards() {
    const query = $search.val().trim().toLowerCase();
    const category = $category.val();
    const order = $sorting.val();

    const found = topics.filter(function (item) {
      return (category === 'all' || item.category === category) &&
        `${item.title} ${item.info} ${item.keywords}`
          .toLowerCase()
          .includes(query);
    });

    if (order === 'az') {
      found.sort((a, b) => a.title.localeCompare(b.title));
    }

    if (order === 'za') {
      found.sort((a, b) => b.title.localeCompare(a.title));
    }

    $cards.empty();

    found.forEach(function (item) {
      const $column = createElement('div', 'col-12 col-md-6');
      const $card = createElement('article', 'card h-100 p-3');

      const $actions = createElement(
        'div',
        'd-flex gap-2 flex-wrap mt-auto'
      );

      const $askButton = createElement(
        'button',
        'btn btn-outline-secondary btn-sm',
        'Ask about this'
      ).attr({
        type: 'button',
        'data-enquiry-topic': item.enquiryTopic
      });

      $actions.append(
        createLink('Open', item.url),
        $askButton
      );

      $card.append(
        createElement('h4', 'h6 fw-bold', item.title),
        createElement('p', 'small', `${item.category} — ${item.info}`),
        $actions
      );

      $column.append($card).appendTo($cards);
    });

    $count.text(`Showing ${found.length} of ${topics.length} actions`);
    $noResults.toggleClass('hidden', found.length !== 0);
    $category.toggleClass('selected', category !== 'all');
  }

  $search.on('input', updateCards);

  $category.add($sorting).on('change', updateCards);

  $resetSearch.on('click', function () {
    $search.val('');
    $category.val('all');
    $sorting.val('default');

    updateCards();
    $search.trigger('focus');
  });

  const $section = createElement(
    'section',
    'p-4 rounded border bg-white shadow-sm mb-4'
  ).attr('id', 'contact-enquiry-section');

  // .html() interprets trusted markup; .text() displays visitor input as plain text.
  const $intro = $('<p>')
    .addClass('text-muted')
    .html(
      '<strong>Demo only:</strong> preview an enquiry here. Nothing is sent to a server.'
    );

  const $form = $('<form>').attr({
    id: 'contact-enquiry-form',
    method: 'post',
    action: 'contacts.html'
  });

  const $formError = createElement('p', 'alert alert-danger hidden')
    .attr({
      id: 'contact-form-errors',
      role: 'alert'
    });

  const $grid = createElement('div', 'row g-3');

  const $name = $('<input>')
    .attr({
      type: 'text',
      id: 'contact-name',
      name: 'fullName',
      autocomplete: 'name',
      placeholder: 'Your name',
      minlength: 2,
      maxlength: 80
    })
    .addClass('form-control')
    .prop('required', true);

  const $email = $('<input>')
    .attr({
      type: 'email',
      id: 'contact-email',
      name: 'email',
      autocomplete: 'email',
      placeholder: 'name@mail.kz',
      maxlength: 254
    })
    .addClass('form-control')
    .prop('required', true);

  const $topic = addOptions(
    $('<select>')
      .attr({
        id: 'contact-topic',
        name: 'topic'
      })
      .addClass('form-select')
      .prop('required', true),
    enquiryTopics
  );

  const $method = addOptions(
    $('<select>')
      .attr({
        id: 'contact-method',
        name: 'replyMethod'
      })
      .addClass('form-select')
      .prop('required', true),
    [
      ['email', 'Email'],
      ['phone', 'Phone']
    ]
  );

  const $phone = $('<input>')
    .attr({
      type: 'tel',
      id: 'contact-phone',
      name: 'phone',
      autocomplete: 'tel',
      placeholder: '+7 700 000 00 00',
      maxlength: 30
    })
    .addClass('form-control');

  const $message = $('<textarea>')
    .attr({
      id: 'contact-message',
      name: 'message',
      rows: 5,
      minlength: 20,
      maxlength: 800,
      placeholder: 'Explain your question (20–800 characters)'
    })
    .addClass('form-control')
    .prop('required', true);

  const $phoneRow = createFieldRow(
    'Telephone (if phone reply chosen)',
    $phone,
    'col-12'
  ).attr('id', 'contact-phone-row');

  const $messageRow = createFieldRow(
    'Message',
    $message,
    'col-12'
  );

  const $counter = createElement(
    'p',
    'small text-muted mt-1',
    '0 / 800 characters'
  ).attr({
    id: 'contact-message-counter',
    'aria-live': 'polite'
  });

  $message.attr(
    'aria-describedby',
    'contact-message-error contact-message-counter'
  );

  $messageRow.append($counter);

  $grid.append(
    createFieldRow('Full name', $name),
    createFieldRow('Email address', $email),
    createFieldRow('Topic', $topic),
    createFieldRow('Preferred reply', $method),
    $phoneRow,
    $messageRow
  );

  const $buttons = createElement(
    'div',
    'd-flex gap-2 flex-wrap mt-3'
  );

  const $previewButton = createElement(
    'button',
    'btn btn-primary',
    'Preview enquiry'
  ).attr({
    type: 'submit',
    id: 'contact-preview-btn'
  });

  const $resetButton = createElement(
    'button',
    'btn btn-outline-secondary',
    'Clear form'
  ).attr({
    type: 'reset',
    id: 'contact-reset-btn'
  });

  const $result = createElement(
    'section',
    'alert alert-success hidden mt-3'
  ).attr({
    id: 'contact-enquiry-preview',
    role: 'status',
    'aria-live': 'polite',
    tabindex: '-1'
  });

  $buttons.append($previewButton, $resetButton);
  $form.append($formError, $grid, $buttons);

  $section.append(
    createElement('h3', 'h4', 'Prepare an enquiry'),
    $intro,
    $form,
    $result
  );

  $anchor.before($guide, $section);

  const $fields = $form.find('.form-control, .form-select');

  function readValues() {
    return {
      name: $name.val().trim(),
      email: $email.val().trim(),
      topic: $topic.val() || '',
      method: $method.val() || '',
      phone: $phone.val().trim(),
      message: $message.val().trim()
    };
  }

  function isValidPhone(value) {
    if (value.length > 30) return false;

    // Only paired digit groups are replaced; unmatched brackets and letters still fail.
    const withoutBrackets = value.replace(/\(\d+\)/g, '0');
    const formatIsValid = /^\+?\d(?:[\d -]*\d)?$/.test(withoutBrackets);
    const digits = value.replace(/\D/g, '');

    return formatIsValid && /^\d{10,15}$/.test(digits);
  }

  // Rewrite 2: .val(), .prop(), .each() and class methods replace value/required/classList.
  // Feedback chains are clearer; complete validation is not shorter than the original rules.
  function getFieldError($field, values) {
    const id = $field.attr('id');

    if (id === 'contact-phone' && values.method !== 'phone') {
      return '';
    }

    if (
      id === 'contact-name' &&
      (values.name.length < 2 || values.name.length > 80)
    ) {
      return 'Enter your full name (2–80 characters).';
    }

    if (
      id === 'contact-email' &&
      (
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email) ||
        values.email.length > 254
      )
    ) {
      return 'Enter a valid email address, for example name@mail.kz.';
    }

    if (
      id === 'contact-topic' &&
      !enquiryTopics.some(([value]) => value && value === values.topic)
    ) {
      return 'Choose a topic for your enquiry.';
    }

    if (
      id === 'contact-method' &&
      !['email', 'phone'].includes(values.method)
    ) {
      return 'Choose Email or Phone as your reply method.';
    }

    if (id === 'contact-phone' && !isValidPhone(values.phone)) {
      return 'Enter 10–15 digits using an optional leading +, spaces, hyphens or paired brackets.';
    }

    if (
      id === 'contact-message' &&
      (values.message.length < 20 || values.message.length > 800)
    ) {
      return 'Write a message of 20–800 characters, excluding surrounding spaces.';
    }

    // Native constraints stay active together with trimmed-value checks.
    const validity = $field.prop('validity');

    if (validity && !validity.valid) {
      const label = $field.siblings('label').text();
      return `Please check ${label.toLowerCase()}.`;
    }

    return '';
  }

  function setFieldStatus($field, errorMessage) {
    const $feedback = $field.parent().find('.invalid-feedback');

    if (errorMessage) {
      $field
        .removeClass('success is-valid')
        .addClass('error is-invalid')
        .attr('aria-invalid', 'true');

      $feedback.text(errorMessage).removeClass('hidden');
    } else {
      const hasValue =
        !$field.prop('disabled') &&
        String($field.val() || '').trim() !== '';

      $field
        .removeClass('error is-invalid')
        .removeAttr('aria-invalid')
        .toggleClass('success', hasValue)
        .toggleClass('is-valid', hasValue);

      $feedback.text('').addClass('hidden');
    }
  }

  function validateForm() {
    const values = readValues();
    let $firstInvalid = null;

    $fields.each(function () {
      const $field = $(this);
      const errorMessage = getFieldError($field, values);

      setFieldStatus($field, errorMessage);

      if (errorMessage && !$firstInvalid) {
        $firstInvalid = $field;
      }
    });

    $formError
      .text('Please correct the marked fields. No message was sent.')
      .toggleClass('hidden', !$firstInvalid);

    return $firstInvalid;
  }

  function clearErrors() {
    $fields
      .removeClass('error success is-invalid is-valid')
      .removeAttr('aria-invalid');

    $form.find('.invalid-feedback')
      .text('')
      .addClass('hidden');

    $formError.text('').addClass('hidden');
  }

  function hidePreview() {
    // Cancel animation without running its focus callback while the visitor is typing.
    $result.stop(true, false).addClass('hidden');
  }

  // Rewrite 3: .prop(), .hasClass() and slide effects replace classList/required changes.
  // Animation makes the conditional field easier to notice; this is longer than an instant toggle.
  function updatePhone(animate = true) {
    const needed = $method.val() === 'phone';

    $phone.prop({
      required: needed,
      disabled: !needed
    });

    $phoneRow.stop(true, true);

    if (!animate) {
      $phoneRow
        .slideDown(0)
        .toggleClass('hidden', !needed);
    } else if (needed && $phoneRow.hasClass('hidden')) {
      $phoneRow
        .removeClass('hidden')
        .slideUp(0)
        .slideDown(200);
    } else if (!needed && !$phoneRow.hasClass('hidden')) {
      $phoneRow.slideUp(200, function () {
        $(this).addClass('hidden');
      });
    }

    if (!needed) {
      $phone
        .removeClass('error success is-invalid is-valid')
        .removeAttr('aria-invalid');

      $phone.siblings('.invalid-feedback')
        .text('')
        .addClass('hidden');
    }
  }

  function showPreview(values, topicLabel) {
    const $heading = createElement(
      'div',
      'd-flex justify-content-between align-items-start gap-2 mb-2'
    );

    const $closeButton = $('<button>')
      .attr({
        type: 'button',
        'data-close-preview': 'true',
        'aria-label': 'Close enquiry preview'
      })
      .addClass('btn-close');

    $heading.append(
      createElement('h4', 'h5 mb-0', 'Enquiry preview — not sent'),
      $closeButton
    );

    const $list = createElement('ul', 'list-group mb-3');

    const facts = [
      ['Name', values.name],
      ['Email', values.email],
      ['Topic', topicLabel],
      ['Reply by', values.method === 'phone' ? values.phone : 'Email'],
      ['Message', values.message]
    ];

    facts.forEach(function ([label, value]) {
      const $item = createElement('li', 'list-group-item text-break');

      $item.append(
        createElement('strong', 'me-2', `${label}:`),
        createElement('span', '', value)
      ).appendTo($list);
    });

    $result
      .empty()
      .append(
        $heading,
        $list,
        createElement(
          'p',
          'small',
          'No message was sent. Use email to contact the cafe.'
        ),
        createLink(
          'Use real email instead',
          'mailto:info@zebracoffee.kz'
        )
      )
      .removeClass('hidden')
      .fadeOut(0)
      .fadeIn(250, function () {
        // Focus the preview after the animation finishes.
        $(this).trigger('focus');
      });
  }

  // Direct handlers would miss buttons created by later searches.
  // Delegation on the existing cards container also handles future buttons.
  $cards.on('click', 'button[data-enquiry-topic]', function () {
    const $button = $(this);
    const $card = $button.closest('article');

    // Select this card, reach its column, find sibling columns and clear their card selection.
    $card
      .addClass('selected')
      .parent()
      .siblings()
      .find('article')
      .removeClass('selected');

    $topic
      .val($button.attr('data-enquiry-topic'))
      .trigger('change');

    $message.trigger('focus');
  });

  // invalid does not bubble, so each field gets a direct .on() handler.
  // Native validation stays enabled, while jQuery displays every field message.
  $fields.on('invalid', function () {
    hasAttemptedSubmit = true;
    hidePreview();
    validateForm();
  });

  $form.on('input change', '.form-control, .form-select', function () {
    const $field = $(this);

    hidePreview();

    if ($field.attr('id') === 'contact-method') {
      updatePhone();
    }

    const length = $message.val().length;

    $counter
      .text(`${length} / 800 characters`)
      .toggleClass('text-danger', length > 800)
      .toggleClass('text-muted', length <= 800);

    // Revalidate: a field stays marked until its value actually becomes valid.
    if (hasAttemptedSubmit || $field.hasClass('is-invalid')) {
      validateForm();
    }
  });

  $form.on('submit', function (event) {
    // Without preventDefault(), the browser would POST and navigate away.
    event.preventDefault();

    hasAttemptedSubmit = true;
    hidePreview();

    const $firstInvalid = validateForm();

    if ($firstInvalid) {
      $firstInvalid.trigger('focus');
      return;
    }

    const values = readValues();
    const topicLabel = $topic.find('option:selected').text();

    resettingAfterSuccess = true;
    $form.trigger('reset');
    resettingAfterSuccess = false;

    showPreview(values, topicLabel);
  });

  $form.on('reset', function () {
    hasAttemptedSubmit = false;
    clearErrors();

    if (!resettingAfterSuccess) {
      hidePreview();
    }

    // Default values are restored after this reset handler returns.
    setTimeout(function () {
      updatePhone(false);

      $counter
        .text('0 / 800 characters')
        .removeClass('text-danger')
        .addClass('text-muted');
    }, 0);
  });

  $result.on('click', 'button[data-close-preview]', function () {
    $result.stop(true, true).fadeOut(200, function () {
      $(this).addClass('hidden');
      $previewButton.trigger('focus');
    });
  });

  $('#store-status').text('Listed hours: 24/7 (not live)');

  updateCards();
  updatePhone(false);
});