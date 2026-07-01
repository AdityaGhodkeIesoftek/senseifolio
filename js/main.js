/* ============================================================
   main.js — Shared site behaviour
   Nav toggle · scroll shadow · reveal · smooth anchors · year
   ============================================================ */
(() => {
  'use strict';

  /* ---------- Random grain texture (one of three per page load) ---------- */
  const grainImages = [
    'images/gallery/grain-1.avif',
    'images/gallery/grain-2.avif',
    'images/gallery/grain-3.avif',
  ];
  const grainOverlay = document.querySelector('.grain-overlay');
  if (grainOverlay) {
    const randomGrain = grainImages[Math.floor(Math.random() * grainImages.length)];
    grainOverlay.style.backgroundImage = `url('${randomGrain}')`;
  }

  /* ---------- Mobile hamburger menu ---------- */
  const hamburger = document.querySelector('.nav__hamburger');
  const navMenu = document.querySelector('.nav__menu');

  const closeMenu = () => {
    navMenu?.classList.remove('is-open');
    hamburger?.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  hamburger?.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('is-open');
    hamburger.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  navMenu?.querySelectorAll('.nav__link').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  // Close on Escape, and when resizing to desktop
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });
  window.matchMedia('(min-width: 768px)').addEventListener('change', closeMenu);

  /* ---------- Sticky nav shadow on scroll ---------- */
  const nav = document.querySelector('.nav');
  if (nav) {
    const sentinel = document.createElement('div');
    sentinel.setAttribute('aria-hidden', 'true');
    sentinel.style.cssText = 'position:absolute;top:0;height:1px;width:1px;';
    document.body.prepend(sentinel);
    const scrollObserver = new IntersectionObserver(
      ([entry]) => nav.classList.toggle('is-scrolled', !entry.isIntersecting),
      { threshold: 0 }
    );
    scrollObserver.observe(sentinel);
  }

  /* ---------- Scroll-reveal with IntersectionObserver ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length) {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      revealEls.forEach((el) => el.classList.add('is-visible'));
    } else {
      const revealObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-visible');
              revealObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
      );
      revealEls.forEach((el) => revealObserver.observe(el));
    }
  }

  /* ---------- Smooth scroll for in-page anchors ---------- */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const id = anchor.getAttribute('href');
      if (id.length < 2) return;
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        target.setAttribute('tabindex', '-1');
        target.focus({ preventScroll: true });
      }
    });
  });

  /* ---------- Mark current nav link ---------- */
  const path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav__link').forEach((link) => {
    const href = link.getAttribute('href');
    if (href === path) link.setAttribute('aria-current', 'page');
  });

  /* ---------- Auto-fill footer year ---------- */
  const yearEl = document.querySelector('[data-year]');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Testimonial auto-carousel (mobile only) ---------- */
  const testimonials = document.querySelectorAll('.testimonial-card');
  if (testimonials.length > 1) {
    let currentIndex = 0;
    let timer = null;

    const cycle = () => {
      testimonials.forEach((card, i) => {
        card.style.opacity = i === currentIndex ? '1' : '0.35';
        card.style.transform = i === currentIndex ? 'scale(1)' : 'scale(0.96)';
      });
      currentIndex = (currentIndex + 1) % testimonials.length;
    };

    const mobileQuery = window.matchMedia('(max-width: 767px)');
    const handle = (mq) => {
      clearInterval(timer);
      if (mq.matches) {
        currentIndex = 0;
        cycle();
        timer = setInterval(cycle, 3500);
      } else {
        testimonials.forEach((card) => {
          card.style.opacity = '';
          card.style.transform = '';
        });
      }
    };
    mobileQuery.addEventListener('change', handle);
    handle(mobileQuery);
  }
})();
