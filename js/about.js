
$(function () {

  $('#flip-cards').on('click', '.flip-card', function () {
    const $card = $(this);
    const flipped = !$card.hasClass('is-flipped');

    $card.toggleClass('is-flipped', flipped).attr('aria-pressed', String(flipped));
  });

  const photoModal = new bootstrap.Modal('#photoModal');

  $('#gallery').on('click', '.gallery-item', function () {
    const $img = $(this).find('img');

    $('#photoModalImage').attr({ src: $img.attr('src'), alt: $img.attr('alt') });
    $('#photoModalCaption').text($(this).data('caption'));
    photoModal.show();
  });
});
