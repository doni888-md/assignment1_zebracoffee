'use strict';

/**
 * Zebra Coffee - Core UI Logic
 * jQuery Version: 3.7.1
 * Why $(function() { ... }) is needed:
 * Ensures the DOM tree is fully parsed and constructed before traversing or attaching event listeners,
 * preventing 'null reference' errors when targeting HTML nodes.
 */
$(function () {
  const $backToTop = $('#back-to-top-btn');

  // Show the floating button only after the visitor has scrolled down,
  // so on small screens it does not cover the first buttons and text of the page.
  function updateBackToTop() {
    $backToTop.toggleClass('hidden', $(window).scrollTop() < 400);
  }

  $(window).on('scroll', updateBackToTop);
  updateBackToTop();

  $backToTop.on('click', function (event) {
    event.preventDefault();
    $('html, body').animate({ scrollTop: 0 }, 500);
  });
});
