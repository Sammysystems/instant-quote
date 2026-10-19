import React from "react";
import { motion } from "motion/react";
import { TestimonialsSection } from "@/components/ui/testimonials-with-marquee";
import { REVIEWS } from "../data";

export default function Testimonials() {
  const mappedTestimonials = REVIEWS.map((review) => {
    // Premium professional avatars matched to customer profiles
    let avatar = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face";
    if (review.author.includes("Prince")) {
      avatar = "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face";
    } else if (review.author.includes("Sarah")) {
      avatar = "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face";
    } else if (review.author.includes("Deji") || review.author.includes("Michael") || review.author.includes("Chidi")) {
      avatar = "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face";
    }

    return {
      author: {
        name: review.author,
        handle: `${review.role} • ${review.suburb}`,
        avatar: avatar,
      },
      text: review.text,
    };
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      <TestimonialsSection
        title="Trusted by 640+ premium homeowners across Lagos"
        description="Join hundreds of families and businesses who have silenced their generators, slashed their electricity bills, and transitioned to reliable, 24/7 solar power with Auxano Solar."
        testimonials={mappedTestimonials}
      />
    </motion.div>
  );
}
