# 📸 images/gallery/

Real photos used as **parallax section backgrounds** (and available as gallery
thumbnails). Renamed to clean slugs `gallery-01.jpg … gallery-09.jpg`.

## Currently used as backgrounds (see `css/components.css` → `.bg--*`)
| File | Subject | Used as |
|------|---------|---------|
| `gallery-01.jpg` | Koi in dark water | Home **CTA** background (`.bg--koi`) |
| `gallery-03.jpg` | Paper lanterns (B&W) | **Footer** background, site-wide (`.bg--lanterns`) |
| `gallery-05.jpg` | Traditional machiya + noren | About **personal-message** bg (`.bg--machiya`) |
| `gallery-09.jpg` | Torii gate in green trees | Home **breather divider** (`.bg--torii`) |

(`images/japan-pics/japan-10.jpg` — Tokyo neon — is the Classes CTA background.)

## Spare / not yet placed
`gallery-02` (Great-Wave ramen art), `gallery-04` (JDM car at night),
`gallery-06` (udon/sake collage), `gallery-07` ("TOKYO" poster),
`gallery-08` (cat + Fuji beach). These suit the **gallery grid** in
`gallery.html` as extra thumbnails, or as alternate section backgrounds.

## How to change a background
Edit the `url(...)` in the matching `.bg--*` rule in `css/components.css`
(paths are relative to `/css`, e.g. `../images/gallery/gallery-01.jpg`).
Overlay strength is set per-section in the HTML via
`bg-overlay--light | --medium | --heavy | --fade`.

## ⚠️ Copyright
Use your own or properly-licensed photos before publishing.
