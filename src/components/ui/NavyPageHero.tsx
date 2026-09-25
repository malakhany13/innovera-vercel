import Image from "next/image";
import { motion } from "motion/react";
import type { ReactNode } from "react";

interface NavyPageHeroProps {
  backgroundImage: string;
  backgroundAlt: string;
  badge: string;
  badgeClassName?: string;
  title: ReactNode;
  description: string;
  actions?: ReactNode;
}

export default function NavyPageHero({
  backgroundImage,
  backgroundAlt,
  badge,
  badgeClassName = "tracking-wider uppercase",
  title,
  description,
  actions,
}: NavyPageHeroProps) {
  return (
    <section className="relative bg-brand-navy pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image
          src={backgroundImage}
          alt={backgroundAlt}
          fill
          priority
          sizes="100vw"
          referrerPolicy="no-referrer"
          className="object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-navy via-brand-navy/90 to-transparent"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span
              className={`inline-block py-1 px-3 rounded-full bg-brand-cyan/20 text-brand-cyan font-semibold text-sm mb-6 ${badgeClassName}`}
            >
              {badge}
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white leading-tight mb-6">
              {title}
            </h1>
            <p className="text-lg text-slate-300 mb-10 max-w-xl leading-relaxed">{description}</p>
            {actions}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
