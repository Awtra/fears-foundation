# The Fears Foundation - biography & scholarship portfolio

A production-ready React + Tailwind CSS platform section for **Dr. Constance Y. Fears, JD, PhD**:
global navigation, profile hero, polymath timeline, scholarship hub, and personal footer.

---

## 1. Run it

```bash
npm install
npm run build # tailwind → dist/app.css, esbuild → dist/app.js, then inline both → preview.html
npm run serve # http://localhost:4173
```

| Command                          | What it does                                           |
| -------------------------------- | ------------------------------------------------------ |
| `npm run build:css`              | Tailwind CLI → `dist/app.css` (minified, ~25 KB)       |
| `npm run build:js`               | esbuild → `dist/app.js` (IIFE, ~170 KB incl. React 18) |
| `npm run build:preview`          | Inlines CSS + JS into a single portable `preview.html` |
| `npm run serve`                  | Zero-dependency static server on `:4173`               |
| `npm run watch:css` / `watch:js` | Rebuild on change                                      |

**`index.html`** is the deployable entry (external, cacheable assets).
**`preview.html`** is the same page as one self-contained file - no sub-resources, no server, no
CDN. Safe to open from disk, attach to an email, or drop into a review pane.

To port into an existing app: copy `src/FearsFoundationPage.jsx` and the `theme.extend` block from
`tailwind.config.js`. The component has no dependencies beyond React - no icon library, no
animation library, no CSS-in-JS runtime.

---

## 2. File map

```
index.html Deployable entry (fonts, meta, OG tags, skip link)
preview.html Generated self-contained build
tailwind.config.js Design tokens (canvas, surface, plum, type, radii, motion)
src/index.css Base layer (canvas, focus ring, scrollbars, reduced motion), .shell, .rule-label
src/main.jsx StrictMode mount
src/FearsFoundationPage.jsx ← the deliverable: 9 documented modules
scripts/bundle-preview.mjs Inlines the build into preview.html
scripts/serve.mjs Static dev server
shots/ Verification screenshots (desktop 1512 / mobile 390)
```

`src/FearsFoundationPage.jsx` module map:

| §   | Module        | Contains                                                                                                                                        |
| --- | ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Content model | `NAV_LINKS`, `CREDENTIAL_MARKS`, `HERO_STATS`, `ACADEMIC_CREDENTIALS`, `PRACTICE_SNAPSHOT`, `TIMELINE_TRACKS`, `SCHOLARSHIP_CARDS`, footer data |
| 2   | Hooks         | `useScrolled`, `useActiveSection`, `useEscapeToClose`, `scrollToSection`                                                                        |
| 3   | Primitives    | `Eyebrow`, `SectionHeading`, `Tag`, `CTA_BASE`/`CTA_VARIANTS`/`CTA_SIZES`, `ArrowGlyph`, `PlumGlow`                                             |
| 4   | Navigation    | `FearsMark`, `Navbar` (sticky, backdrop-blur, mobile drawer)                                                                                    |
| 5   | Hero          | `CredentialRail`, `ProfileHero`                                                                                                                 |
| 6   | Timeline      | `TimelineTrack`, `PolymathTimeline`                                                                                                             |
| 7   | Hub           | `ImpactWidget`, `ScholarshipCard`, `FoundationHub`, apply ribbon                                                                                |
| 8   | Footer        | `FoundationFooter`                                                                                                                              |
| 9   | Composition   | `FearsFoundationPage` (default export)                                                                                                          |

Splitting §4–§8 into `src/components/*.jsx` is a mechanical extraction - each module is already
self-contained.

---

## 3. Design system

| Token                               | Value                             | Use                                                       |
| ----------------------------------- | --------------------------------- | --------------------------------------------------------- |
| `canvas`                            | `#0B0F19`                         | Page background                                           |
| `surface` / `raised` / `inset`      | `#0F172A` / `#141D33` / `#080B13` | Panels, tiles, insets                                     |
| `plum` / `plum-light` / `plum-glow` | `#581C87` / `#6B21A8` / `#A855F7` | Ambient glow, borders, active state - never large fills   |
| `silver`                            | `#94A3B8`                         | Body copy                                                 |
| `muted`                             | `#7C8BA1`                         | Micro-labels, meta (lifted from slate-500 to clear AA)    |
| `rounded-sharp` / `rounded-card`    | `2px` / `4px`                     | Hard ceiling on every radius, including decorative blooms |
| `font-display`                      | Instrument Serif                  | Editorial italic accents in headings                      |
| `font-sans`                         | Inter                             | Interface + body                                          |
| `font-mono`                         | IBM Plex Mono                     | Indices, counts, micro-labels                             |

Purple is deliberately rationed: radial ambient blooms (`blur-[120px]`, `aria-hidden`), hairline
gradients, hover borders, one active-nav underline, and the portal button. No purple-filled cards,
no gradient text, no glassmorphism beyond the requested navbar blur.

---

## 4. Accessibility

- Semantic landmarks: `header` / `nav[aria-label]` / `main` / `section[aria-labelledby]` / `article` / `footer`, plus a visible-on-focus skip link.
- `aria-current="true"` on the nav link for the section in view (IntersectionObserver, not scroll math).
- Mobile drawer: `aria-expanded` + `aria-controls`, closes on Escape, on outside click, and on navigating below `lg`.
- Measured contrast: headings 17.85:1, body 7.47:1, micro-labels/eyebrows 5.53:1 - all ≥ WCAG AA.
- Tap targets: 46–48 px on touch surfaces (card CTAs, drawer links, primary CTAs).
- `prefers-reduced-motion` honoured twice: CSS kills transitions/animations, and `scrollToSection` swaps smooth scrolling for an instant jump.
- Decorative layers (grid texture, blooms, parity bars, arrows, node dots) are `aria-hidden`.

---

## 5. Content mapping

Every string traces to the supplied client material: the four degrees and their institutions, the
FDA investigator / postdoc / professor / senior quality leader roles, Polymath Regulatory
Consultants, LLC, Morehouse School of Medicine, cGMP subject-matter expertise, the six scholarship
programs (FSU, UAB, Middle Georgia State, Auburn, law students, K–12), the 2023 recipient fields
(Respiratory Therapy, Nursing, Aviation Science & Management), Alpharetta Chamber, Women in
Manufacturing, Parenteral Drug Association, ASQ, Atlanta residency, and the personal interests
(mentoring, teaching, public speaking, international travel, all things deep-fried; STEM education,
environmental conservation, human rights).

The only derived figures are the hero counters (20+ / 06 / 04), each a direct count or restatement
of the record. No invented metrics, testimonials, or placeholder copy.

---

## 6. Verified

Rendered in Chrome at 1512 px, 1024 px, and a true 390 px mobile viewport (CDP device emulation):

- Hero 12-column split (664 / 456 px), timeline and hub at 3 columns, single column below `lg`.
- Scholarship cards: identical 598 px height, CTA top offset identical across all three, 46 px tall, 12/20 px padding.
- Zero horizontal overflow at every width; the only elements extending past the viewport are `aria-hidden` bloom layers inside `overflow-hidden` parents.
- Drawer: closed `0px` → open `278.5px` (`aria-expanded="true"`) → Escape closes; nav click scrolls, updates the hash, closes the drawer, and moves `aria-current`.
- Fonts (Inter, Instrument Serif, IBM Plex Mono) load; the only external request is Google Fonts.
