'use strict';

/*
 * jQuery 3.7.1, loaded from the CDN <script> tag placed BEFORE this file.
 * This line is needed because $, .on(), .append(), .slideDown() and every other
 * method below come from the library and do not exist until it has loaded.
 */
$(function () {
    const $reviewsList = $('#reviews-list');
    const $form = $('#review-form');
    if ($reviewsList.length === 0 || $form.length === 0) return; // not the reviews page

    const MIN_TEXT = 20;
    const MAX_TEXT = 500;
    const MIN_VISIT_DATE = '2023-01-01';
    const FIELDS = ['name', 'email', 'phone', 'visitDate', 'rating', 'drink', 'impression', 'review', 'recommend'];

    const DRINK_LABELS = { coffee: 'Coffee', tea: 'Tea', dessert: 'Dessert' };
    const IMPRESSION_LABELS = { good: 'Good', excellent: 'Excellent' };

    let reviews = [
        { id: 'r1', name: 'd sss__', rating: 5, drink: 'coffee', impression: 'excellent', recommend: true, createdAt: '2026-07-30T14:20:00+05:00',
          text: 'Pleasant atmosphere, great purple on Salvador Geisha. A clean balanced cup with a bright aroma, pleasant sweetness and revealing floral and fruity notes.',
          images: [
              { src: 'images/IMG_0046.jpg', alt: 'Interior of Zebra Coffee', caption: 'Main interior of Zebra Coffee.' },
              { src: 'images/IMG_0047.jpg', alt: 'Another view of Zebra Coffee interior', caption: 'Another view of the interior.' }
          ], isOwn: false },
        { id: 'r2', name: 'Aigerim K.', rating: 5, drink: 'coffee', impression: 'excellent', recommend: true, createdAt: '2026-09-12T09:45:00+05:00',
          text: 'Flat White at 350 ml was smooth and not bitter. The barista remembered my order on the second visit. Quick service even in the morning rush.', images: [], isOwn: false },
        { id: 'r3', name: 'Dias', rating: 4, drink: 'dessert', impression: 'good', recommend: true, createdAt: '2026-08-21T18:10:00+05:00',
          text: 'Spanish Cheesecake is creamy and not too sweet. Would be perfect with a few more seats near the window, but the takeaway option is convenient.', images: [], isOwn: false },
        { id: 'r4', name: 'Madina S.', rating: 4, drink: 'tea', impression: 'good', recommend: true, createdAt: '2026-10-02T16:30:00+05:00',
          text: 'Tried the Blue Matcha and Mochi with strawberry. Both were fresh, the drink arrived cold and nicely layered. Prices are fair for the centre of Astana.', images: [], isOwn: false },
        { id: 'r5', name: 'Timur B.', rating: 3, drink: 'coffee', impression: 'good', recommend: false, createdAt: '2026-09-27T13:05:00+05:00',
          text: 'The cappuccino was tasty, but I waited about fifteen minutes at lunch time. Staff were polite and apologised. I will try again at a quieter hour.', images: [], isOwn: false },
        { id: 'r6', name: 'Alina', rating: 5, drink: 'dessert', impression: 'excellent', recommend: true, createdAt: '2026-10-15T11:40:00+05:00',
          text: 'Warm Cinnabon with an Ice Latte with mango syrup is my new weekend habit. Clean tables, soft music and a really friendly team.', images: [], isOwn: false }
    ];

    const filters = { query: '', rating: 'all', drink: 'all', sort: 'newest' };

    // ------------------------------------------------------------------
    // Small helpers
    // ------------------------------------------------------------------
    // Creates an element and sets its text with .text(): visitor input is NEVER put in with .html(),
    // because .html() would run tags like <script>/<img onerror> typed by the visitor (XSS).
    function makeEl(tag, className, text) {
        return $('<' + tag + '>', { 'class': className || '' }).text(text === undefined ? '' : text);
    }

    // d-none is "display: none !important" in Bootstrap, so effects cannot show such an element.
    // We remove the classes first, hide it with jQuery, then fade it in.
    function showBox($node) {
        $node.stop(true, true).removeClass('hidden d-none').hide().fadeIn(200);
    }

    function hideBox($node) {
        $node.stop(true, true).fadeOut(150);
    }

    function formatDateTime(iso) {
        const date = new Date(iso);
        const day = date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
        const time = date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
        return `${day}, ${time}`;
    }

    function formatStars(rating) {
        return '★'.repeat(rating) + '☆'.repeat(5 - rating);
    }

    function calculateAverage(list) {
        if (list.length === 0) return 0;
        return list.reduce((sum, review) => sum + review.rating, 0) / list.length;
    }

    function generateReference() {
        return `DEMO-${Math.floor(1000 + Math.random() * 9000)}`;
    }

    // ------------------------------------------------------------------
    // The review list: every card is created in code from the array above
    // ------------------------------------------------------------------
    function createReviewCard(review) {
        const $article = makeEl('article', 'review-card card border shadow-sm').attr('id', 'review-' + review.id);
        if (review.isOwn) $article.addClass('border-success');

        const $body = makeEl('div', 'card-body').appendTo($article);

        const $head = makeEl('div', 'd-flex flex-wrap justify-content-between align-items-start gap-2 mb-2').appendTo($body);
        makeEl('h3', 'h5 fw-bold mb-0', review.name).appendTo($head);
        makeEl('span', 'badge text-bg-warning fs-6', `${formatStars(review.rating)} ${review.rating}/5`)
            .attr('aria-label', `Rating ${review.rating} out of 5`)
            .appendTo($head);

        const $tags = makeEl('div', 'd-flex flex-wrap gap-2 mb-3').appendTo($body);
        makeEl('span', 'badge text-bg-secondary', `Favorite: ${DRINK_LABELS[review.drink]}`).appendTo($tags);
        makeEl('span', 'badge text-bg-light border', `Impression: ${IMPRESSION_LABELS[review.impression]}`).appendTo($tags);
        if (review.recommend) makeEl('span', 'badge text-bg-success', '✓ Recommends Zebra Coffee').appendTo($tags);
        if (review.isOwn) makeEl('span', 'badge text-bg-info', 'Your demo review').appendTo($tags);

        const $quote = makeEl('blockquote', 'blockquote').appendTo($body);
        makeEl('p', 'mb-2', review.text).appendTo($quote);
        const $footer = makeEl('footer', 'blockquote-footer').appendTo($quote);
        $footer.append($('<span>').text(review.name + ', '));
        makeEl('time', '', formatDateTime(review.createdAt)).attr('datetime', review.createdAt).appendTo($footer);

        if (review.images.length > 0) {
            const $row = makeEl('div', 'row g-3').appendTo($body);
            $.each(review.images, function (_, image) {
                const $col = makeEl('div', 'col-12 col-md-6').appendTo($row);
                const $figure = makeEl('figure', 'mb-0 text-center').appendTo($col);
                $('<img>', { 'class': 'img-fluid rounded-3 review-photo', src: image.src, alt: image.alt }).appendTo($figure);
                makeEl('figcaption', 'small mt-2', image.caption).appendTo($figure);
            });
        }

        if (review.isOwn) {
            $('<button>', {
                type: 'button',
                'class': 'btn btn-sm btn-outline-danger mt-3 delete-review-btn',
                'data-id': review.id,
                text: 'Remove my review'
            }).appendTo($body);
        }

        return $article;
    }

    // ------------------------------------------------------------------
    // Search / filter / sort controls (created in code, no HTML edits)
    // ------------------------------------------------------------------
    function createControlColumn(colClass, labelText, controlId, $control) {
        const $col = makeEl('div', colClass);
        makeEl('label', 'form-label small fw-semibold mb-1', labelText).attr('for', controlId).appendTo($col);
        $control.attr('id', controlId).appendTo($col);
        return $col;
    }

    function createSelect(options) {
        const $select = makeEl('select', 'form-select form-select-sm');
        $.each(options, function (_, pair) {
            $('<option>', { value: pair[0], text: pair[1] }).appendTo($select);
        });
        return $select;
    }

    const $searchInput = $('<input>', {
        type: 'search', 'class': 'form-control form-control-sm',
        placeholder: 'Name or word in review', autocomplete: 'off'
    });
    const $ratingSelect = createSelect([['all', 'All ratings'], ['5', '5 stars only'], ['4', '4 stars and above'], ['low', '3 stars and below']]);
    const $drinkSelect = createSelect([['all', 'All drinks'], ['coffee', 'Coffee'], ['tea', 'Tea'], ['dessert', 'Dessert']]);
    const $sortSelect = createSelect([['newest', 'Newest first'], ['oldest', 'Oldest first'], ['highest', 'Highest rating'], ['lowest', 'Lowest rating']]);
    const $resetFiltersBtn = makeEl('button', 'btn btn-outline-secondary btn-sm w-100', 'Reset').attr('type', 'button');

    const $toolbar = makeEl('div', 'card card-body border shadow-sm mb-3');
    const $toolbarRow = makeEl('div', 'row g-2 align-items-end').appendTo($toolbar);
    $toolbarRow.append(
        createControlColumn('col-12 col-md-6', 'Search reviews', 'reviews-search', $searchInput),
        createControlColumn('col-6 col-md-3', 'Rating', 'reviews-filter-rating', $ratingSelect),
        createControlColumn('col-6 col-md-3', 'Drink', 'reviews-filter-drink', $drinkSelect),
        createControlColumn('col-6 col-md-6', 'Sort by', 'reviews-sort', $sortSelect),
        makeEl('div', 'col-6 col-md-6').append($resetFiltersBtn)
    );

    const $resultCount = makeEl('p', 'small text-muted mb-0 mt-3').attr('aria-live', 'polite').appendTo($toolbar);
    const $statusBox = makeEl('div', 'alert mt-3 mb-0 hidden d-none').attr('role', 'status').appendTo($toolbar);

    const $emptyState = makeEl('div', 'alert alert-secondary text-center hidden d-none');
    makeEl('p', 'mb-2', 'No reviews match your search. Try other words or reset the filters.').appendTo($emptyState);
    const $emptyResetBtn = makeEl('button', 'btn btn-dark btn-sm', 'Show all reviews').attr('type', 'button').appendTo($emptyState);

    $reviewsList.before($toolbar).before($emptyState);

    // ------------------------------------------------------------------
    // Filtering logic (pure data work, no DOM)
    // ------------------------------------------------------------------
    function matchesFilters(review, activeFilters) {
        const query = activeFilters.query.trim().toLowerCase();
        const textMatch = query === ''
            || review.name.toLowerCase().includes(query)
            || review.text.toLowerCase().includes(query);

        let ratingMatch = true;
        switch (activeFilters.rating) {
            case '5': ratingMatch = review.rating === 5; break;
            case '4': ratingMatch = review.rating >= 4; break;
            case 'low': ratingMatch = review.rating <= 3; break;
            default: ratingMatch = true;
        }

        const drinkMatch = activeFilters.drink === 'all' || review.drink === activeFilters.drink;
        return textMatch && ratingMatch && drinkMatch;
    }

    function sortReviews(list, mode) {
        return list.slice().sort(function (a, b) {
            const timeA = new Date(a.createdAt).getTime();
            const timeB = new Date(b.createdAt).getTime();
            switch (mode) {
                case 'oldest': return timeA - timeB;
                case 'highest': return b.rating - a.rating || timeB - timeA;
                case 'lowest': return a.rating - b.rating || timeB - timeA;
                default: return timeB - timeA;
            }
        });
    }

    function applyFilters(list, activeFilters) {
        // $.grep = jQuery's filter for arrays
        return sortReviews($.grep(list, review => matchesFilters(review, activeFilters)), activeFilters.sort);
    }

    function renderReviews(highlightId) {
        const visible = applyFilters(reviews, filters);

        $reviewsList.empty();
        $.each(visible, function (_, review) {
            $reviewsList.append(createReviewCard(review));
        });

        const averageText = visible.length > 0 ? ` Average rating: ${calculateAverage(visible).toFixed(1)} / 5.` : '';
        $resultCount.text(`Showing ${visible.length} of ${reviews.length} reviews.${averageText}`);

        if (visible.length === 0) {
            if (!$emptyState.is(':visible')) showBox($emptyState); // avoid re-animating on every keystroke
        } else {
            hideBox($emptyState);
        }

        if (highlightId) {
            const $card = $('#review-' + highlightId).addClass('shadow');
            if ($card.length) {
                // Effect with a purpose: scroll smoothly to the review the visitor has just added
                $('html, body').animate({ scrollTop: $card.offset().top - ($(window).height() - $card.outerHeight()) / 2 }, 400);
            }
        }
    }

    function resetFilters() {
        filters.query = '';
        filters.rating = 'all';
        filters.drink = 'all';
        filters.sort = 'newest';
        $searchInput.val('');
        $ratingSelect.val('all');
        $drinkSelect.val('all');
        $sortSelect.val('newest');
    }

    // Status message: fadeIn -> stays 4 s -> fadeOut
    function showStatus(message, type) {
        $statusBox
            .stop(true, true)
            .text(message)
            .removeClass('alert-success alert-info alert-danger')
            .addClass('alert-' + type)
            .removeClass('hidden d-none')
            .hide()
            .fadeIn(200)
            .delay(4000)
            .fadeOut(400);
    }

    // ------------------------------------------------------------------
    // Events for the filters (types: input, keydown, change, click)
    // ------------------------------------------------------------------
    $searchInput.on('input', function () {
        filters.query = $(this).val();
        renderReviews();
    });

    $searchInput.on('keydown', function (event) {
        if (event.key === 'Escape') {
            $(this).val('');
            filters.query = '';
            renderReviews();
        }
    });

    $ratingSelect.on('change', function () { filters.rating = $(this).val(); renderReviews(); });
    $drinkSelect.on('change', function () { filters.drink = $(this).val(); renderReviews(); });
    $sortSelect.on('change', function () { filters.sort = $(this).val(); renderReviews(); });

    function handleResetClick() {
        resetFilters();
        renderReviews();
        showStatus('Filters were reset. All reviews are shown.', 'info');
    }

    // .add() puts two buttons into one jQuery set, so one .on() serves both
    $resetFiltersBtn.add($emptyResetBtn).on('click', handleResetClick);

    // DELEGATED handler. The "Remove my review" button does not exist when the page loads: it is
    // created by createReviewCard() only for reviews the visitor adds, and renderReviews() deletes and
    // re-creates ALL cards on every filter change. A direct $('.delete-review-btn').on('click', ...)
    // would match nothing at this moment, and the new buttons would never get the handler.
    // $reviewsList always exists, click events bubble up to it, and jQuery runs the function
    // only if the real target matches '.delete-review-btn'.
    $reviewsList.on('click', '.delete-review-btn', function () {
        const id = $(this).attr('data-id');
        reviews = $.grep(reviews, review => review.id !== id);
        renderReviews();
        showStatus('Your demo review was removed from this page.', 'info');
    });

    // ------------------------------------------------------------------
    // Form: counter, preview, submit
    // ------------------------------------------------------------------
    // .prop() (not .attr()) because noValidate is a live property of the form.
    // The required / type="email" attributes stay in the HTML as the first line of defence
    // (they work if this script fails to load); with noValidate on, our code shows a message
    // next to EACH field instead of one browser bubble for the first problem only.
    $form.prop('noValidate', true);

    const $errorSummary = $('#review-form-errors');
    const $previewBox = $('#review-preview');
    const $previewName = $('#review-preview-name');
    const $previewRating = $('#review-preview-rating');
    const $previewText = $('#review-preview-text');
    const $confirmationBox = $('#review-confirmation-message');
    const $previewBtn = $('#review-preview-btn');
    const $textArea = $('#review-text');

    const $counter = makeEl('div', 'form-text').insertAfter($textArea);
    const $summaryBox = $('<div>', { 'class': 'mt-3' }).appendTo($confirmationBox);

    function updateCounter() {
        const length = $textArea.val().length;
        const tooShort = length > 0 && length < MIN_TEXT;
        const tooLong = length > MAX_TEXT;
        let hint = `${length} / ${MAX_TEXT} characters (minimum ${MIN_TEXT}).`;
        if (tooLong) hint = `${length} / ${MAX_TEXT} characters — too long, remove ${length - MAX_TEXT}.`;
        $counter.text(hint).toggleClass('text-danger', tooLong || tooShort);
    }

    $textArea.on('input', updateCounter);
    updateCounter();

    // ------------------------------------------------------------------
    // FEATURE 1 (rewritten from plain JS): form validation.
    // Old: getElementById / querySelector(All) / classList / createElement / .after() /
    //      setAttribute / removeAttribute / forEach (~60 lines of DOM work).
    // New: $('#id').val(), .find(':checked'), .addClass/.removeClass, .after(), .attr(),
    //      .slideDown(), .each() (~50 lines of DOM work).
    // Result: only a bit shorter. The real gain is that one jQuery set (getControls) is
    // changed in ONE call instead of a forEach loop, so it is clearer but not dramatically shorter.
    // validateReview() is pure logic with no DOM, so it is identical in both versions.
    // ------------------------------------------------------------------
    function fieldValue(selector) {
        return ($(selector).val() || '').trim(); // trim() before every check
    }

    function getFormValues() {
        return {
            name: fieldValue('#review-name'),
            email: fieldValue('#review-email'),
            phone: fieldValue('#review-phone'),
            visitDate: $('#review-date').val() || '',
            rating: fieldValue('#review-rating'),
            drink: $('#review-drink').val(),
            impression: $form.find('input[name="impression"]:checked').val() || '', // attribute selector + :checked
            review: ($textArea.val() || '').trim(),
            // .prop('checked') = the CURRENT state (true/false). .attr('checked') would only
            // return the value written in the HTML and would not change when the visitor clicks.
            recommend: $('#review-recommend').prop('checked')
        };
    }

    function validateReview(values) {
        const errors = [];
        const namePattern = /^[\p{L}\d][\p{L}\d\s'._-]{1,39}$/u;
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
        const phonePattern = /^\+?[\d\s()-]{10,18}$/;

        if (values.name === '') {
            errors.push({ field: 'name', message: 'Enter your name.' });
        } else if (!namePattern.test(values.name)) {
            errors.push({ field: 'name', message: 'Name must be 2–40 characters: letters, digits, spaces or . _ - \'' });
        }

        if (values.email === '') {
            errors.push({ field: 'email', message: 'Enter your email.' });
        } else if (!emailPattern.test(values.email)) {
            errors.push({ field: 'email', message: 'Email must look like example@mail.kz.' });
        }

        if (values.phone !== '') {
            const digits = values.phone.replace(/\D/g, '');
            if (!phonePattern.test(values.phone) || digits.length < 10 || digits.length > 12) {
                errors.push({ field: 'phone', message: 'Phone must contain 10–12 digits, e.g. +7 700 000 00 00.' });
            }
        }

        if (values.visitDate === '') {
            errors.push({ field: 'visitDate', message: 'Choose your visit date.' });
        } else {
            const visit = new Date(`${values.visitDate}T00:00:00`);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            if (visit > today) {
                errors.push({ field: 'visitDate', message: 'Visit date cannot be in the future.' });
            } else if (visit < new Date(`${MIN_VISIT_DATE}T00:00:00`)) {
                errors.push({ field: 'visitDate', message: 'Visit date is too old. Choose a date after 1 January 2023.' });
            }
        }

        const ratingNumber = Number(values.rating);
        if (values.rating === '') {
            errors.push({ field: 'rating', message: 'Enter a rating from 1 to 5.' });
        } else if (!Number.isInteger(ratingNumber) || ratingNumber < 1 || ratingNumber > 5) {
            errors.push({ field: 'rating', message: 'Rating must be a whole number from 1 to 5.' });
        }

        if (values.impression === '') {
            errors.push({ field: 'impression', message: 'Select your overall impression.' });
        } else if (values.impression === 'excellent' && Number.isInteger(ratingNumber) && ratingNumber > 0 && ratingNumber < 4) {
            errors.push({ field: 'impression', message: '“Excellent” does not match a rating below 4. Change one of them.' });
        }

        if (values.review === '') {
            errors.push({ field: 'review', message: 'Write your review.' });
        } else if (values.review.length < MIN_TEXT) {
            errors.push({ field: 'review', message: `Review is too short: at least ${MIN_TEXT} characters.` });
        } else if (values.review.length > MAX_TEXT) {
            errors.push({ field: 'review', message: `Review is too long: maximum ${MAX_TEXT} characters.` });
        }

        if (values.recommend && Number.isInteger(ratingNumber) && ratingNumber > 0 && ratingNumber <= 2) {
            errors.push({ field: 'recommend', message: 'You cannot recommend us with a rating of 2 or lower. Untick it or change the rating.' });
        }

        // NOTE: this check runs in the visitor's browser, and the visitor controls the browser:
        // they can edit the JS, delete the required attribute, or send a request without the
        // page at all. So the server MUST repeat every check; browser validation only saves time
        // and gives friendly messages, it is never a security measure.
        return errors;
    }

    function getControls(fieldName) {
        return $form.find('[name="' + fieldName + '"]'); // attribute selector
    }

    // The element AFTER which the error message is placed
    function getAnchor(fieldName) {
        const $first = getControls(fieldName).first();
        if (fieldName === 'review') return $counter;
        if (fieldName === 'impression') return $first.closest('.p-3');
        if (fieldName === 'recommend') return $first.closest('.form-check');
        return $first;
    }

    function clearFieldError(fieldName) {
        // Remove the id first, so a new error with the same id can be added while this one slides away
        $('#error-' + fieldName).removeAttr('id').slideUp(150, function () {
            $(this).remove(); // callback: delete from the DOM only AFTER the slide has finished
        });
        getControls(fieldName).removeClass('is-invalid').removeAttr('aria-invalid aria-describedby');
    }

    function clearAllErrors() {
        $.each(FIELDS, function (_, fieldName) { clearFieldError(fieldName); });
        $form.find('.is-valid').removeClass('is-valid');
        $errorSummary.stop(true, true).empty().addClass('hidden d-none');
    }

    function showErrors(errors, values) {
        clearAllErrors();

        $.each(errors, function (_, item) {
            const $error = makeEl('div', 'field-error text-danger small mt-1 fw-semibold', '⚠ ' + item.message)
                .attr('id', 'error-' + item.field)
                .hide();                       // hidden first, so slideDown has something to reveal
            getAnchor(item.field).after($error); // the message sits NEXT TO its own field
            $error.slideDown(200);

            getControls(item.field).each(function () {
                $(this).addClass('is-invalid').attr({ 'aria-invalid': 'true', 'aria-describedby': 'error-' + item.field });
            });
        });

        const failed = $.map(errors, item => item.field);
        $.each(['name', 'email', 'visitDate', 'rating', 'review'], function (_, field) {
            if ($.inArray(field, failed) === -1) getControls(field).addClass('is-valid');
        });
        if (values.phone !== '' && $.inArray('phone', failed) === -1) getControls('phone').addClass('is-valid');

        const uniqueCount = failed.filter((field, index) => failed.indexOf(field) === index).length;
        $errorSummary.text(`Please fix ${uniqueCount} field${uniqueCount === 1 ? '' : 's'} below before sending your review.`);
        showBox($errorSummary);

        $form.find('.is-invalid:first').trigger('focus'); // :first filter
    }

    function buildSummary(review, values, reference) {
        const $list = makeEl('dl', 'row mb-0 small');
        const rows = [
            ['Reference', reference],
            ['Name', review.name],
            ['Rating', `${review.rating} / 5`],
            ['Favorite drink', DRINK_LABELS[review.drink]],
            ['Impression', IMPRESSION_LABELS[review.impression]],
            ['Visit date', values.visitDate],
            ['Posted', formatDateTime(review.createdAt)],
            ['Recommends us', review.recommend ? 'Yes' : 'No']
        ];
        $.each(rows, function (_, row) {
            makeEl('dt', 'col-5 col-md-4', row[0]).appendTo($list);
            makeEl('dd', 'col-7 col-md-8', row[1]).appendTo($list);
        });
        return $list;
    }

    function showConfirmation(review, values) {
        $summaryBox
            .empty()
            .append(buildSummary(review, values, generateReference()))
            .append(makeEl('p', 'mb-0 mt-3 small fw-semibold',
                ' '));
        showBox($confirmationBox);
    }

    // DELEGATED on the form: the error is cleared as soon as the visitor edits that field.
    // One handler for 2 event types ('input change') and for every field that has a name.
    $form.on('input change', '[name]', function () {
        clearFieldError($(this).attr('name'));
    });

    $previewBtn.on('click', function () {
        const values = getFormValues();
        const errors = validateReview(values);
        hideBox($confirmationBox);

        if (errors.length > 0) {
            hideBox($previewBox);
            showErrors(errors, values);
            return;
        }

        clearAllErrors();
        $previewName.text(values.name);
        $previewRating.text(`${formatStars(Number(values.rating))} ${values.rating} / 5`);
        $previewText.text(values.review);
        showBox($previewBox);
    });

    $form.on('submit', function (event) {
        // Without preventDefault the browser would send the form and reload the page:
        // our review list, the checks and the success message would all disappear.
        event.preventDefault();
        hideBox($confirmationBox);

        const values = getFormValues();
        const errors = validateReview(values);

        if (errors.length > 0) {
            hideBox($previewBox);
            showErrors(errors, values);
            return; // success message is shown ONLY when every check passed
        }

        const review = {
            id: `u${Date.now()}`,
            name: values.name,
            rating: Number(values.rating),
            drink: values.drink,
            impression: values.impression,
            recommend: values.recommend,
            createdAt: new Date().toISOString(),
            text: values.review,
            images: [],
            isOwn: true
        };

        reviews.unshift(review);
        resetFilters();
        $form[0].reset(); // jQuery has no reset method: [0] is the plain DOM form, reset() clears the fields
        hideBox($previewBox);
        renderReviews(review.id);
        showConfirmation(review, values);
        showStatus('Your demo review was added to the list.', 'success');
    });

    $form.on('reset', function () {
        clearAllErrors();
        hideBox($previewBox);
        hideBox($confirmationBox);
        setTimeout(updateCounter, 0); // wait until the browser has really emptied the textarea
    });

    renderReviews();
    
});