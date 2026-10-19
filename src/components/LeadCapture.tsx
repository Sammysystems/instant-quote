import React, { useState } from "react";
import { Check, CheckCircle2, Loader2, Sparkles, Calendar, Clock } from "lucide-react";
import { motion } from "motion/react";
import { BRAND_NAME, LAGOS_SUBURBS } from "../data";

export default function LeadCapture() {
  // Form states
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [suburb, setSuburb] = useState("Lekki Phase 1");
  const [bill, setBill] = useState("₦150,000–₦250,000");
  const [batteryInterest, setBatteryInterest] = useState("Yes");
  const [referral, setReferral] = useState("Google Search");

  // Status indicators
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [assessmentSelected, setAssessmentSelected] = useState<string | null>(null);
  
  // Validation inline errors
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateField = (field: string, value: string) => {
    let errs = { ...errors };
    if (field === "name") {
      if (!value.trim()) {
        errs.name = "Full name is required";
      } else {
        delete errs.name;
      }
    }
    if (field === "phone") {
      if (!value.trim()) {
        errs.phone = "Phone number is required";
      } else if (!/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/.test(value)) {
        errs.phone = "Please enter a valid phone number";
      } else {
        delete errs.phone;
      }
    }
    if (field === "email") {
      if (!value.trim()) {
        errs.email = "Email address is required";
      } else if (!/\S+@\S+\.\S+/.test(value)) {
        errs.email = "Please enter a valid email address";
      } else {
        delete errs.email;
      }
    }
    setErrors(errs);
  };

  const handleBlur = (field: string, value: string) => {
    validateField(field, value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Final check
    let formErrs: { [key: string]: string } = {};
    if (!name.trim()) formErrs.name = "Full name is required";
    if (!phone.trim()) formErrs.phone = "Phone number is required";
    if (!email.trim()) formErrs.email = "Email address is required";

    if (Object.keys(formErrs).length > 0) {
      setErrors(formErrs);
      return;
    }

    setIsSubmitting(true);

    // Simulate database / webhook save
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 1200);
  };

  const getFirstName = () => {
    return name.trim().split(" ")[0] || "there";
  };

  const trustPoints = [
    "Response within 24 hours — guaranteed",
    "Free comprehensive structural site assessment",
    "Tailored shade-analysis report included in design package"
  ];

  return (
    <section id="lead-capture" className="bg-[#0D1A0E] py-20 sm:py-28 text-white relative overflow-hidden">
      {/* Structural visual background accents */}
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-[#2D6A30]/10 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-[#E8A020]/5 rounded-full blur-3xl -z-10" />

      <motion.div 
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column (Trust content) */}
          <div className="lg:col-span-5">
            <span className="text-xs sm:text-sm font-sans tracking-widest text-[#E8A020] uppercase font-semibold block mb-4">
              GET YOUR FREE ANALYSIS
            </span>
            <h2 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight leading-[1.1] mb-6">
              Find out exactly <br />
              what solar will <br />
              save you.
            </h2>
            <p className="text-base sm:text-lg text-[#B0ACA4] font-sans leading-relaxed mb-8 max-w-md">
              No pressure. No generic packages. Just an engineered roadmap of your roof&apos;s physical capacity and clear financial payback calculations.
            </p>

            {/* Checklist */}
            <ul className="space-y-4 mb-8">
              {trustPoints.map((point, index) => (
                <li key={index} className="flex items-start text-sm sm:text-base font-medium">
                  <div className="w-5 h-5 rounded-full bg-[#E8A020]/10 flex items-center justify-center mr-3 mt-0.5 shrink-0">
                    <Check className="w-3.5 h-3.5 text-[#E8A020] stroke-[2.5]" />
                  </div>
                  <span className="text-white/95">{point}</span>
                </li>
              ))}
            </ul>

            <p className="text-xs sm:text-sm text-[#9CA8A2] border-t border-white/10 pt-6">
              Over 640 Lagos homeowners have started their solar transition journey right here.
            </p>
          </div>

          {/* Right Column (Form Card) */}
          <div className="lg:col-span-7">
            <div className="bg-white dark:bg-[#0E170F] text-[#1A1C1A] dark:text-[#FAFAF8] rounded-[16px] p-6 sm:p-10 shadow-2xl border border-[#E5E3DC] dark:border-white/5 relative transition-colors duration-300">
              
              {!isSuccess ? (
                <>
                  <div className="mb-6">
                    <h3 className="font-display text-xl sm:text-2xl font-bold text-[#1A1C1A] dark:text-[#FAFAF8] mb-1">
                      Request Your Solar Estimate
                    </h3>
                    <p className="text-xs sm:text-sm text-[#6B7A6E] dark:text-[#B0ACA4]">
                      Take 60 seconds to lock in your priority consultation slot.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    
                    {/* Full Name */}
                    <div>
                      <label className="block text-xs sm:text-sm font-sans font-bold text-[#1A1C1A] dark:text-[#FAFAF8] mb-1.5">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onBlur={(e) => handleBlur("name", e.target.value)}
                        onChange={(e) => {
                          setName(e.target.value);
                          if (errors.name) validateField("name", e.target.value);
                        }}
                        placeholder="e.g. Kola Shonibare"
                        className={`w-full h-11 px-4 rounded-[8px] border font-sans text-sm outline-none transition-all ${
                          errors.name
                            ? "border-red-500 focus:ring-1 focus:ring-red-500 bg-red-50/10 text-red-900"
                            : "border-[#E5E3DC] focus:border-[#2D6A30] focus:ring-1 focus:ring-[#2D6A30] bg-[#FAFAF8] dark:bg-[#1A2E1C]/25 dark:border-white/10 dark:text-[#FAFAF8] dark:focus:border-[#E8A020] dark:focus:ring-[#E8A020]"
                        }`}
                      />
                      {errors.name && (
                        <p className="text-red-500 text-xs mt-1 font-medium">{errors.name}</p>
                      )}
                    </div>

                    {/* Dual Column grid for Phone & Email */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Phone Number */}
                      <div>
                        <label className="block text-xs sm:text-sm font-sans font-bold text-[#1A1C1A] dark:text-[#FAFAF8] mb-1.5">
                          Phone Number <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="tel"
                          required
                          value={phone}
                          onBlur={(e) => handleBlur("phone", e.target.value)}
                          onChange={(e) => {
                            setPhone(e.target.value);
                            if (errors.phone) validateField("phone", e.target.value);
                          }}
                          placeholder="e.g. +234 803 123 4567"
                          className={`w-full h-11 px-4 rounded-[8px] border font-sans text-sm outline-none transition-all ${
                            errors.phone
                              ? "border-red-500 focus:ring-1 focus:ring-red-500 bg-red-50/10 text-red-900"
                              : "border-[#E5E3DC] focus:border-[#2D6A30] focus:ring-1 focus:ring-[#2D6A30] bg-[#FAFAF8] dark:bg-[#1A2E1C]/25 dark:border-white/10 dark:text-[#FAFAF8] dark:focus:border-[#E8A020] dark:focus:ring-[#E8A020]"
                          }`}
                        />
                        {errors.phone && (
                          <p className="text-red-500 text-xs mt-1 font-medium">{errors.phone}</p>
                        )}
                      </div>

                      {/* Email Address */}
                      <div>
                        <label className="block text-xs sm:text-sm font-sans font-bold text-[#1A1C1A] dark:text-[#FAFAF8] mb-1.5">
                          Email Address <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          required
                          value={email}
                          onBlur={(e) => handleBlur("email", e.target.value)}
                          onChange={(e) => {
                            setEmail(e.target.value);
                            if (errors.email) validateField("email", e.target.value);
                          }}
                          placeholder="e.g. kola@domain.com"
                          className={`w-full h-11 px-4 rounded-[8px] border font-sans text-sm outline-none transition-all ${
                            errors.email
                              ? "border-red-500 focus:ring-1 focus:ring-red-500 bg-red-50/10 text-red-900"
                              : "border-[#E5E3DC] focus:border-[#2D6A30] focus:ring-1 focus:ring-[#2D6A30] bg-[#FAFAF8] dark:bg-[#1A2E1C]/25 dark:border-white/10 dark:text-[#FAFAF8] dark:focus:border-[#E8A020] dark:focus:ring-[#E8A020]"
                          }`}
                        />
                        {errors.email && (
                          <p className="text-red-500 text-xs mt-1 font-medium">{errors.email}</p>
                        )}
                      </div>
                    </div>

                    {/* Dual Column for Suburb & Bill */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Suburb Select */}
                      <div>
                        <label className="block text-xs sm:text-sm font-sans font-bold text-[#1A1C1A] dark:text-[#FAFAF8] mb-1.5">
                          Lagos Suburb / District <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={suburb}
                          onChange={(e) => setSuburb(e.target.value)}
                          className="w-full h-11 px-3 rounded-[8px] border border-[#E5E3DC] dark:border-white/10 focus:border-[#2D6A30] dark:focus:border-[#E8A020] focus:ring-1 focus:ring-[#2D6A30] dark:focus:ring-[#E8A020] bg-[#FAFAF8] dark:bg-[#1A2E1C]/25 font-sans text-sm text-[#1A1C1A] dark:text-[#FAFAF8] cursor-pointer outline-none transition-all"
                        >
                          {LAGOS_SUBURBS.map((sub) => (
                            <option key={sub} value={sub} className="bg-white dark:bg-[#0E170F] text-[#1A1C1A] dark:text-[#FAFAF8]">{sub}</option>
                          ))}
                        </select>
                      </div>

                      {/* Monthly Bill Select */}
                      <div>
                        <label className="block text-xs sm:text-sm font-sans font-bold text-[#1A1C1A] dark:text-[#FAFAF8] mb-1.5">
                          Monthly Electricity Spend <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={bill}
                          onChange={(e) => setBill(e.target.value)}
                          className="w-full h-11 px-3 rounded-[8px] border border-[#E5E3DC] dark:border-white/10 focus:border-[#2D6A30] dark:focus:border-[#E8A020] focus:ring-1 focus:ring-[#2D6A30] dark:focus:ring-[#E8A020] bg-[#FAFAF8] dark:bg-[#1A2E1C]/25 font-sans text-sm text-[#1A1C1A] dark:text-[#FAFAF8] cursor-pointer outline-none transition-all"
                        >
                          <option value="Under ₦150,000" className="bg-white dark:bg-[#0E170F] text-[#1A1C1A] dark:text-[#FAFAF8]">Under ₦150,000 / month</option>
                          <option value="₦150,000–₦250,000" className="bg-white dark:bg-[#0E170F] text-[#1A1C1A] dark:text-[#FAFAF8]">₦150,000–₦250,000 / month</option>
                          <option value="₦250,000–₦400,000" className="bg-white dark:bg-[#0E170F] text-[#1A1C1A] dark:text-[#FAFAF8]">₦250,000–₦400,000 / month</option>
                          <option value="Over ₦400,000" className="bg-white dark:bg-[#0E170F] text-[#1A1C1A] dark:text-[#FAFAF8]">Over ₦400,000 / month</option>
                        </select>
                      </div>
                    </div>

                    {/* Battery Storage Radio Buttons */}
                    <div>
                      <label className="block text-xs sm:text-sm font-sans font-bold text-[#1A1C1A] dark:text-[#FAFAF8] mb-1.5">
                        Are you interested in battery backup storage? <span className="text-red-500">*</span>
                      </label>
                      <div className="flex space-x-4">
                        {["Yes", "No", "Not Sure"].map((val) => (
                          <label key={val} className="flex items-center space-x-2 cursor-pointer font-sans text-sm font-medium text-[#1A1C1A] dark:text-[#FAFAF8]">
                            <input
                              type="radio"
                              name="batteryInterest"
                              value={val}
                              checked={batteryInterest === val}
                              onChange={() => setBatteryInterest(val)}
                              className="accent-[#2D6A30] dark:accent-[#E8A020]"
                            />
                            <span>{val}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Referral Dropdown */}
                    <div>
                      <label className="block text-xs sm:text-sm font-sans font-bold text-[#1A1C1A] dark:text-[#FAFAF8] mb-1.5">
                        How did you hear about us?
                      </label>
                      <select
                        value={referral}
                        onChange={(e) => setReferral(e.target.value)}
                        className="w-full h-11 px-3 rounded-[8px] border border-[#E5E3DC] dark:border-white/10 focus:border-[#2D6A30] dark:focus:border-[#E8A020] focus:ring-1 focus:ring-[#2D6A30] dark:focus:ring-[#E8A020] bg-[#FAFAF8] dark:bg-[#1A2E1C]/25 font-sans text-sm text-[#1A1C1A] dark:text-[#FAFAF8] cursor-pointer outline-none transition-all"
                      >
                        <option value="Google Search" className="bg-white dark:bg-[#0E170F] text-[#1A1C1A] dark:text-[#FAFAF8]">Google Search</option>
                        <option value="Client Referral" className="bg-white dark:bg-[#0E170F] text-[#1A1C1A] dark:text-[#FAFAF8]">Friend / Neighbor Referral</option>
                        <option value="Social Media" className="bg-white dark:bg-[#0E170F] text-[#1A1C1A] dark:text-[#FAFAF8]">LinkedIn / Instagram</option>
                        <option value="Project Site Banner" className="bg-white dark:bg-[#0E170F] text-[#1A1C1A] dark:text-[#FAFAF8]">Installation Site Banner</option>
                      </select>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full h-12 bg-[#E8A020] hover:bg-[#d08f1b] disabled:bg-[#E5E3DC] disabled:text-[#6B7A6E] text-[#1A1C1A] rounded-[6px] font-bold text-sm sm:text-base transition-colors duration-200 flex items-center justify-center cursor-pointer mt-6"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin text-[#1A1C1A]" />
                          Booking Priority Slot...
                        </>
                      ) : (
                        "Send My Free Quote Request →"
                      )}
                    </button>

                    <p className="text-[11px] text-center text-[#6B7A6E] dark:text-[#B0ACA4] mt-3">
                      We strictly respect your privacy. No unsolicited marketing. Expected callback response within 24 hours.
                    </p>

                  </form>
                </>
              ) : (
                /* Success Feedback Block */
                <div className="py-8 text-center flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-[#2D6A30]/10 dark:bg-[#2D6A30]/20 flex items-center justify-center mb-6">
                    <CheckCircle2 className="w-10 h-10 text-[#2D6A30] dark:text-emerald-400 stroke-[1.5]" />
                  </div>
                  
                  <span className="bg-[#E8A020]/20 text-[#2D6A30] dark:text-[#E8A020] text-xs font-mono font-bold px-3 py-1.5 rounded-full uppercase flex items-center mb-3">
                    <Sparkles className="w-3.5 h-3.5 mr-1" /> PRIORITY SLOT RESERVED
                  </span>

                  <h3 className="font-display text-2xl sm:text-3xl font-extrabold text-[#1A1C1A] dark:text-white mb-2">
                    Thanks, {getFirstName()}!
                  </h3>
                  
                  <p className="text-sm sm:text-base text-[#6B7A6E] dark:text-[#B0ACA4] leading-relaxed max-w-md mb-8">
                    We&apos;ve registered your system configuration for <strong>{suburb}</strong> ({bill} electricity usage). Our design engineer will call you shortly to confirm your rooftop dimensions.
                  </p>

                  {/* Immediate Interactive Calendar Embed / Scheduling Offer */}
                  <div className="w-full p-5 bg-[#FAFAF8] dark:bg-[#1A2E1C]/20 rounded-[12px] border border-[#E5E3DC] dark:border-white/10 text-left">
                    <h4 className="font-display font-bold text-sm text-[#1A1C1A] dark:text-[#FAFAF8] mb-3 flex items-center">
                      <Calendar className="w-4 h-4 mr-2 text-[#2D6A30] dark:text-emerald-400" /> Want to pick your preferred site assessment window now?
                    </h4>
                    
                    {assessmentSelected ? (
                      <div className="p-3 bg-[#2D6A30]/10 dark:bg-[#2D6A30]/20 border border-[#2D6A30]/20 rounded-[8px] text-xs sm:text-sm text-[#2D6A30] dark:text-emerald-400 font-medium">
                        ✓ <strong>{assessmentSelected === "Phone Alignment" ? "Phone call coordination" : assessmentSelected}</strong> selected. Our engineer will align this on callback!
                      </div>
                    ) : (
                      <>
                        <div className="space-y-2 text-xs sm:text-sm text-[#1A1C1A] dark:text-[#FAFAF8] font-sans font-medium">
                          <button
                            type="button"
                            onClick={() => setAssessmentSelected("Tomorrow Afternoon (1:00 PM – 4:00 PM)")}
                            className="w-full flex items-center p-2.5 bg-white dark:bg-[#0E170F] border border-[#E5E3DC] dark:border-white/10 rounded hover:border-[#2D6A30] dark:hover:border-[#E8A020] cursor-pointer text-left transition-colors"
                          >
                            <Clock className="w-4 h-4 mr-2 text-[#6B7A6E] dark:text-[#B0ACA4]" /> Tomorrow Afternoon (1:00 PM – 4:00 PM)
                          </button>
                          <button
                            type="button"
                            onClick={() => setAssessmentSelected("Friday Morning (9:00 AM – 12:00 PM)")}
                            className="w-full flex items-center p-2.5 bg-white dark:bg-[#0E170F] border border-[#E5E3DC] dark:border-white/10 rounded hover:border-[#2D6A30] dark:hover:border-[#E8A020] cursor-pointer text-left transition-colors"
                          >
                            <Clock className="w-4 h-4 mr-2 text-[#6B7A6E] dark:text-[#B0ACA4]" /> Friday Morning (9:00 AM – 12:00 PM)
                          </button>
                        </div>
                        
                        <button
                          type="button"
                          onClick={() => setAssessmentSelected("Phone Alignment")}
                          className="mt-4 text-xs font-bold text-[#2D6A30] dark:text-[#E8A020] hover:underline flex items-center"
                        >
                          Skip and handle over phone call
                        </button>
                      </>
                    )}
                  </div>
                </div>
              )}

            </div>
          </div>

        </div>
      </motion.div>
    </section>
  );
}
