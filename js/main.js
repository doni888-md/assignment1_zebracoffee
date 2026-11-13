/* =========================================================
   main.js — things every page needs (jQuery)
   1. cart badge in the menu
   2. "Back to top" button (fixed, bottom right)
   3. small "added to cart" toast that Home and Menu use
   ========================================================= */

$(function () {
  // ---------- 1. Cart badge ----------
  updateCartBadge(false);

  // If the cart changes in another tab, refresh the number here too.
  $(window).on('storage', function (event) {
    if (event.originalEvent.key === CART_KEY) updateCartBadge(true);
  });

  // ---------- 2. Back to top ----------
  const $toTop = $('#back-to-top');

  function toggleBackToTop() {
    // show the button after the visitor scrolled 400px down
    $toTop.toggleClass('show', $(window).scrollTop() > 400);
  }

  $(window).on('scroll', toggleBackToTop);
  toggleBackToTop();

  $toTop.on('click', function (event) {
    event.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
});

// ---------- 3. Toast ----------
// showToast('Raf added to cart') — creates the toast once, then reuses it.
function showToast(message) {
  let $toast = $('#zebra-toast');

  if ($toast.length === 0) {
    $toast = $(
      '<div class="toast-container position-fixed bottom-0 start-0 p-3" style="z-index: 1050">' +
        '<div id="zebra-toast" class="toast zebra-toast align-items-center border-0" role="status" aria-live="polite" aria-atomic="true">' +
          '<div class="d-flex align-items-center gap-3 p-3">' +
            '<span class="toast-text"></span>' +
            '<a href="cart.html">Open cart</a>' +
            '<button type="button" class="btn-close btn-close-white ms-auto" data-bs-dismiss="toast" aria-label="Close"></button>' +
          '</div>' +
        '</div>' +
      '</div>'
    ).appendTo('body').find('#zebra-toast');
  }

  $toast.find('.toast-text').text(message);
  bootstrap.Toast.getOrCreateInstance($toast[0], { delay: 3000 }).show();
}
