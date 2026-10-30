'use strict';

/**
 * Zebra Coffee - Core UI Logic
 * jQuery Version: 3.7.1
 * Why $(function() { ... }) is needed:
 * Ensures the DOM tree is fully parsed and constructed before traversing or attaching event listeners,
 * preventing 'null reference' errors when targeting HTML nodes.
 */
$(function () {
  $('#back-to-top-btn').on('click', function (event) {
    event.preventDefault();
    $('html, body').animate({ scrollTop: 0 }, 500);
  });
});