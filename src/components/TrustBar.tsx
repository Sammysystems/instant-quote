import React from "react";
import { CITY_NAME, SYSTEMS_INSTALLED } from "../data";

export default function TrustBar() {
  const stats = [
    {
      value: `${SYSTEMS_INSTALLED}+`,
      label: "Systems Installed",
      highlight: true
    },
    {
      value: "8 Years",
      label: `Serving ${CITY_NAME}`,
      highlight: false
    },
    {
      value: "4.9★",
      label: "Google Rating",
      highlight: false
    },
    {
      value: "25-Year",
      label: "Performance Warranty",
      highlight: false
    },
    {
      value: "₦3.16M",
      label: "Avg. Annual Savings",
      highlight: false
    }
  ];

  return (
    <section className="bg-[#F2F0EA] dark:bg-[#0E170F] border-t border-b border-[#E5E3DC] dark:border-white/5 py-8 sm:py-10 overflow-hidden relative z-20 transition-colors duration-300">
      <div className="relative flex w-full flex-col items-center justify-center overflow-hidden">
        {/* Infinite Ticker Marquee */}
        <div className="group flex overflow-hidden p-1 [--gap:3rem] [gap:var(--gap)] flex-row [--duration:30s]">
          <div className="flex shrink-0 justify-around [gap:var(--gap)] animate-marquee flex-row group-hover:[animation-play-state:paused]">
            {[...Array(4)].map((_, setIndex) => (
              stats.map((stat, i) => (
                <div
                  key={`${setIndex}-${i}`}
                  className="flex items-center space-x-4 px-6 min-w-[240px] sm:min-w-[280px]"
                >
                  <span
                    className={`font-display text-2xl sm:text-3xl font-bold tracking-tight shrink-0 transition-colors duration-300 ${
                      stat.highlight
                        ? "text-[#E8A020]"
                        : i === 3
                        ? "text-[#2D6A30] dark:text-emerald-400"
                        : "text-[#1A1C1A] dark:text-[#FAFAF8]"
                    }`}
                  >
                    {stat.value}
                  </span>
                  <span className="text-xs sm:text-sm font-sans font-semibold text-[#6B7A6E] dark:text-[#B0ACA4] uppercase tracking-wider whitespace-nowrap transition-colors duration-300">
                    {stat.label}
                  </span>
                </div>
              ))
            ))}
          </div>
        </div>

        {/* Dynamic Side Fades */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-1/6 bg-gradient-to-r from-[#F2F0EA] dark:from-[#0E170F] to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-1/6 bg-gradient-to-l from-[#F2F0EA] dark:from-[#0E170F] to-transparent" />
      </div>
    </section>
  );
}

