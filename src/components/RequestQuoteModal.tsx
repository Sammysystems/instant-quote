import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  User,
  Phone,
  Mail,
  MapPin,
  Zap,
  Home,
  BatteryCharging,
  Sun,
  ArrowRight,
  ChevronLeft,
  Loader2,
  CheckCircle2,
  Download,
  MessageCircle,
  RotateCcw,
} from "lucide-react";
import { LAGOS_SUBURBS } from "../data";
import { SOLAR_QUOTE_CONFIG as CFG } from "../quote/config.solar";
import { generateQuote, formatMoney, formatNumber } from "../lib/quoteEngine";
import { downloadQuotePdf } from "../lib/quotePdf";
import type { QuoteInput, QuoteResult } from "../types";

interface RequestQuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const EMPTY: QuoteInput = {
  name: "",
  phone: "",
  email: "",
  suburb: LAGOS_SUBURBS[0],
  propertyType: CFG.propertyTypes[0],
  monthlySpend: 200000,
  priority: CFG.priorities[1],
  backupHours: 8,
  roofType: CFG.roofTypes[0],
  roofSpace: CFG.roofSpaces[1],
};

const LOADER_MESSAGES = [
  "Reading your load profile and sizing the array…",
  "Matching inverter, battery depth-of-discharge and backup hours…",
  "Pricing your system and writing your quote…",
];

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-[11px] font-sans font-bold uppercase tracking-wider text-[#B0ACA4] mb-1.5">
        {label}
      </label>
      {children}
    </div>
  );
}

const inputCls =
  "w-full h-12 pl-10 pr-4 bg-[#132A14]/30 border border-white/10 rounded-xl font-sans font-semibold text-sm outline-none focus:border-[#E8A020] transition-all text-white placeholder:text-white/25";

