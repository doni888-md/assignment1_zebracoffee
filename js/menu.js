'use strict';

/*
 * jQuery 3.7.1, loaded from the CDN <script> tag placed BEFORE this file.
 * This line is needed because $, .on(), .append(), .fadeToggle() and every other
 * method below come from the library and do not exist until it has loaded.
 */
$(function () {
    const SUGAR_CHOICES = ['With sugar', 'Without sugar'];
    const SYRUP_CHOICES = ['No syrup', 'Vanilla syrup', 'Chocolate syrup', 'Caramel syrup'];

    const menuItems = [
        // --- HOT DRINKS ---
        { id: 'espresso', name: 'Espresso', category: 'hot', hasVolume: true, volumes: { '250': 790, '350': 890, '480': 990 }, hasCustomOption: false, hasSugarSyrup: true, image: 'images/americanoespresso.jpg' },
        { id: 'americano', name: 'Americano', category: 'hot', hasVolume: true, volumes: { '250': 790, '350': 890, '480': 990 }, hasCustomOption: false, hasSugarSyrup: true, image: 'images/americanoespresso.jpg' },
        { id: 'cappuccino', name: 'Cappuccino', category: 'hot', hasVolume: true, volumes: { '250': 990, '350': 1040, '480': 1090 }, hasCustomOption: false, hasSugarSyrup: true, image: 'images/cappuccinolatte.jpg' },
        { id: 'latte', name: 'Latte', category: 'hot', hasVolume: true, volumes: { '250': 990, '350': 1040, '480': 1090 }, hasCustomOption: false, hasSugarSyrup: true, image: 'images/cappuccinolatte.jpg' },
        { id: 'raf', name: 'Raf', category: 'hot', hasVolume: true, volumes: { '250': 1190, '350': 1290, '480': 1390 }, hasCustomOption: false, image: 'images/raf.jpg' },
        { id: 'flat-white', name: 'Flat White', category: 'hot', hasVolume: true, volumes: { '250': 1090, '350': 1190, '480': 1290 }, hasCustomOption: false, image: 'images/flatwhite.jpg' },
        { id: 'hot-chocolate', name: 'Hot Chocolate', category: 'hot', hasVolume: false, standardPrice: 990, hasCustomOption: false, image: 'images/IMG_0932.jpg' },
        { id: 'cocoa', name: 'Cocoa', category: 'hot', hasVolume: false, standardPrice: 990, hasCustomOption: false, image: 'images/IMG_0932.jpg' },

        // --- COLD DRINKS ---
        { id: 'iced-latte', name: 'Ice Latte', category: 'cold', hasVolume: false, standardPrice: 1290, hasCustomOption: true, optionLabel: 'Flavor / Syrup', options: ['Pomegranate', 'Raspberry', 'Mango', 'Cherry', 'Mint', 'Blackcurrant'], image: 'images/IMG_0931.jpg' },
        { id: 'espresso-tonic', name: 'Espresso Tonic', category: 'cold', hasVolume: false, standardPrice: 1290, hasCustomOption: false, image: 'images/IMG_0753.jpg' },
        { id: 'limonade', name: 'Limonade', category: 'cold', hasVolume: false, standardPrice: 990, hasCustomOption: true, optionLabel: 'Flavor', options: ['Pomegranate-Rose', 'Strawberry-Watermelon', 'Tropical', 'Taiga Berries'], image: 'images/IMG_0930.jpg' },
        { id: 'matcha', name: 'Matcha', category: 'cold', hasVolume: false, standardPrice: 1090, hasCustomOption: true, optionLabel: 'Type', options: ['Green Matcha', 'Blue Matcha', 'Mango Green Matcha'], image: 'images/IMG_0754.jpg' },
        { id: 'frappe', name: 'Frappe', category: 'cold', hasVolume: false, standardPrice: 1590, hasCustomOption: true, optionLabel: 'Flavor', options: ['Chocolate', 'Salted Caramel', 'Hazelnut'], image: 'images/IMG_0929.jpg' },

        // --- DESSERTS ---
        { id: 'cinnabon', name: 'Cinnabon', category: 'desserts', hasVolume: false, standardPrice: 990, hasCustomOption: false, image: 'images/IMG_0757.jpg' },
        { id: 'spanish-cheesecake', name: 'Spanish Cheesecake', category: 'desserts', hasVolume: false, standardPrice: 1390, hasCustomOption: false, image: 'images/IMG_0756.jpg' },
        { id: 'mochi', name: 'Mochi', category: 'desserts', hasVolume: false, standardPrice: 850, hasCustomOption: true, optionLabel: 'Flavor', options: ['Blackcurrant', 'Strawberry', 'Mango', 'Strawberry-Coconut', 'Vanilla', 'Nutella'], image: 'images/IMG_0939.jpg' },
        { id: 'napoleon', name: 'Napoleon', category: 'desserts', hasVolume: false, standardPrice: 1390, hasCustomOption: false, image: 'images/IMG_0934.jpg' },
        { id: 'honey-cake', name: 'Honey Cake', category: 'desserts', hasVolume: false, standardPrice: 1390, hasCustomOption: false, image: 'images/IMG_0933.jpg' },
        { id: 'syrniki', name: 'Syrniki', category: 'desserts', hasVolume: false, standardPrice: 1390, hasCustomOption: false, image: 'images/IMG_0935.jpg' },
        { id: 'donut', name: 'Donut', category: 'desserts', hasVolume: false, standardPrice: 690, hasCustomOption: false, image: 'images/IMG_0936.jpg' },
        { id: 'art-desserts', name: 'Art Desserts', category: 'desserts', hasVolume: false, standardPrice: 1990, hasCustomOption: false, image: 'images/IMG_0937.jpg' }
    ];

    // Selector by id
    const $tbody = $('#menu-table-body');
    if ($tbody.length === 0) return; // not the menu page

    $tbody.empty();

    const categories = {
        hot: { title: '🔥 Hot Drinks', items: [] },
        cold: { title: '❄️ Cold Drinks', items: [] },
        desserts: { title: '🥐 Desserts', items: [] }
    };

    $.each(menuItems, function (_, item) {
        if (categories[item.category]) categories[item.category].items.push(item);
    });

    // ------------------------------------------------------------------
    // Build the table from the array: none of these rows exist in menu.html.
    // .html() is safe here because every value comes from OUR array above.
    // (For text typed by a visitor we would use .text(), see reviews.js.)
    // ------------------------------------------------------------------
    $.each(categories, function (catKey, catData) {
        if (catData.items.length === 0) return; // inside $.each this means "continue"

        const $headerCell = $('<td>', {
            colspan: 5,
            'class': 'd-flex justify-content-between align-items-center py-2 px-3'
        });
        $('<span>').text(catData.title).appendTo($headerCell);
        $('<button>', {
            type: 'button',
            'class': 'btn btn-sm btn-outline-dark toggle-cat-btn',
            'data-target': catKey
        }).html('Hide &#9660;').appendTo($headerCell);
        $('<tr>', { 'class': 'table-secondary fw-bold' }).append($headerCell).appendTo($tbody);

        $.each(catData.items, function (_, item) {
            let volumeControlHtml;
            let defaultPrice;

            if (item.hasVolume) {
                let volumeOptionsHtml = '';
                $.each(item.volumes, function (vol, price) {
                    if (defaultPrice === undefined) defaultPrice = price;
                    volumeOptionsHtml += `<option value="${vol}" data-price="${price}">${vol} ml (${price} ₸)</option>`;
                });
                volumeControlHtml = `<select class="form-select form-select-sm volume-select" aria-label="Select volume">${volumeOptionsHtml}</select>`;
            } else {
                defaultPrice = item.standardPrice;
                volumeControlHtml = '<span class="text-muted small">Standard</span>';
            }

            let customOptionHtml = '';
            if (item.hasCustomOption && item.options) {
                let optionsHtml = '';
                $.each(item.options, function (_, opt) {
                    optionsHtml += `<option value="${opt}">${opt}</option>`;
                });
                customOptionHtml = `
                    <div class="mt-1">
                        <label class="form-label small mb-0 text-muted">${item.optionLabel}:</label>
                        <select class="form-select form-select-sm custom-option-select">${optionsHtml}</select>
                    </div>`;
            }

            // Coffee drinks get TWO separate lists: sugar AND syrup can be chosen together
            let sugarSyrupHtml = '';
            if (item.hasSugarSyrup) {
                const sugarOptions = $.map(SUGAR_CHOICES, opt => `<option value="${opt}">${opt}</option>`).join('');
                const syrupOptions = $.map(SYRUP_CHOICES, opt => `<option value="${opt}">${opt}</option>`).join('');
                sugarSyrupHtml = `
                    <div class="mt-1">
                        <label class="form-label small mb-0 text-muted">Sugar:</label>
                        <select class="form-select form-select-sm sugar-select">${sugarOptions}</select>
                    </div>
                    <div class="mt-1">
                        <label class="form-label small mb-0 text-muted">Syrup:</label>
                        <select class="form-select form-select-sm syrup-select">${syrupOptions}</select>
                    </div>`;
            }

            $('<tr>', {
                'class': 'menu-item-row category-group-' + catKey,
                'data-id': item.id,
                'data-name': item.name,
                'data-price': defaultPrice
            }).html(`
                <th scope="row">
                    <div class="d-flex align-items-center gap-2">
                        <img src="${item.image}" alt="${item.name}" class="menu-image" style="width: 50px; height: 50px; object-fit: cover; border-radius: 8px;">
                        <span>${item.name}</span>
                    </div>
                </th>
                <td>${volumeControlHtml}</td>
                <td class="text-nowrap item-price-display">${defaultPrice} ₸</td>
                <td>
                    <div class="mb-1">
                        <input type="number" class="form-control form-control-sm qty-input" min="1" value="1" aria-label="Quantity">
                    </div>
                    ${customOptionHtml}${sugarSyrupHtml}
                </td>
                <td>
                    <div class="d-flex flex-wrap gap-1">
                        <button type="button" class="btn btn-outline-secondary btn-sm place-btn selected" data-place="Here">Here</button>
                        <button type="button" class="btn btn-outline-secondary btn-sm place-btn" data-place="Takeaway">Takeaway</button>
                        <button type="button" class="btn btn-primary btn-sm order-btn">Order</button>
                    </div>
                </td>`).appendTo($tbody);
        });
    });

    // ------------------------------------------------------------------
    // FEATURE 2 (rewritten from plain JS): hide / show a whole category.
    // Old: querySelectorAll + a addEventListener on EVERY button + forEach with
    //      classList.toggle('d-none') + innerHTML for the label (~14 lines).
    // New: ONE delegated .on() + .fadeToggle() + .html() (~7 lines).
    // Result: shorter, clearer, and it now animates instead of just blinking.
    //
    // DELEGATION: the buttons are created by the code above, AFTER the page loaded.
    // $('.toggle-cat-btn').on('click', ...) would find ZERO elements if it ran
    // before they exist, and later-created buttons would never get the handler.
    // Binding to $tbody (it already exists) works because click events bubble up
    // from the button to the tbody, and jQuery checks the ".toggle-cat-btn" selector then.
    // ------------------------------------------------------------------
    $tbody.on('click', '.toggle-cat-btn', function () {
        const $btn = $(this);                                   // $(this) = the clicked button
        const $rows = $('.menu-item-row.category-group-' + $btn.attr('data-target')); // class + attribute
        $rows.stop(true, true);                                 // finish a running animation first
        const willHide = $rows.first().is(':visible');          // check BEFORE toggling
        $rows.fadeToggle(250);                                  // effect with a duration
        $btn.html(willHide ? 'Show &#9650;' : 'Hide &#9660;');  // .html() because of the &#...; arrows
    });

    // Volume changed -> update the price. 'change' is the 2nd event type; it is delegated too.
    $tbody.on('change', '.volume-select', function () {
        const price = $(this).find('option:selected').attr('data-price'); // .find() + :selected filter
        $(this).closest('tr').attr('data-price', price);                  // go UP to the row
        $(this).parent().siblings('.item-price-display').text(price + ' ₸'); // parent <td> -> neighbour <td>
    });

    // Place buttons (Here / Takeaway)
    $tbody.on('click', '.place-btn', function () {
        if ($(this).hasClass('selected')) return; // already selected: nothing to do

        // CHAIN of 5 links, step by step:
        // 1) $(this)                          the button that was clicked
        // 2) .addClass('selected btn-primary') mark it as active (classes already in the CSS)
        // 3) .removeClass('btn-outline-secondary') take away its "inactive" look
        // 4) .siblings('.place-btn')          jump to the OTHER place button(s) in the same group
        // 5) .removeClass(...).addClass(...)  give them the "inactive" look again
        $(this).addClass('selected btn-primary').removeClass('btn-outline-secondary')
            .siblings('.place-btn').removeClass('selected btn-primary').addClass('btn-outline-secondary');
    });

    // ------------------------------------------------------------------
    // Order
    // ------------------------------------------------------------------
    let orderItems = [];

    // Status message: fadeIn -> wait 3 s -> fadeOut, and a CALLBACK that runs after fadeOut ends.
    function showMenuStatus(message) {
        $('#menu-status')
            .stop(true, true)
            .text(message)                    // .text(): the message may contain user-chosen words, never as HTML
            .removeClass('hidden d-none')     // d-none is !important in Bootstrap, so remove it before an effect
            .hide()
            .fadeIn(200)
            .delay(3000)
            .fadeOut(400, function () {
                $(this).text('');             // callback: runs only AFTER the fade-out has finished
            });
    }

    $tbody.on('click', '.order-btn', function () {
        const $row = $(this).closest('tr');
        const itemName = $row.attr('data-name');

        const $volumeSelect = $row.find('.volume-select');
        const volume = $volumeSelect.length ? $volumeSelect.val() + ' ml' : 'Standard';
        const price = parseInt($row.attr('data-price'), 10);
        const quantity = Math.max(1, parseInt($row.find('.qty-input').val(), 10) || 1);
        // Flavor list (cold drinks / desserts) + sugar + syrup, joined into one text.
        // .val() on a missing list gives undefined, and $.grep(..., Boolean) throws those away.
        const syrup = $row.find('.syrup-select').val();
        const customOption = $.grep([
            $row.find('.custom-option-select').val(),
            $row.find('.sugar-select').val(),
            syrup === 'No syrup' ? '' : syrup
        ], Boolean).join(', ');
        const place = $row.find('.place-btn.selected').attr('data-place') || 'Here';

        orderItems.push({ itemName, volume, price, quantity, customOption, place, subtotal: price * quantity });
        updateOrderUI();

        showMenuStatus(`☕ ${itemName} (${volume}${customOption ? ', ' + customOption : ''}) added to your order!`);
    });

    // ------------------------------------------------------------------
    // FEATURE 3 (rewritten from plain JS): the order list built from an array.
    // Old: createElement + innerHTML + appendChild, and querySelectorAll(...).forEach
    //      re-attaching a listener to every remove button after EVERY redraw (~30 lines).
    // New: $('<li>', {...}).html(...).appendTo(list) + ONE delegated remove handler below.
    // Result: only a little shorter, but clearer, because nothing has to be re-bound after a redraw.
    // ------------------------------------------------------------------
    function updateOrderUI() {
        const $orderList = $('#order-list');
        if ($orderList.length === 0) return;

        $orderList.empty();
        $('#order-empty').toggle(orderItems.length === 0); // show "empty" text only when there are no items

        let grandTotal = 0;

        $.each(orderItems, function (index, item) {
            grandTotal += item.subtotal;

            $('<li>', { 'class': 'list-group-item d-flex justify-content-between align-items-center' })
                .html(`
                    <div>
                        <strong>${item.itemName}</strong> (${item.volume})
                        <br><small class="text-muted">${item.customOption ? 'Option: ' + item.customOption + ' | ' : ''}Place: ${item.place} | Qty: ${item.quantity}</small>
                    </div>
                    <div class="text-end">
                        <span class="badge bg-primary rounded-pill me-2">${item.subtotal} ₸</span>
                        <button type="button" class="btn btn-sm btn-outline-danger remove-item-btn" data-index="${index}">×</button>
                    </div>`)
                .appendTo($orderList);
        });

        $('#order-total').text(grandTotal);
    }

    // Delegated: the remove buttons are re-created on every redraw of the list.
    $('#order-list').on('click', '.remove-item-btn', function () {
        orderItems.splice(parseInt($(this).attr('data-index'), 10), 1);
        updateOrderUI();
    });

    $('#order-reset-btn').on('click', function () {
        orderItems = [];
        updateOrderUI();
        // put the place buttons back to "Here": attribute selector + :not() filter
        $tbody.find('.place-btn[data-place="Here"]:not(.selected)').trigger('click');
        $('#order-confirmation-message').addClass('hidden d-none');
    });

    updateOrderUI();
});