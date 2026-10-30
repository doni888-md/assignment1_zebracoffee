'use strict';

/**
 * Zebra Coffee - About Page Standards & Interactive Benchmark Explorer
 * jQuery Version: 3.7.1
 * Initialized via $(function() { ... }) to avoid executing on incomplete DOM.
 *
 * Comparison Comment (Feature Rewrite: Standards Table & Filter):
 * Replaced document.createElement, native classList, and multiple event listeners
 * with jQuery .empty(), .append(), .before(), .closest(), and delegated .on().
 */

const coffeeStandardsData = [
  {
    id: 1,
    standard: 'Order Prep Time',
    target: '< 3 minutes',
    frequency: 'Every order',
    category: 'speed',
    detail: 'Automated cup dosing and calibrated tampers allow baristas to pull espresso shots in 25s without compromising crema.'
  },
  {
    id: 2,
    standard: 'Grinder Calibration',
    target: 'Exact double shot extraction',
    frequency: 'Twice per shift',
    category: 'quality',
    detail: 'Morning and evening micron adjustments ensure 18g in, 36g out within a strict 26-28 second flow window.'
  },
  {
    id: 3,
    standard: 'Milk Steaming Temp',
    target: '60°C – 65°C sweet spot',
    frequency: 'Every drink',
    category: 'quality',
    detail: 'Preserves the natural sweetness of lactose without scalding proteins, delivering velvety microfoam for latte art.'
  },
  {
    id: 4,
    standard: 'Workplace Seating & Wi-Fi',
    target: '24/7 continuous access',
    frequency: 'Continuous',
    category: 'hospitality',
    detail: 'High-speed gigabit Wi-Fi, power outlets under every seat on the 2nd floor, and quiet study zones.'
  },
  {
    id: 5,
    standard: 'Steam Wand Sanitization',
    target: 'Purge and wipe instantly',
    frequency: 'After each cup',
    category: 'hygiene',
    detail: 'Dedicated antibacterial microfiber cloths and immediate steam purging prevent milk residue buildup.'
  },
  {
    id: 6,
    standard: 'Fresh Bean Rest Period',
    target: '7 to 21 days from roast',
    frequency: 'Weekly audit',
    category: 'quality',
    detail: 'Locally roasted in Astana; rested 7 days for peak CO2 degassing before opening valves at the espresso bar.'
  }
];

function renderStandardsTable(items, $tbody) {
  $tbody.empty();

  if (items.length === 0) {
    const $emptyRow = $('<tr>').append(
      $('<td>')
        .attr('colspan', 3)
        .addClass('text-center text-muted py-4')
        .html('🔍 <em>No matching operational benchmarks found.</em>')
    );
    $tbody.append($emptyRow);
    return;
  }

  $.each(items, function (index, item) {
    const badgeClass = item.category === 'speed' ? 'badge bg-warning text-dark' : 'badge bg-secondary';
    
    const $row = $('<tr>')
      .addClass('benchmark-row')
      .attr('data-id', item.id)
      .css('cursor', 'pointer');

    const $nameCell = $('<td>')
      .addClass('fw-semibold text-dark')
      .html(`<span>${item.standard}</span> <small class="text-muted d-block font-monospace" style="font-size: 0.72rem;">[view details]</small>`);

    const $targetCell = $('<td>').text(item.target);
    const $freqCell = $('<td>').append($('<span>').addClass(badgeClass).text(item.frequency));

    $row.append($nameCell, $targetCell, $freqCell);
    const $detailRow = $('<tr>')
      .addClass('benchmark-detail-row')
      .attr('data-parent-id', item.id)
      .hide();

    const $detailCell = $('<td>')
      .attr('colspan', 3)
      .addClass('bg-light p-3 rounded-bottom')
      .css('border-left', '4px solid #008B82');

    $detailCell.html(`
      <div class="d-flex align-items-center justify-content-between mb-1">
        <strong class="small text-uppercase" style="color: #008B82; letter-spacing: 0.5px;">Operational Standard Breakdown:</strong>
        <span class="badge bg-white text-dark border">Standard #${item.id}</span>
      </div>
      <p class="mb-0 small text-secondary">${item.detail}</p>
    `);

    $detailRow.append($detailCell);
    $tbody.append($row, $detailRow);
  });
}

