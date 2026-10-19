import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ShieldCheck, Cpu, ArrowRight } from "lucide-react";

interface HandoverRecord {
  id: string;
  location: string;
  capacity: string;
  battery: string;
  engineer: string;
  status: string;
}

const verifiedHandovers: HandoverRecord[] = [
  { id: "AUX-2026-091", location: "Ikoyi Phase 1", capacity: "15.2 kWp Array", battery: "30.0 kWh LFP Storage", engineer: "Engr. O. Williams", status: "STABILIZED" },
  { id: "AUX-2026-088", location: "Lekki Peninsula II", capacity: "9.3 kWp Hybrid", battery: "15.0 kWh LFP Storage", engineer: "Engr. T. Balogun", status: "STABILIZED" },
  { id: "AUX-2026-082", location: "Ikeja GRA", capacity: "25.2 kWp Medical Grid", battery: "45.0 kWh LFP Storage", engineer: "Engr. O. Williams", status: "STABILIZED" },
  { id: "AUX-2026-079", location: "Magodo Phase II", capacity: "6.6 kWp Residential", battery: "10.0 kWh LFP Storage", engineer: "Engr. S. Adeleke", status: "STABILIZED" },
  { id: "AUX-2026-075", location: "Victoria Island", capacity: "30.4 kWp Dual Inverter", battery: "60.0 kWh LFP Storage", engineer: "Engr. T. Balogun", status: "STABILIZED" }
];

export default function LiveAlertToast() {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Initial delay before showing the first handover
    const firstShowTimeout = setTimeout(() => {
      setVisible(true);
    }, 6000);

    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % verifiedHandovers.length);
        setVisible(true);
      }, 1000); // 1s elegant transition
    }, 20000); // cycle slowly and unobtrusively

    return () => {
      clearTimeout(firstShowTimeout);
      clearInterval(interval);
    };
  }, []);

  const active = verifiedHandovers[index];

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 40, scale: 0.98 }}
          transition={{ type: "spring", damping: 30, stiffness: 300 }}
          className="fixed bottom-6 right-6 z-50 max-w-[350px] bg-[#060C07]/95 backdrop-blur-md border border-white/10 rounded-2xl p-4 shadow-[0_16px_50px_rgba(0,0,0,0.6)] flex flex-col space-y-2.5"
        >
          {/* Header Row */}
          <div className="flex items-center justify-between border-b border-white/5 pb-2">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-[#E8A020]" />
              <span className="text-[10px] text-white font-mono font-bold tracking-widest uppercase">
                Grid Handover Registry
              </span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400"></span>
              </span>
              <span className="text-[9px] font-mono font-bold text-emerald-400">
                {active.status}
              </span>
            </div>
          </div>

          {/* Core Spec details */}
          <div className="space-y-1">
            <div className="flex items-baseline justify-between">
              <span className="text-[11px] font-mono text-[#6B7A6E] font-semibold">{active.id}</span>
              <span className="text-[11px] font-mono text-white/50">{active.location}</span>
            </div>
            <p className="text-xs font-sans text-[#FAFAF8] font-bold">
              {active.capacity} / {active.battery}
            </p>
          </div>

          {/* Footer Metadata */}
          <div className="flex items-center justify-between pt-1 text-[9px] text-[#6B7A6E] font-mono">
            <span>Lead: {active.engineer}</span>
            <span className="text-[#E8A020]/80">Commissioned & Active</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

