import React from "react";
import { motion } from "motion/react";
import { Gallery4 } from "@/components/ui/gallery4";
import { PROJECTS } from "../data";

export default function Projects() {
  const items = PROJECTS.map((project) => ({
    id: String(project.id),
    title: `${project.suburb.toUpperCase()} RESIDENCE`,
    description: `${project.sizeKw}kW System + ${project.batteryCapacityKwh}kWh Battery. Slashes generator runtime. Estimated annual savings: ${project.annualSavings}. Installed in ${project.installDuration}.`,
    href: "#lead-capture",
    image: project.imageUrl,
  }));

  return (
    <motion.div 
      id="projects"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      <Gallery4
        title="Real homes. Real savings."
        description="Every installation is fully engineered, installed, and commissioned by our own certified in-house crew. Silence your generator and take full control of your power today."
        items={items}
      />
    </motion.div>
  );
}
