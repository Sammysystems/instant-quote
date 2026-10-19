import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import TrustBar from "./components/TrustBar";
import About from "./components/About";
import Services from "./components/Services";
import SolarCalculator from "./components/Calculator";
import Projects from "./components/Projects";
import Testimonials from "./components/Testimonials";
import FAQ from "./components/FAQ";
import LeadCapture from "./components/LeadCapture";
import Footer from "./components/Footer";
import RequestQuoteModal from "./components/RequestQuoteModal";
import LiveAlertToast from "./components/LiveAlertToast";

declare global {
  interface Window {
    openQuoteModal?: () => void;
    /** Legacy alias kept so existing CTAs (e.g. the savings calculator) keep working. */
    openBookingModal?: () => void;
  }
}

export default function App() {
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("theme") === "dark";
    }
    return false;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  useEffect(() => {
    // Expose global open trigger for modular CTAs
    const open = () => setIsQuoteOpen(true);
    window.openQuoteModal = open;
    window.openBookingModal = open;
    return () => {
      delete window.openQuoteModal;
      delete window.openBookingModal;
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#FAFAF8] dark:bg-[#060C07] text-[#1A1C1A] dark:text-[#FAFAF8] font-sans antialiased selection:bg-[#E8A020] selection:text-[#1A1C1A] transition-colors duration-300">
      {/* 1. Transparent Navbar with scroll effects */}
      <Navbar isDark={isDark} toggleTheme={() => setIsDark(prev => !prev)} />

      {/* 2. Hero Section with visual overlay */}
      <Hero />

      {/* 3. Stat strip validation */}
      <TrustBar />

      {/* 4. Human-centric about us column */}
      <About />

      {/* 5. Editorial services list */}
      <Services />

      {/* 6. Precision savings calculator */}
      <SolarCalculator />

      {/* 7. Asymmetric completed projects gallery */}
      <Projects />

      {/* 8. Google-reviewed client feedback loop */}
      <Testimonials />

      {/* 9. Comprehensive interactive FAQ section */}
      <FAQ />

      {/* 10. Dark-theme, optimized direct lead acquisition form */}
      <LeadCapture />

      {/* 11. Corporate editorial footer */}
      <Footer />

      {/* Instant Quote flow — a real priced PDF in seconds */}
      <RequestQuoteModal isOpen={isQuoteOpen} onClose={() => setIsQuoteOpen(false)} />

      {/* High-conversion social proof live notification */}
      <LiveAlertToast />
    </div>
  );
}
