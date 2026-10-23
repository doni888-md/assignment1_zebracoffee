'use strict';

/**
 * Zebra Coffee - Homepage Daily Special Feature (Offline / In-Store Perk)
 * Features: Math.random selection, DOM creation, counter/reference generation
 */

const dailySpecials = [
  { name: 'Raf Citrus', desc: 'Creamy espresso with natural orange zest', discount: '15%' },
  { name: 'Matcha Tonic', desc: 'Cold brew green tea with sparkling tonic', discount: '10%' },
  { name: 'Spanish Latte', desc: 'Silky milk with sweet condensed layers', discount: '20%' },
  { name: 'Filter Geisha', desc: 'Fresh local roast from Astana roastery', discount: '15%' }
];

document.addEventListener('DOMContentLoaded', () => {
  const promoContainer = document.getElementById('live-announcement-container');
  if (!promoContainer) return;

  const randomIndex = Math.floor(Math.random() * dailySpecials.length);
  const todaysDrink = dailySpecials[randomIndex];

  promoContainer.classList.remove('hidden');
  promoContainer.className = 'alert alert-warning border-dark d-flex flex-column flex-md-row justify-content-between align-items-md-center shadow-sm rounded-3 p-3 mb-4';

  const textBlock = document.createElement('div');
  textBlock.className = 'mb-2 mb-md-0';

  const title = document.createElement('h6');
  title.className = 'fw-bold mb-1';
  title.textContent = `⭐ In-Store Special: ${todaysDrink.name} (${todaysDrink.discount} OFF)`;

  const desc = document.createElement('p');
  desc.className = 'mb-0 small text-secondary';
  desc.textContent = `${todaysDrink.desc}. Show this offline voucher to your barista at Mangilik El branch!`;

  textBlock.appendChild(title);
  textBlock.appendChild(desc);

  const buttonWrapper = document.createElement('div');
  const promoBtn = document.createElement('button');
  promoBtn.type = 'button';
  promoBtn.className = 'btn btn-dark btn-sm rounded-pill px-3 text-nowrap';
  promoBtn.textContent = 'Generate Cash Desk Coupon';

  buttonWrapper.appendChild(promoBtn);
  promoContainer.appendChild(textBlock);
  promoContainer.appendChild(buttonWrapper);

  promoBtn.addEventListener('click', () => {
    const randomCoupon = `ZEB-${Math.floor(1000 + Math.random() * 9000)}`;
    promoBtn.className = 'badge bg-success fs-6 p-2 text-wrap';
    promoBtn.textContent = `Coupon #${randomCoupon} (Active at Till)`;
  }, { once: true });
});