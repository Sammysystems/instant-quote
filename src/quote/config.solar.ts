// ---------------------------------------------------------------------------
// Instant Quote — vertical config (Solar).
//
// Every vertical-specific value for the instant-quote engine lives here so the
// next vertical becomes a new config file, not a rebuild. Solar is vertical #1.
// ---------------------------------------------------------------------------

export interface SolarRateCard {
  panelPerKw: number;
  inverterPerKva: number;
  batteryPerKwh: number;
  mountingPerKw: number;
  bosPerKw: number;
  installPerKw: number;
  projectMgmtPerKw: number;
  roofWorksPerKw: number;
  engineeringFlat: number;
  netMeteringFlat: number;
  monitoringFlat: number;
}

export const SOLAR_QUOTE_CONFIG = {
  // --- Brand & identity ----------------------------------------------------
  brand: "Auxano Solar",
  tagline: "Lagos's Licensed Solar Installation Specialists",
  phone: "0816 394 9428",
  phoneIntl: "+2348163949428",
  website: "auxanosolar.com",
  currency: "₦",
  currencyPrefixPdf: "NGN ",
  brandDark: "#0D1A0E",
  brandGreen: "#2D6A30",
  brandGold: "#E8A020",

  // --- Technical model -----------------------------------------------------
  peakSunHours: 4.5, // Lagos daily peak-sun-hours
  systemLoss: 0.75, // wiring, heat, dust, inverter & orientation derate
  panelWatts: 550, // Tier-1 monocrystalline module
  batteryDod: 0.9, // usable depth of discharge (LiFePO4)
  batteryModulesKwh: [5, 10, 15, 20, 30, 40],
  inverterSizesKva: [3, 5, 8, 10, 15, 20, 25, 30],
  blendedRatePerKwh: 300, // ₦/kWh blended grid + generator fuel cost
  co2PerKwYear: 1.6, // tonnes CO₂ avoided per installed kW per year

  // --- Commercial terms ----------------------------------------------------
  vatRate: 0.075, // Nigeria VAT
  priceSpread: 0.1, // ± band shown on an indicative quote
  quoteValidDays: 14, // "indicative" validity window
  depositRate: 0.3, // booking deposit
  installmentMonths: 3, // balance spread over N months
  baselinePerKw: 1_200_000, // headline "from" price used in copy

  // --- Rate card (₦) — derived from the ₦1.2M/kW installed baseline --------
  // A no-battery hybrid system lands at ~₦1.2M per kW installed.
  // Battery storage is priced separately per kWh.
  rates: {
    panelPerKw: 200_000,
    inverterPerKva: 150_000,
    batteryPerKwh: 320_000,
    mountingPerKw: 70_000,
    bosPerKw: 85_000,
    installPerKw: 120_000,
    projectMgmtPerKw: 65_000,
    roofWorksPerKw: 55_000,
    engineeringFlat: 100_000,
    netMeteringFlat: 80_000,
    monitoringFlat: 40_000,
  } as SolarRateCard,

  // --- Form option lists ---------------------------------------------------
  propertyTypes: ["Home", "Duplex", "Office", "Clinic", "Shop / Retail", "Estate"],
  priorities: ["Cut bills", "Backup power", "Off-grid independence"],
  backupOptions: [
    { label: "Essentials only (4h)", hours: 4 },
    { label: "Half-day backup (8h)", hours: 8 },
    { label: "Full day (12h)", hours: 12 },
    { label: "24/7 autonomy", hours: 24 },
  ],
  roofTypes: ["Pitched / tiled", "Flat / concrete", "Aluminium / stone-coated", "Not sure"],
  roofSpaces: ["Under 30 m²", "30–60 m²", "60–100 m²", "Over 100 m²", "Not sure"],
} as const;

export type SolarQuoteConfig = typeof SOLAR_QUOTE_CONFIG;
