# 🌅 Akebono Sensei — Free Japanese Classes Website

A warm, culturally-respectful, fully responsive website for **free** Japanese language classes.
Pure HTML5 + CSS3 + vanilla JavaScript — no frameworks, no build step.

Inspired by (not copied from) https://www.akebonoacademy.com/. See `CRAWL_REPORT.md` and `PLAN.md`.

---

## ▶ How to run

It's a static site — no build, no dependencies. Pick one:

**Just open it**
- Double-click `index.html`. (Google Fonts and placeholder images need internet.)

**Local server (recommended — avoids any file:// quirks)**
```bash
# Python 3
python -m http.server 8000
# then visit http://localhost:8000

# or Node
npx serve .

# or VS Code: right-click index.html → "Open with Live Server"
```

---

## 📁 Structure
```
japanese-sensei-website/
├── index.html · about.html · classes.html
├── schedule.html · resources.html · gallery.html · contact.html
├── css/
│   ├── reset.css
│   ├── variables.css      ← ALL design tokens (colors, type, spacing, motion)
│   ├── typography.css      ← fonts + Japanese text rules
│   ├── layout.css          ← containers, grids, sections
│   ├── components.css      ← nav, buttons, cards, footer, forms, reveals
│   └── pages/ home·about·classes·contact·gallery.css
├── js/
│   ├── main.js             ← nav, scroll shadow, reveals, smooth scroll, carousel
│   ├── schedule.js         ← highlights today's column
│   ├── gallery.js          ← lightbox (click/Enter open, ← → nav, Esc close)
│   ├── events.js           ← events calendar + upcoming list (edit EVENTS array)
│   └── contact.js          ← form validation + success panel
├── images/
│   └── gallery/            ← labeled placeholder SVGs + swap guide (README.md)
├── CRAWL_REPORT.md · PLAN.md · README.md
```

CSS load order on every page:
`reset → variables → typography → layout → components → pages/<page>`

---

## ✏️ How to customize content

| To change… | Edit… |
|------------|-------|
| **Colors / fonts / spacing / motion** | `css/variables.css` only — never hardcode values elsewhere |
| **Teacher name / bio / story** | `about.html` (and the teaser in `index.html`) |
| **Class levels & details** | `classes.html` (the `.tier` cards) |
| **Timetable** | `schedule.html` `<table class="schedule-table">` |
| **Vocabulary / kana / tips** | `resources.html` |
| **Contact email / socials** | `contact.html` + footer links in every page |
| **Gallery photos** | drop files in `images/gallery/` — see `images/gallery/README.md` |
| **Events / intakes** | edit the `EVENTS` array at the top of `js/events.js` |
| **Brand name (“Akebono”)** | search-replace in the nav/footer of each page |

### Swap placeholder images for real ones
Images currently use `https://picsum.photos/seed/.../w/h`. Replace each `src`
(and `srcset` if added) with files in `images/` — e.g. `images/hero/teacher.jpg`.
Keep the `width`/`height` attributes and `loading="lazy"` (except the hero, which uses `fetchpriority="high"`).

### Make the contact form actually send
`js/contact.js` validates and shows a success panel but does **not** submit anywhere.
Wire it to a form service:
- **Formspree:** set `<form action="https://formspree.io/f/XXXX" method="POST">` and let it submit normally, or `fetch()` to it inside the success branch of `contact.js`.
- **Netlify Forms:** add `netlify` + `name="signup"` attributes to the `<form>`.
- **Google Form:** point users there, or POST to the form's `formResponse` endpoint.

---

## 🌐 How to deploy

Any static host works (no build):
- **Netlify / Vercel / Cloudflare Pages:** drag-and-drop the folder, or connect a Git repo. Output dir = project root.
- **GitHub Pages:** push to a repo → Settings → Pages → deploy from branch root. Visit `https://<user>.github.io/<repo>/`.
- **Any web server:** upload the folder; ensure `index.html` is the directory index.

> Tip: For best performance in production, self-host the fonts (`assets/fonts/`) and your own optimized images, and add real `srcset` sets.

---

## ♿ Accessibility & ⚡ performance notes (already built in)
- Semantic HTML, skip-to-content link, `aria-label`s, visible focus states, WCAG-AA-minded contrast.
- `prefers-reduced-motion` gate disables all animation for users who ask for it.
- Mobile-first, fluid `clamp()` type, 44×44px touch targets, horizontally-scrollable schedule table.
- Lazy-loaded images, deferred JS, font `preconnect`.
- `lang="ja"` on Japanese text; furigana via `<ruby>`.

---

## ⚠️ Before going live
- [ ] Replace placeholder teacher info, email (`hello@akebono-sensei.example`), and social links.
- [ ] Swap picsum placeholder images for real, optimized images.
- [ ] Connect the contact form to a real backend/service.
- [ ] Replace the map placeholder on `contact.html` with a real embed (or remove it).
- [ ] Have a native speaker proof the Japanese before publishing.

*Made with care — 日本語を、みんなに。*
