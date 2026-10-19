import React from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { motion } from "motion/react";
import { CITY_NAME, SYSTEMS_INSTALLED, FOUNDED_YEAR } from "../data";

export default function Hero() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1], // Custom elegant easeOutMated
      },
    },
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-end justify-start bg-[#0D1A0E] overflow-hidden"
    >
      {/* Cinematic Full-Bleed Background Image */}
      <motion.div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&w=2000&q=90')`
        }}
        initial={{ scale: 1.08, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.8, ease: "easeOut" }}
      />

      {/* Complex Editorial Dual Overlay */}
      <div className="absolute inset-0 bg-[#0D1A0E]/65" />
      <div className="absolute inset-0 bg-gradient-to-tr from-[#0D1A0E] via-[#0D1A0E]/70 to-transparent" />

      {/* Core Hero Content aligned bottom-left for premium editorial look */}
      <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16 sm:pb-24 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          <motion.div 
            className="lg:col-span-7"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Label above H1 */}
            <motion.div className="flex items-center space-x-2 mb-6" variants={itemVariants}>
              <span className="text-xs sm:text-sm font-sans tracking-widest text-[#E8A020] uppercase font-semibold">
                • LICENSED & INSURED — SERVING {CITY_NAME.toUpperCase()} SINCE {FOUNDED_YEAR}
              </span>
            </motion.div>

            {/* Main Display Heading */}
            <motion.h1 
              className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl xl:text-7xl text-white tracking-tight leading-[1.15] mb-6"
              variants={itemVariants}
            >
              We Build <br />
              <span className="text-[#E8A020] bg-gradient-to-r from-[#E8A020] to-[#FFC252] bg-clip-text text-transparent block my-2">
                Zero downtime, 24/7 Solar Architectures
              </span>
              for Lagos Homeowners
            </motion.h1>

            {/* Mobile-only Premium Showcase Image - shows under h1 on mobile, hidden on lg */}
            <motion.div 
              className="block lg:hidden relative w-full h-[320px] sm:h-[450px] my-6"
              variants={itemVariants}
            >
              {/* Soft backdrop glow behind image */}
              <div className="absolute inset-0 bg-gradient-to-tr from-[#2D6A30]/30 to-[#E8A020]/20 rounded-[24px] blur-2xl -z-10 opacity-60 pointer-events-none" />

              {/* Direct bold image container */}
              <div className="relative w-full h-full rounded-[24px] overflow-hidden border border-white/10 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.5)] bg-[#0D1A0E]">
                <img 
                  src="https://images.unsplash.com/photo-1624397640148-949b1732bb0a?auto=format&fit=crop&w=800&q=80" 
                  alt="Auxano Premium Solar Install" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                
                {/* Visual blend gradient overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0D1A0E] via-[#0D1A0E]/20 to-transparent" />
                <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-[24px]" />

                {/* Overlaid specs box at the bottom */}
                <div className="absolute bottom-4 inset-x-4 bg-[#0D1A0E]/75 backdrop-blur-md border border-white/10 rounded-[16px] p-4 text-white">
                  <span className="text-[9px] font-mono font-bold text-[#E8A020] uppercase tracking-widest block mb-0.5">
                    ESTATE MICRO-GRID
                  </span>
                  <h4 className="font-display font-bold text-xs sm:text-sm text-white">
                    Lekki Royal Estate Install
                  </h4>
                  <p className="text-[10px] text-[#B0ACA4] font-sans mt-0.5">
                    15.2kWp Generation • 30kWh Smart LiFePO4 Lithium Bank
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Sub-headline */}
            <motion.p 
              className="text-sm sm:text-base lg:text-lg italic text-[#D4D0C8] font-sans font-normal leading-relaxed mb-8 max-w-2xl"
              variants={itemVariants}
            >
              Auxano Solar is Lagos&apos;s leading engineering-first solar team. We custom-design, install, and support premium hybrid solar systems that give discerning families and medical clinics absolute energy independence, 24/7 silent power, and zero-compromise reliability. Get a real, itemised quote in seconds — not a callback in three days.
            </motion.p>

             {/* CTA Buttons */}
            <motion.div 
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-12"
              variants={itemVariants}
            >
              <button
                onClick={() => window.openQuoteModal?.()}
                className="bg-[#E8A020] hover:bg-[#FFC252] text-[#1A1C1A] h-[54px] px-8 rounded-xl font-bold text-base uppercase tracking-wider transition-all duration-300 shadow-lg shadow-[#E8A020]/20 flex items-center justify-center cursor-pointer group transform hover:-translate-y-0.5"
              >
                Get Instant Quote
                <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-200 group-hover:translate-x-1" />
              </button>
              <button
                onClick={() => scrollToSection("calculator")}
                className="border-2 border-white hover:bg-white hover:text-[#0D1A0E] text-white h-[54px] px-8 rounded-xl font-bold text-base uppercase tracking-wider transition-all duration-300 flex items-center justify-center cursor-pointer"
              >
                Calculate Savings ROI
              </button>
            </motion.div>

            {/* Trust micro-row */}
            <motion.div 
              className="flex flex-wrap items-center gap-y-3 gap-x-6 text-xs sm:text-sm text-[#B0ACA4] font-semibold uppercase tracking-wider border-t border-white/10 pt-6"
              variants={itemVariants}
            >
              <span className="flex items-center">
                <CheckCircle2 className="w-4 h-4 mr-2 text-[#E8A020] shrink-0" />
                No Obligation
              </span>
              <span className="hidden sm:inline text-white/20">|</span>
              <span className="flex items-center">
                <CheckCircle2 className="w-4 h-4 mr-2 text-[#E8A020] shrink-0" />
                Instant Quote In Seconds
              </span>
              <span className="hidden sm:inline text-white/20">|</span>
              <span className="flex items-center">
                <CheckCircle2 className="w-4 h-4 mr-2 text-[#E8A020] shrink-0" />
                NABCEP Certified Installers
              </span>
            </motion.div>
          </motion.div>

          {/* Right Column: Premium Showcase Image blending perfectly with editorial styling */}
          <motion.div 
            className="hidden lg:block lg:col-span-5 relative w-full h-[450px] sm:h-[550px] lg:h-[620px] mt-12 lg:mt-12"
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Soft backdrop glow behind image */}
            <div className="absolute inset-0 bg-gradient-to-tr from-[#2D6A30]/30 to-[#E8A020]/20 rounded-[32px] blur-3xl -z-10 opacity-60 pointer-events-none" />

            {/* Direct bold image container */}
            <div className="relative w-full h-full rounded-[32px] overflow-hidden border border-white/10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.6)] bg-[#0D1A0E]">
              <img 
                src="https://images.unsplash.com/photo-1624397640148-949b1732bb0a?auto=format&fit=crop&w=1200&q=80" 
                alt="Auxano Premium Solar Install" 
                className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
              
              {/* Visual blend gradient overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0D1A0E] via-[#0D1A0E]/20 to-transparent" />
              <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-[32px]" />

              {/* Overlaid specs box at the bottom */}
              <div className="absolute bottom-6 inset-x-6 bg-[#0D1A0E]/75 backdrop-blur-md border border-white/10 rounded-[20px] p-5 text-white">
                <span className="text-[10px] font-mono font-bold text-[#E8A020] uppercase tracking-widest block mb-1">
                  ESTATE MICRO-GRID
                </span>
                <h4 className="font-display font-bold text-base text-white">
                  Lekki Royal Estate Install
                </h4>
                <p className="text-xs text-[#B0ACA4] font-sans mt-0.5">
                  15.2kWp Generation • 30kWh Smart LiFePO4 Lithium Bank
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
