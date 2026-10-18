'use strict';

document.addEventListener('DOMContentLoaded', () => {
    // Общая логика для всех страниц (например, плавный скролл или статус)
    const backToTopBtn = document.getElementById('back-to-top-btn');
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
});