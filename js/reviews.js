    document.addEventListener('DOMContentLoaded', () => {
    const reviewsList = document.getElementById('reviews-list');
    const form = document.getElementById('review-form');
    if (!reviewsList || !form) return;
 
    const MIN_TEXT = 20;
    const MAX_TEXT = 500;
    const MIN_VISIT_DATE = '2023-01-01';
 
    const DRINK_LABELS = { coffee: 'Coffee', tea: 'Tea', dessert: 'Dessert' };
    const IMPRESSION_LABELS = { good: 'Good', excellent: 'Excellent' };
 
    let reviews = [
        {
            id: 'r1',
            name: 'd sss__',
            rating: 5,
            drink: 'coffee',
            impression: 'excellent',
            recommend: true,
            createdAt: '2026-07-30T14:20:00+05:00',
            text: 'Pleasant atmosphere, great purple on Salvador Geisha. A clean balanced cup with a bright aroma, pleasant sweetness and revealing floral and fruity notes.',
            images: [
                { src: 'images/IMG_0046.jpg', alt: 'Interior of Zebra Coffee', caption: 'Main interior of Zebra Coffee.' },
                { src: 'images/IMG_0047.jpg', alt: 'Another view of Zebra Coffee interior', caption: 'Another view of the interior.' }
            ],
            isOwn: false
        },
        {
            id: 'r2',
            name: 'Aigerim K.',
            rating: 5,
            drink: 'coffee',
            impression: 'excellent',
            recommend: true,
            createdAt: '2026-09-12T09:45:00+05:00',
            text: 'Flat White at 350 ml was smooth and not bitter. The barista remembered my order on the second visit. Quick service even in the morning rush.',
            images: [],
            isOwn: false
        },
        {
            id: 'r3',
            name: 'Dias',
            rating: 4,
            drink: 'dessert',
            impression: 'good',
            recommend: true,
            createdAt: '2026-08-21T18:10:00+05:00',
            text: 'Spanish Cheesecake is creamy and not too sweet. Would be perfect with a few more seats near the window, but the takeaway option is convenient.',
            images: [],
            isOwn: false
        },
        {
            id: 'r4',
            name: 'Madina S.',
            rating: 4,
            drink: 'tea',
            impression: 'good',
            recommend: true,
            createdAt: '2026-10-02T16:30:00+05:00',
            text: 'Tried the Blue Matcha and Mochi with strawberry. Both were fresh, the drink arrived cold and nicely layered. Prices are fair for the centre of Astana.',
            images: [],
            isOwn: false
        },
        {
            id: 'r5',
            name: 'Timur B.',
            rating: 3,
            drink: 'coffee',
            impression: 'good',
            recommend: false,
            createdAt: '2026-09-27T13:05:00+05:00',
            text: 'The cappuccino was tasty, but I waited about fifteen minutes at lunch time. Staff were polite and apologised. I will try again at a quieter hour.',
            images: [],
            isOwn: false
        },
        {
            id: 'r6',
            name: 'Alina',
            rating: 5,
            drink: 'dessert',
            impression: 'excellent',
            recommend: true,
            createdAt: '2026-10-15T11:40:00+05:00',
            text: 'Warm Cinnabon with an Ice Latte with mango syrup is my new weekend habit. Clean tables, soft music and a really friendly team.',
            images: [],
            isOwn: false
        }
    ];
 
    const filters = { query: '', rating: 'all', drink: 'all', sort: 'newest' };
    let statusTimer = null;
 
    // ------------------------------------------------------------------
    // Small reusable helpers
    // ------------------------------------------------------------------
    function createEl(tag, className, text) {
        const node = document.createElement(tag);
        if (className) node.className = className;
        if (text !== undefined) node.textContent = text;
        return node;
    }
 
    function setHidden(node, hidden) {
        node.classList.toggle('hidden', hidden);
        node.classList.toggle('d-none', hidden);
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
        const total = list.reduce((sum, review) => sum + review.rating, 0);
        return total / list.length;
    }
 
    function generateReference() {
        const number = Math.floor(1000 + Math.random() * 9000);
        return `DEMO-${number}`;
    }
 
    // ------------------------------------------------------------------
    // Rendering: one function creates every review card
    // ------------------------------------------------------------------
    function createReviewCard(review) {
        const article = createEl('article', 'review-card card border shadow-sm');
        article.id = `review-${review.id}`;
        if (review.isOwn) article.classList.add('border-success');
 
        const body = createEl('div', 'card-body');
 
        const head = createEl('div', 'd-flex flex-wrap justify-content-between align-items-start gap-2 mb-2');
        head.appendChild(createEl('h3', 'h5 fw-bold mb-0', review.name));
 
        const rating = createEl('span', 'badge text-bg-warning fs-6', `${formatStars(review.rating)} ${review.rating}/5`);
        rating.setAttribute('aria-label', `Rating ${review.rating} out of 5`);
        head.appendChild(rating);
        body.appendChild(head);
 
        const tags = createEl('div', 'd-flex flex-wrap gap-2 mb-3');
        tags.appendChild(createEl('span', 'badge text-bg-secondary', `Favorite: ${DRINK_LABELS[review.drink]}`));
        tags.appendChild(createEl('span', 'badge text-bg-light border', `Impression: ${IMPRESSION_LABELS[review.impression]}`));
        if (review.recommend) {
            tags.appendChild(createEl('span', 'badge text-bg-success', '✓ Recommends Zebra Coffee'));
        }
        if (review.isOwn) {
            tags.appendChild(createEl('span', 'badge text-bg-info', 'Your demo review'));
        }
        body.appendChild(tags);
 
        const quote = createEl('blockquote', 'blockquote');
        quote.appendChild(createEl('p', 'mb-2', review.text));
        const footer = createEl('footer', 'blockquote-footer');
        footer.appendChild(document.createTextNode(`${review.name}, `));
        const time = createEl('time', '', formatDateTime(review.createdAt));
        time.setAttribute('datetime', review.createdAt);
        footer.appendChild(time);
        quote.appendChild(footer);
        body.appendChild(quote);
 
        if (review.images.length > 0) {
            const row = createEl('div', 'row g-3');
            review.images.forEach(image => {
                const col = createEl('div', 'col-12 col-md-6');
                const figure = createEl('figure', 'mb-0 text-center');
                const img = createEl('img', 'img-fluid rounded-3 review-photo');
                img.src = image.src;
                img.alt = image.alt;
                figure.appendChild(img);
                figure.appendChild(createEl('figcaption', 'small mt-2', image.caption));
                col.appendChild(figure);
                row.appendChild(col);
            });
            body.appendChild(row);
        }
 
        if (review.isOwn) {
            const deleteBtn = createEl('button', 'btn btn-sm btn-outline-danger mt-3 delete-review-btn', 'Remove my review');
            deleteBtn.type = 'button';
            deleteBtn.dataset.id = review.id;
            body.appendChild(deleteBtn);
        }
 
        article.appendChild(body);
        return article;
    }
 
    // ------------------------------------------------------------------
    // Search / filter / sort controls (created with DOM, no HTML edits)
    // ------------------------------------------------------------------
    const toolbar = createEl('div', 'card card-body border shadow-sm mb-3');
    const toolbarRow = createEl('div', 'row g-2 align-items-end');
 
    function createControlColumn(colClass, labelText, controlId, control) {
        const col = createEl('div', colClass);
        const label = createEl('label', 'form-label small fw-semibold mb-1', labelText);
        label.setAttribute('for', controlId);
        control.id = controlId;
        col.appendChild(label);
        col.appendChild(control);
        return col;
    }
 
    function createSelect(options) {
        const select = createEl('select', 'form-select form-select-sm');
        options.forEach(([value, label]) => {
            const option = createEl('option', '', label);
            option.value = value;
            select.appendChild(option);
        });
        return select;
    }
 
    const searchInput = createEl('input', 'form-control form-control-sm');
    searchInput.type = 'search';
    searchInput.placeholder = 'Name or word in review';
    searchInput.autocomplete = 'off';
 
    const ratingSelect = createSelect([
        ['all', 'All ratings'],
        ['5', '5 stars only'],
        ['4', '4 stars and above'],
        ['low', '3 stars and below']
    ]);
    const drinkSelect = createSelect([
        ['all', 'All drinks'],
        ['coffee', 'Coffee'],
        ['tea', 'Tea'],
        ['dessert', 'Dessert']
    ]);
    const sortSelect = createSelect([
        ['newest', 'Newest first'],
        ['oldest', 'Oldest first'],
        ['highest', 'Highest rating'],
        ['lowest', 'Lowest rating']
    ]);
 
    const resetFiltersBtn = createEl('button', 'btn btn-outline-secondary btn-sm w-100', 'Reset');
    resetFiltersBtn.type = 'button';
 
    toolbarRow.appendChild(createControlColumn('col-12 col-md-6', 'Search reviews', 'reviews-search', searchInput));
    toolbarRow.appendChild(createControlColumn('col-6 col-md-3', 'Rating', 'reviews-filter-rating', ratingSelect));
    toolbarRow.appendChild(createControlColumn('col-6 col-md-3', 'Drink', 'reviews-filter-drink', drinkSelect));
    toolbarRow.appendChild(createControlColumn('col-6 col-md-6', 'Sort by', 'reviews-sort', sortSelect));
    const resetCol = createEl('div', 'col-6 col-md-6');
    resetCol.appendChild(resetFiltersBtn);
    toolbarRow.appendChild(resetCol);
    toolbar.appendChild(toolbarRow);
 
    const resultCount = createEl('p', 'small text-muted mb-0 mt-3');
    resultCount.setAttribute('aria-live', 'polite');
    toolbar.appendChild(resultCount);
 
    const statusBox = createEl('div', 'alert mt-3 mb-0 hidden d-none');
    statusBox.setAttribute('role', 'status');
    toolbar.appendChild(statusBox);
 
    const emptyState = createEl('div', 'alert alert-secondary text-center hidden d-none');
    const emptyText = createEl('p', 'mb-2', 'No reviews match your search. Try other words or reset the filters.');
    const emptyResetBtn = createEl('button', 'btn btn-dark btn-sm', 'Show all reviews');
    emptyResetBtn.type = 'button';
    emptyState.appendChild(emptyText);
    emptyState.appendChild(emptyResetBtn);
 
    reviewsList.before(toolbar);
    reviewsList.before(emptyState);
 
    // ------------------------------------------------------------------
    // Filtering logic
    // ------------------------------------------------------------------
    function matchesFilters(review, activeFilters) {
        const query = activeFilters.query.trim().toLowerCase();
        const textMatch = query === ''
            || review.name.toLowerCase().includes(query)
            || review.text.toLowerCase().includes(query);
 
        let ratingMatch = true;
        switch (activeFilters.rating) {
            case '5':
                ratingMatch = review.rating === 5;
                break;
            case '4':
                ratingMatch = review.rating >= 4;
                break;
            case 'low':
                ratingMatch = review.rating <= 3;
                break;
            default:
                ratingMatch = true;
        }
 
        const drinkMatch = activeFilters.drink === 'all' || review.drink === activeFilters.drink;
        return textMatch && ratingMatch && drinkMatch;
    }
 
    function sortReviews(list, mode) {
        const copy = [...list];
        copy.sort((a, b) => {
            const timeA = new Date(a.createdAt).getTime();
            const timeB = new Date(b.createdAt).getTime();
            switch (mode) {
                case 'oldest':
                    return timeA - timeB;
                case 'highest':
                    return b.rating - a.rating || timeB - timeA;
                case 'lowest':
                    return a.rating - b.rating || timeB - timeA;
                default:
                    return timeB - timeA;
            }
        });
        return copy;
    }
 
    function applyFilters(list, activeFilters) {
        const matched = list.filter(review => matchesFilters(review, activeFilters));
        return sortReviews(matched, activeFilters.sort);
    }
 
    function renderReviews(highlightId) {
        const visible = applyFilters(reviews, filters);
        reviewsList.replaceChildren();
        visible.forEach(review => reviewsList.appendChild(createReviewCard(review)));
 
        const average = calculateAverage(visible);
        const averageText = visible.length > 0 ? ` Average rating: ${average.toFixed(1)} / 5.` : '';
        resultCount.textContent = `Showing ${visible.length} of ${reviews.length} reviews.${averageText}`;
        setHidden(emptyState, visible.length !== 0);
 
        if (highlightId) {
            const card = document.getElementById(`review-${highlightId}`);
            if (card) {
                card.classList.add('shadow');
                card.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    }
 
    function resetFilters() {
        filters.query = '';
        filters.rating = 'all';
        filters.drink = 'all';
        filters.sort = 'newest';
        searchInput.value = '';
        ratingSelect.value = 'all';
        drinkSelect.value = 'all';
        sortSelect.value = 'newest';
    }
 
    function showStatus(message, type) {
        statusBox.textContent = message;
        statusBox.classList.remove('alert-success', 'alert-info', 'alert-danger');
        statusBox.classList.add(`alert-${type}`);
        setHidden(statusBox, false);
        clearTimeout(statusTimer);
        statusTimer = setTimeout(() => setHidden(statusBox, true), 4000);
    }
 
    searchInput.addEventListener('input', () => {
        filters.query = searchInput.value;
        renderReviews();
    });
 
    searchInput.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            searchInput.value = '';
            filters.query = '';
            renderReviews();
        }
    });
 
    ratingSelect.addEventListener('change', () => {
        filters.rating = ratingSelect.value;
        renderReviews();
    });
 
    drinkSelect.addEventListener('change', () => {
        filters.drink = drinkSelect.value;
        renderReviews();
    });
 
    sortSelect.addEventListener('change', () => {
        filters.sort = sortSelect.value;
        renderReviews();
    });
 
    function handleResetClick() {
        resetFilters();
        renderReviews();
        showStatus('Filters were reset. All reviews are shown.', 'info');
    }
 
    resetFiltersBtn.addEventListener('click', handleResetClick);
    emptyResetBtn.addEventListener('click', handleResetClick);
 
    reviewsList.addEventListener('click', (event) => {
        const button = event.target.closest('.delete-review-btn');
        if (!button) return;
        const id = button.dataset.id;
        reviews = reviews.filter(review => review.id !== id);
        renderReviews();
        showStatus('Your demo review was removed from this page.', 'info');
    });
 
    // ------------------------------------------------------------------
    // Form: counter, validation, preview, submit
    // ------------------------------------------------------------------
    form.noValidate = true; // our own field-level validation replaces browser bubbles
 
    const errorSummary = document.getElementById('review-form-errors');
    const previewBox = document.getElementById('review-preview');
    const previewName = document.getElementById('review-preview-name');
    const previewRating = document.getElementById('review-preview-rating');
    const previewText = document.getElementById('review-preview-text');
    const confirmationBox = document.getElementById('review-confirmation-message');
    const previewBtn = document.getElementById('review-preview-btn');
    const textArea = document.getElementById('review-text');
 
    const counter = createEl('div', 'form-text');
    textArea.after(counter);
 
    const summaryBox = createEl('div', 'mt-3');
    confirmationBox.appendChild(summaryBox);
 
    function updateCounter() {
        const length = textArea.value.length;
        const tooShort = length > 0 && length < MIN_TEXT;
        const tooLong = length > MAX_TEXT;
        let hint = `${length} / ${MAX_TEXT} characters (minimum ${MIN_TEXT}).`;
        if (tooLong) hint = `${length} / ${MAX_TEXT} characters — too long, remove ${length - MAX_TEXT}.`;
        counter.textContent = hint;
        counter.classList.toggle('text-danger', tooLong || tooShort);
    }
 
    textArea.addEventListener('input', updateCounter);
    updateCounter();
 
    function getFormValues() {
        const impression = form.querySelector('input[name="impression"]:checked');
        return {
            name: document.getElementById('review-name').value.trim(),
            email: document.getElementById('review-email').value.trim(),
            phone: document.getElementById('review-phone').value.trim(),
            visitDate: document.getElementById('review-date').value,
            rating: document.getElementById('review-rating').value.trim(),
            drink: document.getElementById('review-drink').value,
            impression: impression ? impression.value : '',
            review: textArea.value.trim(),
            recommend: document.getElementById('review-recommend').checked
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
 
        return errors;
    }
 
    function getControls(fieldName) {
        return form.querySelectorAll(`[name="${fieldName}"]`);
    }
 
    function getAnchor(fieldName) {
        const first = getControls(fieldName)[0];
        if (fieldName === 'review') return counter;
        if (fieldName === 'impression') return first.closest('.p-3');
        if (fieldName === 'recommend') return first.closest('.form-check');
        return first;
    }
 
    function clearFieldError(fieldName) {
        const old = document.getElementById(`error-${fieldName}`);
        if (old) old.remove();
        getControls(fieldName).forEach(control => {
            control.classList.remove('is-invalid');
            control.removeAttribute('aria-invalid');
            control.removeAttribute('aria-describedby');
        });
    }
 
    function clearAllErrors() {
        ['name', 'email', 'phone', 'visitDate', 'rating', 'drink', 'impression', 'review', 'recommend']
            .forEach(clearFieldError);
        form.querySelectorAll('.is-valid').forEach(control => control.classList.remove('is-valid'));
        errorSummary.replaceChildren();
        setHidden(errorSummary, true);
    }
 
    function showErrors(errors, values) {
        clearAllErrors();
 
        errors.forEach(({ field, message }) => {
            const error = createEl('div', 'field-error text-danger small mt-1 fw-semibold', `⚠ ${message}`);
            error.id = `error-${field}`;
            getAnchor(field).after(error);
            getControls(field).forEach(control => {
                control.classList.add('is-invalid');
                control.setAttribute('aria-invalid', 'true');
                control.setAttribute('aria-describedby', error.id);
            });
        });
 
        const failed = errors.map(item => item.field);
        ['name', 'email', 'visitDate', 'rating', 'review'].forEach(field => {
            if (!failed.includes(field)) getControls(field).forEach(control => control.classList.add('is-valid'));
        });
        if (values.phone !== '' && !failed.includes('phone')) {
            getControls('phone').forEach(control => control.classList.add('is-valid'));
        }
 
        const uniqueFields = [...new Set(failed)];
        errorSummary.textContent = `Please fix ${uniqueFields.length} field${uniqueFields.length === 1 ? '' : 's'} below before sending your review.`;
        setHidden(errorSummary, false);
 
        getControls(errors[0].field)[0].focus();
    }
 
    function buildSummary(review, values, reference) {
        const list = createEl('dl', 'row mb-0 small');
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
        rows.forEach(([term, detail]) => {
            list.appendChild(createEl('dt', 'col-5 col-md-4', term));
            list.appendChild(createEl('dd', 'col-7 col-md-8', detail));
        });
        return list;
    }
 
    function showConfirmation(review, values) {
        const reference = generateReference();
        summaryBox.replaceChildren();
        summaryBox.appendChild(buildSummary(review, values, reference));
        summaryBox.appendChild(createEl(
            'p',
            'mb-0 mt-3 small fw-semibold',
            'Demonstration only: no data was sent to a server, and the reference number is temporary. Your review is shown only on this page until it is reloaded.'
        ));
        setHidden(confirmationBox, false);
    }
 
    form.addEventListener('input', (event) => {
        if (event.target.name) clearFieldError(event.target.name);
    });
 
    form.addEventListener('change', (event) => {
        if (event.target.name) clearFieldError(event.target.name);
    });
 
    previewBtn.addEventListener('click', () => {
        const values = getFormValues();
        const errors = validateReview(values);
        setHidden(confirmationBox, true);
 
        if (errors.length > 0) {
            setHidden(previewBox, true);
            showErrors(errors, values);
            return;
        }
 
        clearAllErrors();
        previewName.textContent = values.name;
        previewRating.textContent = `${formatStars(Number(values.rating))} ${values.rating} / 5`;
        previewText.textContent = values.review;
        setHidden(previewBox, false);
    });
 
    form.addEventListener('submit', (event) => {
        event.preventDefault();
        setHidden(confirmationBox, true);
 
        const values = getFormValues();
        const errors = validateReview(values);
 
        if (errors.length > 0) {
            setHidden(previewBox, true);
            showErrors(errors, values);
            return;
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
        form.reset();
        setHidden(previewBox, true);
        renderReviews(review.id);
        showConfirmation(review, values);
        showStatus('Your demo review was added to the list.', 'success');
    });
 
    form.addEventListener('reset', () => {
        clearAllErrors();
        setHidden(previewBox, true);
        setHidden(confirmationBox, true);
        setTimeout(updateCounter, 0);
    });
 
    // ------------------------------------------------------------------
    // Initial state
    // ------------------------------------------------------------------
    renderReviews();
});

