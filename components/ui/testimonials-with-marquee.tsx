"use client";

import { cn } from "@/lib/utils"
import { TestimonialCard, TestimonialAuthor } from "@/components/ui/testimonial-card"
import { Star } from "lucide-react"

interface TestimonialsSectionProps {
  title: string
  description: string
  testimonials: Array<{
    author: TestimonialAuthor
    text: string
    href?: string
  }>
  className?: string
}

export function TestimonialsSection({ 
  title,
  description,
  testimonials,
  className 
}: TestimonialsSectionProps) {
  // Split testimonials for two opposite scrolling rows
  const midPoint = Math.ceil(testimonials.length / 2)
  const row1 = testimonials.slice(0, midPoint)
  const row2 = testimonials.slice(midPoint)

  return (
    <section className={cn(
      "bg-[#FAF9F5] dark:bg-[#060C07] text-[#1A1C1A] dark:text-[#FAFAF8] transition-colors duration-300",
      "py-20 sm:py-28 px-0 border-b border-[#E5E3DC] dark:border-white/5",
      className
    )} id="testimonials">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-12 text-center sm:gap-16">
        {/* Header & Social Proof Badges */}
        <div className="flex flex-col items-center gap-4 px-4 max-w-3xl">
          {/* Trust Rating Badge */}
          <div className="inline-flex items-center space-x-2 bg-white dark:bg-[#0E170F] px-3.5 py-1.5 rounded-full border border-[#E5E3DC] dark:border-white/5 shadow-sm mb-2 transition-colors duration-300">
            <div className="flex items-center space-x-0.5">
              {[...Array(5)].map((_, idx) => (
                <Star key={idx} className="w-3.5 h-3.5 fill-[#E8A020] text-[#E8A020]" />
              ))}
            </div>
            <span className="text-[11px] font-sans font-bold text-[#1A1C1A] dark:text-[#FAFAF8] uppercase tracking-wider">
              5.0 Star Rated on Google Business
            </span>
          </div>

          <h2 className="text-3xl font-display font-bold leading-tight text-[#1A1C1A] dark:text-[#FAFAF8] sm:text-4xl lg:text-5xl tracking-tight">
            {title}
          </h2>
          <p className="text-base max-w-2xl font-sans text-[#6B7A6E] dark:text-[#B0ACA4]">
            {description}
          </p>
        </div>

        {/* Dual Marquee Containers */}
        <div className="relative flex w-full flex-col items-center justify-center overflow-hidden gap-6">
          
          {/* Row 1: Scrolling Left */}
          <div className="group flex overflow-hidden p-2 [--gap:1.5rem] [gap:var(--gap)] flex-row [--duration:45s] w-full">
            <div className="flex shrink-0 justify-around [gap:var(--gap)] animate-marquee flex-row group-hover:[animation-play-state:paused]">
              {[...Array(4)].map((_, setIndex) => (
                row1.map((testimonial, i) => (
                  <TestimonialCard 
                    key={`row1-${setIndex}-${i}`}
                    {...testimonial}
                  />
                ))
              ))}
            </div>
          </div>

          {/* Row 2: Scrolling Right (Reverse) */}
          <div className="group flex overflow-hidden p-2 [--gap:1.5rem] [gap:var(--gap)] flex-row [--duration:45s] w-full">
            <div className="flex shrink-0 justify-around [gap:var(--gap)] animate-marquee-reverse flex-row group-hover:[animation-play-state:paused]">
              {[...Array(4)].map((_, setIndex) => (
                row2.map((testimonial, i) => (
                  <TestimonialCard 
                    key={`row2-${setIndex}-${i}`}
                    {...testimonial}
                  />
                ))
              ))}
            </div>
          </div>

          {/* Side Fades for Premium Glassmorphic Finish */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-1/12 bg-gradient-to-r from-[#FAF9F5] dark:from-[#060C07] to-transparent z-10" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-1/12 bg-gradient-to-l from-[#FAF9F5] dark:from-[#060C07] to-transparent z-10" />
        </div>
      </div>
    </section>
  )
}
