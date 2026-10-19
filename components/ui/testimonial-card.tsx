import { cn } from "@/lib/utils"
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { Star, Quote, Check } from "lucide-react"

export interface TestimonialAuthor {
  name: string
  handle: string
  avatar: string
  tag?: string
  system?: string
}

export interface TestimonialCardProps {
  author: TestimonialAuthor
  text: string
  href?: string
  className?: string
  key?: string | number
}

export function TestimonialCard({ 
  author,
  text,
  href,
  className
}: TestimonialCardProps) {
  const Card = href ? 'a' : 'div'
  
  // Custom smart system details based on author names
  const systemTag = author.system || (
    author.name.includes("Prince") ? "15kVA Hybrid" :
    author.name.includes("James") ? "8.2kW + LiFePO4" :
    author.name.includes("Michael") ? "20kVA Medical SLA" :
    author.name.includes("Deji") ? "5kW Urban" :
    author.name.includes("Linda") ? "12kW Premium" :
    author.name.includes("Anthony") ? "10kW Custom" : "8.2kW Hybrid"
  );

  const verificationTag = author.tag || (
    author.name.includes("Prince") ? "Verified Homeowner" :
    author.name.includes("James") ? "Pure Sine-Wave Backup" :
    author.name.includes("Michael") ? "Zero-Down-Time Clinic" :
    author.name.includes("Deji") ? "Architect-Approved" :
    author.name.includes("Linda") ? "Proactive Smart Monitor" :
    author.name.includes("Anthony") ? "78% Cost Reduction" : "Verified Client"
  );

  return (
    <Card
      {...(href ? { href } : {})}
      className={cn(
        "flex flex-col justify-between rounded-[24px] border border-[#E5E3DC] dark:border-white/5",
        "bg-[#FFFFFF] dark:bg-[#0E170F]",
        "p-6 text-start sm:p-7 relative",
        "hover:border-[#2D6A30]/50 dark:hover:border-emerald-500/50 hover:shadow-xl hover:shadow-[#2D6A30]/5 dark:hover:shadow-[#E8A020]/5 hover:-translate-y-1",
        "min-w-[320px] sm:min-w-[360px] max-w-[360px]",
        "transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
        className
      )}
    >
      {/* Background Decorative Quote Icon */}
      <div className="absolute top-6 right-6 text-[#2D6A30]/10 dark:text-emerald-400/5">
        <Quote className="w-8 h-8 transform rotate-180" />
      </div>

      <div>
        {/* Five Star Rating */}
        <div className="flex items-center space-x-1 mb-4">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-4 h-4 fill-[#E8A020] text-[#E8A020]" />
          ))}
        </div>

        {/* Testimonial Quote Text */}
        <p className="font-sans text-sm sm:text-[15px] leading-relaxed text-[#1A1C1A]/90 dark:text-[#FAFAF8]/90 font-medium mb-6">
          "{text}"
        </p>
      </div>

      {/* Author Profile and Verification Footer */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <div className="relative p-0.5 rounded-full ring-2 ring-[#2D6A30]/10 dark:ring-emerald-500/10 bg-white dark:bg-[#0E170F]">
            <Avatar className="h-11 w-11">
              <AvatarImage src={author.avatar} alt={author.name} />
            </Avatar>
          </div>
          <div className="flex flex-col items-start">
            <h4 className="text-sm font-display font-bold text-[#1A1C1A] dark:text-[#FAFAF8]">
              {author.name}
            </h4>
            <p className="text-[11px] font-semibold text-[#6B7A6E] dark:text-[#B0ACA4] mt-0.5 font-sans">
              {author.handle}
            </p>
          </div>
        </div>

        {/* Verification Pill Tags */}
        <div className="pt-4 border-t border-[#E5E3DC]/60 dark:border-white/5 flex items-center justify-between">
          <span className="inline-flex items-center text-[10px] font-bold text-[#2D6A30] dark:text-emerald-400 bg-[#2D6A30]/5 dark:bg-emerald-500/10 px-2.5 py-1 rounded-full uppercase tracking-wider">
            <Check className="w-3 h-3 mr-1.5 stroke-[3]" />
            {verificationTag}
          </span>
          <span className="text-[10px] font-mono font-bold text-[#E8A020] bg-[#E8A020]/10 dark:bg-[#E8A020]/15 px-2 py-0.5 rounded uppercase">
            {systemTag}
          </span>
        </div>
      </div>
    </Card>
  )
}
