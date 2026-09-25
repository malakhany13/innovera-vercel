"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { FALLBACK_COURSE_IMAGE_ALT, getCourseImage } from "@/lib/directus";
import type { ServicesPageCard } from "@/features/directus/types";

interface HomeServicesSectionProps {
  cards?: ServicesPageCard[];
}

export default function HomeServicesSection({ cards = [] }: HomeServicesSectionProps) {
  if (cards.length === 0) return null;

  return (
    <section className="py-24 sm:py-32 bg-[#f7f8fa] border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 gap-6">
          <div className="max-w-3xl">
            <h2 className="text-sm font-bold text-brand-cyan uppercase tracking-[0.2em] mb-4">
              What We Offer
            </h2>
            <h3 className="text-4xl lg:text-5xl font-display font-bold text-brand-navy">
              Our Services
            </h3>
          </div>
          <Link
            href="/services"
            className="inline-flex items-center gap-2 text-brand-cyan font-bold hover:gap-3 transition-all"
          >
            View All Services <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        <div className="flex w-full flex-col gap-8">
          {cards.map((card, idx) => (
            <motion.article
              key={card.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: idx * 0.06 }}
              className="grid w-full grid-cols-1 overflow-hidden rounded-[24px] bg-white shadow-[0_10px_40px_rgba(15,23,42,0.08)] md:min-h-[260px] md:[grid-template-columns:29%_1fr]"
            >
              <div className="relative h-52 overflow-hidden bg-slate-200 sm:h-56 md:h-auto md:min-h-[260px]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={getCourseImage(card.image, { width: 720 })}
                  alt={card.title || "Service"}
                  className="absolute inset-0 h-full w-full object-cover"
                  onError={(event) => {
                    event.currentTarget.src = FALLBACK_COURSE_IMAGE_ALT;
                  }}
                />
              </div>

              <div className="flex flex-col justify-center px-6 py-6 sm:px-8 sm:py-7 md:px-10 md:py-8">
                <h4
                  className="text-2xl font-bold tracking-tight sm:text-[28px]"
                  style={{ color: "#003f83" }}
                >
                  {card.title}
                </h4>
                {card.description ? (
                  <p
                    className="mt-3 max-w-3xl text-sm leading-relaxed sm:text-[15px]"
                    style={{ color: "#6d7481" }}
                  >
                    {card.description}
                  </p>
                ) : null}
                <div className="mt-6 flex justify-end">
                  <Link
                    href="/services"
                    className="inline-flex items-center gap-1.5 text-sm font-medium transition-colors hover:opacity-80"
                    style={{ color: "#003f83" }}
                  >
                    Learn more
                    <ArrowRight className="h-4 w-4" aria-hidden />
                  </Link>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
