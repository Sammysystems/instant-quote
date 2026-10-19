# Instant Quote

**A config-driven instant quoting engine.** A customer fills in a short form; the
system sizes the job, prices it from your own rate card, and returns a branded,
itemised **PDF quote in seconds** — not days.

This repo ships the engine **and** its first application: a production-quality
landing site for a Lagos solar installer (brand face: **Auxano Solar**). The site
is the showcase; the engine is the product.

> The core idea: a business owner should never spend three to five days producing a
> quote that a machine can produce correctly in six seconds.

---

## Table of contents

- [The problem](#the-problem)
- [How it works](#how-it-works)
- [How the quote is calculated](#how-the-quote-is-calculated)
- [Worked example](#worked-example)
- [Architecture](#architecture)
- [Project structure](#project-structure)
- [Configuration](#configuration)
- [Getting started](#getting-started)
- [Verification](#verification)
- [Known gaps & roadmap](#known-gaps--roadmap)
- [Adding a new vertical](#adding-a-new-vertical)
- [Brand & currency notes](#brand--currency-notes)
- [Tech stack](#tech-stack)

---

## The problem

A serious enquiry starts with "how much?" and then the customer waits. In home
services and solar especially, that wait is where deals die:

- The **first credible responder** usually wins the job.
- A reply in **minutes** closes at a dramatically higher rate than one in **days**.
- Every hour a quote sits in a drafts folder is an hour the customer is talking to
  three other installers.

The fix is not "type faster." It is to encode the quoting rules **once** so the
first, itemised, priced answer can be generated the instant the customer asks —
while the human keeps control of the final firm number.

---

## How it works

```
customer form  ──►  size the system  ──►  price the line items  ──►  PDF + on-screen quote
   (2 steps)          (physics)              (rate card)                (jsPDF)
```

Four properties make this safe:

1. **Deterministic** — the same inputs always produce the same quote. No randomness,
   no AI, no network call.
2. **Client-only** — everything runs in the browser. No backend, no API keys, no data
   leaves the device.
3. **Config-driven** — every price and engineering constant lives in one file.
4. **Honest by design** — it is explicitly an *indicative* estimate with a ±10% band,
   and it hands off to a free site survey for the firm price.

The flow the customer sees:

1. Click **Request a Quote** (navbar, hero, or any CTA wired to `window.openQuoteModal()`).
2. **Step 1** — name, WhatsApp, email, Lagos location, property type.
3. **Step 2** — monthly power spend, primary goal, backup hours, roof type, roof space.
4. **Generating** — a short, deliberate loader sequence (≈4.4 s) so the result feels
   like work being done rather than a flicker.
5. **Result** — system summary, indicative total + range, savings, payback, deposit,
   payment plan, line items.
6. **Download PDF** or **Book free survey** (pre-fills a WhatsApp message with the
   quote number and system size).

---

## How the quote is calculated

The engine turns **money → energy → equipment → price**. The customer knows what they
*spend*, not what they *use*; everything starts there.

### 1. Inputs

| Field | Type | Drives |
|---|---|---|
| `monthlySpend` | number (₦) | **System size** — the single most important input |
| `priority` | `Cut bills` / `Backup power` / `Off-grid` | Battery sizing factor (0.5 / 0.7 / 0.7) |
| `backupHours` | 4 / 8 / 12 / 24 | Battery capacity |
| `roofType`, `roofSpace` | text | Quote context + mounting wording |
| `name`, `phone`, `email`, `suburb`, `propertyType` | text | Lead details, quote header |

### 2. Sizing — `src/lib/quoteEngine.ts:40` (`sizeSystem`)

```ts
dailyKwh      = monthlySpend / blendedRatePerKwh / 30
systemSizeKw  = max(1.5, dailyKwh / (peakSunHours * systemLoss))
panelCount    = ceil(systemSizeKw * 1000 / panelWatts)
backupLoadKwh = dailyKwh * (backupHours / 24) * backupFraction
batteryKwh    = snapUp(max(5, backupLoadKwh / batteryDod), batteryModulesKwh)
inverterKva   = snapUp(systemSizeKw * 1.15, inverterSizesKva)
```

- `blendedRatePerKwh = 300` — blended grid + generator fuel cost (₦/kWh).
- `peakSunHours = 4.5`, `systemLoss = 0.75` — Lagos sun and a 25% derate for heat,
  dust, wiring and inverter losses.
- `panelWatts = 550`, `batteryDod = 0.9` (LiFePO4 usable depth of discharge).
- Batteries and inverters are **snapped up** to real product sizes, so a quote only
  ever contains equipment that exists.
- A **1.5 kWp floor** prevents nonsense from tiny inputs.

### 3. Pricing — `src/lib/quoteEngine.ts:65` (`buildLineItems`)

Eleven line items, each quantity × rate from the rate card:

| Line item | Basis | Rate (₦) |
|---|---|---|
| Tier-1 monocrystalline PV modules | per kW | 200,000 |
| Hybrid inverter | per kVA | 150,000 |
| LiFePO4 battery bank | per kWh | 320,000 |
| Mounting structure & rails | per kW | 70,000 |
| Balance of system (cabling, isolators, earthing) | per kW | 85,000 |
| Installation & electrical works | per kW | 120,000 |
| Engineering, design & project management | per kW | 65,000 |
| Roof & structural works | per kW | 55,000 |
| System design & permit documentation | flat | 100,000 |
| Eko DisCo net-metering application | flat | 80,000 |
| Monitoring & app setup | flat | 40,000 |

The card is derived from a **₦1.2M per kW installed** baseline, so a no-battery
hybrid system lands near ₦1.2M/kW. Battery is the line that moves the total most.

### 4. Commercial terms — `src/lib/quoteEngine.ts:180` (`generateQuote`)

```
subtotal   = Σ line items
vat        = subtotal * 7.5%
total      = round(subtotal + vat, 1,000)
range      = total ± 10%                      (± band on an indicative quote)
monthlySaving = monthlySpend * 0.85           (0.70 without battery)
payback    = total / (monthlySaving * 12)
CO₂        = systemSizeKw * 1.6 t/yr
deposit    = total * 30%
installment= (total - deposit) / 3 months
validity   = 14 days
quote no.  = AXS-YYYYMM-NNNN
```

---

## Worked example

Inputs: **₦250,000/month**, priority **Backup power**, **8 h** backup, pitched roof,
Home.

| Step | Result |
|---|---|
| Daily usage | `250,000 / 300 / 30` = **27.8 kWh/day** |
| System size | `27.8 / (4.5 × 0.75)` = **8.2 kWp** |
| Panels | `ceil(8,200 / 550)` = **15 × 550 W** |
| Battery | `27.8 × (8/24) × 0.7 / 0.9` = 7.2 → snapped to **10 kWh** |
| Inverter | `8.2 × 1.15` = 9.4 → snapped to **10 kVA** |
| Subtotal | **₦9,799,000** |
| VAT (7.5%) | **₦734,925** |
| **Total** | **₦10,534,000** (range ₦9,481,000 – ₦11,587,000) |
| Est. saving | **₦213,000/mo** |
| Payback | **≈ 4.1 years** |
| Deposit (30%) | **₦3,160,000**, or 3 × **₦2,458,000** |
| Monthly production | **≈ 830 kWh** |

> These numbers are reproducible: `generateQuote` is pure. Change the rate card and
> every quote moves with it.

---

## Architecture

| Stage | Responsibility | File |
|---|---|---|
| 1 | 2-step form, loader, result view | `src/components/RequestQuoteModal.tsx` |
| 2 | Sizing (physics) | `src/lib/quoteEngine.ts:40` |
| 3 | Pricing (rate card) | `src/lib/quoteEngine.ts:65` |
| 4 | Commercials + quote object | `src/lib/quoteEngine.ts:180` |
| 5 | Branded PDF | `src/lib/quotePdf.ts` |
| — | All constants & option lists | `src/quote/config.solar.ts` |
| — | Shared types | `src/types.ts` |

The modal is a **controlled overlay** owned by `App.tsx`, which exposes
`window.openQuoteModal()`. A legacy `window.openBookingModal()` alias is kept so the
existing savings calculator keeps working unchanged.

---

## Project structure

```
instant-quote/
├─ index.html                  # Vite entry + Google Fonts
├─ vite.config.ts              # React + Tailwind plugins, @ alias, HMR toggle
├─ tsconfig.json               # noEmit; `npm run lint` runs tsc --noEmit
├─ package.json
│
├─ src/                        # ← the application
│  ├─ main.tsx                 # React root (StrictMode ON)
│  ├─ App.tsx                  # page composition + modal state + global triggers
│  ├─ index.css                # design tokens (dark green / gold palette)
│  ├─ types.ts                 # QuoteInput / QuoteLineItem / QuoteResult + site types
│  ├─ data.ts                  # projects, reviews, suburbs, services (₦ figures)
│  │
│  ├─ quote/
│  │  └─ config.solar.ts       # ★ the brain: brand, engineering constants, rate card
│  │
│  ├─ lib/
│  │  ├─ quoteEngine.ts        # sizeSystem → buildLineItems → generateQuote
│  │  └─ quotePdf.ts           # jsPDF + autotable branded quote
│  │
│  └─ components/              # page sections + the quote modal
│     ├─ RequestQuoteModal.tsx # ★ the instant-quote flow
│     ├─ Navbar.tsx  Hero.tsx  TrustBar.tsx  About.tsx  Services.tsx
│     ├─ Calculator.tsx        # legacy savings calculator (kept working)
│     ├─ Projects.tsx  Testimonials.tsx  FAQ.tsx  LeadCapture.tsx
│     ├─ Footer.tsx  LiveAlertToast.tsx  BookingModal.tsx (legacy, unused)
│     └─ …
│
├─ components/ui/              # shadcn-style primitives (button, card, carousel…)
├─ lib/utils.ts                # `cn()` class helper
└─ public/hero_solar.jpg       # local hero asset
```

> **Note the two component roots.** `src/components/*` are the page sections and the
> quote flow. `components/ui/*` are generic design-system primitives (shadcn style)
> used by a few sections, with `lib/utils.ts` at the project root. Keep new
> page-level work in `src/`; keep reusable primitives in `components/ui/`.

---

## Configuration

Almost everything worth changing lives in **`src/quote/config.solar.ts`**.

### Engineering constants

| Key | Value | Change it when… |
|---|---|---|
| `peakSunHours` | 4.5 | You target a different city/region |
| `systemLoss` | 0.75 | Your installation quality/derate differs |
| `panelWatts` | 550 | You standardise on a different module |
| `batteryDod` | 0.9 | You switch battery chemistry |
| `batteryModulesKwh` | `[5,10,15,20,30,40]` | Your catalogue of battery sizes changes |
| `inverterSizesKva` | `[3,5,8,10,15,20,25,30]` | Your inverter range changes |
| `blendedRatePerKwh` | 300 | Power costs in your market move |

### Commercial terms

| Key | Value |
|---|---|
| `vatRate` | 7.5% |
| `priceSpread` | ±10% |
| `quoteValidDays` | 14 |
| `depositRate` | 30% |
| `installmentMonths` | 3 |
| `baselinePerKw` | ₦1,200,000 |

### Rate card

See the pricing table above (`config.solar.ts:56`). To re-price the business, change
these eleven numbers — the engine, the PDF and the website copy all follow.

---

## Getting started

**Prerequisites:** Node.js 18+ (built and verified on Node 25) and npm.

```bash
npm install        # installs ~250 MB of deps into node_modules (gitignored)
npm run dev        # http://localhost:3000  (binds 0.0.0.0, so your phone can reach it)
```

Other scripts:

```bash
npm run lint       # tsc --noEmit  (the only type check)
npm run build      # production build → dist/
npm run preview    # serve the built output locally
```

`npm run dev` binds `0.0.0.0:3000`, so on a phone connected to the same Wi‑Fi open
`http://<your-lan-ip>:3000`.

> **No environment variables are required.** The app is fully client-side. Any
> `GEMINI_API_KEY` you may have read about belonged to the original AI Studio
> scaffolding and is no longer used or needed.

---

## Verification

Before shipping a change:

```bash
npm run lint && npm run build
```

Both must pass clean (the build emits a chunk-size warning only — see roadmap).

**End-to-end check (manual):** open the site → **Request a Quote** → fill both steps →
confirm the result matches the engine, then **Download PDF** and open it.

**End-to-end check (automated, used in development):** a headless Chrome script drove
the real flow over the DevTools Protocol, filled the form, generated a quote and
downloaded the PDF (≈31 KB, valid). It also verified that every `<img>` on the page
loads (`naturalWidth > 0`) — currently **0 broken images**.

---

## Known gaps & roadmap

Honest list of what this is **not** yet:

- **Quote numbers are per-session.** `counter` is a `useRef` starting at 1, so the
  number resets on page reload. A real system of record needs a backend counter.
- **No owner notification.** The customer gets the PDF and can start a WhatsApp thread;
  the quote is not automatically emailed to the business owner. This is the next
  product step (a thin backend that stores the lead and delivers the PDF).
- **No persistence, no CRM, no auth.** Nothing is stored anywhere.
- **Single vertical.** Solar is vertical #1; the pricing/line-item logic still carries
  solar-specific items (see below).
- **Unused dependencies:** `@google/genai`, `express`, `dotenv` are AI Studio
  leftovers. Safe to prune after a reinstall + build check.
- **Bundle size:** the main chunk is ~1.3 MB (mostly pdf libs). Code-splitting the PDF
  generator behind a dynamic import is an easy win.

---

## Adding a new vertical

The thesis is that a new business type is a **new config**, not a rebuild. That is
true for the *sizing constants, option lists, brand and rate card*. Be aware of one
real limitation today:

- `sizeSystem` is generic in shape but its constants are solar-shaped.
- `buildLineItems` **hardcodes solar line items** (panels, inverter, battery, net
  metering…).

So a true second vertical means:

1. Copy `src/quote/config.solar.ts` → `config.<vertical>.ts` and rewrite the rate card,
   constants and option lists.
2. Extract the line-item templates into the config (or a per-vertical builder), so
   `buildLineItems` becomes vertical-agnostic.
3. Extend `QuoteInput` in `src/types.ts` with the new vertical's fields.
4. Swap the import in `RequestQuoteModal.tsx` and `quoteEngine.ts` behind a small
   vertical registry.

The PDF generator needs no change — it renders whatever `QuoteResult` it is given.

---

## Brand & currency notes

- **Auxano Solar** is the reference brand face for the solar vertical (the site
  title, quote header, phone number and net-metering item all use it).
- Currency is **₦ (NGN) throughout the UI**.
- **The PDF uses `NGN `, not `₦`** — jsPDF's built-in Helvetica has no Naira glyph.
  `formatMoney(n, { pdf: true })` handles the switch. If you later embed a Unicode
  font, you can unify them.

---

## Tech stack

React 19 · Vite 6 · TypeScript 5.8 · Tailwind CSS 4 · `motion` (Framer Motion) ·
lucide-react · jsPDF + jspdf-autotable · recharts.

---

*Private and proprietary. Built as the first application of the Instant Quote engine.*
