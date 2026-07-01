/* ============================================================
   contact.js — Enquiry form → Google Form (hidden-iframe POST)
   Intercepts the styled site form, posts a hidden mirror <form>
   into an invisible iframe (no backend, no CORS), then shows a
   toaster. Responses land in the linked Google Sheet.
   ============================================================ */
(() => {
  'use strict';

  // ── Google Form endpoint + field entry IDs (from the prefill URL) ──
  const GOOGLE_FORM_ACTION =
    'https://docs.google.com/forms/d/e/1FAIpQLSdG6t0zi9V90bxEQkJjCT6aZ6zv9Igy5eqsqpkAkalwSME4Tw/formResponse';

  const ENTRY_IDS = {
    name:     'entry.511813944',
    email:    'entry.931756210',
    whatsapp: 'entry.812784825',
    course:   'entry.1895042',
    batch:    'entry.1778205666',
    level:    'entry.591904812',
    goal:     'entry.658846529',
  };
  // ───────────────────────────────────────────────────────────────────

  const form      = document.getElementById('enquiry-form');
  const submitBtn = document.getElementById('form-submit-btn');
  if (!form || !submitBtn) {
    console.warn('[contact] enquiry-form / submit button not found — listener NOT attached. Form would fall back to a native submit.');
    return;
  }
  console.info('[contact] contact.js v3 loaded — enquiry form wired ✓ (goal field now included)');

  const submitLabel = submitBtn.innerHTML; // preserve label (incl. the JP span)
  let toastTimer;

  /* ---------- Toaster ---------- */
  function showToaster(type) {
    const toaster = document.getElementById('form-toaster');
    const icon    = document.getElementById('toaster-icon');
    const title   = document.getElementById('toaster-title');
    const sub     = document.getElementById('toaster-sub');
    if (!toaster) return;

    if (type === 'error') {
      toaster.classList.add('toaster--error');
      icon.textContent  = '✕';
      title.textContent = 'Something went wrong';
      sub.textContent   = 'Please email: some.sumita92@gmail.com';
    } else {
      toaster.classList.remove('toaster--error');
      icon.textContent  = '✓';
      title.textContent = 'ありがとうございます！';
      sub.textContent   = 'Sumita will reach out to you shortly.';
    }

    toaster.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toaster.classList.remove('is-visible'), 5000);
  }

  /* ---------- Submit → Google Form ---------- */
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.info('[contact] submit intercepted → posting to Google Form (no page navigation)');

    // Native validation (required fields, email format, one batch radio)
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const batchInput = form.querySelector('[name="batch"]:checked');
    const data = {
      name:     form.querySelector('[name="name"]').value.trim(),
      email:    form.querySelector('[name="email"]').value.trim(),
      whatsapp: form.querySelector('[name="whatsapp"]').value.trim(),
      course:   form.querySelector('[name="course"]').value,
      batch:    batchInput ? batchInput.value : '',
      level:    form.querySelector('[name="level"]').value,
      goal:     form.querySelector('[name="goal"]').value.trim(),
    };

    // Loading state
    submitBtn.disabled = true;
    submitBtn.textContent = '送信中… Sending…';

    // Hidden mirror form → posts into the invisible iframe (avoids CORS)
    const gForm = document.createElement('form');
    gForm.method = 'POST';
    gForm.action = GOOGLE_FORM_ACTION;
    gForm.target = 'hidden-iframe';
    gForm.style.display = 'none';

    Object.entries(ENTRY_IDS).forEach(([key, entryId]) => {
      if (!entryId || entryId.indexOf('TODO') !== -1) return; // skip un-wired fields
      const input = document.createElement('input');
      input.type  = 'hidden';
      input.name  = entryId;
      input.value = data[key] || '';
      gForm.appendChild(input);
    });

    document.body.appendChild(gForm);

    const iframe = document.getElementById('hidden-iframe');
    let settled = false;
    let timeoutId = 0;

    const finish = (isError) => {
      if (settled) return;
      settled = true;
      if (iframe) iframe.onload = null;
      clearTimeout(timeoutId);
      gForm.remove();
      submitBtn.disabled = false;
      submitBtn.innerHTML = submitLabel;
      if (isError) {
        showToaster('error');
      } else {
        form.reset();
        showToaster();
      }
    };

    // iframe load = Google Forms received the POST
    if (iframe) iframe.onload = () => finish(false);
    // Fallback: if the iframe never loads within 8s, show the error toaster
    timeoutId = setTimeout(() => finish(true), 8000);

    gForm.submit();
  });
})();
