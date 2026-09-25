import { motion } from "motion/react";
import OptimizedImage from "@/components/ui/OptimizedImage";
import type { FeaturedContentItem } from "./ContentFeaturedLayout";

interface ContentGridSectionProps {
  title: string;
  items: FeaturedContentItem[];
  onItemClick: (item: FeaturedContentItem) => void;
  imageFallback?: string;
}

export default function ContentGridSection({
  title,
  items,
  onItemClick,
  imageFallback,
}: ContentGridSectionProps) {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between mb-10 border-b border-slate-200 pb-4">
          <h2 className="text-3xl font-display font-bold text-slate-900">{title}</h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
          {items.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              onClick={() => onItemClick(item)}
              className="group cursor-pointer flex flex-col"
            >
              <div className="relative h-56 rounded-xl overflow-hidden mb-5">
                <OptimizedImage
                  src={item.image || imageFallback || ""}
                  alt={item.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  loading={idx === 0 ? undefined : "lazy"}
                  referrerPolicy="no-referrer"
                  fallbackSrc={imageFallback}
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-xs font-bold text-brand-cyan uppercase tracking-wider">
                  {item.category}
                </span>
                <span className="text-xs text-slate-500">{item.date}</span>
              </div>
              <h3 className="text-xl font-display font-bold text-slate-900 group-hover:text-brand-cyan transition-colors line-clamp-2 mb-3 leading-snug">
                {item.title}
              </h3>
              <p className="text-slate-600 text-sm line-clamp-2">{item.summary}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
