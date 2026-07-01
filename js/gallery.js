/* ============================================================
   gallery.js — Accessible lightbox for the photo gallery
   Click/Enter to open · ← → to navigate · Esc to close.
   Works with any number of .gallery__item elements that wrap
   an <img>. Captions read from data-caption-en / data-caption-ja.
   ============================================================ */
(() => {
  'use strict';

  const items = Array.from(document.querySelectorAll('.gallery__item'));
  const lightbox = document.querySelector('#lightbox');
  if (!items.length || !lightbox) return;

  const lbImg = lightbox.querySelector('.lightbox__img');
  const lbEn = lightbox.querySelector('[data-lb-en]');
  const lbJa = lightbox.querySelector('[data-lb-ja]');
  const lbCounter = lightbox.querySelector('[data-lb-counter]');
  const btnPrev = lightbox.querySelector('.lightbox__btn--prev');
  const btnNext = lightbox.querySelector('.lightbox__btn--next');
  const btnClose = lightbox.querySelector('.lightbox__close');

  let current = 0;
  let lastFocused = null;

  const render = (i) => {
    const item = items[i];
    const img = item.querySelector('img');
    lbImg.src = img.currentSrc || img.src;
    lbImg.alt = img.alt || '';
    if (lbEn) lbEn.textContent = item.dataset.captionEn || '';
    if (lbJa) lbJa.textContent = item.dataset.captionJa || '';
    if (lbCounter) lbCounter.textContent = `${i + 1} / ${items.length}`;
  };

  const open = (i) => {
    current = i;
    lastFocused = document.activeElement;
    render(current);
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    btnClose.focus();
    document.addEventListener('keydown', onKey);
  };

  const close = () => {
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    document.removeEventListener('keydown', onKey);
    lbImg.src = '';
    if (lastFocused) lastFocused.focus();
  };

  const step = (dir) => {
    current = (current + dir + items.length) % items.length;
    render(current);
  };

  const onKey = (e) => {
    switch (e.key) {
      case 'Escape': close(); break;
      case 'ArrowRight': step(1); break;
      case 'ArrowLeft': step(-1); break;
    }
  };

  items.forEach((item, i) => {
    item.addEventListener('click', () => open(i));
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(i); }
    });
  });

  btnPrev?.addEventListener('click', () => step(-1));
  btnNext?.addEventListener('click', () => step(1));
  btnClose?.addEventListener('click', close);
  // Click on the dark backdrop (not the image/controls) closes
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox || e.target.classList.contains('lightbox__stage')) close();
  });
})();
