/* =========================================================
   cart-page.js — Cart page (jQuery)
   1. Lines from localStorage (cart.js): +/−, remove
   2. Totals: promo code = −% on the drink of the day,
        then −10% on the whole order from 5 000 ₸ (both can work)
   3. Pickup time options (from 15 minutes ahead)
   4. Pickup form validation -> success window -> receipt
   ========================================================= */

$(function () {
  const BIG_ORDER = 5000;      // from this sum you get 10%
  const BIG_ORDER_PERCENT = 10;

  let promoOn = false;         // true after a valid ZEB-#### code

  const special = getTodaySpecial();             // { id: 'raf', discount: 15, ... }
  const specialItem = findMenuItem(special.id);  // the drink of the day

  // ---------- 2. Discount logic ----------
  function calculateTotals() {
    const subtotal = getCartSubtotal();

    // 1) promo: only the lines with the drink of the day
    const specialSum = getCart()
      .filter(function (line) { return line.id === special.id; })
      .reduce(function (sum, line) { return sum + line.price * line.qty; }, 0);
    const promoDiscount = promoOn ? Math.round(specialSum * special.discount / 100) : 0;

    // 2) 10% on the rest of the order, if the order is from 5 000 ₸
    const bigDiscount = subtotal >= BIG_ORDER ? Math.round((subtotal - promoDiscount) * BIG_ORDER_PERCENT / 100) : 0;

    return {
      subtotal: subtotal,
      specialSum: specialSum,
      promoDiscount: promoDiscount,
      bigDiscount: bigDiscount,
      total: subtotal - promoDiscount - bigDiscount
    };
  }

  // ---------- 1. Render the cart ----------
  function buildLine(line) {
    const $line = $(
      '<div class="cart-line">' +
        '<img alt="">' +
        '<div class="line-info"><div class="font-display fs-5 line-name"></div><div class="small text-muted-zebra line-details"></div></div>' +
        '<div class="qty-box"><button type="button" class="qty-minus">−</button><span class="line-qty"></span><button type="button" class="qty-plus">+</button></div>' +
        '<div class="line-sum"></div>' +
        '<button type="button" class="btn-remove">' +
          '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/></svg>' +
        '</button>' +
      '</div>'
    );
    $line.attr('data-key', line.key);
    $line.find('img').attr({ src: line.image, alt: line.name });
    $line.find('.line-name').text(line.name);
    $line.find('.line-details').text((line.details ? line.details + ' · ' : '') + formatPrice(line.price));
    $line.find('.line-qty').text(line.qty);
    $line.find('.line-sum').text(formatPrice(line.price * line.qty));
    $line.find('.qty-minus').attr('aria-label', 'One less ' + line.name);
    $line.find('.qty-plus').attr('aria-label', 'One more ' + line.name);
    $line.find('.btn-remove').attr('aria-label', 'Remove ' + line.name);
    return $line;
  }

  function renderCart() {
    const cart = getCart();
    const isEmpty = cart.length === 0;

    $('#cart-empty').toggleClass('d-none', !isEmpty);
    $('#cart-full').toggleClass('d-none', isEmpty);
    if (isEmpty) return;

    const $lines = $('#cart-lines').empty();
    cart.forEach(function (line) { $lines.append(buildLine(line)); });

    const totals = calculateTotals();
    const left = BIG_ORDER - totals.subtotal;

    $('#progress-text').text(left > 0 ? 'Add ' + formatPrice(left) + ' more for 10% off' : 'You unlocked 10% off!');
    $('#discount-bar').css('width', Math.min(100, totals.subtotal / BIG_ORDER * 100) + '%');
    $('#discount-progress').attr('aria-valuenow', totals.subtotal);
    $('#sum-subtotal').text(formatPrice(totals.subtotal));
    $('#promo-name').text(promoOn ? 'Promo: ' + specialItem.name + ' −' + special.discount + '%' : 'Promo code');
    $('#sum-promo').text(totals.promoDiscount ? '−' + formatPrice(totals.promoDiscount) : '—');
    $('#promo-row').toggleClass('is-on', totals.promoDiscount > 0);
    $('#sum-big').text(totals.bigDiscount ? '−' + formatPrice(totals.bigDiscount) : '—');
    $('#big-row').toggleClass('is-on', totals.bigDiscount > 0);
    $('#sum-total').text(formatPrice(totals.total));

    // the code was applied, but the drink of the day was removed from the cart
    if (promoOn && totals.specialSum === 0) {
      promoOn = false;
      $('#promo-message').removeClass('ok').addClass('error').text(specialItem.name + ' was removed — add it again to use the code.');
      renderCart();
    }
    $('#place-order').text('Place order · ' + formatPrice(totals.total));
  }

  // +/−/remove — one handler on the list (delegation)
  $('#cart-lines').on('click', 'button', function () {
    const key = $(this).closest('.cart-line').data('key');
    if ($(this).hasClass('qty-plus')) changeQty(key, 1);
    if ($(this).hasClass('qty-minus')) changeQty(key, -1);
    if ($(this).hasClass('btn-remove')) removeFromCart(key);
    renderCart();
  });

  // ---------- Promo code ----------
  $('#promo-form').on('submit', function (event) {
    event.preventDefault();
    const code = $.trim($('#promo-code').val()).toUpperCase();
    const $message = $('#promo-message').removeClass('ok error');
    const $input = $('#promo-code').removeClass('is-invalid');

    const hasSpecial = calculateTotals().specialSum > 0;
    promoOn = false;

    if (code === '') {
      $message.addClass('error').text('Please enter a code.');
      $input.addClass('is-invalid');
    } else if (!/^ZEB-\d{4}$/.test(code)) {
      $message.addClass('error').text('Code not found. It looks like ZEB-1234.');
      $input.addClass('is-invalid');
    } else if (!hasSpecial) {
      $message.addClass('error').text('Today’s code works only for ' + specialItem.name + ' — add it from the menu.');
      $input.addClass('is-invalid');
    } else {
      promoOn = true;
      $message.addClass('ok').text('−' + special.discount + '% on ' + specialItem.name + ' applied');
    }
    renderCart();
  });

  // ---------- 3. Pickup times ----------
  function fillPickupTimes() {
    const $select = $('#order-time');
    const chosen = $select.val();
    $select.find('option:not(:first)').remove();

    const start = new Date(Date.now() + 15 * 60000);                   // +15 minutes
    start.setMinutes(Math.ceil(start.getMinutes() / 5) * 5, 0, 0);   // round up to 5 min

    for (let i = 0; i < 12; i++) {
      const time = new Date(start.getTime() + i * 10 * 60000);       // every 10 minutes
      const label = String(time.getHours()).padStart(2, '0') + ':' + String(time.getMinutes()).padStart(2, '0');
      $('<option>').val(label).text(label).attr('data-time', time.getTime()).appendTo($select);
    }
    if (chosen) $select.val(chosen);
  }

  fillPickupTimes();

  // ---------- 4. Pickup form ----------
  const rules = [
    { field: '#order-name', check: function () { return checkName(fieldValue('#order-name'), 40); } },
    { field: '#order-phone', check: function () { return checkPhone(fieldValue('#order-phone'), true); } },
    {
      field: '#order-time',
      check: function () {
        const $option = $('#order-time option:selected');
        if ($('#order-time').val() === '') return 'Choose when you will pick it up.';
        // the page could be open for a long time — the time must still be 15+ min ahead
        if (Number($option.data('time')) < Date.now() + 14 * 60000) {
          fillPickupTimes();
          return 'This time is too soon now — please choose again.';
        }
        return '';
      }
    }
  ];

  setupForm('#order-form', rules, function () {
    if (getCart().length === 0) return;

    const totals = calculateTotals();
    const number = 'Z-' + Math.floor(1000 + Math.random() * 9000);
    const time = $('#order-time').val();
    const place = $('input[name="order-place"]:checked').val() === 'here' ? 'Here' : 'Takeaway';
    const name = fieldValue('#order-name');

    // fill the receipt
    $('#receipt-number').text('#' + number);
    $('#receipt-pickup').text(time + ' · ' + place);
    $('#receipt-name').text(name);
    $('#receipt-time-title').text(time);
    const $receiptLines = $('#receipt-lines').empty();
    getCart().forEach(function (line) {
      $('<div class="receipt-row">')
        .append($('<span>').text(line.qty + ' × ' + line.name))
        .append($('<span>').text(formatPrice(line.price * line.qty)))
        .appendTo($receiptLines);
    });
    $('#receipt-subtotal').text(formatPrice(totals.subtotal));
    $('#receipt-promo-name').text(totals.promoDiscount ? 'PROMO ' + specialItem.name.toUpperCase() + ' −' + special.discount + '%' : 'PROMO');
    $('#receipt-promo').text(totals.promoDiscount ? '−' + formatPrice(totals.promoDiscount) : '—');
    $('#receipt-big').text(totals.bigDiscount ? '−' + formatPrice(totals.bigDiscount) : '—');
    $('#receipt-total').text(formatPrice(totals.total));

    showSuccessModal({
      title: 'Order sent!',
      label: 'Order number',
      number: '#' + number,
      text: 'Thank you, ' + name.split(/\s+/)[0] + '! Say this number at the counter. Pay at pickup.',
      lines: [
        ['Items', String(getCartCount())],
        ['Pickup', time + ' · ' + place],
        ['Total', formatPrice(totals.total)]
      ]
    });

    // empty the cart and switch to the receipt
    clearCart();
    $('#cart-view').addClass('d-none');
    $('#receipt-view').removeClass('d-none');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  renderCart();
});
