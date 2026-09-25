import OptimizedImage from "@/components/ui/OptimizedImage";
import { Calendar } from "lucide-react";
import { motion } from "motion/react";
import type { ReactNode } from "react";

export interface FeaturedContentItem {
  id: number;
  title: string;
  date: string;
  category: string;
  image: string;
  summary: string;
}

interface ContentFeaturedLayoutProps {
  header?: ReactNode;
  topItem: FeaturedContentItem;
  sideItems: FeaturedContentItem[];
  onItemClick: (item: FeaturedContentItem) => void;
  imageFallback?: string;
}

export default function ContentFeaturedLayout({
  header,
  topItem,
  sideItems,
  onItemClick,
  imageFallback,
}: ContentFeaturedLayoutProps) {
  return (
    <section className="pt-32 pb-12 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6">
        {header}
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-8 group cursor-pointer flex flex-col"
            onClick={() => onItemClick(topItem)}
          >
            <div className="relative h-[300px] sm:h-[400px] lg:h-[500px] rounded-2xl overflow-hidden mb-6">
              <OptimizedImage
                src={topItem.image || imageFallback || ""}
                alt={topItem.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 66vw"
                referrerPolicy="no-referrer"
                fallbackSrc={imageFallback}
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </div>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-sm font-bold text-brand-cyan uppercase tracking-wider">
                {topItem.category}
              </span>
              <span className="text-sm text-slate-500 flex items-center gap-1">
                <Calendar className="w-4 h-4" /> {topItem.date}
              </span>
            </div>
            <h2 className="text-3xl lg:text-4xl font-display font-bold text-slate-900 group-hover:text-brand-cyan transition-colors mb-4 leading-tight">
              {topItem.title}
            </h2>
            <p className="text-lg text-slate-600 line-clamp-2">{topItem.summary}</p>
          </motion.div>

          <div className="lg:col-span-4 flex flex-col gap-8">
            {sideItems.map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: (idx + 1) * 0.2 }}
                className="group cursor-pointer flex flex-col h-full"
                onClick={() => onItemClick(item)}
              >
                <div className="relative h-48 sm:h-64 lg:h-48 rounded-xl overflow-hidden mb-4 shrink-0">
                  <OptimizedImage
                    src={item.image || imageFallback || ""}
                    alt={item.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 33vw"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    fallbackSrc={imageFallback}
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xs font-bold text-brand-cyan uppercase tracking-wider">
                    {item.category}
                  </span>
                  <span className="text-xs text-slate-500">{item.date}</span>
                </div>
                <h3 className="text-xl font-display font-bold text-slate-900 group-hover:text-brand-cyan transition-colors line-clamp-3 leading-snug">
                  {item.title}
                </h3>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
