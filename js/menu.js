/* =========================================================
   menu.js — Menu page (jQuery)
   1. Cards from menuItems (data.js)
   2. Category pills + search (with counters and empty state)
   3. Drink window: size / sugar / flavor / quantity -> price
   4. "Add to cart" (cart.js) + toast (main.js)
   ========================================================= */

$(function () {
  const $grid = $('#menu-grid');
  const $search = $('#menu-search');
  let currentCategory = 'all';

  // ---------- helpers ----------
  function matchesSearch(item, query) {
    if (query === '') return true;
    return (item.name + ' ' + item.taste).toLowerCase().indexOf(query) !== -1;
  }

  function matchesCategory(item, category) {
    return category === 'all' || item.category === category;
  }

  function temperatureLabel(item) {
    if (item.category === 'cold') return 'Cold';
    if (item.category === 'hot') return 'Hot';
    return 'Dessert';
  }

  // one card -> jQuery object
  function buildCard(item) {
    const priceText = item.sizes ? 'from ' + formatPrice(item.sizes[0]) : formatPrice(item.price);
    const $col = $(
      '<div class="col-sm-6 col-lg-4 col-xl-3">' +
        '<article class="zebra-card hover-lift menu-card">' +
          '<button type="button" class="photo-btn open-drink">' +
            '<img class="card-photo" alt="">' +
            '<span class="tag temp-tag"></span>' +
          '</button>' +
          '<div class="p-3 d-flex flex-column gap-1 flex-grow-1">' +
            '<h2 class="font-display h4 mb-0 item-name"></h2>' +
            '<p class="small text-muted-zebra mb-0 item-taste"></p>' +
            '<div class="d-flex justify-content-between align-items-center mt-auto pt-3">' +
              '<span class="fw-bold item-price"></span>' +
              '<button type="button" class="btn-plus open-drink">+</button>' +
            '</div>' +
          '</div>' +
        '</article>' +
      '</div>'
    );

    $col.find('.open-drink').attr('data-id', item.id);
    $col.find('.photo-btn').attr('aria-label', 'Open ' + item.name);
    $col.find('.btn-plus').attr('aria-label', 'Add ' + item.name);
    $col.find('img').attr({ src: item.image, alt: item.name });
    $col.find('.temp-tag').text(temperatureLabel(item));
    $col.find('.item-name').text(item.name);
    $col.find('.item-taste').text(item.taste);
    $col.find('.item-price').text(priceText);

    if (item.badge) {
      $('<span class="tag tag-yellow badge-tag">').text(item.badge).insertAfter($col.find('.temp-tag'));
    }
    return $col;
  }

  // ---------- 1 + 2. Render with filters ----------
  function renderMenu() {
    const query = $.trim($search.val()).toLowerCase();
    const found = menuItems.filter(function (item) { return matchesSearch(item, query); });
    const shown = found.filter(function (item) { return matchesCategory(item, currentCategory); });

    // numbers next to All / Hot / Cold / Desserts
    $('#category-pills .pill-btn').each(function () {
      const category = $(this).data('category');
      const count = found.filter(function (item) { return matchesCategory(item, category); }).length;
      $(this).find('.pill-count').text(count);
    });

    $grid.empty();
    shown.forEach(function (item) { $grid.append(buildCard(item)); });

    const isEmpty = shown.length === 0;
    $('#menu-empty').toggleClass('d-none', !isEmpty);
    $('#empty-query').text($search.val());
    $('#menu-result-text').text(shown.length + ' items shown');
  }

  $('#category-pills').on('click', '.pill-btn', function () {
    const $btn = $(this);
    currentCategory = $btn.data('category');
    $btn.addClass('active').attr('aria-pressed', 'true')
      .siblings().removeClass('active').attr('aria-pressed', 'false');
    renderMenu();
  });

  $search.on('input', renderMenu);

  $('#clear-search').on('click', function () {
    $search.val('').trigger('focus');
    renderMenu();
  });

  renderMenu();

  // ---------- 3. Drink window ----------
  const drinkModal = new bootstrap.Modal('#drinkModal');
  const choice = { item: null, sizeIndex: 1, sugar: 'No sugar', qty: 1 };

  function unitPrice() {
    return choice.item.sizes ? choice.item.sizes[choice.sizeIndex] : choice.item.price;
  }

  function updateModalPrice() {
    $('#qty-value').text(choice.qty);
    $('#add-to-cart').text('Add to cart · ' + formatPrice(unitPrice() * choice.qty));
  }

  function openDrink(id) {
    const item = findMenuItem(id);
    choice.item = item;
    choice.sizeIndex = 1;          // 350 ml by default
    choice.sugar = 'No sugar';
    choice.qty = 1;

    $('#drinkModalTitle').text(item.name);
    $('#drink-taste').text(item.taste);
    $('#drink-image').attr({ src: item.image, alt: item.name });

    // sizes
    const $sizes = $('#size-options').empty();
    if (item.sizes) {
      item.sizes.forEach(function (price, index) {
        $('<button type="button" class="option-btn">')
          .attr({ 'data-size': index, 'aria-pressed': String(index === 1) })
          .toggleClass('active', index === 1)
          .append($('<strong>').text(sizeNames[index]))
          .append($('<small>').text(formatPrice(price)))
          .appendTo($sizes);
      });
    }
    $('#size-block').toggle(Boolean(item.sizes));

    // sugar
    $('#sugar-block').toggle(Boolean(item.sugar));
    $('#sugar-options .option-btn').removeClass('active').attr('aria-pressed', 'false')
      .first().addClass('active').attr('aria-pressed', 'true');

    // flavor / syrup / type
    const $select = $('#flavor-select').empty();
    if (item.options) {
      $('#flavor-label').text(item.optionLabel);
      item.options.forEach(function (name) {
        $('<option>').val(name).text(name).appendTo($select);
      });
    }
    $('#flavor-block').toggle(Boolean(item.options));

    updateModalPrice();
    drinkModal.show();
  }

  // one handler for every card (photo and "+")
  $grid.on('click', '.open-drink', function () {
    openDrink($(this).data('id'));
  });

  $('#size-options').on('click', '.option-btn', function () {
    choice.sizeIndex = Number($(this).data('size'));
    $(this).addClass('active').attr('aria-pressed', 'true')
      .siblings().removeClass('active').attr('aria-pressed', 'false');
    updateModalPrice();
  });

  $('#sugar-options').on('click', '.option-btn', function () {
    choice.sugar = $(this).data('sugar');
    $(this).addClass('active').attr('aria-pressed', 'true')
      .siblings().removeClass('active').attr('aria-pressed', 'false');
  });

  $('#qty-plus').on('click', function () {
    if (choice.qty < 9) choice.qty++;
    updateModalPrice();
  });

  $('#qty-minus').on('click', function () {
    if (choice.qty > 1) choice.qty--;
    updateModalPrice();
  });

  // ---------- 4. Add to cart ----------
  $('#add-to-cart').on('click', function () {
    const line = makeCartLine(choice.item, {
      sizeIndex: choice.sizeIndex,
      sugar: choice.sugar,
      option: $('#flavor-select').val(),
      qty: choice.qty
    });
    addToCart(line);
    drinkModal.hide();
    showToast(choice.qty + ' × ' + choice.item.name + ' added to cart');
  });
});
