import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Calendar, Clock, User, Phone, Mail, MapPin, Zap, CheckCircle2, ChevronRight, ChevronLeft, Loader2 } from "lucide-react";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function BookingModal({ isOpen, onClose }: BookingModalProps) {
  const [step, setStep] = useState<number>(1);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [area, setArea] = useState<string>("");
  const [monthlySpend, setMonthlySpend] = useState<string>("₦150,000–₦250,000");

  // Loader states for customized engineering simulation
  const [loaderIndex, setLoaderIndex] = useState<number>(0);
  const loaderMessages = [
    "Analyzing solar irradiance data for your location...",
    "Sizing optimum inverter & photovoltaic module balance...",
    "Matching Smart LiFePO4 battery storage depth of discharge...",
    "Finalizing system design and scheduling lead engineer..."
  ];

  // Calendar parameters
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date(2026, 6)); // July 2026 as per metadata
  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  const firstDayIndex = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();

  // Reset booking form state on open
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setSelectedDate(null);
      setSelectedTime("");
      setName("");
      setPhone("");
      setEmail("");
      setArea("");
      setMonthlySpend("₦150,000–₦250,000");
      setLoaderIndex(0);
    }
  }, [isOpen]);

  // Handle auto-progressing loader steps on form submit
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (step === 4 && loaderIndex < loaderMessages.length) {
      interval = setInterval(() => {
        setLoaderIndex((prev) => {
          if (prev >= loaderMessages.length - 1) {
            clearInterval(interval);
            setTimeout(() => setStep(5), 1000); // transition to success step
            return prev;
          }
          return prev + 1;
        });
      }, 1500);
    }
    return () => clearInterval(interval);
  }, [step, loaderIndex]);

  if (!isOpen) return null;

  // Render Calendar Grid
  const renderCalendar = () => {
    const days = [];
    // Blank padding for days before the first day of the month
    for (let i = 0; i < firstDayIndex; i++) {
      days.push(<div key={`empty-${i}`} className="h-10 w-10" />);
    }

    // Days in July 2026
    for (let day = 1; day <= daysInMonth; day++) {
      const dateObj = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      const isSunday = dateObj.getDay() === 0;
      const isSelected = selectedDate && selectedDate.getDate() === day && selectedDate.getMonth() === currentMonth.getMonth();
      const isPast = dateObj < new Date();

      days.push(
        <button
          key={day}
          type="button"
          disabled={isSunday || isPast}
          onClick={() => setSelectedDate(dateObj)}
          className={`h-10 w-10 rounded-full font-sans text-xs font-semibold flex items-center justify-center transition-all cursor-pointer ${
            isSunday
              ? "text-white/20 cursor-not-allowed bg-transparent"
              : isSelected
              ? "bg-[#E8A020] text-[#1A1C1A] font-extrabold shadow-md shadow-[#E8A020]/25 scale-110"
              : "text-white hover:bg-white/10"
          }`}
        >
          {day}
        </button>
      );
    }
    return days;
  };

  const timeSlots = ["09:00 AM", "11:30 AM", "02:00 PM", "04:30 PM"];

  const handleNextStep = () => {
    if (step === 1 && !selectedDate) return;
    if (step === 2 && !selectedTime) return;
    if (step === 3 && (!name || !phone || !area)) return;
    
    if (step === 3) {
      setStep(4); // Trigger loader animation step
      setLoaderIndex(0);
    } else {
      setStep((prev) => prev + 1);
    }
  };

  const handlePrevStep = () => {
    setStep((prev) => Math.max(1, prev - 1));
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/85 backdrop-blur-sm"
        />

        {/* Modal card wrapper */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 350 }}
          className="relative w-full max-w-xl bg-[#0D1A0E] border border-white/10 rounded-[32px] overflow-hidden shadow-[0_24px_80px_rgba(0,0,0,0.8)] text-white z-10 flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 sm:p-8 border-b border-white/10 shrink-0">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-[#E8A020]/10 flex items-center justify-center">
                <Zap className="w-5 h-5 text-[#E8A020]" />
              </div>
              <div>
                <h3 className="font-display font-bold text-lg text-white">Book Expert Consultation</h3>
                <p className="text-[11px] text-[#B0ACA4] font-sans font-medium uppercase tracking-widest">Premium Engineering Audit</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-white/5 text-[#B0ACA4] hover:text-white transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Stepper Progress Bar */}
          {step <= 3 && (
            <div className="w-full h-1 bg-white/5 shrink-0 flex">
              <div
                className="h-full bg-[#E8A020] transition-all duration-300"
                style={{ width: `${(step / 3) * 100}%` }}
              />
            </div>
          )}

          {/* Form Content / Scrollable area */}
          <div className="p-6 sm:p-8 overflow-y-auto flex-1">
            
            {/* STEP 1: Select Date */}
            {step === 1 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div className="text-center sm:text-left">
                  <h4 className="font-display font-bold text-xl text-white flex items-center justify-center sm:justify-start">
                    <Calendar className="w-5 h-5 text-[#E8A020] mr-2" />
                    Select a Consultation Date
                  </h4>
                  <p className="text-xs text-[#B0ACA4] font-sans mt-1">
                    Select a convenient day for our engineering lead to analyze your space.
                  </p>
                </div>

                <div className="bg-[#132A14]/40 border border-white/5 rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h5 className="font-sans font-bold text-sm text-[#E8A020]">
                      {currentMonth.toLocaleString("default", { month: "long", year: "numeric" })}
                    </h5>
                    <div className="flex space-x-1">
                      <button
                        type="button"
                        onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                        className="p-1 rounded-md hover:bg-white/5 text-[#B0ACA4] hover:text-white"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                        className="p-1 rounded-md hover:bg-white/5 text-[#B0ACA4] hover:text-white"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Weekday Labels */}
                  <div className="grid grid-cols-7 gap-1 text-center mb-2">
                    {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
                      <span key={day} className="text-[10px] font-mono text-white/40 font-bold uppercase">
                        {day}
                      </span>
                    ))}
                  </div>

                  {/* Calendar Days */}
                  <div className="grid grid-cols-7 gap-1 text-center">
                    {renderCalendar()}
                  </div>
                </div>

                {selectedDate && (
                  <div className="bg-[#E8A020]/10 border border-[#E8A020]/20 rounded-xl p-3.5 text-center text-xs font-sans font-semibold text-[#E8A020]">
                    Selected Date: {selectedDate.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
                  </div>
                )}
              </motion.div>
            )}

            {/* STEP 2: Select Time Slot */}
            {step === 2 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div className="text-center sm:text-left">
                  <h4 className="font-display font-bold text-xl text-white flex items-center justify-center sm:justify-start">
                    <Clock className="w-5 h-5 text-[#E8A020] mr-2" />
                    Choose Meeting Slot
                  </h4>
                  <p className="text-xs text-[#B0ACA4] font-sans mt-1">
                    Select an engineering opening for your dedicated system design consultation.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  {timeSlots.map((time) => (
                    <button
                      key={time}
                      type="button"
                      onClick={() => setSelectedTime(time)}
                      className={`h-14 rounded-2xl border font-sans font-semibold text-sm flex flex-col items-center justify-center transition-all cursor-pointer ${
                        selectedTime === time
                          ? "bg-[#E8A020] text-[#1A1C1A] border-[#E8A020] font-bold shadow-lg shadow-[#E8A020]/15"
                          : "bg-[#132A14]/35 border-white/10 hover:border-[#E8A020] text-white"
                      }`}
                    >
                      <span className="text-sm">{time}</span>
                      <span className={`text-[9px] mt-0.5 uppercase ${selectedTime === time ? "text-[#1A1C1A]/70" : "text-white/40"}`}>
                        Slot Available
                      </span>
                    </button>
                  ))}
                </div>

                {selectedTime && (
                  <div className="bg-[#E8A020]/10 border border-[#E8A020]/20 rounded-xl p-3.5 text-center text-xs font-sans font-semibold text-[#E8A020]">
                    Selected Schedule: {selectedDate?.toLocaleDateString()} at {selectedTime} (Lagos Time)
                  </div>
                )}
              </motion.div>
            )}

            {/* STEP 3: Project & Contact Details */}
            {step === 3 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-5"
              >
                <div className="text-center sm:text-left">
                  <h4 className="font-display font-bold text-xl text-white flex items-center justify-center sm:justify-start">
                    <User className="w-5 h-5 text-[#E8A020] mr-2" />
                    Your Project Specifications
                  </h4>
                  <p className="text-xs text-[#B0ACA4] font-sans mt-1">
                    Please provide authentic contact information to qualify for this exclusive engineering audit.
                  </p>
                </div>

                <div className="space-y-4 pt-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Full Name */}
                    <div>
                      <label className="block text-[11px] font-sans font-bold uppercase tracking-wider text-[#B0ACA4] mb-1.5">
                        Full Name *
                      </label>
                      <div className="relative">
                        <User className="absolute left-3.5 top-3.5 w-4.5 h-4.5 text-[#B0ACA4]" />
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Alhaji Kola George"
                          className="w-full h-12 pl-10 pr-4 bg-[#132A14]/30 border border-white/10 rounded-xl font-sans font-semibold text-sm outline-none focus:border-[#E8A020] transition-all"
                        />
                      </div>
                    </div>

                    {/* WhatsApp/Phone */}
                    <div>
                      <label className="block text-[11px] font-sans font-bold uppercase tracking-wider text-[#B0ACA4] mb-1.5">
                        WhatsApp Number *
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3.5 top-3.5 w-4.5 h-4.5 text-[#B0ACA4]" />
                        <input
                          type="tel"
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="e.g. 0816 394 9428"
                          className="w-full h-12 pl-10 pr-4 bg-[#132A14]/30 border border-white/10 rounded-xl font-sans font-semibold text-sm outline-none focus:border-[#E8A020] transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Email */}
                    <div>
                      <label className="block text-[11px] font-sans font-bold uppercase tracking-wider text-[#B0ACA4] mb-1.5">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-3.5 w-4.5 h-4.5 text-[#B0ACA4]" />
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="kola@example.com"
                          className="w-full h-12 pl-10 pr-4 bg-[#132A14]/30 border border-white/10 rounded-xl font-sans font-semibold text-sm outline-none focus:border-[#E8A020] transition-all"
                        />
                      </div>
                    </div>

                    {/* Lagos Area */}
                    <div>
                      <label className="block text-[11px] font-sans font-bold uppercase tracking-wider text-[#B0ACA4] mb-1.5">
                        Lagos Location/Estate *
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-3.5 top-3.5 w-4.5 h-4.5 text-[#B0ACA4]" />
                        <input
                          type="text"
                          required
                          value={area}
                          onChange={(e) => setArea(e.target.value)}
                          placeholder="e.g., Lekki Phase 1, Ikeja"
                          className="w-full h-12 pl-10 pr-4 bg-[#132A14]/30 border border-white/10 rounded-xl font-sans font-semibold text-sm outline-none focus:border-[#E8A020] transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Monthly Bill */}
                  <div>
                    <label className="block text-[11px] font-sans font-bold uppercase tracking-wider text-[#B0ACA4] mb-1.5">
                      Average Monthly Electricity & Fuel Spend
                    </label>
                    <select
                      value={monthlySpend}
                      onChange={(e) => setMonthlySpend(e.target.value)}
                      className="w-full h-12 px-4 bg-[#132A14]/40 border border-white/10 rounded-xl font-sans font-semibold text-sm outline-none focus:border-[#E8A020] cursor-pointer"
                    >
                      <option value="Under ₦150,000">Under ₦150,000 / month</option>
                      <option value="₦150,000–₦250,000">₦150,000 – ₦250,000 / month</option>
                      <option value="₦250,000–₦400,000">₦250,000 – ₦400,000 / month</option>
                      <option value="Over ₦400,000">Over ₦400,000 / month</option>
                    </select>
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 4: Engineering Design Simulation Loader */}
            {step === 4 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-10 space-y-6 text-center"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-[#E8A020]/20 rounded-full blur-xl animate-pulse" />
                  <Loader2 className="w-16 h-16 text-[#E8A020] animate-spin relative z-10" />
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-display font-bold text-lg text-white">Sizing Your Custom Solar Microgrid</h4>
                  <div className="h-6 overflow-hidden">
                    <motion.p
                      key={loaderIndex}
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -20, opacity: 0 }}
                      className="text-sm text-[#B0ACA4] font-mono"
                    >
                      {loaderMessages[loaderIndex]}
                    </motion.p>
                  </div>
                </div>

                <div className="w-full max-w-xs bg-white/5 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="h-full bg-[#E8A020] transition-all duration-300"
                    style={{ width: `${((loaderIndex + 1) / loaderMessages.length) * 100}%` }}
                  />
                </div>
              </motion.div>
            )}

            {/* STEP 5: Success confirmation screen */}
            {step === 5 && (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex flex-col items-center justify-center py-10 space-y-6 text-center"
              >
                <div className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shadow-[0_0_50px_rgba(16,185,129,0.15)]">
                  <CheckCircle2 className="w-12 h-12 text-emerald-400" />
                </div>

                <div className="space-y-2">
                  <h4 className="font-display font-bold text-2xl text-white">Consultation Confirmed!</h4>
                  <p className="text-sm text-[#B0ACA4] font-sans max-w-sm leading-relaxed mx-auto">
                    Excellent! Your custom engineering analysis has been initiated for <span className="text-white font-bold">{area}</span>.
                  </p>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-4 w-full max-w-md text-left font-sans space-y-3">
                  <div className="flex justify-between text-xs pb-2.5 border-b border-white/5">
                    <span className="text-[#B0ACA4]">Client Name</span>
                    <span className="font-bold text-white">{name}</span>
                  </div>
                  <div className="flex justify-between text-xs pb-2.5 border-b border-white/5">
                    <span className="text-[#B0ACA4]">Scheduled Slot</span>
                    <span className="font-bold text-[#E8A020]">{selectedDate?.toLocaleDateString()} at {selectedTime}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-[#B0ACA4]">Estimated System Capacity</span>
                    <span className="font-bold text-white font-mono">
                      {monthlySpend === "Under ₦150,000" ? "5.2" : monthlySpend === "₦150,000–₦250,000" ? "9.3" : monthlySpend === "₦250,000–₦400,000" ? "15.0" : "25.2"} kWp
                    </span>
                  </div>
                </div>

                <p className="text-xs text-[#E8A020] font-bold uppercase tracking-wider">
                  Our Engineering Lead will message you on WhatsApp shortly.
                </p>

                <button
                  type="button"
                  onClick={onClose}
                  className="w-full max-w-xs h-12 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl font-bold text-sm transition-all cursor-pointer"
                >
                  Return to Site
                </button>
              </motion.div>
            )}

          </div>

          {/* Footer Controls */}
          {step <= 3 && (
            <div className="p-6 sm:p-8 border-t border-white/10 shrink-0 flex items-center justify-between bg-[#0B150C]">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="px-5 h-11 bg-white/5 hover:bg-white/10 text-white rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer flex items-center"
                >
                  Back
                </button>
              ) : (
                <div />
              )}

              <button
                type="button"
                onClick={handleNextStep}
                disabled={(step === 1 && !selectedDate) || (step === 2 && !selectedTime) || (step === 3 && (!name || !phone || !area))}
                className="px-6 h-11 bg-[#E8A020] hover:bg-[#FFC252] disabled:opacity-40 disabled:pointer-events-none text-[#1A1C1A] rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer flex items-center"
              >
                {step === 3 ? "Submit & Generate Design" : "Continue"}
                <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
