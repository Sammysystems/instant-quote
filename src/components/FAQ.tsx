import React, { useState } from "react";
import { ChevronDown, HelpCircle, PhoneCall, Mail } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface FAQItem {
  question: string;
  answer: string;
}

const FAQS: FAQItem[] = [
  {
    question: "How does the hybrid system perform during the heavy Lagos rainy season?",
    answer: "Our systems are custom engineered with Tier-1 premium monocrystalline panels featuring high shade-tolerance and low-light performance. Even during overcast weeks in June and July, modern panels generate diffused solar power. When combined with our smart lithium LiFePO4 battery storage, the system intelligently shifts loads to keep your premium appliances running flawlessly 24/7."
  },
  {
    question: "With the current Band-A DISCO tariff hikes, what is my real payback timeline?",
    answer: "With recent hikes raising Band-A tariffs dramatically, the payback timeline for our premium installations has shortened from 7 years down to 4 to 5 years. Since solar displaces not only expensive grid rates but also extremely high-cost petrol/diesel generator fuel, your system acts as a direct hedging asset from day one, yielding full capital amortization rapidly."
  },
  {
    question: "Can this system completely eliminate my dependency on diesel generators?",
    answer: "Yes, absolutely. Our high-capacity systems are custom sized to support heavy starting inductive loads like inverter ACs, deep freezers, and water pumps. By utilizing a zero-flicker automatic transfer switch (ATS) paired with Victron smart inverters, your home transitions instantly between solar, battery, and grid. You will live in complete, absolute silence with zero generator fumes."
  },
  {
    question: "What equipment brands do you spec, and what warranties do they carry?",
    answer: "We specify only world-class, certified hardware. For solar generation, we use Jinko and Longi high-yield modules backed by a 25-year performance warranty. For power inversion and monitoring, we use Victron Energy (Netherlands) and Fronius, backed by an elite 5-to-10-year manufacturer warranty. Our high-density LiFePO4 battery banks are certified for over 6,000 charge cycles, easily translating to a 10-to-15-year operational lifespan."
  },
  {
    question: "What does your 'Proactive Smart Monitoring' service include?",
    answer: "We don't just install and walk away. Every hybrid system comes integrated with smart cloud telemetry. Our engineering headquarters in Lagos receives real-time diagnostic alerts on load balancing, battery health, and peak solar yields. If our system detects any load anomaly or cell degradation, we proactively contact you or dispatch a certified team to resolve it before you even notice."
  },
  {
    question: "How long does the physical installation take, and will it disrupt my home?",
    answer: "A standard residential installation (under 15kW capacity) is completed in just 1 to 2 days of active on-site work. Our certified technicians plan all structural roof mounting beforehand. The final electrical transfer connection to your main distribution board is completed during a pre-arranged, 45-minute power window to ensure minimum disruption to your family's daily activities."
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="faq" className="bg-[#F2F0EA] dark:bg-[#0E170F] py-20 sm:py-28 border-b border-[#E5E3DC] dark:border-white/5 relative overflow-hidden transition-colors duration-300">
      {/* Decorative architectural background accents */}
      <div className="absolute inset-y-0 right-0 w-1/3 bg-[#E5E3DC]/10 dark:bg-white/[0.01] pointer-events-none" />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs sm:text-sm font-sans tracking-widest text-[#2D6A30] dark:text-emerald-400 uppercase font-bold block mb-4">
            ANSWERS FROM OUR ENGINEERS
          </span>
          <h2 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl text-[#1A1C1A] dark:text-[#FAFAF8] tracking-tight leading-[1.1] mb-6">
            Frequently Asked Questions
          </h2>
          <p className="text-base sm:text-lg text-[#6B7A6E] dark:text-[#B0ACA4] font-sans">
            Have questions about solar capability, high-heat ambient performance, or ROI in Nigeria? Here is what you need to know.
          </p>
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-4">
          {FAQS.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div 
                key={index} 
                className={`rounded-2xl border transition-all duration-300 ${
                  isOpen 
                    ? "border-[#2D6A30] dark:border-[#E8A020] bg-white dark:bg-[#060C07] shadow-[0_12px_24px_-8px_rgba(45,106,48,0.06)]" 
                    : "border-[#E5E3DC] dark:border-white/5 bg-white dark:bg-[#060C07]/40 hover:border-[#2D6A30]/40 dark:hover:border-[#E8A020]/40 shadow-sm"
                }`}
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full text-left px-6 py-5 sm:py-6 flex items-center justify-between cursor-pointer group"
                >
                  <div className="flex items-start pr-4 space-x-3 sm:space-x-4">
                    <HelpCircle className={`w-5 h-5 mt-0.5 shrink-0 transition-colors duration-300 ${
                      isOpen ? "text-[#2D6A30] dark:text-[#E8A020]" : "text-[#6B7A6E]/70 dark:text-[#B0ACA4]/60 group-hover:text-[#2D6A30] dark:group-hover:text-[#E8A020]"
                    }`} />
                    <span className="font-display font-bold text-base sm:text-lg text-[#1A1C1A] dark:text-[#FAFAF8] leading-tight">
                      {faq.question}
                    </span>
                  </div>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-[#2D6A30]/5 dark:bg-[#2D6A30]/10 text-[#2D6A30] dark:text-[#E8A020] shrink-0 transition-all duration-300 ${
                    isOpen ? "rotate-180 bg-[#2D6A30] dark:bg-[#E8A020] text-white dark:text-[#1A1C1A]" : "group-hover:bg-[#2D6A30]/10 dark:group-hover:bg-white/5"
                  }`}>
                    <ChevronDown className="w-4 h-4 stroke-[2.5]" />
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 pt-1 sm:px-12 sm:pb-7 text-sm sm:text-base text-[#6B7A6E] dark:text-[#B0ACA4] font-sans leading-relaxed border-t border-[#E5E3DC]/40 dark:border-white/5">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* Dynamic Trust Callout Banner for high conversion */}
        <div className="mt-16 p-6 sm:p-8 bg-[#0D1A0E] rounded-3xl border border-white/5 text-white flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden shadow-xl">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#2D6A30]/25 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-[#E8A020]/10 rounded-full blur-xl pointer-events-none" />
          
          <div className="relative z-10 text-center sm:text-left">
            <h3 className="font-display font-bold text-xl sm:text-2xl text-white mb-2">
              Have a custom configuration in mind?
            </h3>
            <p className="text-xs sm:text-sm text-[#D4D0C8] font-sans">
              Speak directly with a Lagos-based electrical and solar system engineer today.
            </p>
          </div>

          <div className="relative z-10 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto shrink-0">
            <button
              onClick={() => scrollToSection("lead-capture")}
              className="w-full sm:w-auto h-11 px-6 bg-[#E8A020] hover:bg-[#FFC252] text-[#1A1C1A] rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-300 flex items-center justify-center cursor-pointer shadow-md shadow-[#E8A020]/15"
            >
              Request Site Audit
            </button>
            <a
              href="tel:+234800AUXANO" 
              className="w-full sm:w-auto h-11 px-5 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl font-semibold text-xs tracking-wider transition-all duration-300 flex items-center justify-center space-x-2 cursor-pointer"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Call Team</span>
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}
