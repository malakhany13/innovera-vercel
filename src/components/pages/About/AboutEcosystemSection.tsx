"use client";

import { AppWindow, ArrowRight, GraduationCap, Landmark } from "lucide-react";
import Image from "next/image";
import { motion } from "motion/react";
import Link from "next/link";

const FALLBACK_ECOSYSTEM_BG =
  "https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&q=80&w=2000";

const ECOSYSTEM_CARDS = [
  {
    icon: AppWindow,
    title: "Innovera Company",
    description:
      "A regional leader in AI, cybersecurity, and integrated digital solutions, backed by strategic partnerships and a strong focus on measurable transformation.",
    tag: "Digital Solutions",
    variant: "default" as const,
  },
  {
    icon: GraduationCap,
    title: "Innovera Academy",
    description:
      "Building future-ready talent through structured AI, software, and cybersecurity training, capacity-building programs, and digital learning solutions.",
    tag: "Transformative Learning",
    variant: "highlight" as const,
  },
  {
    icon: Landmark,
    title: "Innovera Investment",
    description:
      "Supporting high-potential startups in AI, cybersecurity, and digital transformation through early-stage funding, technical guidance, and market access.",
    tag: "Innovation-Driven",
    variant: "default" as const,
  },
];

export default function AboutEcosystemSection() {
  return (
    <section className="py-32 bg-brand-navy relative overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-20">
        <Image
          src={FALLBACK_ECOSYSTEM_BG}
          alt="Ecosystem background"
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-brand-navy via-brand-navy/80 to-brand-navy" />
      </div>
      <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-cyan/20 to-transparent z-10 -translate-y-1/2" />

      <div className="max-w-7xl mx-auto px-6 relative z-20">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-sm font-bold text-brand-cyan uppercase tracking-[0.2em] mb-4">
            Strategic Integration
          </h2>
          <h3 className="text-4xl lg:text-5xl font-display font-bold text-white mb-6">
            Our Ecosystem
          </h3>
          <p className="text-lg text-slate-300 leading-relaxed">
            Innovera combines integrated digital solutions, transformative learning,
            and innovation-driven investment to accelerate secure growth across Egypt
            and the MENA region.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 items-stretch relative">
          {ECOSYSTEM_CARDS.map(({ icon: Icon, title, description, tag, variant }, idx) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className={
                variant === "highlight"
                  ? "bg-brand-cyan/10 backdrop-blur-md rounded-3xl p-8 border border-brand-cyan/30 hover:border-brand-cyan hover:bg-brand-cyan/20 transition-all duration-500 group flex flex-col relative transform lg:-translate-y-4 shadow-[0_0_40px_-10px_rgba(6,182,212,0.3)]"
                  : "bg-slate-800/50 backdrop-blur-md rounded-3xl p-8 border border-white/5 hover:border-brand-cyan/50 hover:bg-slate-800/80 transition-all duration-500 group flex flex-col relative"
              }
            >
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                <Icon className="w-32 h-32 text-brand-cyan" />
              </div>
              <div
                className={
                  variant === "highlight"
                    ? "w-14 h-14 bg-brand-cyan rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-brand-cyan/40 group-hover:scale-110 transition-transform duration-500"
                    : "w-14 h-14 bg-brand-cyan/10 rounded-2xl flex items-center justify-center mb-8 border border-brand-cyan/20 group-hover:scale-110 transition-transform duration-500"
                }
              >
                <Icon
                  className={`w-6 h-6 ${
                    variant === "highlight" ? "text-brand-navy" : "text-brand-cyan"
                  }`}
                />
              </div>
              <h4 className="text-2xl font-display font-bold text-white mb-4">{title}</h4>
              <p
                className={`leading-relaxed mb-8 flex-1 relative z-10 ${
                  variant === "highlight" ? "text-slate-300" : "text-slate-400"
                }`}
              >
                {description}
              </p>
              <div
                className={`pt-6 mt-auto ${
                  variant === "highlight"
                    ? "border-t border-brand-cyan/20"
                    : "border-t border-white/10"
                }`}
              >
                <span className="text-xs font-bold text-brand-cyan uppercase tracking-widest">
                  {tag}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-16">
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-8 py-4 bg-brand-cyan text-white rounded-full font-bold hover:bg-cyan-400 hover:-translate-y-1 shadow-lg shadow-brand-cyan/30 transition-all duration-300"
          >
            Get in Touch <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
