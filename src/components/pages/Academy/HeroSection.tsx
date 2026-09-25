"use client";

import { useMemo } from "react";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { getCourseImage } from "@/lib/directus";
import { ArrowRight } from "lucide-react";
import { useAcademyPageContent } from "./AcademySeedContext";

const TRUST = ["Accredited by AICERTS", "Palo Alto Networks", "Fortinet", "Engineering Syndicate"];

const FALLBACK_HERO_IMAGE =
  "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=2070";

function resolveHeroImageSrc(image: string): string {
  if (image.startsWith("/")) return image;
  if (image.startsWith("http")) return image;
  return getCourseImage(image, { width: 2070 });
}

export function HeroSection() {
  const data = useAcademyPageContent();

  const heroImages = data?.cmsConnected
    ? data.heroImages
    : data?.heroImages?.length
      ? data.heroImages
      : [];

  const backgroundImage = useMemo(() => {
    const cmsImage = heroImages[0]?.image;
    if (cmsImage) return resolveHeroImageSrc(cmsImage);
    if (data?.cmsConnected) return undefined;
    return FALLBACK_HERO_IMAGE;
  }, [data?.cmsConnected, heroImages]);

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0" style={{ background: "var(--gradient-hero)" }} />
      {backgroundImage ? (
        <div
          className="absolute inset-0 opacity-20 mix-blend-overlay"
          style={{
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
          role="img"
          aria-label={heroImages[0]?.alt ?? "Academy hero background"}
        />
      ) : null}
      <div className="relative mx-auto max-w-7xl px-6 py-24 md:py-32">
        <div className="max-w-3xl">
          <Badge className="rounded-full bg-primary-foreground/15 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-primary-foreground hover:bg-primary-foreground/15">
            Innovera Academy
          </Badge>
          <h1 className="mt-6 text-4xl font-extrabold leading-tight text-primary-foreground md:text-6xl">
            You Know How to Code.
            <br />
            <span className="text-accent">We Teach You How to Build a Company.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-primary-foreground/85">
            A 12–16 week, evening-and-weekend program for university students. You leave with a
            working MVP, a pitch deck, a micro-grant or pilot customer, and a backup job offer.
          </p>
          <div className="mt-9 flex flex-wrap gap-4">
            <a
              href="#apply"
              className={cn(
                buttonVariants({ size: "lg" }),
                "rounded-full bg-accent text-accent-foreground hover:bg-accent/90",
              )}
            >
              Take the Free Founder Readiness Scorecard <ArrowRight className="size-4" />
            </a>
            <a
              href="/courses"
              className={cn(
                buttonVariants({ size: "lg", variant: "outline" }),
                "rounded-full border-primary-foreground/40 bg-primary-foreground/10 text-primary-foreground backdrop-blur hover:bg-primary-foreground/20 hover:text-primary-foreground",
              )}
            >
              Browse Courses first
            </a>
          </div>
        </div>
      </div>
      <div className="relative border-t border-primary-foreground/15 bg-primary/40 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-8 gap-y-2 px-6 py-5 text-sm text-primary-foreground/80">
          {TRUST.map((item, i) => (
            <span key={item} className="flex items-center gap-8">
              {i === 0 ? <span className="font-semibold text-primary-foreground/60">{item}</span> : item}
              {i < TRUST.length - 1 && <span className="hidden sm:inline">·</span>}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
