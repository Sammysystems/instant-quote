export interface ServiceItem {
  id: number;
  number: string;
  title: string;
  description: string;
}

export interface ProjectItem {
  id: number;
  suburb: string;
  sizeKw: number;
  hasBattery: boolean;
  batteryCapacityKwh?: number;
  annualSavings: string;
  installDuration: string;
  quote?: string;
  clientName?: string;
  imageUrl: string;
  isFeatured?: boolean;
}

export interface ReviewItem {
  id: number;
  rating: number;
  text: string;
  author: string;
  role: string;
  suburb: string;
}

export interface CalculatorInputs {
  monthlyBill: string;
  roofType: string;
  homeSize: string;
  primaryInterest: string;
}

export interface CalculatorResults {
  annualSavings: number;
  paybackYears: number;
  systemSizeKw: number;
  co2OffsetTonnes: number;
  lifetimeSavings: number;
}

export interface QuoteInput {
  name: string;
  phone: string;
  email: string;
  suburb: string;
  propertyType: string;
  monthlySpend: number;
  priority: string;
  backupHours: number;
  roofType: string;
  roofSpace: string;
}

export interface QuoteLineItem {
  label: string;
  detail: string;
  qty: number;
  unit: string;
  unitPrice: number;
  amount: number;
}

export interface QuoteResult {
  quoteNo: string;
  issuedAt: string;
  validUntil: string;
  validDays: number;
  systemSizeKw: number;
  panelCount: number;
  inverterKva: number;
  batteryKwh: number;
  dailyKwh: number;
  monthlyProductionKwh: number;
  lineItems: QuoteLineItem[];
  subtotal: number;
  vatRate: number;
  vat: number;
  total: number;
  totalLow: number;
  totalHigh: number;
  monthlySaving: number;
  annualSaving: number;
  paybackYears: number;
  co2OffsetTonnes: number;
  deposit: number;
  installmentMonths: number;
  installmentAmount: number;
  assumptions: string[];
}
