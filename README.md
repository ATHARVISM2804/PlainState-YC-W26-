# Plainstate — landing page

Marketing site for [Plainstate](https://buildplainstate.in): month-end owner
statements for residential property managers, with the source cell behind every
figure.

React 18 + TypeScript + Vite. Ships as static files and works with no backend
at all. Point it at the ingestion reader and one section becomes live.

> The ingestion engine lives in a separate repository (`plainstate`). This repo
> contains no product code and never handles a customer's data unless the
> reader below is deliberately wired up.

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # -> dist/
npm run preview    # serve the built output locally
npm run typecheck  # strict, no emit
npm run check:layout   # renders at 390/820/1440, fails on overflow or console errors
npm run check:quality  # after a build: bundle budget, LCP/CLS, hidden text, keyboard, grain, placeholder copy
npm run check:contrast # every text token on every surface, WCAG AA
npm run verify         # build, then all three checks, both pages
```

## Analytics

Five events, no personal data: `figure_inspected`, `view_switched`,
`film_played`, `export_sent`, `call_booked`. `src/lib/track.ts` sends them to
Plausible if `window.plausible` exists, to gtag if `window.gtag` exists, and
otherwise logs in development and drops in production. To turn analytics on,
add the provider's script tag to `index.html` and `method.html`; nothing else
changes.

## The quality bar

`check:quality` is the bar the roadmap holds every phase to, enforced on the
built site: first-route JavaScript under 150 KB gzipped, LCP under 2.5 s and
CLS under 0.1 in a headless Chromium, no readable text resting at opacity zero
with motion on or off, the paper grain darkening the ground by under 5%, and
no placeholder copy anywhere in `src/`. Motion's animation runtime loads after
first paint (`LazyMotion` with `m.*` elements), which took the first route
from about 104 KB to about 80 KB gzipped. Section reveals are CSS scroll-driven
animations, so they cost no JavaScript and the finished state is the default;
browsers without view timelines, readers with reduced motion, and print all see
the content as it is.

## Connecting the reader

The page ships fully static and works with no backend. Point it at the
ingestion API and the **Try it** section becomes live: a visitor drops in their
own export and gets back what Plainstate found in it.

```bash
# terminal 1 — the reader, from the plainstate engine repo
python -m pip install -e ".[api]"
uvicorn plainstate.api:app --port 8000

# terminal 2 — this site
VITE_API_URL=http://localhost:8000 npm run dev
```

With `VITE_API_URL` unset the panel explains how to run it rather than
pretending to work. Copy `.env.example` to `.env.local` to set it permanently.

**The endpoint is inspection-only, on purpose.** It reports what is in a file —
the report, the owner, the period, which balance roles were found, which
accounts need a decision — and returns **no figures at all**. A statement can
only be produced through the reviewed path, so nothing a stranger uploads can
come back as a number nobody approved. Uploads live in a per-request temporary
directory and are deleted when the request ends; nothing is retained.

## Deploy

**Vercel** — import the repo and accept the defaults. `vercel.json` already
sets the framework, build command, output directory and immutable caching for
hashed assets.

**Netlify / Cloudflare Pages** — build command `npm run build`, publish
directory `dist`.

**Anywhere else** — `npm run build` and serve `dist/` as static files.

### Connecting the domain

1. Add the domain in your host's dashboard and point DNS at it.
2. Update three places that currently say `buildplainstate.in`:
   - `index.html` — `<link rel="canonical">` and `og:url`
   - `public/robots.txt` — the `Sitemap:` line
   - `src/data/content.ts` — `SITE.contact`

## Structure

```
public/           favicon.png · apple-touch-icon.png · wordmark.png · og.png · robots.txt · sitemap.xml · 404.html
scripts/          make-og.py     regenerates the Open Graph card
index.html        meta, Open Graph, JSON-LD, fonts
src/
  main.tsx App.tsx
  data/           content.ts     every string on the page
                  statement.ts   the demo's figures and provenance
  styles/         tokens.css     the brand: colour, type scale, spacing
                  base.css       primitives, mobile-first
  hooks/          useTether.ts   measures the curve from a figure to its receipt
  components/
    nav/          Nav            sticky, with a real mobile menu
    hero/         Hero · SourceTrace (headline traced to the opening balance) · Ticker
    method/       MethodPage (the /method route)
    demo/         Demo · Sheet · Receipt · Tether · Record
    demo/         Demo · Sheet · Receipt · Tether
    sections/     Problem · Rollforward · Sources · TryIt · Walkthrough (sticky steps) · Faq · Sections
                  Story.tsx: Why · RunsOut · Prove · Engine · Method · Status · Data · Glossary
    Cite.tsx      the sources under a section
    Stamp.tsx     the rubber stamp
    Figure.tsx    every number on the page: mono, tabular, carrying its provenance as data
    Reveal.tsx    a CSS scroll-driven entrance; no JavaScript, never rests invisible
    Reveal.tsx
```

Copy lives in `src/data/content.ts`, never in JSX. Changing a sentence, a
price or a FAQ answer means editing one file.

## The page

Ordered the way B2B pages that convert are ordered — the outcome first,
because a visitor decides in about five seconds:

1. **Hero** — outcome headline, audience above it, one dominant CTA
2. **Demo** — beside the headline on wide screens, under it elsewhere; click a
   figure and everything not on its path recedes while the source appears
3. **What Plainstate is** — the product in one paragraph and three columns
4. **How a month moves** — the whole loop in five stations: your PMS, the
   export, Plainstate, your reviewer, your owner (`Workflow.tsx`)
5. **Film** — a framed video slot (`FILMS.overview` in `content.ts`)
6. **The problem in the manager's words** — what owners write in, the
   founder's estimates labelled as estimates, then "Why now" as three shifts
7. **What you do today, and where it runs out** — the PMS statement, a
   spreadsheet, an outsourced bookkeeper, each honestly, with the torn
   before/after
8. **How statements work** — the rollforward skeleton
9. **Under the hood** — the seven-step engine, the inspector's real output
   (`Inspect.tsx`), confidence tiers, refusals, exit codes
10. **One figure, end to end** — the scroll-drawn trace
11. **The receipt travels with the figure** — the forest band, carrying the
    four-line standard
12. **Four steps, once a month** — the sticky walkthrough
13. **What it reads**, **Try it**, **The checks**
14. **What we believe** — six rules
15. **What works today. What is next.** — dated, with the synthetic-data
    caveat stamped on it
16. **Your data** — how files are handled, certification status stated plainly
17. **Boundaries**, **Pricing**, **FAQ**, **Close**, **Footer** — the footer
    holds the glossary as a disclosure and a short colophon

The hero is the one lit object on the page: the statement, the receipt and a
"Checks on this statement" card share a single two-layer shadow; nothing else
casts one. The nav compresses on scroll.

Every section that makes a factual claim ends in a small `Sources` list
(`Cite.tsx`); anything not cited is labelled a founder estimate.

## The interactions

Five, each depicting a real mechanism of the product, each usable by keyboard
and by touch, each a still frame under reduced motion.

- **Inspectable numbers.** Any figure with a provenance record (the rollforward
  chain, the drafted statement in the walkthrough) is a control: hover or tap
  and a small receipt shows file, checksum, cell, as-printed text and
  confidence. The founder's estimates in the Problem section are inspectable
  too, and say "Estimate · unverified". One receipt open at a time; Escape,
  an outside tap or a scroll closes it. `Figure.tsx`.
- **Statement / Sources.** A switch above the demo rewrites every figure into
  the cell it was read from, top to bottom, on the compositor. `Demo.tsx`,
  `Sheet.tsx`.
- **One figure, end to end.** A pinned drawing where the reader's scroll draws
  three ledger cells into Total Income, rolls it forward, distributes it and
  carries it into September. Five hops, five fifths of the scroll.
  `TraceScroll.tsx`.
- **The rollforward as progress.** A small corner strip that fills the August
  arithmetic in as the reader descends. Built in `ScrollLedger.tsx` but not
  rendered, because it sat over content while reading; one line in `App.tsx`
  brings it back.
- **Before and after, torn.** In "What you do today", the export as it arrives
  lies over the statement it becomes; drag the torn edge, or use the arrow
  keys on the handle. `Torn.tsx`.

The four-step walkthrough gained a Restart control and, on fine pointers, a
hover preview of each step's stage.

## Motion rules

One easing for everything that answers a person, `--ease`
(`cubic-bezier(0.2, 0.7, 0.3, 1)`), and nothing uses ease-in. UI transitions
stay inside 300 ms; the three longer movements are deliberate set-pieces that
run once: the hero's word-mask headline (settled inside 600 ms), the headline
traced to the opening balance, and stamps pressing in. Only transform and
opacity animate on the scroll path. Nothing scales from zero. Every control
has hover, active and a visible focus ring in mint; the scrollbar wears the
page's colours. Demos play in sequence, never simultaneously.

## The document feel

- **The Method page** at `/method` (`method.html`, a second Vite entry;
  `vercel.json` has `cleanUrls` so the extension is dropped). Six chapters
  with a table of contents that stays put, set at a reading measure. Copy in
  `src/data/method.ts`. It has its own share card, `public/og-method.png`,
  from `python scripts/make-og.py method`.
- **Pinned badges.** The two sticky sections announce when they are holding
  the page and how far along they are, with a small stamped label. A
  one-pixel sentinel and `IntersectionObserver` in `usePinned.ts`.
- **The Record view.** A third state on the demo switch shows the canonical
  statement as JSON, serialised from the same figures the sheet renders, so a
  technical reader can check the shape against the statement to the cent.
- **Print.** `@media print` in `base.css`: no chrome, no motion, no controls,
  black on white, sections kept whole, external link URLs printed after the
  link text.

The earlier numbered list below is superseded by this one.
4. **Why it is trustworthy** — the provenance rule
5. **How it works** — four steps
6. **What it reads** — Buildium and AppFolio live, the rest named honestly
7. **The check that matters** — what it refuses to send
8. **Boundaries** — what it will never do
9. **Pricing** — three tiers by door count
10. **FAQ** — the real objections
11. **Close** — send one export

There is **no logo strip and no testimonial**. Plainstate has no customers
yet, and inventing them on a page whose whole argument is that numbers are
verifiable would be the one unrecoverable mistake. Where social proof would
normally sit there are product facts that are true today.

## Brand

A grainy off-white ground taken from the logo's own paper colour, near-black
text, and the two greens from the mark. The forest green is the ink: buttons,
links, the accent phrase in the headline. The mint is the signal: the cited
cell, the active row, the drawn line, the dot. Mint never carries text, because
it fails contrast on white.

Committed to a single light theme — a choice, not an omission. Every colour is
painted explicitly so the page holds on any host background, and nothing
depends on a media query to be legible. The grain is one tiled SVG noise
filter multiplied over the ground by `body::before`; no image request.

Colour is spent in exactly three roles:

| token | means |
|---|---|
| `--brand` / `--signal` | the live thing: citations, active row, primary action |
| `--warn` | a figure a human still has to look at |
| `--stop` | something the system refused outright |

A fourth colour would mean one of these had stopped carrying meaning.

Type: **Newsreader**, a quiet editorial serif, sets every headline at one
weight so the page reads like a printed statement rather than a software
launch. **Instrument Sans** carries body and UI. **IBM Plex Mono** handles every
figure, price and citation with tabular numerals — not decoration, since cell
references are the product.

Deliberately not Inter, and no italic accent word in the headline. Both are the
defaults of the moment, and a page that uses them looks like every other page.

The page is framed like a document: two ruled rails run the length of the
content column, every section rule reaches them, and small register marks sit
where they cross. Depth is a hairline and a tint shift; nothing casts a shadow.
The one inverted band mid-page ("The receipt travels with the figure") is the
only time the ink becomes the paper.

Devices come from the product's own materials: a rubber stamp for the
reconciled state and the featured price, torn receipt strips for the three
refusals, a double rule under each price like a total line, and a slow ticker
of engine facts under the hero where a logo strip would otherwise go.

## Checking it in a browser

```bash
npx playwright install chromium   # once
npm run check:layout
```

Renders the page at 390, 820 and 1440px and fails on horizontal overflow or a
console error. Worth running before any deploy: three real bugs shipped past
every static review and were only caught here — a background wash inset past
the viewport edge, and two grid children with the default `min-width: auto`
refusing to shrink. All three gave the page a sideways scroll that reading the
CSS never revealed.

Playwright is an optional dependency, so a normal `npm install` does not pull
the browser.

## Small screens

Audited on iPhone SE (320 and 375 px), iPhone 14 (390 px) and the 430 px
Pro Max width, both pages, with touch emulation. The rules that came out of
it, all in CSS:

- No label under 12px on a phone: `--t-2xs` is 11px on desktop and 12px
  under 40rem, and every small mono label uses it.
- Every control is at least 44px tall where the pointer is a thumb
  (`@media (pointer: coarse)`), including the statement rows, the view
  switch and the logo link; inline figure controls get an invisible hit area.
- Nothing may widen the document: the Sources locators never exceed their
  row, rotated stamps wrap under 40rem, and the trace diagram keeps a legible
  size inside its own sideways-scrolling box, the one place on the page
  allowed to pan.
- The torn comparison starts its tear further left on phones and gives the
  statement two thirds of the width, so labels stay readable.
- Receipts open as a bottom sheet under 40rem.

## Responsive

Written mobile-first: the narrow layout is the default and media queries only
add to it. Breakpoints at 26 / 34 / 40 / 52 / 58 / 60 / 64rem, each introduced
where the content needs it rather than at device sizes.

- Sticky header collapses to a menu panel below 60rem — Escape closes it,
  focus returns to the trigger, the page behind cannot scroll
- Every touch target is at least 48px
- Buttons go full-width below 26rem instead of squeezing
- The demo stacks below 64rem and the tether hides, since there is nothing
  left to connect
- Long code strings scroll inside their own box; the page body never scrolls
  sideways
- Everything honours `prefers-reduced-motion`

## SEO and sharing

Shipped and wired up: canonical URL, Open Graph and Twitter card with a real
1200×630 image, `theme-color` for both schemes, `sitemap.xml`, `robots.txt`,
a styled `404.html`, and `SoftwareApplication` JSON-LD carrying the three
pricing tiers.

The OG card is generated, not hand-drawn:

```bash
python scripts/make-og.py   # -> public/og.png
```

It reads the same brand colours the site uses, so the card and the page cannot
drift apart. Re-run it after changing the headline or the palette.

## Accessibility

- One `h1`, ordered headings, `main` / `header` / `footer` landmarks, a skip link
- Both `nav` elements labelled; the menu trigger carries `aria-expanded` and
  `aria-controls`, Escape closes it, focus returns to the trigger
- The provenance card is an `aria-live` region and the selected row carries
  `aria-current`, so a screen reader hears the citation change
- Decorative marks are `aria-hidden`; the only `svg` is the tether, which is
  ornamental by definition
- Every text/ground pairing clears WCAG AA — 42 combinations checked,
  weakest 4.88:1 (`--stop` on `--surface-max`)
- `MotionConfig reducedMotion="user"` globally, plus explicit guards in every
  animating component. Nothing translates or springs for someone who asked it
  not to.

## Known trade-off

The bundle is ~96 KB gzipped, most of it React and Motion. For a page that is
largely static that is the honest cost of building it in React rather than
hand-written HTML, which would ship about 5 KB. It buys the interactive demo
and a component model worth extending. If the page ever needs to win on Core
Web Vitals for paid acquisition, moving it to Next.js with server components
is the lever — the components port unchanged, since none of them import
anything Vite-specific.

## Before launch

- Replace `SITE.contact` in `src/data/content.ts` with the real address
- Replace `SITE.calendar` with the Cal.com booking URL (every "Book a call"
  reads it) and the two `mailto:` links in `FOOTER.columns`
- One film section only. The overview film is live: `public/film-overview.mp4` (H.264, fast-start,
  13.8 MB, encoded from the 58 MB master with
  `ffmpeg -i master.mp4 -vf "scale='min(1920,iw)':-2" -c:v libx264 -preset slow -crf 24 -pix_fmt yuv420p -movflags +faststart -an public/film-overview.mp4`)
  with a poster from the one-minute mark. Masters stay out of the repo
  (`/*.mp4` is ignored). The second film section was removed on 18 Sep 2026.
- Update the three places that say `buildplainstate.in` (canonical + `og:url` in
  `index.html`, the `Sitemap:` line in `public/robots.txt`)
- Settle the name — the strategy docs say OwnerBrief, this says Plainstate
- Add "Backed by Y Combinator" to the nav if and when that is true
