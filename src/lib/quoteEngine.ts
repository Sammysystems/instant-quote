// ---------------------------------------------------------------------------
// Instant Quote engine — sizes a solar system and prices it from the rate card.
//
// Deterministic and rules-based: the same inputs always produce the same quote.
// No API keys, no server. This is the "Q1" indicative estimate that is handed
// to the customer the moment they request a quote.
// ---------------------------------------------------------------------------

import { SOLAR_QUOTE_CONFIG as CFG } from "../quote/config.solar";
import type { QuoteInput, QuoteLineItem, QuoteResult } from "../types";

const roundTo = (n: number, step: number) => Math.round(n / step) * step;

const snapUp = (n: number, sizes: readonly number[]) => {
  for (const s of sizes) if (n <= s) return s;
  return sizes[sizes.length - 1];
};

// --- Formatting -------------------------------------------------------------

export function formatMoney(n: number, opts: { pdf?: boolean } = {}): string {
  const prefix = opts.pdf ? CFG.currencyPrefixPdf : CFG.currency;
  return `${prefix}${Math.round(n).toLocaleString("en-NG")}`;
}

export function formatNumber(n: number, digits = 1): string {
  return n.toLocaleString("en-NG", { minimumFractionDigits: digits, maximumFractionDigits: digits });
}

// --- Sizing -----------------------------------------------------------------

export interface Sizing {
  dailyKwh: number;
  systemSizeKw: number;
  panelCount: number;
  batteryKwh: number;
  inverterKva: number;
}

export function sizeSystem(input: QuoteInput): Sizing {
  const dailyKwh = input.monthlySpend / CFG.blendedRatePerKwh / 30;

  const systemSizeKw = Math.max(1.5, dailyKwh / (CFG.peakSunHours * CFG.systemLoss));
  const panelCount = Math.ceil((systemSizeKw * 1000) / CFG.panelWatts);

  const backupFraction =
    input.priority === CFG.priorities[0] ? 0.5 : input.priority === CFG.priorities[1] ? 0.7 : 0.7;
  const backupLoadKwh = dailyKwh * (input.backupHours / 24) * backupFraction;
  const rawBattery = backupLoadKwh / CFG.batteryDod;
  const batteryKwh = input.backupHours <= 0 ? 0 : snapUp(Math.max(5, rawBattery), CFG.batteryModulesKwh);

  const inverterKva = snapUp(systemSizeKw * 1.15, CFG.inverterSizesKva);

  return {
    dailyKwh,
    systemSizeKw: Math.round(systemSizeKw * 10) / 10,
    panelCount,
    batteryKwh,
    inverterKva,
  };
}

// --- Pricing ----------------------------------------------------------------

function buildLineItems(input: QuoteInput, s: Sizing): QuoteLineItem[] {
  const r = CFG.rates;
  const kw = s.systemSizeKw;
  const items: QuoteLineItem[] = [];

  items.push({
    label: "Tier-1 Monocrystalline PV Modules",
    detail: `${CFG.panelWatts}W panels · ${s.panelCount} units · ${formatNumber(kw)} kWp array`,
    qty: s.panelCount,
    unit: "panel",
    unitPrice: (r.panelPerKw * kw) / s.panelCount,
    amount: r.panelPerKw * kw,
  });

  items.push({
    label: "Hybrid Inverter",
    detail: `${s.inverterKva} kVA smart hybrid inverter with MPPT + monitoring gateway`,
    qty: s.inverterKva,
    unit: "kVA",
    unitPrice: r.inverterPerKva,
    amount: r.inverterPerKva * s.inverterKva,
  });

  if (s.batteryKwh > 0) {
    items.push({
      label: "Lithium (LiFePO4) Battery Bank",
      detail: `${s.batteryKwh} kWh usable storage · ${input.backupHours}h backup`,
      qty: s.batteryKwh,
      unit: "kWh",
      unitPrice: r.batteryPerKwh,
      amount: r.batteryPerKwh * s.batteryKwh,
    });
  }

  items.push({
    label: "Mounting Structure & Rails",
    detail: `${input.roofType} roof · galvanised rails, hooks and clamps`,
    qty: kw,
    unit: "kW",
    unitPrice: r.mountingPerKw,
    amount: r.mountingPerKw * kw,
  });

  items.push({
    label: "Balance of System",
    detail: "DC/AC cabling, isolators, combiner, earthing & surge protection",
    qty: kw,
    unit: "kW",
    unitPrice: r.bosPerKw,
    amount: r.bosPerKw * kw,
  });

  items.push({
    label: "Installation & Electrical Works",
    detail: "Certified installation, commissioning and system testing",
    qty: kw,
    unit: "kW",
    unitPrice: r.installPerKw,
    amount: r.installPerKw * kw,
  });

  items.push({
    label: "Engineering, Design & Project Management",
    detail: "Load study, system design, site coordination and QA",
    qty: kw,
    unit: "kW",
    unitPrice: r.projectMgmtPerKw,
    amount: r.projectMgmtPerKw * kw,
  });

  items.push({
    label: "Roof & Structural Works",
    detail: "Roof penetrations, flashing and weatherproofing",
    qty: kw,
    unit: "kW",
    unitPrice: r.roofWorksPerKw,
    amount: r.roofWorksPerKw * kw,
  });

  items.push({
    label: "System Design & Permit Documentation",
    detail: "Single-line diagram, bill of materials and compliance pack",
    qty: 1,
    unit: "lot",
    unitPrice: r.engineeringFlat,
    amount: r.engineeringFlat,
  });

  items.push({
    label: "Eko DisCo Net-Metering Application",
    detail: "Interconnection filing and liaison handled on your behalf",
    qty: 1,
    unit: "lot",
    unitPrice: r.netMeteringFlat,
    amount: r.netMeteringFlat,
  });

  items.push({
    label: "Monitoring & App Setup",
    detail: "Live generation & consumption monitoring app, configured",
    qty: 1,
    unit: "lot",
    unitPrice: r.monitoringFlat,
    amount: r.monitoringFlat,
  });

  return items.map((i) => ({ ...i, unitPrice: Math.round(i.unitPrice), amount: Math.round(i.amount) }));
}

