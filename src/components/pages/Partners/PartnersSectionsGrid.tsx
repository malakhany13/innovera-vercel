import Image from "next/image";
import { Building2, CalendarDays, Handshake, type LucideIcon } from "lucide-react";
import { motion } from "motion/react";
import { sections } from "@/src/constants";
import { getCourseImage } from "@/lib/directus";
import type { PartnersPageSection } from "@/features/directus/types";

const ICONS: Record<string, LucideIcon> = {
  partner: Handshake,
  partners: Handshake,
  client: Building2,
  clients: Building2,
  event: CalendarDays,
  events: CalendarDays,
};

function sectionImageSrc(image: string | null): string {
  if (!image) return "";
  if (image.startsWith("/") || image.startsWith("http")) return image;
  return getCourseImage(image);
}

interface PartnersSectionsGridProps {
  sections: PartnersPageSection[];
}

export default function PartnersSectionsGrid({
  sections: directusSections,
}: PartnersSectionsGridProps) {
  const displaySections =
    directusSections.length > 0
      ? directusSections.map((section) => ({
          ...section,
          image: sectionImageSrc(section.image),
          icon: ICONS[section.icon.toLowerCase()] ?? Handshake,
        }))
      : sections;

  return (
    <section className="py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col gap-24 max-w-5xl mx-auto">
          {displaySections.map((section, index) => (
            <motion.div
              key={`${section.title}-${index}`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="flex flex-col gap-8"
            >
              <div className="text-center flex flex-col items-center">
                <div className="w-14 h-14 bg-white rounded-full shadow-sm flex items-center justify-center text-brand-cyan mb-6 border border-slate-100">
                  <section.icon className="w-6 h-6" />
                </div>
                <h2 className="text-3xl font-display font-bold text-brand-navy mb-4 relative inline-block">
                  {section.title}
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-12 h-1 bg-brand-cyan rounded-full"></div>
                </h2>
                <p className="text-slate-500 mt-4 max-w-2xl mx-auto">{section.description}</p>
              </div>

              <div className="w-full bg-white rounded-[2rem] p-4 shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
                <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden">
                  <Image
                    src={section.image}
                    alt={section.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 896px"
                    loading={index === 0 ? undefined : "lazy"}
                    referrerPolicy="no-referrer"
                    className="object-contain bg-white p-4"
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
