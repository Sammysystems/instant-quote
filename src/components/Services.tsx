import React, { useState } from "react";
import { 
  ArrowRight, 
  Home, 
  BatteryCharging, 
  Cpu, 
  Building2, 
  Check, 
  ArrowUpRight 
} from "lucide-react";
import { motion } from "motion/react";
import { SERVICES, BRAND_NAME } from "../data";
import { TiltContainer } from "@/components/ui/TiltContainer";

const SERVICE_DETAILS = [
  {
    icon: Home,
    badge: "15-Year Panel Warranty",
    features: ["Shade-tolerant cells", "Premium roof brackets", "High-heat optimized"]
  },
  {
    icon: BatteryCharging,
    badge: "Zero-Flicker Backup",
    features: ["Safe LiFePO4 chemistry", "Victron auto-transfer", "10-year lifespan"]
  },
  {
    icon: Cpu,
    badge: "Intelligent Monitoring",
    features: ["Remote app diagnostics", "Balanced 3-Phase load", "Smart EV integration"]
  },
  {
    icon: Building2,
    badge: "Enterprise SLA",
    features: ["Diesel replacement", "Guaranteed peak yield", "Zero operational noise"]
  }
];

export default function Services() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1],
        staggerChildren: 0.12,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <section id="services" className="bg-[#FAF9F5] dark:bg-[#060C07] py-20 sm:py-28 relative border-b border-[#E5E3DC] dark:border-white/5 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          
          {/* Left Column (Sticky Sidebar) */}
          <motion.div className="lg:col-span-5 lg:sticky lg:top-28 h-fit space-y-8" variants={itemVariants}>
            <div>
              <span className="text-xs sm:text-sm font-sans tracking-widest text-[#2D6A30] dark:text-emerald-400 uppercase font-semibold block mb-4">
                WHAT WE BUILD & INSTALL
              </span>
              <h2 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl text-[#1A1C1A] dark:text-[#FAFAF8] tracking-tight leading-[1.1] mb-6">
                Premium solar<br />
                infrastructure,<br />
                zero compromise.
              </h2>
              <p className="text-base sm:text-lg text-[#6B7A6E] dark:text-[#B0ACA4] font-sans leading-relaxed">
                From initial site audit and customized solar engineering to grid connection — we deliver elite, high-efficiency energy systems with our certified in-house technicians.
              </p>
            </div>
            
            {/* Visual reassurance footer */}
            <TiltContainer maxRotate={5} scale={1.02} className="w-full">
              <div className="p-6 bg-[#FFFFFF] dark:bg-[#0E170F] rounded-[16px] border border-[#E5E3DC] dark:border-white/5 shadow-sm transition-colors duration-300">
                <span className="text-xs font-sans font-bold text-[#2D6A30] dark:text-emerald-400 uppercase block mb-2 tracking-wider">
                  STANDARDIZED PREMIUM MATERIALS
                </span>
                <p className="text-sm text-[#6B7A6E] dark:text-[#B0ACA4] font-medium leading-relaxed mb-4">
                  We specify only Tier-1 Jinko or Longi solar modules, paired with elite Victron Energy or SMA smart inverter systems, to guarantee peak output under high-ambient-heat climates.
                </p>
                <div className="flex items-center space-x-3 text-xs text-[#2D6A30] dark:text-emerald-400 font-mono font-semibold">
                  <span>• TILED CELL TECH</span>
                  <span>• PURE SINE WAVE</span>
                </div>
              </div>
            </TiltContainer>
          </motion.div>

          {/* Right Column (Services and Featured Card) */}
          <motion.div className="lg:col-span-7 flex flex-col space-y-12" variants={itemVariants}>
            
            {/* Services Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {SERVICES.map((service, index) => {
                const details = SERVICE_DETAILS[index] || { icon: Home, badge: "Premium", features: [] };
                const IconComponent = details.icon;
                
                return (
                  <div key={service.id} className="h-full">
                    <TiltContainer 
                      maxRotate={5} 
                      scale={1.02}
                      className="h-full"
                    >
                      <div
                        className="bg-white dark:bg-[#0E170F] rounded-[20px] border border-[#E5E3DC] dark:border-white/5 p-6 h-full flex flex-col justify-between group cursor-pointer transition-all duration-300 hover:border-[#2D6A30] dark:hover:border-[#E8A020] hover:shadow-lg hover:shadow-[#2D6A30]/5 relative overflow-hidden"
                        onMouseEnter={() => setHoveredIndex(index)}
                        onMouseLeave={() => setHoveredIndex(null)}
                        onClick={() => scrollToSection("calculator")}
                      >
                        {/* Top Row: Icon and Custom Badge */}
                        <div className="flex items-start justify-between mb-6">
                          <div className="w-12 h-12 rounded-xl bg-[#2D6A30]/5 dark:bg-[#2D6A30]/10 group-hover:bg-[#2D6A30]/10 dark:group-hover:bg-[#2D6A30]/20 flex items-center justify-center transition-all duration-300">
                            <IconComponent className="w-6 h-6 text-[#2D6A30] dark:text-emerald-400 stroke-[1.75]" />
                          </div>
                          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#E8A020] bg-[#E8A020]/10 px-2.5 py-1 rounded-full">
                            {details.badge}
                          </span>
                        </div>

                        {/* Middle Row: Content */}
                        <div className="flex-1 mb-6">
                          <h3 className="font-display text-lg sm:text-xl font-bold text-[#1A1C1A] dark:text-[#FAFAF8] mb-2 group-hover:text-[#2D6A30] dark:group-hover:text-[#E8A020] transition-colors duration-200 flex items-center">
                            {service.title}
                            <ArrowUpRight className="w-4 h-4 ml-1.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300 text-[#2D6A30] dark:text-emerald-400" />
                          </h3>
                          <p className="text-xs sm:text-sm text-[#6B7A6E] dark:text-[#B0ACA4] font-sans leading-relaxed mb-4">
                            {service.description}
                          </p>

                          {/* Bullets */}
                          <ul className="space-y-1.5">
                            {details.features.map((feature, idx) => (
                              <li key={idx} className="flex items-center text-[11px] font-medium text-[#1A1C1A]/80 dark:text-[#FAFAF8]/80">
                                <Check className="w-3 h-3 text-[#2D6A30] dark:text-emerald-400 mr-1.5 shrink-0" />
                                {feature}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Bottom Accent Line */}
                        <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-transparent group-hover:bg-[#2D6A30] dark:group-hover:bg-[#E8A020] transition-colors duration-300" />
                      </div>
                    </TiltContainer>
                  </div>
                );
              })}
            </div>

            {/* Featured Project Image Card */}
            <TiltContainer maxRotate={3} scale={1.01} className="w-full">
              <div 
                className="relative rounded-[20px] overflow-hidden group cursor-pointer shadow-lg border border-[#E5E3DC] dark:border-white/5 aspect-[16/9]"
                onClick={() => scrollToSection("projects")}
              >
                {/* Photo */}
                <img
                  src="https://images.unsplash.com/photo-1613665813446-82a78c468a1d?auto=format&fit=crop&w=1200&q=80"
                  alt="Completed installation in Lekki"
                  className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-[1.03] transition-transform duration-500"
                  loading="lazy"
                />
                
                {/* Dark Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0D1A0E] via-[#0D1A0E]/50 to-transparent" />
                
                {/* Content Overlay */}
                <div className="absolute bottom-0 inset-x-0 p-6 sm:p-8 flex flex-col justify-end text-white">
                  <span className="text-xs font-mono font-bold tracking-wider text-[#E8A020] mb-1.5 uppercase">
                    RECENT FEATURED INSTALL
                  </span>
                  <h4 className="font-display text-lg sm:text-2xl font-bold text-white mb-1">
                    Lekki Residence — 12.4kW + Battery Backup
                  </h4>
                  <p className="text-xs sm:text-sm text-white/80 font-sans mb-4">
                    Estimated annual grid savings • Handled entirely by our in-house crew.
                  </p>
                  <div className="inline-flex items-center text-xs sm:text-sm font-bold text-[#E8A020] group-hover:underline">
                    View full case study
                    <ArrowRight className="w-4 h-4 ml-1.5 transition-transform duration-200 group-hover:translate-x-1" />
                  </div>
                </div>
              </div>
            </TiltContainer>

          </motion.div>

        </motion.div>
      </div>
    </section>
  );
}
