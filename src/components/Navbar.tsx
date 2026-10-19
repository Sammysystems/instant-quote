import React, { useState, useEffect } from "react";
import { Menu, X, Phone, Sun, Moon } from "lucide-react";
import { BRAND_NAME } from "../data";

interface NavbarProps {
  isDark: boolean;
  toggleTheme: () => void;
}

export default function Navbar({ isDark, toggleTheme }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <nav
        className={`fixed left-0 right-0 z-50 transition-all duration-500 flex justify-center ${
          isScrolled
            ? "top-0 bg-[#0D1A0E]/95 backdrop-blur-md border-b border-white/5 py-4 shadow-xl"
            : "top-4 sm:top-6 bg-transparent px-4 sm:px-6 lg:px-8"
        }`}
      >
        <div
          className={`w-full max-w-7xl transition-all duration-500 ${
            isScrolled
              ? "px-4 sm:px-6 lg:px-8"
              : "px-6 sm:px-8 py-3 bg-white/5 backdrop-blur-md border border-white/10 rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.25)]"
          }`}
        >
          <div className="flex items-center justify-between">
            {/* Logo / Brand Name */}
            <div 
              className="flex items-center cursor-pointer" 
              onClick={() => scrollToSection("hero")}
            >
              <div className="w-8 h-8 rounded bg-[#E8A020] mr-2.5 flex items-center justify-center font-display font-extrabold text-[#1A1C1A] text-lg">
                A
              </div>
              <span className="font-display font-bold text-lg sm:text-xl tracking-tight text-white">
                {BRAND_NAME}
              </span>
            </div>

            {/* Desktop Navigation Links - Simplified to 5 items */}
            <div className="hidden md:flex items-center space-x-8">
              <button
                onClick={() => scrollToSection("hero")}
                className="text-white/80 hover:text-[#E8A020] font-sans font-semibold text-[15px] transition-colors cursor-pointer"
              >
                Home
              </button>
              <button
                onClick={() => scrollToSection("about")}
                className="text-white/80 hover:text-[#E8A020] font-sans font-semibold text-[15px] transition-colors cursor-pointer"
              >
                About
              </button>
              <button
                onClick={() => scrollToSection("services")}
                className="text-white/80 hover:text-[#E8A020] font-sans font-semibold text-[15px] transition-colors cursor-pointer"
              >
                Services
              </button>
              <button
                onClick={() => scrollToSection("projects")}
                className="text-white/80 hover:text-[#E8A020] font-sans font-semibold text-[15px] transition-colors cursor-pointer"
              >
                Projects
              </button>
              <button
                onClick={() => scrollToSection("lead-capture")}
                className="text-white/80 hover:text-[#E8A020] font-sans font-semibold text-[15px] transition-colors cursor-pointer"
              >
                Contact
              </button>
            </div>

            {/* Right Action Bar (Phone + Quote button) */}
            <div className="hidden lg:flex items-center space-x-6">
              <button
                onClick={toggleTheme}
                className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-white hover:text-[#E8A020] hover:bg-white/10 transition-all duration-300 cursor-pointer flex items-center justify-center shadow-sm"
                aria-label="Toggle visual theme"
              >
                {isDark ? <Sun className="w-4 h-4 text-[#E8A020]" /> : <Moon className="w-4 h-4" />}
              </button>
              <a
                href="tel:+2348163949428"
                className="flex items-center text-white/90 hover:text-[#E8A020] transition-colors text-sm font-semibold"
              >
                <Phone className="w-4 h-4 mr-2 text-[#E8A020] stroke-[2]" />
                0816 394 9428
              </a>
              <button
                onClick={() => window.openQuoteModal?.()}
                className="bg-[#E8A020] hover:bg-[#FFC252] text-[#1A1C1A] px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 transform hover:-translate-y-0.5 shadow-md shadow-[#E8A020]/15 cursor-pointer"
              >
                Request a Quote
              </button>
            </div>

            {/* Mobile Actions with theme toggle */}
            <div className="md:hidden flex items-center space-x-2">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-xl bg-white/5 border border-white/10 text-white hover:text-[#E8A020] transition-all duration-300 cursor-pointer flex items-center justify-center"
                aria-label="Toggle visual theme"
              >
                {isDark ? <Sun className="w-4.5 h-4.5 text-[#E8A020]" /> : <Moon className="w-4.5 h-4.5" />}
              </button>
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-white p-2 focus:outline-none cursor-pointer"
                aria-label="Toggle navigation menu"
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6 stroke-[2]" />
                ) : (
                  <Menu className="w-6 h-6 stroke-[2]" />
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Drawer Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-[#0D1A0E] flex flex-col pt-28 px-6 space-y-6 transition-transform duration-300 ease-in-out md:hidden ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <button
          onClick={() => scrollToSection("hero")}
          className="text-white/90 text-left text-xl font-display font-semibold pb-3 border-b border-white/5 cursor-pointer"
        >
          Home
        </button>
        <button
          onClick={() => scrollToSection("about")}
          className="text-white/90 text-left text-xl font-display font-semibold pb-3 border-b border-white/5 cursor-pointer"
        >
          About
        </button>
        <button
          onClick={() => scrollToSection("services")}
          className="text-white/90 text-left text-xl font-display font-semibold pb-3 border-b border-white/5 cursor-pointer"
        >
          Services
        </button>
        <button
          onClick={() => scrollToSection("projects")}
          className="text-white/90 text-left text-xl font-display font-semibold pb-3 border-b border-white/5 cursor-pointer"
        >
          Projects
        </button>
        <button
          onClick={() => scrollToSection("lead-capture")}
          className="text-white/90 text-left text-xl font-display font-semibold pb-3 border-b border-white/5 cursor-pointer"
        >
          Contact
        </button>

        <div className="pt-6 flex flex-col space-y-4">
          <a
            href="tel:+2348163949428"
            className="flex items-center text-white/90 text-lg font-semibold py-2"
          >
            <Phone className="w-5 h-5 mr-3 text-[#E8A020] stroke-[2]" />
            0816 394 9428
          </a>
          <button
            onClick={() => {
              setIsMobileMenuOpen(false);
              window.openQuoteModal?.();
            }}
            className="w-full bg-[#E8A020] text-[#1A1C1A] text-center py-4 rounded-xl font-bold text-lg shadow-lg cursor-pointer"
          >
            Request a Quote
          </button>
        </div>
      </div>
    </>
  );
}
