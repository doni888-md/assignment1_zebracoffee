/* =========================================================
   contacts.js — Contacts page (jQuery)
   1. Live clock: Astana time (UTC+5)
   2. Email / phone switch in the form
   3. Form validation + success window
   ========================================================= */

$(function () {

  // ---------- 1. Clock ----------
  // Astana is UTC+5 — so the clock is right even if the computer is in another city.
  function updateClock() {
    const now = new Date();
    const utcMinutes = now.getTime() / 60000 + now.getTimezoneOffset();
    const astana = new Date((utcMinutes + 5 * 60) * 60000);

    const parts = [astana.getHours(), astana.getMinutes(), astana.getSeconds()].map(function (n) {
      return String(n).padStart(2, '0');
    });
    $('#astana-clock').text(parts.join(':'));
  }

  updateClock();
  setInterval(updateClock, 1000);

  // ---------- 2. Reply by email or phone ----------
  function replyMethod() {
    return $('input[name="reply-method"]:checked').val();
  }

  $('input[name="reply-method"]').on('change', function () {
    const byPhone = replyMethod() === 'phone';
    $('#phone-block').toggleClass('d-none', !byPhone);
    $('#email-block').toggleClass('d-none', byPhone);
  });

  $('#contact-message').on('input', function () {
    $('#message-count').text($(this).val().length);
  });

  // ---------- 3. Rules ----------
  const topicNames = {
    general: 'General question', booking: 'Booking', feedback: 'Feedback',
    lost: 'Lost item', careers: 'Careers', partner: 'Partnership'
  };

  const rules = [
    { field: '#contact-topic', check: function () { return $('#contact-topic').val() === '' ? 'Choose a topic.' : ''; } },
    { field: '#contact-name', check: function () { return checkName(fieldValue('#contact-name'), 60); } },
    {
      field: '#contact-email',
      check: function () { return replyMethod() === 'email' ? checkEmail(fieldValue('#contact-email')) : ''; }
    },
    {
      field: '#contact-phone',
      check: function () { return replyMethod() === 'phone' ? checkPhone(fieldValue('#contact-phone'), true) : ''; }
    },
    {
      field: '#contact-message',
      check: function () {
        const message = fieldValue('#contact-message');
        if (message === '') return 'Please write your message.';
        if (message.length < 10) return 'At least 10 characters (now ' + message.length + ').';
        if (message.length > 500) return 'At most 500 characters.';
        if ($('#contact-topic').val() === 'lost' && message.length < 20) return 'Describe the lost item and when you visited.';
        return '';
      }
    }
  ];

  setupForm('#contact-form', rules, function () {
    const byPhone = replyMethod() === 'phone';

    showSuccessModal({
      title: 'Message sent!',
      label: 'Request number',
      number: makeNumber('ZM'),
      text: 'Thank you, ' + fieldValue('#contact-name').split(/\s+/)[0] + '! We will reply within a day.',
      lines: [
        ['Topic', topicNames[$('#contact-topic').val()]],
        ['Reply by', byPhone ? 'Phone call' : 'Email'],
        [byPhone ? 'Phone' : 'Email', byPhone ? fieldValue('#contact-phone') : fieldValue('#contact-email')]
      ]
    });

    const $form = $('#contact-form');
    $form[0].reset();
    $('#phone-block').addClass('d-none');
    $('#email-block').removeClass('d-none');
    $('#message-count').text('0');
    clearFormState($form);
  });
});
