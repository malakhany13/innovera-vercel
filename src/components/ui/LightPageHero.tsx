import { motion } from "motion/react";
import type { ReactNode } from "react";

interface LightPageHeroProps {
  eyebrow: string;
  title: ReactNode;
  description: string;
}

export default function LightPageHero({ eyebrow, title, description }: LightPageHeroProps) {
  return (
    <div className="text-center mb-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <span className="inline-block py-1 px-3 rounded-full bg-brand-cyan/20 text-brand-cyan font-semibold text-sm mb-4 tracking-wider uppercase">
          {eyebrow}
        </span>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-brand-navy mb-4">
          {title}
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">{description}</p>
      </motion.div>
    </div>
  );
}
