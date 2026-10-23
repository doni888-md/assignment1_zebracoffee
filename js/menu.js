'use strict';

document.addEventListener('DOMContentLoaded', () => {
    // Массив данных меню с точными ценами, категориями и уникальными опциями (на английском языке)
    const menuItems = [
        // --- HOT DRINKS ---
        {
            id: 'espresso',
            name: 'Espresso',
            category: 'hot',
            hasVolume: true,
            volumes: { '250': 790, '350': 890, '480': 990 },
            hasCustomOption: true,
            optionLabel: 'Sugar & Syrup',
            options: ['With sugar', 'Without sugar', 'Vanilla syrup', 'Chocolate syrup', 'Caramel syrup'],
            image: 'images/americanoespresso.jpg'
        },
        {
            id: 'americano',
            name: 'Americano',
            category: 'hot',
            hasVolume: true,
            volumes: { '250': 790, '350': 890, '480': 990 },
            hasCustomOption: true,
            optionLabel: 'Sugar & Syrup',
            options: ['With sugar', 'Without sugar', 'Vanilla syrup', 'Chocolate syrup', 'Caramel syrup'],
            image: 'images/americanoespresso.jpg'
        },
        {
            id: 'cappuccino',
            name: 'Cappuccino',
            category: 'hot',
            hasVolume: true,
            volumes: { '250': 990, '350': 1040, '480': 1090 },
            hasCustomOption: true,
            optionLabel: 'Sugar & Syrup',
            options: ['With sugar', 'Without sugar', 'Vanilla syrup', 'Chocolate syrup', 'Caramel syrup'],
            image: 'images/cappuccinolatte.jpg'
        },
        {
            id: 'latte',
            name: 'Latte',
            category: 'hot',
            hasVolume: true,
            volumes: { '250': 990, '350': 1040, '480': 1090 },
            hasCustomOption: true,
            optionLabel: 'Sugar & Syrup',
            options: ['With sugar', 'Without sugar', 'Vanilla syrup', 'Chocolate syrup', 'Caramel syrup'],
            image: 'images/cappuccinolatte.jpg'
        },
        {
            id: 'raf',
            name: 'Raf',
            category: 'hot',
            hasVolume: true,
            volumes: { '250': 1190, '350': 1290, '480': 1390 },
            hasCustomOption: false,
            image: 'images/raf.jpg'
        },
        {
            id: 'flat-white',
            name: 'Flat White',
            category: 'hot',
            hasVolume: true,
            volumes: { '250': 1090, '350': 1190, '480': 1290 },
            hasCustomOption: false,
            image: 'images/flatwhite.jpg'
        },
        {
            id: 'hot-chocolate',
            name: 'Hot Chocolate',
            category: 'hot',
            hasVolume: false,
            standardPrice: 990,
            hasCustomOption: false,
            image: 'images/IMG_0932.jpg' 
        },
        {
            id: 'cocoa',
            name: 'Cocoa',
            category: 'hot',
            hasVolume: false,
            standardPrice: 990,
            hasCustomOption: false,
            image: 'images/IMG_0932.jpg' 
        },

        // --- COLD DRINKS (Standard volume, specific choices) ---
        {
            id: 'iced-latte',
            name: 'Ice Latte',
            category: 'cold',
            hasVolume: false,
            standardPrice: 1290,
            hasCustomOption: true,
            optionLabel: 'Flavor / Syrup',
            options: ['Pomegranate', 'Raspberry', 'Mango', 'Cherry', 'Mint', 'Blackcurrant'],
            image: 'images/IMG_0931.jpg'
        },
        {
            id: 'espresso-tonic',
            name: 'Espresso Tonic',
            category: 'cold',
            hasVolume: false,
            standardPrice: 1290,
            hasCustomOption: false,
            image: 'images/IMG_0753.jpg'
        },
        {
            id: 'limonade',
            name: 'Limonade',
            category: 'cold',
            hasVolume: false,
            standardPrice: 990,
            hasCustomOption: true,
            optionLabel: 'Flavor',
            options: ['Pomegranate-Rose', 'Strawberry-Watermelon', 'Tropical', 'Taiga Berries'],
            image: 'images/IMG_0930.jpg' 
        },
        {
            id: 'matcha',
            name: 'Matcha',
            category: 'cold',
            hasVolume: false,
            standardPrice: 1090,
            hasCustomOption: true,
            optionLabel: 'Type',
            options: ['Green Matcha', 'Blue Matcha', 'Mango Green Matcha'],
            image: 'images/IMG_0754.jpg' 
        },
        {
            id: 'frappe',
            name: 'Frappe',
            category: 'cold',
            hasVolume: false,
            standardPrice: 1590,
            hasCustomOption: true,
            optionLabel: 'Flavor',
            options: ['Chocolate', 'Salted Caramel', 'Hazelnut'],
            image: 'images/IMG_0929.jpg'
        },

        // --- DESSERTS ---
        {
            id: 'cinnabon',
            name: 'Cinnabon',
            category: 'desserts',
            hasVolume: false,
            standardPrice: 990,
            hasCustomOption: false,
            image: 'images/IMG_0757.jpg'
        },
        {
            id: 'spanish-cheesecake',
            name: 'Spanish Cheesecake',
            category: 'desserts',
            hasVolume: false,
            standardPrice: 1390,
            hasCustomOption: false,
            image: 'images/IMG_0756.jpg'
        },
        {
            id: 'mochi',
            name: 'Mochi',
            category: 'desserts',
            hasVolume: false,
            standardPrice: 850,
            hasCustomOption: true,
            optionLabel: 'Flavor',
            options: ['Blackcurrant', 'Strawberry', 'Mango', 'Strawberry-Coconut', 'Vanilla', 'Nutella'],
            image: 'images/IMG_0939.jpg'
        },
        {
            id: 'napoleon',
            name: 'Napoleon',
            category: 'desserts',
            hasVolume: false,
            standardPrice: 1390,
            hasCustomOption: false,
            image: 'images/IMG_0934.jpg'
        },
        {
            id: 'honey-cake',
            name: 'Honey Cake',
            category: 'desserts',
            hasVolume: false,
            standardPrice: 1390,
            hasCustomOption: false,
            image: 'images/IMG_0933.jpg'
        },
        {
            id: 'syrniki',
            name: 'Syrniki',
            category: 'desserts',
            hasVolume: false,
            standardPrice: 1390,
            hasCustomOption: false,
            image: 'images/IMG_0935.jpg'
        },
        {
            id: 'donut',
            name: 'Donut',
            category: 'desserts',
            hasVolume: false,
            standardPrice: 690,
            hasCustomOption: false,
            image: 'images/IMG_0936.jpg'
        },
        {
            id: 'art-desserts',
            name: 'Art Desserts',
            category: 'desserts',
            hasVolume: false,
            standardPrice: 1990,
            hasCustomOption: false,
            image: 'images/IMG_0937.jpg'
        }
    ];

    const tbody = document.getElementById('menu-table-body');
    if (!tbody) return;

    tbody.innerHTML = '';

    // Группировка по категориям
    const categories = {
        hot: { title: '🔥 Hot Drinks', items: [] },
        cold: { title: '❄️ Cold Drinks', items: [] },
        desserts: { title: '🥐 Desserts', items: [] }
    };

    menuItems.forEach(item => {
        if (categories[item.category]) {
            categories[item.category].items.push(item);
        }
    });

    // Рендеринг категорий со стрелками сворачивания (Collapse/Expand)
    Object.keys(categories).forEach(catKey => {
        const catData = categories[catKey];
        if (catData.items.length === 0) return;

        const categoryHeaderRow = document.createElement('tr');
        categoryHeaderRow.className = 'table-secondary fw-bold';
        categoryHeaderRow.innerHTML = `
            <td colspan="5" class="d-flex justify-content-between align-items-center py-2 px-3">
                <span>${catData.title}</span>
                <button type="button" class="btn btn-sm btn-outline-dark toggle-cat-btn" data-target="${catKey}">
                    Hide &#9660;
                </button>
            </td>
        `;
        tbody.appendChild(categoryHeaderRow);

        const categoryContainerClass = `category-group-${catKey}`;

        catData.items.forEach(item => {
            const tr = document.createElement('tr');
            tr.className = `menu-item-row ${categoryContainerClass}`;
            tr.setAttribute('data-id', item.id);
            tr.setAttribute('data-name', item.name);

            let priceDisplayHtml = '';
            let volumeControlHtml = '';
            let defaultPrice = 0;

            if (item.hasVolume) {
                let volumeOptionsHtml = '';
                const volumeKeys = Object.keys(item.volumes);
                volumeKeys.forEach((vol, index) => {
                    const price = item.volumes[vol];
                    if (index === 0) defaultPrice = price;
                    volumeOptionsHtml += `<option value="${vol}" data-price="${price}">${vol} ml (${price} ₸)</option>`;
                });
                volumeControlHtml = `
                    <select class="form-select form-select-sm volume-select" aria-label="Select volume">
                        ${volumeOptionsHtml}
                    </select>
                `;
                priceDisplayHtml = `${defaultPrice} ₸`;
            } else {
                defaultPrice = item.standardPrice;
                volumeControlHtml = `<span class="text-muted small">Standard</span>`;
                priceDisplayHtml = `${defaultPrice} ₸`;
            }

            tr.setAttribute('data-price', defaultPrice);

            // Генерация кастомных опций (сиропы, вкусы, типы)
            let customOptionHtml = '';
            if (item.hasCustomOption && item.options) {
                let optionsHtml = '';
                item.options.forEach(opt => {
                    optionsHtml += `<option value="${opt}">${opt}</option>`;
                });
                customOptionHtml = `
                    <div class="mt-1">
                        <label class="form-label small mb-0 text-muted">${item.optionLabel}:</label>
                        <select class="form-select form-select-sm custom-option-select">
                            ${optionsHtml}
                        </select>
                    </div>
                `;
            }

            tr.innerHTML = `
                <th scope="row">
                    <div class="d-flex align-items-center gap-2">
                        <img src="${item.image}" alt="${item.name}" class="menu-image" style="width: 50px; height: 50px; object-fit: cover; border-radius: 8px;">
                        <span>${item.name}</span>
                    </div>
                </th>
                <td>${volumeControlHtml}</td>
                <td class="text-nowrap item-price-display">${priceDisplayHtml}</td>
                <td>
                    <div class="mb-1">
                        <input type="number" class="form-control form-control-sm qty-input" min="1" value="1" aria-label="Quantity">
                    </div>
                    ${customOptionHtml}
                </td>
                <td>
                    <div class="d-flex flex-wrap gap-1">
                        <button type="button" class="btn btn-outline-secondary btn-sm place-btn selected" data-place="Here">Here</button>
                        <button type="button" class="btn btn-outline-secondary btn-sm place-btn" data-place="Takeaway">Takeaway</button>
                        <button type="button" class="btn btn-primary btn-sm order-btn">Order</button>
                    </div>
                </td>
            `;
            tbody.appendChild(tr);
        });
    });

    // Обработчик кнопки скрытия/показа категории
    document.querySelectorAll('.toggle-cat-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const targetKey = e.currentTarget.getAttribute('data-target');
            const rows = document.querySelectorAll(`.category-group-${targetKey}`);
            
            let isHidden = false;
            rows.forEach(row => {
                row.classList.toggle('d-none');
                isHidden = row.classList.contains('d-none');
            });

            e.currentTarget.innerHTML = isHidden ? 'Show &#9650;' : 'Hide &#9660;';
        });
    });

    // Динамическое обновление цены при выборе мл
    document.querySelectorAll('.volume-select').forEach(select => {
        select.addEventListener('change', (e) => {
            const selectedOption = e.target.options[e.target.selectedIndex];
            const price = selectedOption.getAttribute('data-price');
            const row = e.target.closest('tr');
            
            row.setAttribute('data-price', price);
            const priceDisplay = row.querySelector('.item-price-display');
            if (priceDisplay) {
                priceDisplay.textContent = `${price} ₸`;
            }
        });
    });

    // Переключение Here / Takeaway
    document.querySelectorAll('.place-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const parentDiv = e.target.closest('div');
            parentDiv.querySelectorAll('.place-btn').forEach(b => b.classList.remove('selected', 'btn-primary'));
            parentDiv.querySelectorAll('.place-btn').forEach(b => b.classList.add('btn-outline-secondary'));
            
            e.target.classList.add('selected', 'btn-primary');
            e.target.classList.remove('btn-outline-secondary');
        });
    });

    // Логика корзины (Your Order)
    let orderItems = [];

    tbody.addEventListener('click', (e) => {
        if (!e.target.classList.contains('order-btn')) return;

        const row = e.target.closest('tr');
        const itemName = row.getAttribute('data-name');
        
        const volumeSelect = row.querySelector('.volume-select');
        const volume = volumeSelect ? `${volumeSelect.value} ml` : 'Standard';
        const price = parseInt(row.getAttribute('data-price'), 10);
        
        const qtyInput = row.querySelector('.qty-input');
        const quantity = parseInt(qtyInput.value, 10) || 1;

        const customSelect = row.querySelector('.custom-option-select');
        const customOption = customSelect ? customSelect.value : '';

        const placeBtn = row.querySelector('.place-btn.selected');
        const place = placeBtn ? placeBtn.getAttribute('data-place') : 'Here';

        const orderItem = {
            itemName,
            volume,
            price,
            quantity,
            customOption,
            place,
            subtotal: price * quantity
        };

        orderItems.push(orderItem);
        updateOrderUI();

        const statusDiv = document.getElementById('menu-status');
        if (statusDiv) {
            statusDiv.textContent = `☕ ${itemName} (${volume}${customOption ? ', ' + customOption : ''}) added to your order!`;
            statusDiv.classList.remove('hidden', 'd-none');
            setTimeout(() => statusDiv.classList.add('hidden', 'd-none'), 3000);
        }
    });

    function updateOrderUI() {
        const orderList = document.getElementById('order-list');
        const orderEmpty = document.getElementById('order-empty');
        const orderTotalSpan = document.getElementById('order-total');
        if (!orderList) return;

        orderList.innerHTML = '';

        if (orderItems.length === 0) {
            if (orderEmpty) orderEmpty.style.display = 'block';
            if (orderTotalSpan) orderTotalSpan.textContent = '0';
            return;
        }

        if (orderEmpty) orderEmpty.style.display = 'none';

        let grandTotal = 0;

        orderItems.forEach((item, index) => {
            grandTotal += item.subtotal;

            const li = document.createElement('li');
            li.className = 'list-group-item d-flex justify-content-between align-items-center';
            li.innerHTML = `
                <div>
                    <strong>${item.itemName}</strong> (${item.volume}) 
                    <br><small class="text-muted">${item.customOption ? 'Option: ' + item.customOption + ' | ' : ''}Place: ${item.place} | Qty: ${item.quantity}</small>
                </div>
                <div class="text-end">
                    <span class="badge bg-primary rounded-pill me-2">${item.subtotal} ₸</span>
                    <button type="button" class="btn btn-sm btn-outline-danger remove-item-btn" data-index="${index}">×</button>
                </div>
            `;
            orderList.appendChild(li);
        });

        if (orderTotalSpan) {
            orderTotalSpan.textContent = grandTotal;
        }

        document.querySelectorAll('.remove-item-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const idx = parseInt(e.currentTarget.getAttribute('data-index'), 10);
                orderItems.splice(idx, 1);
                updateOrderUI();
            });
        });
    }

    const resetBtn = document.getElementById('order-reset-btn');
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            orderItems = [];
            updateOrderUI();
            const confirmationMsg = document.getElementById('order-confirmation-message');
            if (confirmationMsg) confirmationMsg.classList.add('hidden', 'd-none');
        });
    }
});