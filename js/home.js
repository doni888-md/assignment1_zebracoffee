/* =========================================================
   home.js — Home page (jQuery)
   1. Rotating italic word in the hero
   2. "Hits right now" cards from data.js
   3. Mood picker
   4. Night Owls timer (00:00–06:00)
   5. Today's perk + promo code
   ========================================================= */

$(function () {

  // ---------- 1. Rotating word ----------
  const $words = $('.rotating-word');
  let wordIndex = 0;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!reduceMotion) {
    setInterval(function () {
      $words.eq(wordIndex).removeClass('is-active');
      wordIndex = (wordIndex + 1) % $words.length;      // 0,1,2,3,4,0,1...
      $words.eq(wordIndex).addClass('is-active');
    }, 2200);
  }

  // ---------- 2. Hits ----------
  const hitIds = ['raf', 'flat-white', 'iced-latte', 'cinnabon'];
  const $hits = $('#hits-grid');

  hitIds.forEach(function (id) {
    const item = findMenuItem(id);
    const priceText = item.sizes ? 'from ' + formatPrice(item.sizes[0]) : formatPrice(item.price);
    const badge = item.category === 'cold' ? '<span class="tag tag-teal">Cold</span>'
      : item.category === 'desserts' ? '<span class="tag">Dessert</span>'
      : '<span class="tag tag-yellow">Hit</span>';

    const $card = $(
      '<div class="col-sm-6 col-lg-3">' +
        '<article class="zebra-card hover-lift d-flex flex-column">' +
          '<div class="position-relative">' +
            '<img class="card-photo" alt="">' +
            '<span class="position-absolute top-0 start-0 m-3">' + badge + '</span>' +
          '</div>' +
          '<div class="p-3 d-flex flex-column gap-1 flex-grow-1">' +
            '<h3 class="font-display h4 mb-0 item-name"></h3>' +
            '<p class="small text-muted-zebra mb-0 item-taste"></p>' +
            '<div class="d-flex justify-content-between align-items-center mt-auto pt-3">' +
              '<span class="fw-bold item-price"></span>' +
              '<button type="button" class="btn-plus add-hit">+</button>' +
            '</div>' +
          '</div>' +
        '</article>' +
      '</div>'
    );
    // .text() and .attr() — safe way to put data into the card
    $card.find('img').attr({ src: item.image, alt: item.name });
    $card.find('.item-name').text(item.name);
    $card.find('.item-taste').text(item.taste);
    $card.find('.item-price').text(priceText);
    $card.find('.add-hit').attr({ 'data-id': item.id, 'aria-label': 'Add ' + item.name + ' to cart' });
    $hits.append($card);
  });

  // one handler for all "+" buttons (event delegation)
  $hits.on('click', '.add-hit', function () {
    const item = findMenuItem($(this).data('id'));
    addToCart(makeCartLine(item));
    showToast(item.name + ' added to cart');
  });

  // ---------- 3. Mood picker ----------
  const moods = {
    sleepy: { title: 'Wake-up kit', ids: ['espresso', 'americano'] },
    sweet: { title: 'Something sweet', ids: ['raf', 'frappe'] },
    hot: { title: 'Cool down', ids: ['iced-latte', 'limonade'] },
    exam: { title: 'Study combo', ids: ['flat-white', 'cinnabon'] }
  };
  let currentMood = 'sleepy';

  function showMood(moodKey) {
    const mood = moods[moodKey];
    const $picks = $('#mood-picks').empty();
    let total = 0;

    mood.ids.forEach(function (id) {
      const item = findMenuItem(id);
      const price = item.sizes ? item.sizes[0] : item.price;
      total += price;

      const $col = $('<div class="col-6"><div class="mood-pick"><img alt=""><div class="p-3"><div class="font-display fs-5 pick-name"></div><div class="small text-muted-zebra pick-price"></div></div></div></div>');
      $col.find('img').attr({ src: item.image, alt: item.name });
      $col.find('.pick-name').text(item.name);
      $col.find('.pick-price').text(formatPrice(price));
      $picks.append($col);
    });

    $('#mood-title').text(mood.title);
    $('#mood-add').text('Add both to cart · ' + formatPrice(total));
    $picks.hide().fadeIn(250);
  }

  $('#mood-buttons').on('click', '.pill-btn', function () {
    const $btn = $(this);
    currentMood = $btn.data('mood');
    $btn.addClass('active').attr('aria-pressed', 'true')
      .siblings().removeClass('active').attr('aria-pressed', 'false');
    showMood(currentMood);
  });

  $('#mood-add').on('click', function () {
    moods[currentMood].ids.forEach(function (id) {
      addToCart(makeCartLine(findMenuItem(id)));
    });
    showToast(moods[currentMood].title + ' added to cart');
  });

  showMood(currentMood);

  // ---------- 4. Night Owls timer ----------
  const NIGHT_START = 0; // 00:00
  const NIGHT_END = 6;   // 06:00

  // minutes from "now" until the given hour (today or tomorrow)
  function minutesUntil(hour, now) {
    const target = new Date(now);
    target.setHours(hour, 0, 0, 0);
    if (target <= now) target.setDate(target.getDate() + 1);
    return Math.ceil((target - now) / 60000);
  }

  // 125 -> "2 h 5 min"
  function formatDuration(totalMinutes) {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return hours > 0 ? hours + ' h ' + minutes + ' min' : minutes + ' min';
  }

  function updateNightTimer() {
    const now = new Date();
    const isNight = now.getHours() >= NIGHT_START && now.getHours() < NIGHT_END;

    if (isNight) {
      $('#night-timer').text(formatDuration(minutesUntil(NIGHT_END, now)));
      $('#night-label').text('left tonight — you are right on time');
    } else {
      $('#night-timer').text(formatDuration(minutesUntil(NIGHT_START, now)));
      $('#night-label').text('until Night Owls start (00:00)');
    }
  }

  updateNightTimer();
  setInterval(updateNightTimer, 60000); // once a minute

    // ---------- 5. Drink of the day ----------
  const special = getTodaySpecial();             // { id: 'raf', desc: ..., discount: 15 }
  const specialItem = findMenuItem(special.id);  // the real drink from the menu

  $('#perk-name').text(specialItem.name + ' −' + special.discount + '%');
  $('#perk-desc').text(special.desc);
  $('#perk-add').text('Add ' + specialItem.name + ' to cart');
  $('#perk-hint').text('Enter it in the cart: −' + special.discount + '% on ' + specialItem.name);

  $('#perk-add').on('click', function () {
    addToCart(makeCartLine(specialItem));
    showToast(specialItem.name + ' added to cart');
  });

  $('#perk-reveal').on('click', function () {
    const code = 'ZEB-' + Math.floor(1000 + Math.random() * 9000);
    $('#perk-code').text(code);
    $(this).fadeOut(150, function () {
      $('#perk-code-box').removeClass('d-none').addClass('d-flex');
    });
  });
});
