/* =========================================================
   booking.js — Booking page (jQuery)
   1. Zone cards work like radio buttons
   2. Form validation (every field) + success window
   ========================================================= */

$(function () {
  const $zones = $('#zone-group');
  const $zoneInput = $('#booking-zone');

  // ---------- 1. Zones ----------
  $zones.on('click', '.zone-card', function () {
    const $card = $(this);

    $zones.find('.zone-card').removeClass('is-selected').attr('aria-checked', 'false')
      .find('.zone-mark').text('Tap to choose');
    $card.addClass('is-selected').attr('aria-checked', 'true')
      .find('.zone-mark').text('✓ Selected');

    $zoneInput.val($card.data('zone')).trigger('change'); // re-check the form if needed
    // after choosing on a phone, scroll to the form
    if (window.innerWidth < 768) {
      document.getElementById('booking-form').scrollIntoView({ behavior: 'smooth' });
    }
  });

  $('#special-requests').on('input', function () {
    $('#notes-count').text($(this).val().length);
  });

  // ---------- 2. Rules ----------
  const rules = [
    {
      field: '#booking-zone',
      check: function () {
        const empty = $zoneInput.val() === '';
        $zones.toggleClass('is-invalid', empty);   // red borders on the zone cards
        return empty ? 'Choose a zone above: Main Hall, Window or Quiet Corner.' : '';
      }
    },
    {
      field: '#booking-name',
      check: function () {
        const name = fieldValue('#booking-name');
        if (name === '') return 'Please enter your name.';
        if (name.length < 2 || name.length > 80) return 'Please enter a name with 2–80 characters.';
        if (!NAME_RE.test(name)) return 'Use letters only — no numbers or symbols.';
        return '';
      }
    },
    { field: '#booking-email', check: function () { return checkEmail(fieldValue('#booking-email')); } },
    { field: '#booking-phone', check: function () { return checkPhone(fieldValue('#booking-phone'), true); } },
    {
      field: '#guests-count',
      check: function () {
        const guests = fieldValue('#guests-count');
        if (guests === '') return 'How many guests?';
        if (!/^\d+$/.test(guests) || Number(guests) < 1 || Number(guests) > 10) return 'Choose a whole number of guests from 1 to 10.';
        return '';
      }
    },
    {
      field: '#booking-date',
      check: function () {
        const value = fieldValue('#booking-date');
        if (value === '') return 'Please choose a date.';
        const date = parseDate(value);
        if (!date) return 'Please choose a valid date.';
        const today = todayAtMidnight();
        const max = new Date(today);
        max.setDate(max.getDate() + 30);
        if (date < today) return 'This date has already passed.';
        if (date > max) return 'You can book up to 30 days ahead.';
        return '';
      }
    },
    {
      field: '#booking-time',
      check: function () {
        const time = fieldValue('#booking-time');
        const date = fieldValue('#booking-date');
        if (time === '') return 'Please choose a time.';
        if (date !== '' && new Date(date + 'T' + time) <= new Date()) return 'Please choose a future time in Astana.';
        return '';
      }
    },
    {
      field: '#special-requests',
      check: function () {
        const length = $('#special-requests').val().length;
        return length > 500 ? 'Notes must contain at most 500 characters (now ' + length + ').' : '';
      }
    }
  ];

  setupForm('#booking-form', rules, function () {
    const $chosen = $zones.find('.is-selected');
    const name = fieldValue('#booking-name');

    showSuccessModal({
      title: 'Table booked!',
      label: 'Booking number',
      number: makeNumber('ZB'),
      text: 'See you, ' + name.split(/\s+/)[0] + '! We hold the table for 15 minutes. Confirmation goes to ' + fieldValue('#booking-email') + '.',
      lines: [
        ['Zone', $chosen.data('name')],
        ['Guests', fieldValue('#guests-count')],
        ['Date', fieldValue('#booking-date')],
        ['Time', fieldValue('#booking-time')],
        ['Visit type', $('input[name="visit_type"]:checked').val() === 'business' ? 'Business Meeting' : 'Personal / Study'],
        ['Wi-Fi + socket', $('#wifi-requested').is(':checked') ? 'Yes' : 'No']
      ]
    });

    // clean everything for the next booking
    const $form = $('#booking-form');
    $form[0].reset();
    $zoneInput.val('');
    $zones.removeClass('is-invalid').find('.zone-card').removeClass('is-selected').attr('aria-checked', 'false')
      .find('.zone-mark').text('Tap to choose');
    $('#notes-count').text('0');
    clearFormState($form);
  });
});
