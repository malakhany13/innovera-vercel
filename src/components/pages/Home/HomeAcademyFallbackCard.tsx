import { Brain, Code, Shield, Users } from "lucide-react";
import Image from "next/image";
import { motion } from "motion/react";
import Link from "next/link";
import CoursePoweredBy from "@/components/CoursePoweredBy";
import type { AcademyFallbackTrack } from "./types";

const TRACK_ICONS = {
  brain: Brain,
  shield: Shield,
  code: Code,
  users: Users,
} as const;

interface HomeAcademyFallbackCardProps {
  track: AcademyFallbackTrack;
  idx: number;
}

export default function HomeAcademyFallbackCard({ track, idx }: HomeAcademyFallbackCardProps) {
  const Icon = TRACK_ICONS[track.icon];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: idx * 0.1 }}
      className="bg-white rounded-[1.5rem] p-6 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-slate-100/80 hover:border-brand-cyan/30 hover:shadow-xl transition-all flex flex-col gap-4 group relative"
    >
      <div className="w-full overflow-hidden rounded-xl h-48 relative shadow-sm">
        <Image
          src={track.image}
          alt={track.title}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-700"
        />
      </div>
      <div className="flex flex-col flex-1 mt-2">
        <h4 className={`text-lg font-display font-bold text-${track.color} mb-3 leading-snug`}>{track.title}</h4>
        <p className="text-slate-500 text-sm leading-relaxed mb-6 flex-1">{track.desc}</p>
        <div className="w-full pt-5 border-t border-slate-100 flex items-center gap-3 mt-auto">
          <div className="w-8 h-8 rounded-full bg-slate-50 text-brand-navy flex items-center justify-center shrink-0">
            <Icon className="w-4 h-4" />
          </div>
          <CoursePoweredBy vendorKeys={track.vendorKeys} className="flex-1" />
        </div>
      </div>
      <Link href="/courses" className="absolute inset-0 z-10" aria-label={`Explore ${track.title} track`} />
    </motion.div>
  );
}