$(function () {
  const $tableBody = $('#standards-table-body');
  const $controlBox = $('#standards-status-container');
  const $standardsTable = $('#standards-table');

  if (!$tableBody.length || !$controlBox.length || !$standardsTable.length) return;

  $standardsTable.closest('.table-responsive').before($controlBox);

  $controlBox.addClass('card p-4 mb-3 bg-light border-0 shadow-sm rounded-4').removeClass('hidden');

  $controlBox.html(`
    <div class="row g-3 align-items-center">
      <div class="col-12 col-md-5">
        <label for="benchmark-search-input" class="form-label small fw-bold text-secondary mb-1">Search Standards:</label>
        <input type="text" class="form-control form-control-sm rounded-pill px-3" placeholder="Search (e.g. Grinder, 24/7)..." id="benchmark-search-input">
      </div>
      <div class="col-12 col-md-7">
        <label class="form-label small fw-bold text-secondary mb-1 d-block">Quick Filter by Category:</label>
        <div class="btn-group btn-group-sm flex-wrap w-100" role="group" id="benchmark-filter-buttons">
          <button type="button" class="btn btn-dark active filter-btn" data-cat="all">All</button>
          <button type="button" class="btn btn-outline-dark filter-btn" data-cat="quality">Quality</button>
          <button type="button" class="btn btn-outline-dark filter-btn" data-cat="speed">Speed</button>
          <button type="button" class="btn btn-outline-dark filter-btn" data-cat="hospitality">Hospitality</button>
          <button type="button" class="btn btn-outline-dark filter-btn" data-cat="hygiene">Hygiene</button>
        </div>
      </div>
    </div>
    <div class="d-flex justify-content-between align-items-center mt-3 pt-2 border-top">
      <small class="text-muted" id="benchmark-counter">Showing all ${coffeeStandardsData.length} standards</small>
      <button type="button" class="btn btn-link btn-sm text-decoration-none p-0 text-secondary" id="benchmark-reset-all">Reset search</button>
    </div>
  `);

  const $searchInput = $('input[type="text"]#benchmark-search-input');
  const $filterButtons = $('#benchmark-filter-buttons .filter-btn');
  const $counter = $('#benchmark-counter');
  let currentCategory = 'all';

  function applyFilter() {
    const q = $searchInput.val().trim().toLowerCase();

    const filtered = $.grep(coffeeStandardsData, function (item) {
      const matchText = item.standard.toLowerCase().indexOf(q) !== -1 || 
                        item.target.toLowerCase().indexOf(q) !== -1 ||
                        item.detail.toLowerCase().indexOf(q) !== -1;
      const matchCat = (currentCategory === 'all') || (item.category === currentCategory);
      return matchText && matchCat;
    });

    $tableBody.fadeOut(120, function () {
      renderStandardsTable(filtered, $tableBody);
      $tableBody.fadeIn(150);
      $tableBody.find('.benchmark-row:first').addClass('table-active');
    });

    $counter.text(`Showing ${filtered.length} of ${coffeeStandardsData.length} standards`);
  }

  $searchInput.on('input', applyFilter);

  $filterButtons.on('click', function () {
    $filterButtons.removeClass('btn-dark active').addClass('btn-outline-dark');
    $(this).removeClass('btn-outline-dark').addClass('btn-dark active');
    currentCategory = $(this).attr('data-cat');
    applyFilter();
  });

  $('#benchmark-reset-all').on('click', function () {
    $searchInput.val('');
    $filterButtons.filter('[data-cat="all"]').trigger('click');
  });

  renderStandardsTable(coffeeStandardsData, $tableBody);
  $tableBody.find('.benchmark-row:first').addClass('table-active');

  $tableBody.on('click', '.benchmark-row', function () {
    const $clickedRow = $(this);
    const standardId = $clickedRow.attr('data-id');
    const $targetDetailRow = $tableBody.find(`.benchmark-detail-row[data-parent-id="${standardId}"]`);
    const isVisible = $targetDetailRow.is(':visible');

    $clickedRow.siblings('.benchmark-row').removeClass('table-active');
    $clickedRow.siblings('.benchmark-detail-row').fadeOut(150);

    if (isVisible) {
      $clickedRow.removeClass('table-active');
      $targetDetailRow.fadeOut(150);
    } else {
      $clickedRow.addClass('table-active');
      $targetDetailRow.fadeIn(200);
    }
  });
});