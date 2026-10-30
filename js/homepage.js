'use strict';

/**
 * jQuery Version: 3.7.1
 * Enclosed in $(function() { ... }) to avoid DOM lookup bottlenecks.
 *
 * Feature Rewrite: Daily In-Store Special
 * Replaced verbose document.createElement and native listeners with jQuery DOM generation,
 * chaining, and .fadeIn() animation.
 */

const dailySpecials = [
  { name: 'Raf Citrus', desc: 'Creamy espresso with natural orange zest', discount: '15%' },
  { name: 'Matcha Tonic', desc: 'Cold brew green tea with sparkling tonic', discount: '10%' },
  { name: 'Spanish Latte', desc: 'Silky milk with sweet condensed layers', discount: '20%' },
  { name: 'Filter Geisha', desc: 'Fresh local roast from Astana roastery', discount: '15%' }
];

$(function () {
  const $promoContainer = $('#live-announcement-container');
  if (!$promoContainer.length) return;

  const randomIndex = Math.floor(Math.random() * dailySpecials.length);
  const todaysDrink = dailySpecials[randomIndex];

  $promoContainer
    .removeClass('hidden')
    .addClass('alert alert-warning border-dark d-flex flex-column flex-md-row justify-content-between align-items-md-center shadow rounded-4 p-3 mb-4')
    .hide();

  const $textBlock = $('<div>').addClass('mb-2 mb-md-0');
  const $title = $('<h6>').addClass('fw-bold mb-1 fs-5').text(`⚡ Today's Special: ${todaysDrink.name} (${todaysDrink.discount} OFF)`);
  const $desc = $('<p>').addClass('mb-0 small text-secondary').text(`${todaysDrink.desc}. Click button to claim your bar coupon!`);
  $textBlock.append($title, $desc);

  const $buttonWrapper = $('<div>');
  const $promoBtn = $('<button>')
    .attr('type', 'button')
    .addClass('btn btn-dark btn-sm rounded-pill px-4 py-2 text-nowrap coupon-btn shadow-sm')
    .text('Claim Coupon');

  $buttonWrapper.append($promoBtn);
  $promoContainer.append($textBlock, $buttonWrapper);

  $promoContainer.fadeIn(700, function () {
    console.log('Special promo loaded successfully via jQuery.');
  });

  $promoContainer.on('click', '.coupon-btn', function () {
    const randomCoupon = `ZEB-${Math.floor(1000 + Math.random() * 9000)}`;
    
    $(this)
      .fadeOut(200, function () {
        $(this)
          .removeClass('btn btn-dark btn-sm rounded-pill coupon-btn')
          .addClass('badge bg-success fs-6 p-2 text-wrap shadow-sm')
          .text(`✅ Active Coupon: #${randomCoupon}`)
          .fadeIn(300);
      });
  });
});