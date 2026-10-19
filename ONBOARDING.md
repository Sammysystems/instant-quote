# Onboarding

You are picking up **Instant Quote** — a config-driven quoting engine, currently
wearing the face of a Lagos solar installer (Auxano Solar). This document gets you
from zero to confidently changing the thing in about 30 minutes.

If you only read one section, read **[Three laws](#4-three-laws-to-internalize)** and
**[The gotchas](#8-the-gotchas-learned-the-hard-way)**.

---

## 1. The 30-second orientation

There are two things in this repo:

1. **The engine** — `src/lib/quoteEngine.ts` + `src/quote/config.solar.ts` +
   `src/lib/quotePdf.ts`. Give it a customer's inputs, get back a fully priced quote
   and a branded PDF.
2. **The site** — everything else in `src/components/`. It exists to drive people into
   the quote flow and to look credible while doing it.

The product claim is simple: **a real, itemised, priced quote in seconds instead of
days.** The machine handles the standard 80% (sizing, pricing, paperwork); the human
handles the judgement 20% (roof survey, final price).

---

## 2. Prerequisites

- **Node.js 18+** and npm. (Developed on Node 25.6.1.)
- Nothing else. No database, no API keys, no Python, no Docker.

> Ignore any `.env` / `GEMINI_API_KEY` instructions you may find in old AI Studio
> docs. This app is 100% client-side and needs no environment variables.

---

## 3. Run it in 5 minutes

```bash
npm install
npm run dev
```

Open <http://localhost:3000>. Click **Request a Quote**, fill both steps, and watch a
quote appear. Hit **Download PDF**.

Sanity checks while you're there:

- The hero image loads (we have already fixed one dead image — see gotchas).
- The total for the default inputs is in the low millions of Naira, not dollars.
- The PDF header says **NGN**, while the screen says **₦**.

Other scripts:

| Command | What it does | Notes |
|---|---|---|
| `npm run dev` | Vite dev server on `:3000` | binds `0.0.0.0` → LAN/phone accessible |
| `npm run lint` | `tsc --noEmit` | this is the **only** type check |
| `npm run build` | production build → `dist/` | expect a chunk-size *warning*, not an error |
| `npm run preview` | serve `dist/` locally | |

---

## 4. Three laws to internalize

**Law 1 — Config is the brain.**
Every price, engineering constant, option list and brand string lives in
`src/quote/config.solar.ts`. If you find yourself typing a rate, a sun-hour figure or
a phone number anywhere else, stop. Put it in config and read it from there.

**Law 2 — The engine is deterministic.**
`generateQuote(input)` is a pure function. Same input → same output, always. No AI, no
fetch, no randomness, no `Date.now()` inside the *sizing* or *pricing*. This is what
makes it trustworthy and testable. Keep it that way.

**Law 3 — The front end is disposable; the engine is not.**
You can restyle the whole site without touching the engine. If a change requires
editing `quoteEngine.ts` to make the UI work, you are probably fighting the design —
think first.

---

## 5. Trace one quote end-to-end

Follow a click through the system:

| # | What happens | Where |
|---|---|---|
| 1 | User clicks a CTA | `Navbar.tsx`, `Hero.tsx`, etc. call `window.openQuoteModal()` |
| 2 | The global trigger opens the modal | `App.tsx:44` sets `isQuoteOpen` |
| 3 | Modal resets and renders step 1 | `RequestQuoteModal.tsx:87` |
| 4 | Step 1 collects name / WhatsApp / email / suburb / property | `RequestQuoteModal.tsx:196` |
| 5 | Step 2 collects spend / priority / backup / roof | `RequestQuoteModal.tsx:287` |
| 6 | "Generate my quote" starts the sequence | `RequestQuoteModal.tsx:100` `startGeneration()` |
| 7 | `sizeSystem(input)` → kWp, panels, battery, inverter | `quoteEngine.ts:40` |
| 8 | `buildLineItems(input, sizing)` → 11 priced items | `quoteEngine.ts:65` |
| 9 | `generateQuote(input, counter)` → totals, savings, payback, terms | `quoteEngine.ts:180` |
| 10 | Result renders on screen | `RequestQuoteModal.tsx:409` |
| 11 | **Download PDF** calls the renderer | `quotePdf.ts` → `downloadQuotePdf()` |
| 12 | **Book free survey** opens WhatsApp pre-filled with the quote number | `RequestQuoteModal.tsx:139` |

Read those four functions in order and you know the whole product.

---

## 6. Where things live

| You want to change… | Go to |
|---|---|
| A price, sun hours, battery sizes, VAT, deposit, validity | `src/quote/config.solar.ts` |
| Brand name, tagline, phone, colours used in the PDF | `src/quote/config.solar.ts` |
| How the system is sized | `quoteEngine.ts` → `sizeSystem` |
| Which line items appear | `quoteEngine.ts` → `buildLineItems` |
| Totals, savings, payback, instalments | `quoteEngine.ts` → `generateQuote` |
| The PDF layout / what's on it | `src/lib/quotePdf.ts` |
| The form steps and their validation | `src/components/RequestQuoteModal.tsx` |
| Page sections / order | `src/App.tsx` |
| Site copy on the hero/navbar | `Hero.tsx`, `Navbar.tsx` |
| Projects, reviews, suburbs, FAQ data | `src/data.ts` |
| Colours, fonts, global styles | `src/index.css` + `index.html` |
| Generic UI primitives | `components/ui/*` |

**Two component roots — don't mix them up:**

- `src/components/` → page sections and the quote flow. Put new features here.
- `components/ui/` → shadcn-style primitives (`button`, `card`, `carousel`, …), with
  `lib/utils.ts` (`cn()`) at the project root. Reuse, don't duplicate.

---

## 7. Conventions to follow

- **Imports:** the codebase uses **relative imports** (`../lib/quoteEngine`). An `@`
  alias exists (`@/*` → project root) but is intentionally unused — match the
  surrounding file rather than mixing styles.
- **Money on screen:** always `formatMoney(n)` (gives `₦…`, en-NG grouping).
  **Money in the PDF:** `formatMoney(n, { pdf: true })` (gives `NGN …`).
- **Numbers:** `formatNumber(n, digits)` for kWp/kWh figures.
- **Types:** all quote shapes live in `src/types.ts`. Extend them there, not inline.
- **Styling:** use the existing palette tokens — dark green `#0D1A0E`, panel
  `#132A14`, gold `#E8A020` / `#FFC252`, muted text `#B0ACA4` / `#D4D0C8`.
- **Comments:** the engine and config are commented deliberately (they encode
  business rules). Don't strip them; explain *why*, not *what*.
- **No secrets, ever.** There is no backend and nothing needs a key.

---

## 8. The gotchas (learned the hard way)

**StrictMode is ON — never put side effects in a state updater.**
`src/main.tsx` uses `<StrictMode>`, which double-invokes state updaters in dev. We hit
a real bug where the quote-generation sequence lived inside `setLoaderIndex(prev => …)`
and produced `AXS-…-0002` on a fresh load. The fix: run the sequence from the click
handler (`startGeneration()`) with a `timers` ref. If you add timed or once-only logic,
put it in a handler or `useEffect`, not an updater.

**The Naira sign does not exist in jsPDF's built-in font.**
Helvetica has no `₦` (U+20A6). The PDF therefore uses `"NGN "`. Keep using
`formatMoney(..., { pdf: true })`. Do not "fix" this by pasting `₦` into PDF strings.

**`tsc` is not on PATH.**
Don't run `tsc`. Run `npm run lint`, or `node node_modules/typescript/bin/tsc --noEmit`.

**Unsplash IDs die.**
One hero image was a 404 for who-knows-how-long because the photo ID was removed
upstream. If an image looks broken, check `naturalWidth` in the console (0 = broken).
Verify replacements in a real browser — some environments get rate-limited into false
404s.

**The quote number resets on reload.**
The counter is a `useRef(1)` in the modal. Reload the page and you're back to `0001`.
This is known and intentional for the demo; fixing it needs a backend.

**`DISABLE_HMR` is an AI Studio artefact.**
`vite.config.ts` reads `process.env.DISABLE_HMR`. You will never set it locally. Leave
it alone.

**Two component roots.**
Duplicated names are possible (`lib/` at root vs `src/lib/`). Root `lib/utils.ts` is
the `cn()` helper; `src/lib/` is the quote engine. They are different things.

**Build warning is normal.**
`vite build` warns that the main chunk exceeds 500 kB. It is a warning. The fix is
code-splitting the PDF libraries, not suppressing it.

---

## 9. Common tasks

### Change a price
1. Edit the relevant number in `config.solar.ts` → `rates`.
2. `npm run lint && npm run build`.
3. Generate a quote and sanity-check the total moved in the right direction.

> If you change the whole price level, re-check the website's "payback" and "from
> ₦X" copy — marketing numbers and the engine can drift apart.

### Change the brand
Update `brand`, `tagline`, `phone`, `phoneIntl`, `website` in `config.solar.ts`, plus
`index.html` `<title>` and any brand strings in `Navbar.tsx` / `Footer.tsx`.

### Add a form field
1. Add it to `QuoteInput` in `src/types.ts`.
2. Add it to `EMPTY` and the UI in `RequestQuoteModal.tsx`.
3. If it should affect sizing, thread it through `sizeSystem`.
4. If it should appear in the PDF, update `quotePdf.ts`.
5. Run `npm run lint` — TypeScript will point at every place you missed.

### Add a page section
Create `src/components/YourSection.tsx`, import it in `App.tsx`, place it in the
order. Follow an existing section for markup and motion conventions.

### Add a new vertical
See the README's [Adding a new vertical](../README.md#adding-a-new-vertical). Short
version: config + types + line-item extraction. The PDF renderer already accepts any
`QuoteResult`.

---

## 10. How to verify your change

Minimum bar:

```bash
npm run lint     # must be clean
npm run build    # must succeed
```

Then, by hand:

1. `npm run dev`, open the site.
2. Run a quote with the default inputs and one extreme input (₦20k and ₦2M).
3. Download the PDF and confirm it opens and the totals match the screen.
4. Check no image is broken (Network tab, or `naturalWidth`).

For anything touching the flow, a headless-Chrome walkthrough over the DevTools
Protocol (as used during development) is the most reliable check: navigate, fill the
form, assert the quote number/total, download the PDF, and assert every `<img>` has
`naturalWidth > 0`.

There are **no unit tests yet**. The engine is pure and easy to test — adding a Vitest
suite around `sizeSystem` / `generateQuote` is a high-value first contribution.

---

## 11. Deploying

It's a static site. Any static host works (Vercel, Netlify, Cloudflare Pages):

| Setting | Value |
|---|---|
| Build command | `npm run build` |
| Output directory | `dist` |
| Node version | 18+ |
| Environment variables | none |

No SPA rewrite/fallback is required — it's a single page.

---

## 12. Glossary

| Term | Meaning |
|---|---|
| **Indicative quote** | The instant estimate. Range ±10%, valid 14 days, subject to survey. |
| **Firm quote** | The final price after the free site survey. What the business commits to. |
| **kWp** | Kilowatt-peak — panel array size under standard test conditions. |
| **kWh** | Kilowatt-hour — energy stored or consumed (battery size, daily usage). |
| **kVA** | Kilovolt-ampere — inverter capacity (apparent power). |
| **DoD** | Depth of discharge — how much of a battery is usable (0.9 for LiFePO4 here). |
| **Peak sun hours** | Effective full-sun hours per day (4.5 for Lagos). |
| **Derate / system loss** | Efficiency lost to heat, dust, wiring, inverter (0.75 here). |
| **Blended rate** | Average cost per kWh across grid + generator fuel (₦300 here). |
| **Net metering** | Exporting surplus solar to the grid for credit (Eko DisCo filing). |
| **Two-clock doctrine** | Q1 indicative now, Q2 firm after survey — the core sales model. |

---

## 13. Suggested first tasks

In rough order of value:

1. **Unit tests** for `sizeSystem` and `generateQuote` (pure functions, no DOM).
2. **Code-split the PDF** — `import()` the `quotePdf` module on download to tame the
   1.3 MB chunk.
3. **Quote numbering + owner notification** — the thin backend that turns this from a
   demo into a system of record (unique IDs, store the lead, email/WhatsApp the PDF).
4. **Analytics events** — modal open, step completion, quote generated, PDF downloaded.
5. **Second vertical** — the real proof of the thesis.

---

*Questions this doc doesn't answer? The code is small and the engine is four
functions. Read `quoteEngine.ts` top to bottom — it is the product.*
