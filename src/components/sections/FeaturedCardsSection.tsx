"use client";

import { ArrowRight, Calendar } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import OptimizedImage from "@/components/ui/OptimizedImage";
import type { FeaturedCard } from "@/src/types/content";

interface FeaturedCardsSectionProps {
  eyebrow: string;
  title: string;
  viewAllHref: string;
  viewAllLabel: string;
  items: FeaturedCard[];
  className?: string;
  imageFallback?: string;
  /** Opens detail in-place (e.g. home page modal) without navigation. */
  onItemClick?: (item: FeaturedCard) => void;
}

export default function FeaturedCardsSection({
  eyebrow,
  title,
  viewAllHref,
  viewAllLabel,
  items,
  className = "py-32 bg-slate-50 border-b border-slate-200",
  imageFallback,
  onItemClick,
}: FeaturedCardsSectionProps) {
  return (
    <section className={className}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-3xl">
            <h2 className="text-sm font-bold text-brand-cyan uppercase tracking-[0.2em] mb-4">{eyebrow}</h2>
            <h3 className="text-4xl lg:text-5xl font-display font-bold text-brand-navy">{title}</h3>
          </div>
          <Link
            href={viewAllHref}
            className="inline-flex items-center gap-2 text-brand-cyan font-bold hover:gap-3 transition-all"
          >
            {viewAllLabel} <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {items.map((item, idx) => {
            const cardClassName =
              "group relative block w-full text-left rounded-[2rem] overflow-hidden h-80 shadow-sm hover:shadow-xl transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan focus-visible:ring-offset-2 cursor-pointer";

            const content = (
              <>
                <OptimizedImage
                  src={item.image || imageFallback || "/images/placeholders/news.svg"}
                  alt={item.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  loading={idx === 0 ? undefined : "lazy"}
                  fallbackSrc={imageFallback}
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-navy via-brand-navy/40 to-transparent opacity-90" />
                <div className="absolute top-8 left-8 z-10">
                  <span className="px-4 py-2 bg-brand-cyan text-white text-[10px] font-bold uppercase tracking-wider rounded-full shadow-lg">
                    {item.category}
                  </span>
                </div>
                <div className="absolute bottom-10 left-10 right-10 z-10">
                  <div className="flex items-center gap-2 text-brand-cyan text-xs font-bold mb-3 bg-white/10 backdrop-blur-md w-fit px-3 py-1.5 rounded-full border border-white/10">
                    <Calendar className="w-3 h-3" />
                    {item.date}
                  </div>
                  <h4 className="text-2xl font-display font-bold text-white group-hover:text-brand-cyan transition-colors line-clamp-3">
                    {item.title}
                  </h4>
                </div>
              </>
            );

            return (
              <motion.div
                key={`${item.title}-${idx}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                {onItemClick ? (
                  <button
                    type="button"
                    onClick={() => onItemClick(item)}
                    aria-label={`Open ${item.title}`}
                    className={cardClassName}
                  >
                    {content}
                  </button>
                ) : item.href ? (
                  <Link
                    href={item.href}
                    aria-label={`Open ${item.title}`}
                    className={cardClassName}
                  >
                    {content}
                  </Link>
                ) : (
                  <div className={cardClassName}>{content}</div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
