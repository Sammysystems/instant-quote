import React from "react";
import { Mail, Phone, MapPin, Zap } from "lucide-react";
import { BRAND_NAME, CITY_NAME, FOUNDED_YEAR } from "../data";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer className="bg-[#060C07] text-[#B0ACA4] pt-16 pb-12 border-t border-white/5 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-12 border-b border-white/5">
          
          {/* Column 1: Brand Info (5 cols) */}
          <div className="md:col-span-5">
            <div className="flex items-center cursor-pointer mb-6" onClick={() => scrollToSection("hero")}>
              <div className="w-7 h-7 rounded bg-[#E8A020] mr-2 flex items-center justify-center font-display font-extrabold text-[#1A1C1A] text-sm">
                A
              </div>
              <span className="font-display font-bold text-lg text-white tracking-tight">
                {BRAND_NAME}
              </span>
            </div>
            
            <p className="text-sm font-sans leading-relaxed mb-6 max-w-sm text-[#9CA8A2]">
              Lagos&apos;s licensed residential solar installation specialists. We engineer and build high-efficiency monocrystalline rooftop solar and smart battery system in Nigeria, designed specifically to offset grid tariffs and silent diesel operations.
            </p>

            {/* License details */}
            <div className="text-xs font-mono text-[#6B7A6E]">
              <span>Licensed Electrical Contractor • NIMET Certified Design</span>
              <br />
              <span>COREN Registry No: EN-7201-LG</span>
            </div>
          </div>

          {/* Column 2: Quick Links (3 cols) */}
          <div className="md:col-span-3">
            <h4 className="font-display font-bold text-sm text-white uppercase tracking-wider mb-6">
              Navigation Shortcuts
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <button
                  onClick={() => scrollToSection("hero")}
                  className="hover:text-white transition-colors duration-150 cursor-pointer"
                >
                  Back to Top
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("about")}
                  className="hover:text-white transition-colors duration-150 cursor-pointer"
                >
                  Who We Are
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("services")}
                  className="hover:text-white transition-colors duration-150 cursor-pointer"
                >
                  What We Install
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("calculator")}
                  className="hover:text-white transition-colors duration-150 cursor-pointer"
                >
                  Savings Calculator
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("projects")}
                  className="hover:text-white transition-colors duration-150 cursor-pointer"
                >
                  Featured Projects
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact details (4 cols) */}
          <div className="md:col-span-4">
            <h4 className="font-display font-bold text-sm text-white uppercase tracking-wider mb-6">
              Our Headquarters
            </h4>
            
            <ul className="space-y-4 text-sm text-[#9CA8A2]">
              <li className="flex items-start">
                <MapPin className="w-5 h-5 text-[#E8A020] mr-3 mt-0.5 shrink-0" />
                <span>
                  Auxano Solar Head Office,<br />
                  Amuwo Odofin Estate,<br />
                  Lagos, Nigeria
                </span>
              </li>
              <li className="flex items-center">
                <Phone className="w-5 h-5 text-[#E8A020] mr-3 shrink-0" />
                <a href="tel:+2348163949428" className="hover:text-white transition-colors">
                  0816 394 9428
                </a>
              </li>
              <li className="flex items-center">
                <Mail className="w-5 h-5 text-[#E8A020] mr-3 shrink-0" />
                <a href="mailto:contact@auxanosolar.com" className="hover:text-white transition-colors">
                  contact@auxanosolar.com
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#6B7A6E]">
          <p>© {currentYear} {BRAND_NAME}. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 sm:mt-0">
            <span className="hover:text-white transition-colors cursor-pointer">Privacy Policy</span>
            <span>•</span>
            <span className="hover:text-white transition-colors cursor-pointer">Terms of Service</span>
            <span>•</span>
            <span className="hover:text-white transition-colors cursor-pointer">Warranty Guide</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
