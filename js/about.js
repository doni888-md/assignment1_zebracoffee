/* =========================================================
   about.js — About page (jQuery)
   1. Flip cards "Our numbers"
   2. Gallery: click a photo -> it opens bigger in a window
   (The FAQ accordion works with Bootstrap only, no JS needed.)
   ========================================================= */

$(function () {

  // ---------- 1. Flip cards ----------
  // one handler on the parent for all 5 cards (event delegation)
  $('#flip-cards').on('click', '.flip-card', function () {
    const $card = $(this);
    const flipped = !$card.hasClass('is-flipped');

    $card.toggleClass('is-flipped', flipped).attr('aria-pressed', String(flipped));
  });

  // ---------- 2. Gallery ----------
  const photoModal = new bootstrap.Modal('#photoModal');

  $('#gallery').on('click', '.gallery-item', function () {
    const $img = $(this).find('img');

    $('#photoModalImage').attr({ src: $img.attr('src'), alt: $img.attr('alt') });
    $('#photoModalCaption').text($(this).data('caption'));
    photoModal.show();
  });
});