export default function RequestQuoteModal({ isOpen, onClose }: RequestQuoteModalProps) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<QuoteInput>(EMPTY);
  const [result, setResult] = useState<QuoteResult | null>(null);
  const [loaderIndex, setLoaderIndex] = useState(0);
  const counter = useRef(1);
  const timers = useRef<number[]>([]);

  const set = <K extends keyof QuoteInput>(key: K, value: QuoteInput[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const clearTimers = () => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
  };

  useEffect(() => {
    if (isOpen) {
      clearTimers();
      setStep(1);
      setForm(EMPTY);
      setResult(null);
      setLoaderIndex(0);
    }
    return clearTimers;
  }, [isOpen]);

  // Drive the "generating" sequence from the click (not a state updater), so
  // React StrictMode's double-invocation can't fire it — or the quote — twice.
  const startGeneration = () => {
    clearTimers();
    setLoaderIndex(0);
    setStep(3);
    LOADER_MESSAGES.forEach((_, i) => {
      timers.current.push(window.setTimeout(() => setLoaderIndex(i), i * 1300));
    });
    timers.current.push(
      window.setTimeout(() => {
        setResult(generateQuote(form, counter.current++));
        setStep(4);
      }, LOADER_MESSAGES.length * 1300 + 500)
    );
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const step1Valid = form.name.trim() && form.phone.trim() && form.suburb;
  const step2Valid = form.monthlySpend >= 20000;

  const handleNext = () => {
    if (step === 1 && !step1Valid) return;
    if (step === 2) {
      if (!step2Valid) return;
      startGeneration();
      return;
    }
    setStep((s) => s + 1);
  };

  const whatsappHref = result
    ? `https://wa.me/${CFG.phoneIntl.replace("+", "")}?text=${encodeURIComponent(
        `Hi ${CFG.brand}, I just got instant quote ${result.quoteNo} (${result.systemSizeKw}kWp). I'd like to book the free site survey.`
      )}`
    : "#";

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/85 backdrop-blur-sm"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 350 }}
          className="relative w-full max-w-2xl bg-[#0D1A0E] border border-white/10 rounded-[28px] sm:rounded-[32px] overflow-hidden shadow-[0_24px_80px_rgba(0,0,0,0.8)] text-white z-10 flex flex-col max-h-[92vh]"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-5 sm:p-7 border-b border-white/10 shrink-0">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-[#E8A020]/10 flex items-center justify-center">
                <Zap className="w-5 h-5 text-[#E8A020]" />
              </div>
              <div>
                <h3 className="font-display font-bold text-base sm:text-lg text-white">
                  {step === 4 ? "Your Instant Quote" : "Get Your Instant Quote"}
                </h3>
                <p className="text-[10px] sm:text-[11px] text-[#B0ACA4] font-sans font-medium uppercase tracking-widest">
                  {step === 4 ? result?.quoteNo : "A real price in seconds — not days"}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-white/5 text-[#B0ACA4] hover:text-white transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Progress */}
          {step <= 2 && (
            <div className="w-full h-1 bg-white/5 shrink-0 flex">
              <div className="h-full bg-[#E8A020] transition-all duration-300" style={{ width: `${(step / 2) * 100}%` }} />
            </div>
          )}

          {/* Body */}
          <div className="p-5 sm:p-7 overflow-y-auto flex-1">
            {/* STEP 1 — who & where */}
            {step === 1 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                <div>
                  <h4 className="font-display font-bold text-lg text-white">Where should we send it?</h4>
                  <p className="text-xs text-[#B0ACA4] font-sans mt-1">
                    We reply in seconds. Tell us who you are and we'll size your system immediately.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                  <Field label="Full Name *">
                    <div className="relative">
                      <User className="absolute left-3.5 top-3.5 w-4 h-4 text-[#B0ACA4]" />
                      <input
                        type="text"
                        value={form.name}
                        onChange={(e) => set("name", e.target.value)}
                        placeholder="Alhaji Kola George"
                        className={inputCls}
                      />
                    </div>
                  </Field>

                  <Field label="WhatsApp Number *">
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-3.5 w-4 h-4 text-[#B0ACA4]" />
                      <input
                        type="tel"
                        value={form.phone}
                        onChange={(e) => set("phone", e.target.value)}
                        placeholder="e.g. 0816 394 9428"
                        className={inputCls}
                      />
                    </div>
                  </Field>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Email Address">
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-[#B0ACA4]" />
                      <input
                        type="email"
                        value={form.email}
                        onChange={(e) => set("email", e.target.value)}
                        placeholder="kola@example.com"
                        className={inputCls}
                      />
                    </div>
                  </Field>

                  <Field label="Lagos Location / Estate *">
                    <div className="relative">
                      <MapPin className="absolute left-3.5 top-3.5 w-4 h-4 text-[#B0ACA4]" />
                      <select
                        value={form.suburb}
                        onChange={(e) => set("suburb", e.target.value)}
                        className={`${inputCls} cursor-pointer appearance-none`}
                      >
                        {LAGOS_SUBURBS.map((s) => (
                          <option key={s} value={s} className="bg-[#0D1A0E] text-white">
                            {s}
                          </option>
                        ))}
                      </select>
                    </div>
                  </Field>
                </div>

                <Field label="Property Type">
                  <div className="grid grid-cols-3 gap-2">
                    {CFG.propertyTypes.map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => set("propertyType", p)}
                        className={`h-11 rounded-xl border font-sans font-semibold text-xs transition-all cursor-pointer flex items-center justify-center ${
                          form.propertyType === p
                            ? "bg-[#E8A020] text-[#1A1C1A] border-[#E8A020]"
                            : "bg-[#132A14]/35 border-white/10 hover:border-[#E8A020] text-white"
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </Field>
              </motion.div>
            )}

            {/* STEP 2 — what to power */}
            {step === 2 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                <div>
                  <h4 className="font-display font-bold text-lg text-white">What do you want to power?</h4>
                  <p className="text-xs text-[#B0ACA4] font-sans mt-1">
                    Two questions and your quote is ready. No callback, no waiting.
                  </p>
                </div>

                <Field label="Average Monthly Electricity & Fuel Spend (₦)">
                  <div className="relative">
                    <span className="absolute left-3.5 top-3.5 text-[#E8A020] font-bold text-sm">₦</span>
                    <input
                      type="number"
                      min={20000}
                      step={5000}
                      value={form.monthlySpend}
                      onChange={(e) => set("monthlySpend", Number(e.target.value))}
                      className={inputCls}
                    />
                  </div>
                  <p className="text-[11px] text-[#B0ACA4] mt-1.5 font-sans">
                    {formatMoney(form.monthlySpend)} / month — this sets your system size.
                  </p>
                </Field>

                <Field label="Primary Goal">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {CFG.priorities.map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => set("priority", p)}
                        className={`h-11 rounded-xl border font-sans font-semibold text-xs transition-all cursor-pointer ${
                          form.priority === p
                            ? "bg-[#E8A020] text-[#1A1C1A] border-[#E8A020]"
                            : "bg-[#132A14]/35 border-white/10 hover:border-[#E8A020] text-white"
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </Field>

                <Field label="How long should backup last?">
                  <div className="grid grid-cols-2 gap-2">
                    {CFG.backupOptions.map((b) => (
                      <button
                        key={b.hours}
                        type="button"
                        onClick={() => set("backupHours", b.hours)}
                        className={`h-11 rounded-xl border font-sans font-semibold text-xs transition-all cursor-pointer ${
                          form.backupHours === b.hours
                            ? "bg-[#E8A020] text-[#1A1C1A] border-[#E8A020]"
                            : "bg-[#132A14]/35 border-white/10 hover:border-[#E8A020] text-white"
                        }`}
                      >
                        {b.label}
                      </button>
                    ))}
                  </div>
                </Field>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Roof Type">
                    <select
                      value={form.roofType}
                      onChange={(e) => set("roofType", e.target.value)}
                      className="w-full h-12 px-4 bg-[#132A14]/40 border border-white/10 rounded-xl font-sans font-semibold text-sm outline-none focus:border-[#E8A020] cursor-pointer text-white appearance-none"
                    >
                      {CFG.roofTypes.map((r) => (
                        <option key={r} value={r} className="bg-[#0D1A0E] text-white">
                          {r}
                        </option>
                      ))}
                    </select>
                  </Field>

                  <Field label="Roof Space Available">
                    <select
                      value={form.roofSpace}
                      onChange={(e) => set("roofSpace", e.target.value)}
                      className="w-full h-12 px-4 bg-[#132A14]/40 border border-white/10 rounded-xl font-sans font-semibold text-sm outline-none focus:border-[#E8A020] cursor-pointer text-white appearance-none"
                    >
                      {CFG.roofSpaces.map((r) => (
                        <option key={r} value={r} className="bg-[#0D1A0E] text-white">
                          {r}
                        </option>
                      ))}
                    </select>
                  </Field>
                </div>
              </motion.div>
            )}

            {/* STEP 3 — generating */}
            {step === 3 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-14 space-y-6 text-center"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-[#E8A020]/20 rounded-full blur-xl animate-pulse" />
                  <Loader2 className="w-16 h-16 text-[#E8A020] animate-spin relative z-10" />
                </div>
                <div className="space-y-2">
                  <h4 className="font-display font-bold text-lg text-white">Generating your instant quote</h4>
                  <div className="h-6 overflow-hidden">
                    <motion.p key={loaderIndex} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-sm text-[#B0ACA4] font-mono">
                      {LOADER_MESSAGES[loaderIndex]}
                    </motion.p>
                  </div>
                </div>
                <div className="w-full max-w-xs bg-white/5 rounded-full h-1.5 overflow-hidden">
                  <div className="h-full bg-[#E8A020] transition-all duration-300" style={{ width: `${((loaderIndex + 1) / LOADER_MESSAGES.length) * 100}%` }} />
                </div>
              </motion.div>
            )}

            {/* STEP 4 — result */}
            {step === 4 && result && (
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
                <div className="flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/25 rounded-2xl p-4">
                  <CheckCircle2 className="w-9 h-9 text-emerald-400 shrink-0" />
                  <div>
                    <p className="font-display font-bold text-white text-sm sm:text-base">
                      Your quote {result.quoteNo} is ready, {form.name.split(" ")[0]}.
                    </p>
                    <p className="text-xs text-[#B0ACA4] font-sans">
                      Indicative estimate — download it now, or book the free survey for the firm price.
                    </p>
                  </div>
                </div>

                {/* System summary */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {[
                    ["System", `${result.systemSizeKw} kWp`],
                    ["Battery", result.batteryKwh > 0 ? `${result.batteryKwh} kWh` : "—"],
                    ["Inverter", `${result.inverterKva} kVA`],
                    ["Daily output", `${Math.round(result.dailyKwh)} kWh`],
                  ].map(([k, v]) => (
                    <div key={k} className="bg-[#132A14]/40 border border-white/10 rounded-xl p-3">
                      <span className="text-[9px] font-mono font-bold text-[#B0ACA4] uppercase tracking-widest block mb-1">{k}</span>
                      <span className="font-display font-bold text-white text-base">{v}</span>
                    </div>
                  ))}
                </div>

                {/* Price + savings */}
                <div className="bg-[#132A14]/40 border border-[#E8A020]/25 rounded-2xl p-5">
                  <div className="flex items-end justify-between flex-wrap gap-3">
                    <div>
                      <span className="text-[10px] font-mono font-bold text-[#E8A020] uppercase tracking-widest block mb-1">
                        Indicative total (incl. VAT)
                      </span>
                      <span className="font-display font-extrabold text-white text-3xl">{formatMoney(result.total)}</span>
                      <span className="block text-xs text-[#B0ACA4] font-sans mt-1">
                        Range {formatMoney(result.totalLow)} – {formatMoney(result.totalHigh)}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-mono font-bold text-[#B0ACA4] uppercase tracking-widest block mb-1">
                        Est. savings
                      </span>
                      <span className="font-display font-bold text-emerald-400 text-xl">{formatMoney(result.monthlySaving)}/mo</span>
                      <span className="block text-xs text-[#B0ACA4] font-sans mt-1">
                        Payback ~{result.paybackYears.toFixed(1)} yrs
                      </span>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-white/10 grid grid-cols-3 gap-3 text-center">
                    <div>
                      <span className="block text-[10px] font-mono text-[#B0ACA4] uppercase">Deposit</span>
                      <span className="font-sans font-bold text-white text-sm">{formatMoney(result.deposit)}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] font-mono text-[#B0ACA4] uppercase">Or</span>
                      <span className="font-sans font-bold text-white text-sm">{result.installmentMonths} months</span>
                    </div>
                    <div>
                      <span className="block text-[10px] font-mono text-[#B0ACA4] uppercase">Monthly</span>
                      <span className="font-sans font-bold text-white text-sm">{formatMoney(result.installmentAmount)}</span>
                    </div>
                  </div>
                </div>

                {/* Line items (compact) */}
                <div className="border border-white/10 rounded-2xl overflow-hidden">
                  <div className="max-h-44 overflow-y-auto divide-y divide-white/5">
                    {result.lineItems.map((it) => (
                      <div key={it.label} className="flex items-center justify-between px-4 py-2.5 text-xs">
                        <span className="text-white/85 font-sans truncate pr-3">{it.label}</span>
                        <span className="font-mono text-[#B0ACA4] shrink-0">{formatMoney(it.amount)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-between px-4 py-3 bg-white/5 border-t border-white/10">
                    <span className="text-xs font-bold text-white uppercase tracking-wider">Subtotal + VAT</span>
                    <span className="font-mono font-bold text-[#E8A020] text-sm">{formatMoney(result.total)}</span>
                  </div>
                </div>

                <p className="text-[11px] text-[#B0ACA4] font-sans leading-relaxed">
                  This is an indicative estimate for {form.suburb} · {form.propertyType}, sized for {form.backupHours}h backup and{" "}
                  {formatNumber(result.systemSizeKw)} kWp. Final firm price follows your free site survey.
                </p>
              </motion.div>
            )}
          </div>

          {/* Footer controls */}
          {step <= 2 && (
            <div className="p-5 sm:p-7 border-t border-white/10 shrink-0 flex items-center justify-between bg-[#0B150C]">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={() => setStep((s) => s - 1)}
                  className="px-5 h-11 bg-white/5 hover:bg-white/10 text-white rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer flex items-center"
                >
                  <ChevronLeft className="w-4 h-4 mr-1" /> Back
                </button>
              ) : (
                <div />
              )}
              <button
                type="button"
                onClick={handleNext}
                disabled={(step === 1 && !step1Valid) || (step === 2 && !step2Valid)}
                className="px-6 h-11 bg-[#E8A020] hover:bg-[#FFC252] disabled:opacity-40 disabled:pointer-events-none text-[#1A1C1A] rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer flex items-center"
              >
                {step === 2 ? "Generate my quote" : "Continue"}
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </button>
            </div>
          )}

          {step === 4 && result && (
            <div className="p-5 sm:p-7 border-t border-white/10 shrink-0 bg-[#0B150C] grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => downloadQuotePdf(form, result)}
                className="h-12 bg-[#E8A020] hover:bg-[#FFC252] text-[#1A1C1A] rounded-xl font-bold text-sm transition-all cursor-pointer flex items-center justify-center"
              >
                <Download className="w-4 h-4 mr-2" /> Download PDF quote
              </button>
              <a
                href={whatsappHref}
                target="_blank"
                rel="noreferrer"
                className="h-12 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl font-bold text-sm transition-all cursor-pointer flex items-center justify-center"
              >
                <MessageCircle className="w-4 h-4 mr-2 text-[#E8A020]" /> Book free survey
              </a>
              <button
                type="button"
                onClick={() => {
                  setStep(1);
                  setResult(null);
                }}
                className="sm:col-span-2 h-10 text-[#B0ACA4] hover:text-white text-xs font-semibold transition-all cursor-pointer flex items-center justify-center"
              >
                <RotateCcw className="w-3.5 h-3.5 mr-1.5" /> Start over
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
