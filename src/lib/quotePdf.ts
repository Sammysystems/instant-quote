// ---------------------------------------------------------------------------
// Instant Quote — branded PDF generator (client-side).
//
// Produces the customer's quote as a real downloadable PDF the moment they
// request it: cover header, system summary, itemised pricing, financials,
// financing, assumptions and a book-the-survey call to action.
//
// Currency is rendered as "NGN" (not ₦) so the standard PDF fonts always show
// a correct glyph — no missing-character boxes.
// ---------------------------------------------------------------------------

import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { SOLAR_QUOTE_CONFIG as CFG } from "../quote/config.solar";
import { formatMoney } from "./quoteEngine";
import type { QuoteInput, QuoteResult } from "../types";

type RGB = [number, number, number];

const HEX: Record<string, RGB> = {
  dark: [13, 26, 14],
  green: [45, 106, 48],
  gold: [232, 160, 32],
  goldSoft: [253, 244, 224],
  panel: [242, 240, 234],
  ink: [26, 28, 26],
  grey: [107, 122, 110],
  line: [220, 218, 210],
  white: [255, 255, 255],
};

const money = (n: number) => formatMoney(n, { pdf: true });

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export function buildQuotePdf(input: QuoteInput, q: QuoteResult): jsPDF {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const W = 210;
  const M = 14;
  const CW = W - M * 2;

  // --- Header band ---------------------------------------------------------
  doc.setFillColor(...HEX.dark);
  doc.rect(0, 0, W, 34, "F");
  doc.setFillColor(...HEX.gold);
  doc.rect(0, 34, W, 1.4, "F");

  doc.setTextColor(...HEX.gold);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(19);
  doc.text(CFG.brand.toUpperCase(), M, 16);

  doc.setTextColor(...HEX.white);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.text(CFG.tagline, M, 22.5);
  doc.setTextColor(...HEX.grey);
  doc.setFontSize(8);
  doc.text(`${CFG.phone}  ·  ${CFG.website}  ·  Lagos, Nigeria`, M, 27.5);

  doc.setTextColor(...HEX.gold);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("INSTANT QUOTE", W - M, 15, { align: "right" });
  doc.setTextColor(...HEX.white);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.text("Indicative estimate — no waiting", W - M, 20.5, { align: "right" });

  let y = 46;

  // --- Prepared for / quote details ---------------------------------------
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(...HEX.grey);
  doc.text("PREPARED FOR", M, y);
  doc.text("QUOTE DETAILS", M + CW / 2 + 4, y);

  doc.setFontSize(11);
  doc.setTextColor(...HEX.ink);
  doc.text(input.name || "Client", M, y + 6);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(...HEX.grey);
  const clientLines = [input.phone, input.email, `${input.suburb} · ${input.propertyType}`].filter(Boolean);
  clientLines.forEach((line, i) => doc.text(line, M, y + 11.5 + i * 4.6));

  const detailRows: Array<[string, string]> = [
    ["Quote No.", q.quoteNo],
    ["Issued", fmtDate(q.issuedAt)],
    ["Valid until", `${fmtDate(q.validUntil)} (${q.validDays} days)`],
    ["Prepared by", "Auxano Solar Engineering"],
  ];
  const rx = M + CW / 2 + 4;
  detailRows.forEach(([k, v], i) => {
    doc.setTextColor(...HEX.grey);
    doc.text(k, rx, y + 5.5 + i * 5);
    doc.setTextColor(...HEX.ink);
    doc.setFont("helvetica", "bold");
    doc.text(v, W - M, y + 5.5 + i * 5, { align: "right" });
    doc.setFont("helvetica", "normal");
  });

  y += 30;

  // --- System summary KPIs -------------------------------------------------
  y += 6;
  doc.setDrawColor(...HEX.line);
  doc.setLineWidth(0.3);
  doc.line(M, y - 3, W - M, y - 3);

  const kpis: Array<[string, string]> = [
    ["System size", `${q.systemSizeKw} kWp`],
    ["Battery storage", q.batteryKwh > 0 ? `${q.batteryKwh} kWh` : "—"],
    ["Inverter", `${q.inverterKva} kVA`],
    ["Daily generation", `${Math.round(q.dailyKwh)} kWh`],
  ];
  const boxW = (CW - 3 * 4) / 4;
  kpis.forEach(([k, v], i) => {
    const bx = M + i * (boxW + 4);
    doc.setFillColor(...HEX.panel);
    doc.roundedRect(bx, y, boxW, 20, 2, 2, "F");
    doc.setDrawColor(...HEX.gold);
    doc.setLineWidth(0.6);
    doc.line(bx, y, bx, y + 20);
    doc.setTextColor(...HEX.grey);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(6.8);
    doc.text(k.toUpperCase(), bx + 3, y + 6.5);
    doc.setTextColor(...HEX.ink);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text(v, bx + 3, y + 15.5);
  });

  y += 28;

  // --- Itemised pricing ----------------------------------------------------
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(...HEX.ink);
  doc.text("Itemised Pricing", M, y);
  y += 3;

  autoTable(doc, {
    startY: y,
    margin: { left: M, right: M },
    head: [["Item", "Details", "Qty", "Unit Price", "Amount"]],
    body: q.lineItems.map((it) => [
      it.label,
      it.detail,
      `${it.qty} ${it.unit}${it.qty === 1 ? "" : "s"}`,
      money(it.unitPrice),
      money(it.amount),
    ]),
    styles: { font: "helvetica", fontSize: 8, cellPadding: 2.2, textColor: HEX.ink, lineColor: HEX.line, lineWidth: 0.15 },
    headStyles: { fillColor: HEX.dark, textColor: HEX.white, fontSize: 8, fontStyle: "bold" },
    alternateRowStyles: { fillColor: [250, 250, 248] },
    columnStyles: {
      0: { cellWidth: 48, fontStyle: "bold" },
      1: { cellWidth: 52, textColor: HEX.grey, fontSize: 7.3 },
      2: { cellWidth: 20, halign: "center" },
      3: { cellWidth: 30, halign: "right" },
      4: { cellWidth: 32, halign: "right", fontStyle: "bold" },
    },
  });

  y = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 6;

  // --- Totals --------------------------------------------------------------
  const totalsX = M + CW / 2;
  const totalRow = (label: string, value: string, bold = false, accent = false) => {
    doc.setFont("helvetica", bold ? "bold" : "normal");
    doc.setFontSize(bold ? 10 : 8.7);
    doc.setTextColor(...(accent ? HEX.gold : bold ? HEX.ink : HEX.grey));
    doc.text(label, totalsX, y);
    doc.setTextColor(...(accent ? HEX.gold : HEX.ink));
    doc.setFont("helvetica", "bold");
    doc.text(value, W - M, y, { align: "right" });
    y += bold ? 7 : 5.4;
  };

  totalRow("Subtotal", money(q.subtotal));
  totalRow(`VAT (${Math.round(q.vatRate * 1000) / 10}%)`, money(q.vat));
  doc.setDrawColor(...HEX.line);
  doc.line(totalsX, y - 2.5, W - M, y - 2.5);
  y += 1;
  totalRow("Total (indicative)", money(q.total), true);
  doc.setFontSize(7.3);
  doc.setTextColor(...HEX.grey);
  doc.setFont("helvetica", "normal");
  doc.text(`Indicative range: ${money(q.totalLow)} – ${money(q.totalHigh)}`, W - M, y, { align: "right" });
  y += 10;

  // --- Financial returns ---------------------------------------------------
  const finTop = y;
  doc.setFillColor(...HEX.panel);
  doc.roundedRect(M, finTop, CW, 24, 2, 2, "F");
  const finCols: Array<[string, string]> = [
    ["Monthly saving", money(q.monthlySaving)],
    ["Annual saving", money(q.annualSaving)],
    ["Payback", `${q.paybackYears.toFixed(1)} yrs`],
    ["CO₂ avoided", `${q.co2OffsetTonnes.toFixed(1)} t/yr`],
  ];
  const fW = CW / 4;
  finCols.forEach(([k, v], i) => {
    const fx = M + i * fW + 4;
    doc.setTextColor(...HEX.grey);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(6.8);
    doc.text(k.toUpperCase(), fx, finTop + 8);
    doc.setTextColor(...HEX.green);
    doc.setFontSize(13);
    doc.text(v, fx, finTop + 17);
  });

  y = finTop + 24 + 8;

  // --- Financing -----------------------------------------------------------
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(...HEX.ink);
  doc.text("Payment & Financing", M, y);
  y += 6;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.8);
  doc.setTextColor(...HEX.grey);
  doc.text(
    `${Math.round(CFG.depositRate * 100)}% deposit of ${money(q.deposit)} secures your install slot. The balance of ${money(
      q.total - q.deposit
    )} can be spread over ${q.installmentMonths} months at ~${money(q.installmentAmount)}/month.`,
    M,
    y
  );
  y += 12;

  // --- Assumptions ---------------------------------------------------------
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(...HEX.ink);
  doc.text("Assumptions", M, y);
  y += 5.5;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.3);
  doc.setTextColor(...HEX.grey);
  q.assumptions.forEach((a) => {
    const lines = doc.splitTextToSize(`•  ${a}`, CW);
    if (y > 248) return;
    doc.text(lines, M, y);
    y += lines.length * 4.1 + 1.4;
  });

  // --- Call to action ------------------------------------------------------
  y = 262; // pin CTA band near the bottom
  doc.setFillColor(...HEX.dark);
  doc.rect(0, y, W, 24, "F");
  doc.setTextColor(...HEX.gold);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("Book your free site survey for the firm price", M, y + 9);
  doc.setTextColor(...HEX.white);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.3);
  doc.text(`Call or WhatsApp ${CFG.phone}  ·  ${CFG.website}`, M, y + 15.5);
  doc.setTextColor(...HEX.grey);
  doc.setFontSize(7);
  doc.text("This is an indicative estimate, subject to a free on-site survey.", W - M, y + 15.5, { align: "right" });

  // --- Page footer on every page ------------------------------------------
  const pages = doc.getNumberOfPages();
  for (let p = 1; p <= pages; p++) {
    doc.setPage(p);
    doc.setTextColor(...HEX.grey);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.text(`${CFG.brand} — ${q.quoteNo}`, M, 292);
    doc.text(`Page ${p} of ${pages}`, W - M, 292, { align: "right" });
  }

  return doc;
}

export function downloadQuotePdf(input: QuoteInput, q: QuoteResult) {
  const doc = buildQuotePdf(input, q);
  const safeName = (input.name || "quote").replace(/[^a-z0-9]+/gi, "-").toLowerCase();
  doc.save(`${CFG.brand.toLowerCase().replace(/\s+/g, "-")}-quote-${safeName}-${q.quoteNo}.pdf`);
}
