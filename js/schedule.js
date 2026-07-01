/* ============================================================
   schedule.js — Schedule page enhancements
   Highlights "today" column and free-trial slots.
   Pure progressive enhancement — table works without JS.
   ============================================================ */
(() => {
  'use strict';

  const table = document.querySelector('.schedule-table');
  if (!table) return;

  // Day-of-week → header index map (Mon-first table layout)
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const todayName = days[new Date().getDay()];

  const headers = Array.from(table.querySelectorAll('thead th'));
  const todayCol = headers.findIndex((th) => th.dataset.day === todayName);

  if (todayCol > 0) {
    table.querySelectorAll('tbody tr').forEach((row) => {
      const cell = row.children[todayCol];
      if (cell) {
        cell.style.background = 'rgba(var(--color-accent-rgb), 0.10)';
        cell.style.fontWeight = '600';
      }
    });
    headers[todayCol].insertAdjacentHTML(
      'beforeend',
      ' <span aria-label="today" title="Today">·今日</span>'
    );
  }
})();
