'use strict';

/**
 * Zebra Coffee - Homepage Interactive Logic
 * jQuery Version: 3.7.1
 * Encapsulated in $(function() { ... }) to ensure full DOM construction before wiring handlers.
 *
 * Comparison Comment (Feature Rewrite: In-Store Special Promo & Interactive Drink Showcase):
 * Replaced verbose document.createElement, manual appendChild, and native listeners with jQuery 
 * dynamic selectors, chained classes, .fadeIn() / .fadeOut() transitions, and .on() events.
 * The resulting codebase is more compact, declarative, and improves interactive UI state handling.
 */

const presetDrinks = {
  energy: {
    title: 'Double Espresso Tonic',
    subtitle: 'Chilled tonic water with rich espresso crema',
    price: '890 KZT',
    calories: '45 kcal',
    portion: 'Standard / 350 ml',
    note: 'Pulled on fresh Ethiopian blend. Balanced acidity with zero added sugar.'
  },
  sweet: {
    title: 'Salted Caramel Raf',
    subtitle: 'Steamed cream infused with Madagascar vanilla',
    price: '1 390 KZT',
    calories: '280 kcal',
    portion: 'Large / 480 ml',
    note: 'Prepared with house-made salted caramel and calibrated espresso.'
  },
  zero: {
    title: 'Buckwheat Herbal Latte',
    subtitle: 'Warm decaf buckwheat infusion with oat microfoam',
    price: '1 040 KZT',
    calories: '120 kcal',
    portion: 'Medium / 350 ml',
    note: '100% caffeine-free. Comforting honey cookie notes for late study sessions.'
  }
};

const dailySpecials = [
  { name: 'Raf Citrus', desc: 'Creamy espresso with natural orange zest', discount: '15%' },
  { name: 'Matcha Tonic', desc: 'Cold brew green tea with sparkling tonic', discount: '10%' },
  { name: 'Spanish Latte', desc: 'Silky milk with sweet condensed layers', discount: '20%' },
  { name: 'Vanilla Cappuccino', desc: 'Silky microfoam with Madagascar vanilla and fresh local espresso', discount: '15%' }
];

$(function () {
  const $presetButtons = $('#drink-preset-filters .filter-preset-btn');
  const $displayPanel = $('#drink-display-panel');
  const $priceTag = $('#widget-price');

  $presetButtons.on('click', function () {
    const $clicked = $(this);
    const key = $clicked.attr('data-preset');
    const data = presetDrinks[key];

    if (!data) return;

    $clicked
      .addClass('btn-dark active')
      .removeClass('btn-outline-dark')
      .siblings()
      .removeClass('btn-dark active')
      .addClass('btn-outline-dark');

    $displayPanel.fadeOut(150, function () {
      $('#drink-title').text(data.title);
      $('#drink-subtitle').text(data.subtitle);
      $('#drink-calories').text(data.calories);
      $('#drink-portion').text(data.portion);
      $('#drink-details').html(`<strong>Barista Note:</strong> ${data.note}`);
      $priceTag.text(data.price);

      $displayPanel.fadeIn(200);
    });
  });

  const $promoContainer = $('#live-announcement-container');
  if ($promoContainer.length) {
    const randomIndex = Math.floor(Math.random() * dailySpecials.length);
    const todaysDrink = dailySpecials[randomIndex];

    $promoContainer
      .removeClass('hidden')
      .addClass('d-flex flex-column flex-md-row justify-content-between align-items-md-center shadow-sm rounded-4 p-3 mb-4')
      .css({
        'background-color': '#E6F6F5',
        'border': '1.5px solid #00A99D',
        'color': '#005751'
      })
      .hide();

    const $textBlock = $('<div>').addClass('mb-2 mb-md-0');
    const $title = $('<h6>')
      .addClass('fw-bold mb-1 fs-6')
      .css('color', '#007068')
      .text(`Daily Perk: ${todaysDrink.name} (${todaysDrink.discount} OFF)`);

    const $desc = $('<p>')
      .addClass('mb-0 small text-secondary')
      .text(`${todaysDrink.desc}. Click button to claim your bar coupon!`);

    $textBlock.append($title, $desc);

    const $buttonWrapper = $('<div>');
    const $promoBtn = $('<button>')
      .attr('type', 'button')
      .addClass('btn btn-sm rounded-pill px-3 py-1 text-nowrap text-white coupon-btn shadow-sm')
      .css('background-color', '#00A99D')
      .text('Claim Coupon');

    $buttonWrapper.append($promoBtn);
    $promoContainer.append($textBlock, $buttonWrapper);

    $promoContainer.fadeIn(500, function () {
      console.log('Daily promo banner mounted successfully.');
    });

    $promoContainer.on('click', '.coupon-btn', function () {
      const randomCoupon = `ZEB-${Math.floor(1000 + Math.random() * 9000)}`;
      $(this)
        .fadeOut(150, function () {
          $(this)
            .removeClass('btn btn-sm coupon-btn')
            .addClass('badge font-monospace p-2 fs-6 shadow-sm')
            .css({
              'background-color': '#007068',
              'color': '#ffffff'
            })
            .text(`CODE: #${randomCoupon}`)
            .fadeIn(200);
        });
    });
  }
});