/* ============================================================
   events.js — Renders a month calendar + marks event days.
   Edit the EVENTS array below to manage upcoming events.
   The calendar shows the month of the next upcoming event
   (or the current month if none are upcoming).
   ============================================================ */
(() => {
  'use strict';

  const grid = document.querySelector('#calendar-grid');
  const monthLabel = document.querySelector('#calendar-month');
  if (!grid) return;

  // ---- Edit your events here (YYYY-MM-DD) ----
  const EVENTS = [
    { date: '2026-07-06', title: 'N5 Beginner batch starts', ja: 'N5入門クラス開講', tag: 'Enrollment open' },
    { date: '2026-07-12', title: 'Free conversation café', ja: '無料会話カフェ', tag: 'Free' },
    { date: '2026-07-20', title: 'Tanabata culture workshop', ja: '七夕ワークショップ', tag: 'Culture' },
    { date: '2026-07-27', title: 'JLPT mock test (N4–N3)', ja: 'JLPT模擬試験', tag: 'Practice' },
  ];

  const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const MONTHS_JA = ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'];
  const DOW = ['Su','Mo','Tu','We','Th','Fr','Sa'];

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Pick the month to display: first upcoming event's month, else this month.
  const upcoming = EVENTS
    .map((e) => ({ ...e, d: new Date(e.date + 'T00:00:00') }))
    .filter((e) => e.d >= today)
    .sort((a, b) => a.d - b.d);

  const focusDate = upcoming.length ? upcoming[0].d : today;
  const year = focusDate.getFullYear();
  const month = focusDate.getMonth();

  if (monthLabel) {
    monthLabel.innerHTML =
      `${MONTHS[month]} ${year} <span class="calendar__month-ja" lang="ja">${MONTHS_JA[month]}</span>`;
  }

  // Map of day-of-month -> event (for this displayed month)
  const eventDays = new Map();
  EVENTS.forEach((e) => {
    const d = new Date(e.date + 'T00:00:00');
    if (d.getFullYear() === year && d.getMonth() === month) eventDays.set(d.getDate(), e);
  });

  // Header row
  let html = DOW.map((d) => `<div class="calendar__dow">${d}</div>`).join('');

  // Leading pad
  const firstDow = new Date(year, month, 1).getDay();
  for (let i = 0; i < firstDow; i++) html += `<div class="calendar__day calendar__day--pad" aria-hidden="true">·</div>`;

  // Days
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const isThisMonth = today.getFullYear() === year && today.getMonth() === month;
  for (let day = 1; day <= daysInMonth; day++) {
    const ev = eventDays.get(day);
    const classes = ['calendar__day'];
    let attrs = '';
    if (isThisMonth && today.getDate() === day) classes.push('calendar__day--today');
    if (ev) {
      classes.push('calendar__day--event');
      attrs = ` title="${ev.title} — ${ev.ja}" aria-label="${day}: ${ev.title}"`;
    }
    html += `<div class="${classes.join(' ')}"${attrs}>${day}</div>`;
  }

  grid.innerHTML = html;

  // ---- Upcoming events list ----
  const list = document.querySelector('#events-list');
  if (list) {
    const tagClass = (t) => (/free/i.test(t) ? 'event__tag' : 'event__tag event__tag--gold');
    list.innerHTML = (upcoming.length ? upcoming : [])
      .slice(0, 4)
      .map((e) => `
        <li class="event reveal">
          <div class="event__date">
            <span class="event__day">${e.d.getDate()}</span>
            <span class="event__mon">${MONTHS[e.d.getMonth()].slice(0, 3)}</span>
          </div>
          <div>
            <span class="event__title">${e.title}<span class="event__title-ja" lang="ja">${e.ja}</span></span>
            <p class="event__body">${e.d.toLocaleDateString('en-US', { weekday: 'long' })}</p>
            <span class="${tagClass(e.tag)}">${e.tag}</span>
          </div>
        </li>`)
      .join('') || '<li class="event"><div class="event__body">No upcoming events scheduled — check back soon!</div></li>';

    // Reveal the freshly-injected items
    list.querySelectorAll('.reveal').forEach((el) => el.classList.add('is-visible'));
  }
})();
