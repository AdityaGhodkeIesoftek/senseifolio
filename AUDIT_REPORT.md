# UI / QA Audit Report — Akebono Sensei

**Date:** 2026-06-30
**Scope:** All 7 pages (index, about, classes, schedule, resources, gallery, contact), all CSS, all JS.
**Design system:** dark editorial (#0A0A0A base) · torii red #C0392B accent · grain overlay · parallax photo sections · Dela Gothic One display / DM Sans body / Noto Sans JP / JetBrains Mono.

---

## ⚠️ Methodology note — read this first

The prompt assumes **Playwright MCP** for rendering, screenshotting (375 / 768 / 1280 / 1920), and hover/scroll simulation. **This environment has no Playwright MCP or any browser-automation/screenshot tool available**, so the requested phases (full-page captures, mid-scroll captures, simulated hover, before/after screenshots) could not be performed.

What was done instead: a **rigorous source-level audit** — reading every HTML/CSS/JS file and analytically tracing the exact bug classes the prompt lists (overflow, contrast, grid/masonry behaviour at each breakpoint, nav, parallax fallback, grain, forms, cross-page drift, a11y). "Before/after" below is shown as **code**, not images. Anything that genuinely needs a human eye (live blend modes, exact rendered contrast over a photo) is called out as **eyeball-on-live** in the "Did NOT fix" section.

To verify visually yourself: `cd japanese-sensei-website && python -m http.server 8000` then open the pages at the four widths.

---

## ✅ Fixed

All fixes use existing `variables.css` tokens; no new colors/fonts/patterns introduced. No content, copy, Japanese text, IA, or JS behaviour changed.

### 1. Leftover old-theme (indigo) colors removed — *consistency*
The prompt explicitly asked for "no leftover old neutral/light colors anywhere." Three survived the dark redesign as `rgba(33,36,46,…)` / `rgba(15,18,30,…)` (the old indigo neutral):

| File | Element | Before | After | Why |
|---|---|---|---|---|
| `css/pages/gallery.css` | `.lightbox` backdrop | `rgba(15, 18, 30, 0.92)` | `rgba(10, 10, 10, 0.92)` | Backdrop had a blue cast against the neutral-dark theme. |
| `css/components.css` | `.nav__menu` (mobile dropdown) | `box-shadow: 0 8px 24px rgba(33,36,46,0.10)` | `box-shadow: var(--shadow-lg)` | Old indigo tint + nearly invisible; now uses the real shadow token. |
| `css/pages/classes.css` | `.table-wrapper` scroll hint | `inset … rgba(33,36,46,0.10)` | `inset … rgba(0,0,0,0.5)` | Same leftover tint on the horizontal-scroll affordance. |
| `css/variables.css` | header comment | "Accent direction: Indigo #2C3E7A" | "Torii red #C0392B …" | Stale comment from the pre-redesign system. |

### 2. Faux-bold on the single-weight display font — *typography consistency*
**Dela Gothic One ships only a 400 weight.** Several rules set it to `700`/`600`, which forces the browser to *synthesize* bold (muddy, blurry strokes). This extends the design decision already documented in `typography.css` ("Dela Gothic One ships a single 400 weight") to the spots that were missed:

| File | Selector | Before | After |
|---|---|---|---|
| `css/components.css` | `.nav__logo-en` | `font-weight: 700` | `400` |
| `css/pages/home.css` | `.hero__stat strong` | (inherited `700`) | `font-weight: 400` |
| `css/pages/classes.css` | `.schedule-table thead th` | `font-weight: 600` | `400` |
| `css/pages/gallery.css` | `.event__day` | `font-weight: 700` | `400` |

> Judgment call (flagged): I can't see the rendered glyphs here, but Dela Gothic at 400 is already very heavy, so these should read as intended bold-display without the synthetic smudge. If any of these now feel too light for you on the live site, that's the one to revisit.

---

## 🚩 Found but deliberately NOT fixed (needs your call)

### A. Torii red on dark fails WCAG AA for *small* text — **most important finding**
`#C0392B` on the near-black base computes to roughly **3.9:1** on `#0A0A0A` and **~3.5:1** on the `#111` card surface. WCAG AA needs **4.5:1** for normal-size text (3:1 is fine for large ≥24px / bold ≥18.7px, and for UI fills).

- **Fine** (large display): `h1`, `.page-hero__title`, `.hero__title`, `.bilingual-heading .heading-en`, `.cta-band__title` — all large, pass at 3:1.
- **Fine** (fills, not text-on-dark): red buttons, `.badge--free`, `.calendar__day--event`, `.contact-info`, `.tier__jlpt` chips — these are white-on-red (~5.4:1) or red-fill, all pass.
- **Borderline/failing** (small red text on dark): `.eyebrow`, `.card__title-ja`, `.tier__level-ja`, `.class-preview__jlpt`, `.timeline__year`, `.text-accent`, `.profile__name-ja`, `.calendar__day--today` text.

**Why I didn't auto-fix:** the clean remedy is a *slightly lighter red used only for small text on dark* (keeping #C0392B for fills/buttons, since brightening the global accent would *lower* the white-on-red button contrast). That means introducing a new token — which the constraints explicitly forbid me to do unilaterally, and it's a brand/aesthetics decision. **Recommendation:** add e.g. `--color-accent-text: #E0584A` (~5:1 on dark) and point the small-label selectors above at it. Say the word and I'll wire it in.

### B. Placeholder images still in use (`picsum.photos`)
`index.html` hero + about-teaser, `about.html` profile, and the 3 testimonial avatars still point at `https://picsum.photos/seed/…`. They load *random* stock photos online and show as **broken-image icons offline**. This is the "I'll provide photos" content you haven't dropped in yet — left as-is because swapping them is a content change, not a styling fix. The gallery and all parallax sections correctly use your real `images/` files.

### C. Footer "Learn" column drift
`gallery.html`'s footer lists **4** links (Classes / Schedule / Resources / **Gallery**); the other 6 pages list only **3** (no Gallery). A shared component has drifted. Left unchanged because reconciling it means adding/removing a nav link — i.e. touching IA/content, which the constraints rule out. Easy to make consistent either direction once you decide (I'd add Gallery to all footers, since it's already in the main nav).

### D. `bg-divider` white text over the torii photo — *eyeball-on-live*
Home's proverb divider (`bg--torii` + `bg-overlay--fade`, middle scrim `rgba(10,10,10,0.55)`) uses white text with a `text-shadow`. Mathematically borderline over the brightest parts of the photo, but the shadow + large type should carry it. **This is the single spot most worth a human glance** at 1280/1920. If it reads weak, bump it to `bg-overlay--medium` (0.65) — that utility already exists.

### E. Lightbox has no focus trap — *minor a11y*
`gallery.js` focuses the close button on open and handles Esc/←/→ correctly, but Tab can still walk into the page behind the modal. Not fixed because it's a behaviour change to working JS; flagging per the a11y brief. Low effort to add if you want it.

### F. Calendar `role="img"` hides per-day events from screen readers — *minor a11y*
`#calendar-grid` is `role="img"`, so SR users don't get the per-day `title`/`aria-label` event text. Mitigated: the adjacent "Next up" list is fully accessible and carries the same info. Left as a conscious tradeoff.

### G. Prompt's font expectation is stale (not a bug)
The audit brief says headings should be **Shippori Mincho**. The site correctly uses **Dela Gothic One** per your later explicit instruction (Shippori remains only as a fallback in the stack). No action — just noting the brief predates that decision so you don't think it's a regression.

---

## 📋 Per-page summary

| Page | Layout/overflow | Nav | Images/bg | Forms | Notes |
|---|---|---|---|---|---|
| index | OK — hero 1→2 col, masonry teaser, no overflow | OK | picsum hero/teaser (B); real gallery + parallax OK | — | bg-divider (D), CTA koi parallax OK |
| about | OK — split→1 col, timeline OK | OK | picsum profile (B); machiya parallax over opaque panel = readable | — | — |
| classes | OK — tier cards 1/2/up; featured ribbon clears top | OK | neon parallax CTA, heavy overlay = readable | — | — |
| schedule | OK — table scrolls x on mobile (intended) | OK | — | — | calendar (F); today-column JS OK |
| resources | OK — 5-col kana grid holds at 375px | OK | — | — | ruby/furigana OK |
| gallery | OK — masonry 1/2/3/4 cols; 15 items, counter matches | OK | all real images; lightbox OK | — | footer drift (C) |
| contact | OK — form/aside 1→2 col at 900px | OK | — | labels tied, 44px targets, focus ring, validation + success state all OK | red `.contact-info` panel = white-on-red, passes |

**Cross-page (all OK):** identical nav markup, `<head>` font links, `.grain-overlay` div present on all 7, shared footer (except C), `scroll-padding-top` accounts for the sticky nav, parallax `bg-section` has the `(hover:none)/(pointer:coarse)` scroll fallback, `prefers-reduced-motion` gates animation + hides grain.

---

## Stale docs (unrelated to this audit, re-flagging)
`PLAN.md` and `README.md` still describe the **original** indigo `#2C3E7A` + Inter / Zen Kaku Gothic system and placeholder images. They predate the dark/red redesign and the Dela Gothic switch. Not touched here (out of audit scope) — offer still stands to bring them current on request.
