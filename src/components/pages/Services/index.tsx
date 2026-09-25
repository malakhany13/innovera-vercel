"use client";

import Link from "next/link";
import {
  AppWindow,
  ArrowRight,
  Brain,
  Briefcase,
  Calendar,
  Cloud,
  Globe,
  GraduationCap,
  Handshake,
  Lightbulb,
  Shield,
  Users,
  type LucideIcon,
} from "lucide-react";
import { FALLBACK_COURSE_IMAGE_ALT, getCourseImage } from "@/lib/directus";
import type { ServicesPageCard, ServicesPageContent } from "@/features/directus/types";

type FeatureItem = { title: string; icon: LucideIcon };

const CORE_FEATURES: FeatureItem[] = [
  { title: "AI, Data & Intelligent Automation", icon: Brain },
  { title: "Cybersecurity & Digital Resilience", icon: Shield },
  { title: "Software, Cloud & Infrastructure", icon: Cloud },
  { title: "Digital Platforms & Products", icon: AppWindow },
  { title: "Consulting & Transformation", icon: Lightbulb },
  { title: "Outsourcing & Operations", icon: Users },
];

const EVENT_FEATURES: FeatureItem[] = [
  { title: "Events & Conferences", icon: Calendar },
  { title: "International Admission", icon: GraduationCap },
];

const STRATEGIC_FEATURES: FeatureItem[] = [
  { title: "Strategic Partnerships", icon: Handshake },
  { title: "Innovation and R&D", icon: Lightbulb },
  { title: "Regional Growth", icon: Globe },
  { title: "Industry Engagement", icon: Briefcase },
];

const FALLBACK_FEATURES_BY_TITLE: Record<string, FeatureItem[]> = {
  "technology services": CORE_FEATURES,
  "event management": EVENT_FEATURES,
  "strategic initiatives": STRATEGIC_FEATURES,
};

const FALLBACK_ICONS: LucideIcon[] = [
  Brain,
  Shield,
  Cloud,
  AppWindow,
  Lightbulb,
  Users,
  Calendar,
  Handshake,
];

function normalizeTitle(title: string): string {
  return title.trim().toLowerCase().replace(/\s+/g, " ");
}

function resolveFeatures(card: ServicesPageCard): FeatureItem[] {
  if (card.features.length > 0) {
    return card.features.map((title, index) => ({
      title,
      icon: FALLBACK_ICONS[index % FALLBACK_ICONS.length],
    }));
  }
  return FALLBACK_FEATURES_BY_TITLE[normalizeTitle(card.title)] ?? [];
}

interface ServicesProps {
  initialServicesPage?: ServicesPageContent | null;
}

export default function Services({ initialServicesPage = null }: ServicesProps) {
  const cards = initialServicesPage?.cards ?? [];

  return (
    <main className="min-h-screen bg-[#f7f8fa]">
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center pt-16 sm:pt-20 pb-12 sm:pb-16 text-center">
          <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-[90px] font-bold leading-tight tracking-[0.04em] text-slate-800">
            Our <span className="text-brand-cyan">Services</span>
          </h1>

          <p className="mt-6 sm:mt-8 max-w-3xl text-base sm:text-lg md:text-xl leading-relaxed text-slate-600">
          Integrated digital solutions, specialized services, and strategic initiatives that help organizations innovate, secure, and grow.
          </p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 pb-16 sm:pb-20 md:pb-24">
        <div className="flex w-full flex-col gap-8 sm:gap-10">
          {cards.length === 0 ? (
            <p className="text-center text-slate-500">
              Services content is unavailable right now.
            </p>
          ) : (
            cards.map((card) => {
              const features = resolveFeatures(card);

              return (
                <article
                  key={card.id}
                  className="grid w-full grid-cols-1 overflow-hidden rounded-[24px] bg-white shadow-[0_10px_40px_rgba(15,23,42,0.08)] md:min-h-[300px] md:[grid-template-columns:29%_1fr]"
                  style={{ borderRadius: 24 }}
                >
                  {/* Image — 29% on desktop */}
                  <div className="relative h-56 overflow-hidden bg-slate-200 sm:h-64 md:h-auto md:min-h-[300px]">
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

                  {/* Content — remaining 71% */}
                  <div
                    className="flex flex-col bg-white px-6 py-6 sm:px-8 sm:py-7 md:px-10 md:py-8"
                    style={{ color: "#003f83" }}
                  >
                    <h2
                      className="text-2xl font-bold tracking-tight sm:text-[28px]"
                      style={{ color: "#003f83" }}
                    >
                      {card.title}
                    </h2>

                    {card.description ? (
                      <p
                        className="mt-3 max-w-3xl text-sm leading-relaxed sm:text-[15px]"
                        style={{ color: "#6d7481" }}
                      >
                        {card.description}
                      </p>
                    ) : null}

                    {features.length > 0 ? (
                      <>
                        <div className="my-5 border-t border-slate-200" />
                        <div className="grid grid-cols-1 gap-x-10 gap-y-2 sm:grid-cols-2">
                          {features.map((feature) => {
                            const Icon = feature.icon;
                            return (
                              <div
                                key={`${card.id}-${feature.title}`}
                                className="flex items-center gap-3"
                              >
                                <span
                                  className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                                  style={{ backgroundColor: "#ecfeff", color: "#3dc0c8" }}
                                >
                                  <Icon className="h-4 w-4" aria-hidden />
                                </span>
                                <span
                                  className="text-sm font-medium"
                                  style={{ color: "#334155" }}
                                >
                                  {feature.title}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </>
                    ) : null}

                    <div className="mt-auto flex justify-end pt-6">
                      <Link
                        href="/contact"
                        className="inline-flex items-center gap-1.5 text-sm font-medium transition-colors hover:opacity-80"
                        style={{ color: "#003f83" }}
                      >
                        Learn more
                        <ArrowRight className="h-4 w-4" aria-hidden />
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })
          )}
        </div>
      </section>
    </main>
  );
}
