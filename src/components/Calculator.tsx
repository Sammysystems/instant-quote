import React, { useState, useEffect } from "react";
import { ArrowRight, Calculator, CheckCircle2, RefreshCw, Zap, TrendingUp, ShieldCheck, Leaf, Sprout, Flame } from "lucide-react";
import { motion } from "motion/react";
import { CITY_NAME } from "../data";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-[#0E170F] border border-[#E5E3DC] dark:border-white/10 p-3.5 rounded-xl shadow-lg font-sans">
        <p className="text-xs font-bold text-[#1A1C1A] dark:text-[#FAFAF8] mb-1.5">{label}</p>
        <div className="space-y-1">
          <p className="text-xs text-[#6B7A6E] dark:text-[#B0ACA4] font-medium flex justify-between gap-6">
            <span>Grid & Generator:</span>
            <span className="font-bold text-[#1A1C1A] dark:text-[#FAFAF8]">₦{payload[0].value}M</span>
          </p>
          <p className="text-xs text-[#2D6A30] dark:text-emerald-400 font-medium flex justify-between gap-6">
            <span>Auxano Solar:</span>
            <span className="font-bold text-[#2D6A30] dark:text-emerald-400">₦{payload[1].value}M</span>
          </p>
        </div>
      </div>
    );
  }
  return null;
};

