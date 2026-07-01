/* ============================================================
   contact.js — Sign-up form validation (client-side)
   Accessible, no dependencies. Shows inline errors and a
   success panel. Does NOT actually submit anywhere — wire up
   a backend / form service (Formspree, Netlify, etc.) later.
   ============================================================ */
(() => {
  'use strict';

  const form = document.querySelector('#signup-form');
  if (!form) return;

  const successPanel = document.querySelector('#form-success');

  const validators = {
    name: (v) => (v.trim().length >= 2 ? '' : 'Please enter your name.'),
    email: (v) =>
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? '' : 'Please enter a valid email address.',
    level: (v) => (v ? '' : 'Please choose your current level.'),
    goals: (v) => (v.trim().length >= 5 ? '' : 'Tell us a little about your goals (5+ characters).'),
  };

  const showError = (field, message) => {
    const input = form.elements[field];
    const errorEl = form.querySelector(`[data-error-for="${field}"]`);
    if (!input) return;
    input.setAttribute('aria-invalid', message ? 'true' : 'false');
    if (errorEl) errorEl.textContent = message;
  };

  // Live-clear errors as the user fixes them
  Object.keys(validators).forEach((field) => {
    const input = form.elements[field];
    input?.addEventListener('input', () => {
      if (input.getAttribute('aria-invalid') === 'true') {
        showError(field, validators[field](input.value));
      }
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let firstInvalid = null;

    Object.keys(validators).forEach((field) => {
      const input = form.elements[field];
      const message = validators[field](input.value);
      showError(field, message);
      if (message && !firstInvalid) firstInvalid = input;
    });

    if (firstInvalid) {
      firstInvalid.focus();
      return;
    }

    // Success — in production, POST to a form service here.
    form.hidden = true;
    if (successPanel) {
      successPanel.classList.add('is-visible');
      successPanel.setAttribute('tabindex', '-1');
      successPanel.focus();
    }
  });
})();
