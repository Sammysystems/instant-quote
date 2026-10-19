import React from "react";
import { Check, ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { CITY_NAME, BRAND_NAME, FOUNDER_NAME } from "../data";

function AnimatedUnderline({ children }: { children: React.ReactNode }) {
  return (
    <span className="relative inline-block font-semibold text-[#2D6A30] dark:text-emerald-400 cursor-pointer group">
      {children}
      <motion.span
        className="absolute left-0 bottom-0.5 w-full h-[2.5px] bg-[#E8A020]"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, margin: "-20px" }}
        transition={{ duration: 0.9, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        style={{ originX: 0 }}
      />
    </span>
  );
}

export default function About() {
  const scrollToForm = () => {
    const element = document.getElementById("lead-capture");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const benefits = [
    "In-house licensed engineering — no subcontracted designs",
    "Tier-1 monocrystalline panels with high shade resilience",
    "25-year performance warranty, backed and serviced locally",
    "Dedicated project managers from design through grid hookup"
  ];

  // Motion variants for scroll entrance
  const sectionVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1],
        staggerChildren: 0.15,
      },
    },
  };

  const childVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  return (
    <section id="about" className="bg-[#F2F0EA] dark:bg-[#0E170F] py-20 sm:py-28 relative overflow-hidden transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          
          {/* Left Column (60% equivalent span 7) */}
          <motion.div className="lg:col-span-7" variants={childVariants}>
            {/* Label */}
            <span className="text-xs sm:text-sm font-sans tracking-widest text-[#2D6A30] dark:text-emerald-400 uppercase font-semibold block mb-4">
              WHO WE ARE
            </span>
            
            {/* H2 Heading */}
            <h2 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl text-[#1A1C1A] dark:text-[#FAFAF8] tracking-tight leading-[1.1] mb-6">
              Local expertise. <br className="hidden sm:inline" />
              Not a franchise. <br className="hidden sm:inline" />
              Not an outsourcing center.
            </h2>
            
            {/* Body Copy with custom animated underlines */}
            <p className="text-base sm:text-lg text-[#1A1C1A] dark:text-[#B0ACA4] font-sans font-normal leading-relaxed mb-8 max-w-2xl">
              {BRAND_NAME} was founded in {CITY_NAME} by <AnimatedUnderline>engineers who saw homeowners being oversold</AnimatedUnderline> oversized systems and underserved after payment. Every system we install is <AnimatedUnderline>custom-designed by our own team</AnimatedUnderline>, executed by our full-time crew, and monitored proactively — <AnimatedUnderline>never handed off to third-party subcontractors</AnimatedUnderline>.
            </p>
            
            {/* Benefits List */}
            <ul className="space-y-4 mb-8">
              {benefits.map((benefit, index) => (
                <li key={index} className="flex items-start text-sm sm:text-base text-[#1A1C1A] dark:text-[#FAFAF8] font-normal">
                  <div className="w-5 h-5 rounded-full bg-[#2D6A30]/10 dark:bg-emerald-500/10 flex items-center justify-center mr-3 mt-0.5 shrink-0">
                    <Check className="w-3.5 h-3.5 text-[#2D6A30] dark:text-emerald-400 stroke-[2.5]" />
                  </div>
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>

            {/* Meet the team / Contact link */}
            <button
              onClick={scrollToForm}
              className="inline-flex items-center text-[#2D6A30] dark:text-emerald-400 hover:text-[#1e4620] dark:hover:text-emerald-300 font-semibold uppercase tracking-wider text-sm transition-colors duration-200 group"
            >
              Consult with our design team
              <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-200 group-hover:translate-x-1" />
            </button>
          </motion.div>
          
          {/* Right Column (40% equivalent span 5) - Editorial Overlapping Photo Stack */}
          <motion.div className="lg:col-span-5 relative mt-12 lg:mt-0" variants={childVariants}>
            {/* Outer offset background graphic element */}
            <div className="absolute -inset-4 border-2 border-dashed border-[#2D6A30]/10 dark:border-white/5 rounded-[16px] -z-10" />

            {/* Bottom/Main photo of professional on-site solar engineering */}
            <div className="relative rounded-[16px] overflow-hidden shadow-xl aspect-[4/3] border border-[#E5E3DC] dark:border-white/10">
              <img
                src="https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=800&q=80"
                alt="Auxano Solar rooftop solar installation team"
                className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute bottom-4 left-4 bg-[#0D1A0E]/90 text-white text-[11px] font-mono tracking-widest px-3 py-1.5 rounded uppercase">
                {FOUNDER_NAME}
              </div>
            </div>

            {/* Overlapping top photo with offset */}
            <div className="absolute -top-10 -right-6 sm:-right-10 w-2/3 rounded-[16px] overflow-hidden shadow-2xl aspect-square border-4 border-[#F2F0EA] dark:border-[#0E170F]">
              <img
                src="https://images.unsplash.com/photo-1613665813446-82a78c468a1d?auto=format&fit=crop&w=600&q=80"
                alt="Close-up of premium monocrystalline panels"
                className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
            </div>
          </motion.div>

        </motion.div>
      </div>
    </section>
  );
}