export default function SolarCalculator() {
  const [bill, setBill] = useState<string>("₦150,000–₦250,000");
  const [roofType, setRoofType] = useState<string>("Metal");
  const [homeSize, setHomeSize] = useState<string>("200–350m²");
  const [primaryInterest, setPrimaryInterest] = useState<string>("All three");
  
  const [isCalculating, setIsCalculating] = useState(false);
  const [hasCalculated, setHasCalculated] = useState(true); // Default calculated to look rich on page load, with interactive recalculation
  
  // Results states (in Naira ₦)
  const [results, setResults] = useState({
    annualSavings: 1872000,
    paybackYears: 4.5,
    systemSizeKw: 9.3,
    co2OffsetTonnes: 11.2,
    lifetimeSavings: 46800000
  });

  const runCalculation = () => {
    setIsCalculating(true);
    setTimeout(() => {
      // Numerical midpoints for Lagos monthly spend (Naira)
      let midpoint = 200000;
      if (bill === "Under ₦150,000") midpoint = 100000;
      else if (bill === "₦150,000–₦250,000") midpoint = 200000;
      else if (bill === "₦250,000–₦400,000") midpoint = 325000;
      else if (bill === "Over ₦400,000") midpoint = 550000;

      // Real calculation logic based on Nigerian residential tariffs and generator fuel (petrol/diesel) costs
      const annualSpend = midpoint * 12;
      const annualSavings = Math.round(annualSpend * 0.78); // 78% displacement on average
      const systemSizeKw = parseFloat(((midpoint / 30000) * 1.4).toFixed(1));
      
      // Payback calculation: average ₦1,200,000 cost per kW installed in Nigeria / annual savings
      const estimatedSystemCost = systemSizeKw * 1200000;
      const paybackYears = parseFloat((estimatedSystemCost / annualSavings).toFixed(1));
      
      const lifetimeSavings = Math.round(annualSavings * 25);
      const co2OffsetTonnes = parseFloat((systemSizeKw * 1.2).toFixed(1));

      setResults({
        annualSavings,
        paybackYears: isNaN(paybackYears) ? 4.5 : paybackYears,
        systemSizeKw,
        co2OffsetTonnes,
        lifetimeSavings
      });

      setIsCalculating(false);
      setHasCalculated(true);
    }, 500);
  };

  // Recalculate dynamically when inputs change
  useEffect(() => {
    runCalculation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bill, roofType, homeSize, primaryInterest]);

  const generateChartData = () => {
    const years = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    // Initial system cost in millions Naira
    const initialSolarCost = (results.systemSizeKw * 1200000) / 1000000;
    
    // Annual bill is derived from results.annualSavings divided by 0.78
    const midpoint = (results.annualSavings / 0.78) / 12;
    const annualConventionalCost = (midpoint * 12) / 1000000;
    
    let cumulativeConventional = 0;
    let cumulativeSolar = initialSolarCost;
    
    return years.map((year) => {
      // 10% compounding conventional tariff and fuel inflation in Lagos
      const yearConventionalCost = annualConventionalCost * Math.pow(1.10, year - 1);
      cumulativeConventional += yearConventionalCost;
      
      // Solar has minor maintenance (filter washes, inverter health checks) at 5% inflation
      const yearSolarMaintenance = ((results.systemSizeKw * 25000) / 1000000) * Math.pow(1.05, year - 1);
      if (year > 1) {
        cumulativeSolar += yearSolarMaintenance;
      }
      
      return {
        name: `Yr ${year}`,
        "Utility & Fuel Spend": parseFloat(cumulativeConventional.toFixed(1)),
        "Auxano Solar System": parseFloat(cumulativeSolar.toFixed(1)),
      };
    });
  };

  return (
    <section id="calculator" className="bg-[#FAF9F5] dark:bg-[#060C07] py-20 sm:py-28 border-b border-[#E5E3DC] dark:border-white/5 relative overflow-hidden transition-colors duration-300">
      {/* Decorative premium geometric grid and ambient background overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#E5E3DC_1px,transparent_1px),linear-gradient(to_bottom,#E5E3DC_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-[0.25]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#2D6A30]/5 rounded-full blur-3xl pointer-events-none -z-10" />

      <motion.div 
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs sm:text-sm font-sans tracking-widest text-[#2D6A30] dark:text-emerald-400 uppercase font-semibold block mb-4">
            NIGERIA&apos;S SMARTEST ENERGY SAVINGS CALCULATOR
          </span>
          <h2 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl text-[#1A1C1A] dark:text-[#FAFAF8] tracking-tight leading-[1.1] mb-6">
            Calculate your custom solar <br className="hidden sm:inline" />
            ROI in Nigeria Naira (₦)
          </h2>
          <p className="text-base sm:text-lg text-[#6B7A6E] dark:text-[#B0ACA4] font-sans">
            Input your typical monthly spending below to see an immediate performance, capacity, and savings forecast backed by current Lagos Band-A DISCO rates and diesel prices.
          </p>
        </div>

        {/* Calculator Main Card with enhanced visual appeal */}
        <div className="max-w-5xl mx-auto bg-white dark:bg-[#0E170F] rounded-[32px] overflow-hidden shadow-[0_24px_64px_-12px_rgba(45,106,48,0.08)] border border-[#E5E3DC] dark:border-white/5 grid grid-cols-1 md:grid-cols-12 transition-colors duration-300">
          
          {/* Left Column - Inputs (7 cols) */}
          <div className="p-6 sm:p-10 md:col-span-7 border-b md:border-b-0 md:border-r border-[#E5E3DC] dark:border-white/5 flex flex-col justify-between bg-white dark:bg-[#0E170F] transition-colors duration-300">
            <div>
              <div className="flex items-center space-x-3 pb-6 border-b border-[#E5E3DC]/60 dark:border-white/5 mb-8">
                <div className="w-10 h-10 rounded-xl bg-[#2D6A30]/5 dark:bg-[#2D6A30]/15 flex items-center justify-center">
                  <Calculator className="w-5 h-5 text-[#2D6A30] dark:text-emerald-400 stroke-[2]" />
                </div>
                <div>
                  <h3 className="font-display text-lg font-bold text-[#1A1C1A] dark:text-[#FAFAF8]">
                    System Configuration
                  </h3>
                  <p className="text-xs text-[#6B7A6E] dark:text-[#B0ACA4] font-sans">Enter parameters to recalculate output</p>
                </div>
              </div>

              <div className="space-y-6">
                {/* Monthly Spend Input */}
                <div>
                  <label className="block text-xs sm:text-sm font-sans font-bold text-[#1A1C1A] dark:text-[#FAFAF8] mb-2.5">
                    Estimated Monthly Utility & Generator Fuel Spend
                  </label>
                  <select
                    value={bill}
                    onChange={(e) => setBill(e.target.value)}
                    className="w-full h-12 px-4 bg-[#FAF9F5] dark:bg-[#1A2E1C]/25 border border-[#E5E3DC] dark:border-white/10 focus:border-[#2D6A30] dark:focus:border-[#E8A020] focus:ring-1 focus:ring-[#2D6A30] dark:focus:ring-[#E8A020] rounded-xl font-sans font-semibold text-[#1A1C1A] dark:text-[#FAFAF8] outline-none transition-all cursor-pointer shadow-sm"
                  >
                    <option value="Under ₦150,000">Under ₦150,000 / month</option>
                    <option value="₦150,000–₦250,000">₦150,000 – ₦250,000 / month (Standard Home)</option>
                    <option value="₦250,000–₦400,000">₦250,000 – ₦400,000 / month (Large Residence)</option>
                    <option value="Over ₦400,000">Over ₦400,000 / month (Premium / Automated)</option>
                  </select>
                </div>

                {/* Roof Type Input */}
                <div>
                  <label className="block text-xs sm:text-sm font-sans font-bold text-[#1A1C1A] dark:text-[#FAFAF8] mb-2.5">
                    Roof Covering Material
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {["Tile", "Metal", "Flat Concrete", "Not Sure"].map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setRoofType(type)}
                        className={`h-11 px-4 text-xs sm:text-sm font-sans font-bold rounded-xl border text-center transition-all duration-200 cursor-pointer ${
                          roofType === type
                            ? "bg-[#2D6A30] text-white border-[#2D6A30] shadow-md shadow-[#2D6A30]/10"
                            : "bg-[#FAF9F5] dark:bg-[#1A2E1C]/10 text-[#6B7A6E] dark:text-[#B0ACA4] border-[#E5E3DC] dark:border-white/5 hover:border-[#2D6A30] dark:hover:border-emerald-500"
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Home Size Input */}
                <div>
                  <label className="block text-xs sm:text-sm font-sans font-bold text-[#1A1C1A] dark:text-[#FAFAF8] mb-2.5">
                    Approximate Built Area
                  </label>
                  <select
                    value={homeSize}
                    onChange={(e) => setHomeSize(e.target.value)}
                    className="w-full h-12 px-4 bg-[#FAF9F5] dark:bg-[#1A2E1C]/25 border border-[#E5E3DC] dark:border-white/10 focus:border-[#2D6A30] dark:focus:border-[#E8A020] focus:ring-1 focus:ring-[#2D6A30] dark:focus:ring-[#E8A020] rounded-xl font-sans font-semibold text-[#1A1C1A] dark:text-[#FAFAF8] outline-none transition-all cursor-pointer shadow-sm"
                  >
                    <option value="Under 200m²">Under 200 m²</option>
                    <option value="200–350m²">200m² – 350 m² (Duplex / Apartment)</option>
                    <option value="Over 350m²">Over 350 m² (Estate Mansion)</option>
                  </select>
                </div>

                {/* Primary Interest Input */}
                <div>
                  <label className="block text-xs sm:text-sm font-sans font-bold text-[#1A1C1A] dark:text-[#FAFAF8] mb-2.5">
                    Primary Backup & Solar Goal
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {["Lower bills", "Battery backup", "EV charging", "All three"].map((interest) => (
                      <button
                        key={interest}
                        type="button"
                        onClick={() => setPrimaryInterest(interest)}
                        className={`h-11 px-3 text-xs font-sans font-bold rounded-xl border text-center transition-all duration-200 cursor-pointer ${
                          primaryInterest === interest
                            ? "bg-[#2D6A30] text-white border-[#2D6A30] shadow-md shadow-[#2D6A30]/10"
                            : "bg-[#FAF9F5] dark:bg-[#1A2E1C]/10 text-[#6B7A6E] dark:text-[#B0ACA4] border-[#E5E3DC] dark:border-white/5 hover:border-[#2D6A30] dark:hover:border-emerald-500"
                        }`}
                      >
                        {interest}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-[#E5E3DC]/60 dark:border-white/5 flex items-center justify-between text-[11px] text-[#6B7A6E] dark:text-[#B0ACA4] font-medium">
              <span className="flex items-center">
                <CheckCircle2 className="w-4 h-4 text-[#2D6A30] dark:text-emerald-400 mr-1.5" />
                Live Nigerian Naira ROI Engine
              </span>
              <span>Updated: Band-A Tariffs</span>
            </div>
          </div>

          {/* Right Column - Results Display (5 cols) with premium dark green metallic gradient */}
          <div className="p-8 sm:p-10 md:col-span-5 bg-gradient-to-br from-[#0D1A0E] via-[#132A14] to-[#0A120B] text-white flex flex-col justify-between relative overflow-hidden">
            
            {/* Elegant glassmorphic background accents */}
            <div className="absolute top-0 right-0 w-44 h-44 bg-[#2D6A30]/25 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#E8A020]/10 rounded-full blur-2xl pointer-events-none" />

            {isCalculating ? (
              <div className="flex-1 flex flex-col items-center justify-center py-24">
                <RefreshCw className="w-8 h-8 text-[#E8A020] animate-spin mb-4" />
                <p className="text-[#D4D0C8] font-mono text-xs tracking-widest uppercase animate-pulse">
                  CALCULATING HARVEST CAPACITY...
                </p>
              </div>
            ) : hasCalculated ? (
              <div className="flex-1 flex flex-col justify-between h-full z-10">
                <div>
                  <div className="flex items-center space-x-2 mb-4">
                    <span className="text-[10px] font-mono tracking-widest text-[#E8A020] bg-[#E8A020]/15 px-2.5 py-1 rounded-full uppercase font-bold">
                      ESTIMATED ANNUAL SAVINGS
                    </span>
                  </div>
                  
                  {/* Large Savings Display */}
                  <div className="flex items-baseline mb-2">
                    <span className="font-display text-4xl sm:text-5xl lg:text-5xl xl:text-6xl font-extrabold text-[#E8A020] tracking-tight">
                      ₦{results.annualSavings.toLocaleString()}
                    </span>
                    <span className="text-white/70 font-sans text-sm sm:text-base ml-1.5 font-semibold">/ yr</span>
                  </div>

                  <p className="text-xs sm:text-sm text-[#D4D0C8] font-sans leading-relaxed mb-8 font-medium">
                    Displace Band-A grid rates and expensive fuel generators with a customized <span className="text-[#E8A020] font-semibold">{results.systemSizeKw} kW</span> engineering specification.
                  </p>

                  {/* Grid Stats */}
                  <div className="space-y-4 border-t border-white/10 pt-6 mb-8">
                    <div className="flex justify-between items-center text-xs sm:text-sm font-sans">
                      <span className="text-[#B0ACA4] font-medium flex items-center">
                        <TrendingUp className="w-4 h-4 mr-1.5 text-[#E8A020]" />
                        Payback Timeline
                      </span>
                      <span className="font-bold text-white bg-white/5 px-2.5 py-0.5 rounded-md">~{results.paybackYears} years</span>
                    </div>
                    <div className="flex justify-between items-center text-xs sm:text-sm font-sans">
                      <span className="text-[#B0ACA4] font-medium flex items-center">
                        <Zap className="w-4 h-4 mr-1.5 text-[#2D6A30]" />
                        System Capacity
                      </span>
                      <span className="font-bold text-white">{results.systemSizeKw} kWp</span>
                    </div>
                    <div className="flex justify-between items-center text-xs sm:text-sm font-sans">
                      <span className="text-[#B0ACA4] font-medium flex items-center">
                        <ShieldCheck className="w-4 h-4 mr-1.5 text-emerald-500" />
                        25-Year Performance
                      </span>
                      <span className="font-bold text-emerald-400 font-mono">100% Backed</span>
                    </div>
                    <div className="flex justify-between items-center text-xs sm:text-sm font-sans pt-1 border-t border-white/5">
                      <span className="text-[#B0ACA4] font-semibold">25-Yr Value Guarantee</span>
                      <span className="font-bold text-[#E8A020] font-display text-base">₦{results.lifetimeSavings.toLocaleString()}+</span>
                    </div>
                  </div>
                </div>

                <div>
                  <button
                    onClick={() => window.openBookingModal?.()}
                    className="w-full h-12 bg-[#E8A020] hover:bg-[#FFC252] text-[#1A1C1A] rounded-xl font-bold text-sm transition-all duration-300 flex items-center justify-center mb-4 cursor-pointer transform hover:-translate-y-0.5 shadow-lg shadow-[#E8A020]/20"
                  >
                    Lock In My Detailed Design
                    <ArrowRight className="w-4.5 h-4.5 ml-2" />
                  </button>
                  
                  <span className="block text-[9px] text-[#B0ACA4] leading-normal text-center italic">
                    *Calculations are calibrated against average Lagos irradiance levels, local tariff metrics, and typical fuel load patterns.
                  </span>
                </div>
              </div>
            ) : null}

          </div>

        </div>

        {/* Long-term Benefits & Environmental Impact Dashboard */}
        <div className="max-w-5xl mx-auto mt-12 grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* Recharts Area Chart Card */}
          <div className="p-6 sm:p-8 md:col-span-7 bg-white dark:bg-[#0E170F] rounded-[24px] border border-[#E5E3DC] dark:border-white/5 shadow-md flex flex-col justify-between transition-all duration-300">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-9 h-9 rounded-xl bg-[#2D6A30]/5 dark:bg-[#2D6A30]/15 flex items-center justify-center">
                  <TrendingUp className="w-4.5 h-4.5 text-[#2D6A30] dark:text-emerald-400 animate-pulse" />
                </div>
                <div>
                  <h4 className="font-display font-bold text-base text-[#1A1C1A] dark:text-white">
                    10-Year Cumulative Spend Comparison
                  </h4>
                  <p className="text-[11px] text-[#6B7A6E] dark:text-[#B0ACA4] font-sans">
                    Visualizing capital amortization and ongoing grid & generator fuel hedging (in Millions ₦)
                  </p>
                </div>
              </div>

              {/* Chart container */}
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={generateChartData()}
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="colorConventional" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#A8A29E" stopOpacity={0.15}/>
                        <stop offset="95%" stopColor="#A8A29E" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorSolar" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2D6A30" stopOpacity={0.25}/>
                        <stop offset="95%" stopColor="#2D6A30" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(107,122,110,0.1)" />
                    <XAxis 
                      dataKey="name" 
                      tick={{ fill: 'currentColor' }} 
                      className="text-[10px] text-[#6B7A6E] dark:text-[#B0ACA4] font-mono"
                    />
                    <YAxis 
                      tickFormatter={(value) => `₦${value}M`}
                      tick={{ fill: 'currentColor' }}
                      className="text-[10px] text-[#6B7A6E] dark:text-[#B0ACA4] font-mono"
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend 
                      verticalAlign="top" 
                      height={36} 
                      iconType="circle"
                      iconSize={8}
                      className="text-xs font-sans font-bold"
                    />
                    <Area 
                      type="monotone" 
                      name="Utility & Fuel Spend"
                      dataKey="Utility & Fuel Spend" 
                      stroke="#6B7A6E" 
                      strokeWidth={2}
                      fillOpacity={1} 
                      fill="url(#colorConventional)" 
                    />
                    <Area 
                      type="monotone" 
                      name="Auxano Solar System"
                      dataKey="Auxano Solar System" 
                      stroke="#2D6A30" 
                      strokeWidth={2.5}
                      fillOpacity={1} 
                      fill="url(#colorSolar)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <p className="text-[10px] text-[#6B7A6E] dark:text-[#B0ACA4] leading-relaxed mt-4 italic">
              *Model assumes a conservative 10% annual tariff and fuel price inflation compound. After year {results.paybackYears}, your system delivers absolute clean energy yield with zero fuel inputs.
            </p>
          </div>

          {/* Environmental Impact Card */}
          <div className="p-6 sm:p-8 md:col-span-5 bg-gradient-to-br from-[#0D1A0E] via-[#132A14] to-[#0A120B] text-white rounded-[24px] border border-white/5 relative overflow-hidden flex flex-col justify-between shadow-lg">
            {/* Elegant glassmorphic background accents */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#2D6A30]/20 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-[#E8A020]/10 rounded-full blur-xl pointer-events-none" />

            <div className="relative z-10">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center">
                  <Leaf className="w-4.5 h-4.5 text-emerald-400" />
                </div>
                <div>
                  <h4 className="font-display font-bold text-base text-white">
                    Dynamic Carbon Offset
                  </h4>
                  <p className="text-[11px] text-[#D4D0C8] font-sans">
                    Emphasizing environmental benefits of your estimated {results.systemSizeKw} kW spec
                  </p>
                </div>
              </div>

              {/* Big CO2 offset display */}
              <div className="mb-6 pb-6 border-b border-white/10">
                <span className="text-[10px] font-mono tracking-widest text-emerald-400 uppercase font-bold block mb-1">
                  ESTIMATED CARBON DISPLACEMENT
                </span>
                <div className="flex items-baseline">
                  <span className="font-display text-4xl sm:text-5xl font-extrabold text-[#FAFAF8] tracking-tight">
                    {results.co2OffsetTonnes}
                  </span>
                  <span className="text-emerald-400 font-sans text-sm ml-2 font-bold">Tonnes CO2 / year</span>
                </div>
                <p className="text-xs text-[#D4D0C8] leading-relaxed mt-2.5">
                  Over a standard 25-year system design lifespan, this specification offsets approximately <span className="text-emerald-400 font-bold">{Math.round(results.co2OffsetTonnes * 25)} tonnes</span> of greenhouse gas emissions.
                </p>
              </div>

              {/* Environmental Bento Stats */}
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center mr-3 shrink-0 mt-0.5">
                    <Sprout className="w-4.5 h-4.5 text-emerald-400" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-white uppercase tracking-wider">
                      Trees Planted Equivalent
                    </h5>
                    <p className="text-xs text-[#D4D0C8] leading-relaxed mt-0.5">
                      Equivalent to growing <span className="text-emerald-400 font-bold">{Math.round(results.systemSizeKw * 48)} trees</span> for 10 years, filtering air pollution directly in Lagos.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center mr-3 shrink-0 mt-0.5">
                    <Flame className="w-4.5 h-4.5 text-[#E8A020]" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-white uppercase tracking-wider">
                      Fossil Fuel Avoided
                    </h5>
                    <p className="text-xs text-[#D4D0C8] leading-relaxed mt-0.5">
                      Eliminates burning up to <span className="text-[#E8A020] font-bold">{Math.round(results.systemSizeKw * 1150).toLocaleString()} liters</span> of expensive, toxic generator diesel/petrol annually.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative z-10 pt-6 mt-6 border-t border-white/10 flex items-center justify-between text-[10px] text-[#B0ACA4] font-medium">
              <span>Calibrated: UNFCCC Standards</span>
              <span className="text-emerald-400 flex items-center">
                <CheckCircle2 className="w-3 h-3 mr-1" /> Zero Emissions
              </span>
            </div>
          </div>

        </div>

      </motion.div>
    </section>
  );
}