// --- Quote ------------------------------------------------------------------

function makeQuoteNo(n: number, d: Date): string {
  return `AXS-${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}-${String(n).padStart(4, "0")}`;
}

export function generateQuote(input: QuoteInput, counter = 1): QuoteResult {
  const s = sizeSystem(input);
  const lineItems = buildLineItems(input, s);

  const subtotal = lineItems.reduce((sum, i) => sum + i.amount, 0);
  const vat = subtotal * CFG.vatRate;
  const total = roundTo(subtotal + vat, 1000);
  const totalLow = roundTo(total * (1 - CFG.priceSpread), 1000);
  const totalHigh = roundTo(total * (1 + CFG.priceSpread), 1000);

  const monthlyProductionKwh = s.systemSizeKw * CFG.peakSunHours * CFG.systemLoss * 30;

  const coverage = s.batteryKwh > 0 ? 0.85 : 0.7;
  const monthlySaving = roundTo(input.monthlySpend * coverage, 1000);
  const annualSaving = monthlySaving * 12;
  const paybackYears = annualSaving > 0 ? total / annualSaving : 0;
  const co2OffsetTonnes = s.systemSizeKw * CFG.co2PerKwYear;

  const deposit = roundTo(total * CFG.depositRate, 1000);
  const installmentAmount = roundTo((total - deposit) / CFG.installmentMonths, 1000);

  const issuedAt = new Date();
  const validUntil = new Date(issuedAt.getTime() + CFG.quoteValidDays * 24 * 60 * 60 * 1000);

  const assumptions = [
    `Indicative estimate based on a blended power cost of ₦${CFG.blendedRatePerKwh}/kWh and ${CFG.peakSunHours} peak-sun-hours/day in Lagos.`,
    "System is sized from your monthly spend and chosen backup hours; final size is confirmed at the free site survey.",
    `Pricing includes ${Math.round(CFG.vatRate * 1000) / 10}% VAT and is valid for ${CFG.quoteValidDays} days.`,
    `A ${Math.round(CFG.depositRate * 100)}% deposit secures your install slot; the balance can be spread over ${CFG.installmentMonths} months.`,
    "Final firm price is issued after roof, electrical and shade assessment (the survey).",
  ];

  return {
    quoteNo: makeQuoteNo(counter, issuedAt),
    issuedAt: issuedAt.toISOString(),
    validUntil: validUntil.toISOString(),
    validDays: CFG.quoteValidDays,
    systemSizeKw: s.systemSizeKw,
    panelCount: s.panelCount,
    inverterKva: s.inverterKva,
    batteryKwh: s.batteryKwh,
    dailyKwh: s.dailyKwh,
    monthlyProductionKwh,
    lineItems,
    subtotal: Math.round(subtotal),
    vatRate: CFG.vatRate,
    vat: Math.round(vat),
    total,
    totalLow,
    totalHigh,
    monthlySaving,
    annualSaving,
    paybackYears,
    co2OffsetTonnes,
    deposit,
    installmentMonths: CFG.installmentMonths,
    installmentAmount,
    assumptions,
  };
}
