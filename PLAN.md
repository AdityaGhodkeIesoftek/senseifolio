# PLAN.md — Akebono Sensei (Free Japanese Classes)

Inspired by https://www.akebonoacademy.com/ — built fresh, not copied. See `CRAWL_REPORT.md`.

---

## 2.1 Site Map
| Page | File | Purpose |
|------|------|---------|
| Home | `index.html` | Hero, why learn, teacher teaser, class types, testimonials, CTA |
| About | `about.html` | Teacher profile, philosophy, JLPT/cert, timeline, personal message |
| Classes | `classes.html` | 4 class tiers (N5–N1 + conversation), free trial, how it works |
| Schedule | `schedule.html` | Weekly timetable, how to join, FAQ |
| Resources | `resources.html` | Hiragana + katakana charts, vocab, tools, culture tips |
| Gallery | `gallery.html` | Masonry photo grid + accessible lightbox (added feature) |
| Contact | `contact.html` | Free sign-up form, contact info, social, map placeholder |

> **Added beyond the original spec (by request):**
> - **Gallery** — `gallery.html` (CSS-columns masonry + keyboard-navigable lightbox in `js/gallery.js`), plus a "Life at Akebono" teaser on the home page. Images are labeled placeholder SVGs in `images/gallery/` (swap guide: `images/gallery/README.md`).
> - **Events calendar** — an "Upcoming events & intakes" section on `schedule.html`, rendering a month grid + upcoming-events list from a small data array in `js/events.js`.
> - The reference site (akebonoacademy.com) has **no** real gallery; this is an original feature inspired by its imagery, not a copy.

## 2.2 Design System

**Theme / spirit:** *Akebono = dawn / new beginning.* An indigo (藍 ai) accent over warm washi-paper off-white, with a soft dawn-sky gradient in heroes.

**Color palette (indigo direction):** defined in `css/variables.css`
- Background `#FAF8F4` (warm washi) · Section band `#F1ECE3` · Surface `#FFFFFF`
- Accent `#2C3E7A` (indigo) · Accent dark `#1F2C5A` · Accent soft `#E7EAF3`
- Highlights: gold `#B8902E` (sparing), sakura `#D98AA0` (decorative)
- Text `#21242E` / secondary `#5A6070` / muted `#8A8F9C` · Border `#E5DFD3`

**Typography:**
- Display: `Zen Kaku Gothic New` (pairs cleanly with Japanese aesthetics)
- Body: `Inter`
- Japanese: `Noto Sans JP` (weights 300/400/500/700) — always included
- Fluid type scale via `clamp()` (`--text-xs` … `--text-hero`)
- Japanese rules: line-height 1.8, letter-spacing 0.05em, `font-feature-settings:"palt"`

**Layout:** max-width 1200px · CSS Grid + Flexbox · 4px spacing base · radius + shadow tokens · container padding via `clamp(1rem,5vw,5rem)`.

**Signature elements:**
- Vertical Japanese text strips (`writing-mode: vertical-rl`) on hero & panels
- Floating decorative kanji (語 / 無料 / 体験) — `aria-hidden`, gentle float
- Brush-stroke gradient dividers
- Dawn-sky radial gradient wash behind heroes
- Bilingual heading pattern (English + 日本語) used site-wide

## 2.3 Component Inventory (`css/components.css`)
Nav (hamburger → X, bilingual links, CTA), Buttons (primary/secondary/ghost/on-accent + ripple), Cards, Class-tier cards, Testimonial cards, Schedule table (mobile-scroll), FAQ `<details>` accordion, Kana grid cells, Vocab rows, Forms (inputs/select/textarea/checkbox + validation states + success panel), Footer, Reveal-on-scroll utilities, Badges/tags, decorative kanji & brush divider.

## 2.4 Pages Breakdown
- **Home:** hero (stats + image + vertical strip) → 4 “why” cards → about teaser (split) → 4 class previews → 3 testimonials → accent CTA band.
- **About:** page-hero → profile split → philosophy → JLPT cards → vertical timeline → personal message panel (JP + EN).
- **Classes:** page-hero → 4 tier cards (Intermediate featured w/ FREE TRIAL ribbon) → accent free-trial CTA → 3-step “how it works.”
- **Schedule:** page-hero → responsive timetable (auto-highlights today via `schedule.js`) → 3-step join → 5-item FAQ accordion.
- **Resources:** hiragana grid (46) → katakana grid (46) → 10-word vocab list w/ furigana → tools & culture cards.
- **Contact:** sign-up form (name/email/level/goals/schedule) w/ client validation (`contact.js`) + success panel → contact info aside + map placeholder.

## 2.5 Japanese Language Implementation
- Bilingual headings everywhere (`.bilingual-heading`: `.heading-en` + `.heading-ja`).
- All Japanese wrapped in `lang="ja"`; `Noto Sans JP`, line-height 1.8, letter-spacing 0.05em.
- Furigana via `<ruby><rt>` on vocabulary (先生, 学生, 水, 本, 友達, 日本…).
- Vertical decorative text + floating kanji.
- Verified safe phrases only (ようこそ, 無料, 先生, お問い合わせ, 初心者/中級/上級, クラスのご案内, etc.).

## 2.6 Technical Stack
- Pure HTML5 + CSS3 + Vanilla JS (no frameworks, no jQuery).
- Google Fonts with `preconnect` (Inter, Noto Sans JP, Zen Kaku Gothic New).
- CSS custom properties drive the entire design system.
- Mobile-first; breakpoints 375 (base) / 480 / 768 / 1024 / 1200.
- `prefers-reduced-motion` gate; IntersectionObserver reveals; deferred JS.

---

## CSS Load Order (every page)
`reset.css → variables.css → typography.css → layout.css → components.css → pages/<page>.css`

> Note: `variables.css` loads *after* `reset.css` but before everything that consumes the tokens; the reset references only a few vars (focus ring, nav height) which resolve fine at paint. All token *consumers* (typography, layout, components, pages) load after it.
