/* =========================================================
   reviews.js — Reviews page (jQuery)
   1. Reviews array (+ new ones, kept only until the page is reloaded)
   2. Summary: average, stars, bars 5★…1★
   3. Filter, sort, "Show more" (first 6 visible)
   4. Form: star rating, validation, success window, new review on top
   ========================================================= */

$(function () {
    const VISIBLE_LIMIT = 6;

  // Reviews written on this page. A normal array lives only in memory,
  // so after a page reload it is empty again and only the 10 starter reviews stay.
  const newReviews = [];

  // An older version saved reviews in localStorage — clean that up once.
  localStorage.removeItem('zebraReviews');

  const starterReviews = [
    { name: 'd sss__', rating: 5, drink: 'coffee', recommend: true, createdAt: '2026-07-30', text: 'Pleasant atmosphere, great purple on Salvador Geisha. A clean balanced cup with a bright aroma, pleasant sweetness and revealing floral and fruity notes.' },
    { name: 'Aigerim K.', rating: 5, drink: 'coffee', recommend: true, createdAt: '2026-09-12', text: 'Flat White at 350 ml was smooth and not bitter. The barista remembered my order on the second visit. Quick service even in the morning rush.' },
    { name: 'Dias', rating: 4, drink: 'dessert', recommend: true, createdAt: '2026-08-21', text: 'Spanish Cheesecake is creamy and not too sweet. Would be perfect with a few more seats near the window, but the takeaway option is convenient.' },
    { name: 'Madina S.', rating: 5, drink: 'tea', recommend: true, createdAt: '2026-10-02', text: 'Tried the Blue Matcha and Mochi with strawberry. Both were fresh, the drink arrived cold and nicely layered. Prices are fair for the centre of Astana.' },
    { name: 'Timur B.', rating: 4, drink: 'coffee', recommend: true, createdAt: '2026-09-27', text: 'The cappuccino was tasty, but I waited about fifteen minutes at lunch time. Staff were polite and apologised. I will try again at a quieter hour.' },
    { name: 'Yerlan T.', rating: 5, drink: 'coffee', recommend: true, createdAt: '2026-10-21', text: 'Came at 3 am before an exam — the Americano was hot and strong and the second floor was quiet. Exactly what I needed.' },
    { name: 'Sofia', rating: 5, drink: 'tea', recommend: true, createdAt: '2026-10-24', text: 'Mango Green Matcha is so refreshing. Pretty cup, friendly barista, and the order was ready in a couple of minutes.' },
    { name: 'Nurlan A.', rating: 5, drink: 'coffee', recommend: true, createdAt: '2026-11-01', text: 'Raf with vanilla is the best in the area. I ordered ahead on the site and just picked it up on the way to class.' },
    { name: 'Kamila', rating: 5, drink: 'dessert', recommend: true, createdAt: '2026-11-05', text: 'The honey cake is soft and not too sweet. Cozy music and warm light in the evening — I stayed for two hours.' },
    { name: 'Alina', rating: 5, drink: 'dessert', recommend: true, createdAt: '2026-10-15', text: 'Warm Cinnabon with an Ice Latte with mango syrup is my new weekend habit. Clean tables, soft music and a really friendly team.' }
  ];

    function allReviews() {
    return newReviews.concat(starterReviews);   // new ones first
  }

  const drinkNames = { coffee: 'Coffee', tea: 'Tea / matcha', dessert: 'Dessert' };
  const filters = { rating: 'all', sort: 'newest', showAll: false };

  // 4 -> "★★★★☆"
  function starsText(rating) {
    return '★★★★★'.slice(0, rating) + '☆☆☆☆☆'.slice(0, 5 - rating);
  }

  function formatDate(isoDate) {
    return new Date(isoDate + 'T00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  }

  // ---------- 2. Summary ----------
  function renderSummary() {
    const reviews = allReviews();
    const sum = reviews.reduce(function (total, r) { return total + r.rating; }, 0);
    const average = reviews.length ? sum / reviews.length : 0;

    $('#avg-rating').text(average.toFixed(1));
    $('#avg-stars').text(starsText(Math.round(average)));
    $('#review-count').text('from ' + reviews.length + ' reviews');

    const $bars = $('#rating-bars').empty();
    [5, 4, 3, 2, 1].forEach(function (star) {
      const count = reviews.filter(function (r) { return r.rating === star; }).length;
      const percent = reviews.length ? (count / reviews.length) * 100 : 0;
      $('<div class="rating-bar-row">')
        .append($('<span class="label">').text(star + '★'))
        .append($('<div class="rating-bar">').append($('<div class="rating-bar-fill">').css('width', percent + '%')))
        .append($('<span class="count">').text(count))
        .appendTo($bars);
    });
  }

  // ---------- 3. List ----------
  function filteredAndSorted() {
    const list = allReviews().filter(function (r) {
      if (filters.rating === 'all') return true;
      if (filters.rating === '3') return r.rating <= 3;
      return r.rating === Number(filters.rating);
    });

    list.sort(function (a, b) {
      if (filters.sort === 'highest') return b.rating - a.rating;
      if (filters.sort === 'lowest') return a.rating - b.rating;
      return a.createdAt < b.createdAt ? 1 : -1;  // newest first
    });
    return list;
  }

  function buildReviewCard(review, index) {
    const $col = $('<div class="col-md-6 col-lg-4">');
    const $card = $('<article class="review-card">').toggleClass('is-new', Boolean(review.isOwn));

    const $head = $('<div class="d-flex justify-content-between align-items-center gap-2">');
    const $who = $('<div class="d-flex align-items-center gap-2">')
      .append($('<span class="avatar" aria-hidden="true">').addClass('avatar-' + (index % 3)).text(review.name.charAt(0).toUpperCase()))
      .append(
        $('<div>')
          .append($('<div class="fw-bold">').text(review.name))
          .append($('<div class="small text-muted-zebra">').text(formatDate(review.createdAt) + ' · ' + drinkNames[review.drink]))
      );
    const $stars = $('<span class="review-stars">').text(starsText(review.rating)).attr('aria-label', review.rating + ' out of 5 stars');
    $head.append($who, $stars);

    $card.append($head, $('<p class="mb-0">').text(review.text));   // .text() = safe for visitor text
    if (review.recommend) $card.append($('<span class="recommend-tag">').text('Recommends Zebra'));

    return $col.append($card);
  }

  function renderList() {
    const list = filteredAndSorted();
    const visible = filters.showAll ? list : list.slice(0, VISIBLE_LIMIT);
    const hiddenCount = list.length - VISIBLE_LIMIT;

    const $list = $('#review-list').empty();
    visible.forEach(function (review, index) {
      $list.append(buildReviewCard(review, index));
    });

    $('#review-empty').toggleClass('d-none', list.length > 0);
    $('#review-result-text').text(list.length + ' reviews found');

    const $more = $('#show-more');
    if (hiddenCount > 0) {
      $more.removeClass('d-none')
        .attr('aria-expanded', String(filters.showAll))
        .text(filters.showAll ? 'Show less ↑' : 'Show ' + hiddenCount + ' more review' + (hiddenCount === 1 ? '' : 's') + ' ↓');
    } else {
      $more.addClass('d-none');
    }
  }

  $('#rating-filter').on('click', '.pill-btn', function () {
    filters.rating = String($(this).data('filter'));
    filters.showAll = false;
    $(this).addClass('active').attr('aria-pressed', 'true')
      .siblings().removeClass('active').attr('aria-pressed', 'false');
    renderList();
  });

  $('#review-sort').on('change', function () {
    filters.sort = $(this).val();
    renderList();
  });

  $('#show-more').on('click', function () {
    filters.showAll = !filters.showAll;
    renderList();
  });

  renderSummary();
  renderList();

  // ---------- 4. Form ----------
  // star buttons -> hidden input #review-rating
  function paintStars(value) {
    $('#star-buttons .star-btn').each(function () {
      $(this).toggleClass('on', Number($(this).data('value')) <= value)
        .attr('aria-pressed', String(Number($(this).data('value')) === value));
    });
  }

  $('#star-buttons').on('click', '.star-btn', function () {
    const value = Number($(this).data('value'));
    $('#review-rating').val(value).trigger('change');
    paintStars(value);
  });

  $('#review-text').on('input', function () {
    $('#text-count').text($(this).val().length);
  });

  const rules = [
    { field: '#review-name', check: function () { return checkName(fieldValue('#review-name'), 40); } },
    { field: '#review-email', check: function () { return checkEmail(fieldValue('#review-email')); } },
    { field: '#review-phone', check: function () { return checkPhone(fieldValue('#review-phone'), false); } },
    {
      field: '#review-date',
      check: function () {
        const value = fieldValue('#review-date');
        if (value === '') return 'When did you visit?';
        const date = parseDate(value);
        if (!date) return 'Please choose a valid date.';
        if (date > new Date()) return 'Visit date cannot be in the future.';
        if (date < new Date('2014-01-01T00:00')) return 'We opened in 2014 — check the year.';
        return '';
      }
    },
    { field: '#rating-group', check: function () { return $('#review-rating').val() ? '' : 'Choose from 1 to 5 stars.'; } },
    {
      field: '#review-text',
      check: function () {
        const text = fieldValue('#review-text');
        if (text === '') return 'Please write a few words.';
        if (text.length < 20) return 'At least 20 characters (now ' + text.length + ').';
        if (text.length > 1000) return 'Max 1000 characters.';
        if (/(.)\1{6,}/.test(text)) return 'Please write real words, not repeated letters.';
        return '';
      }
    }
  ];

  setupForm('#review-form', rules, function () {
    const review = {
      name: fieldValue('#review-name'),
      rating: Number($('#review-rating').val()),
      drink: $('#review-drink').val(),
      recommend: $('#review-recommend').is(':checked'),
      createdAt: new Date().toISOString().slice(0, 10),
      text: fieldValue('#review-text'),
      isOwn: true
    };

        // add to the start of the array (newest first) — not saved anywhere
    newReviews.unshift(review);

    showSuccessModal({
      title: 'Review published!',
      label: 'Review number',
      number: makeNumber('ZR'),
      text: 'Thank you, ' + review.name + '! Your review is now first in the list.',
      lines: [
        ['Rating', starsText(review.rating)],
        ['Visit date', fieldValue('#review-date')],
        ['Recommends', review.recommend ? 'Yes' : 'No']
      ]
    });

    // show the new review on top
    filters.rating = 'all';
    filters.sort = 'newest';
    $('#rating-filter .pill-btn').removeClass('active').attr('aria-pressed', 'false').first().addClass('active').attr('aria-pressed', 'true');
    $('#review-sort').val('newest');
    renderSummary();
    renderList();

    // clean the form
    const $form = $('#review-form');
    $form[0].reset();
    $('#review-rating').val('');
    paintStars(0);
    $('#text-count').text('0');
    clearFormState($form);
  });
});
