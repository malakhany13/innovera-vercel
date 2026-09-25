"use client";

import Image from "next/image";
import { Check, Repeat, Rocket } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useAcademyPageContent } from "./AcademySeedContext";
import type { AcademyPathSectionImage } from "@/features/directus/types";
import { getCourseImage } from "@/lib/directus";
import { Section, SectionHeading } from "./primitives";
import { PATHWAYS } from "@/data/academy";
import { getAcademyIcon } from "./constants";

const FALLBACK_PATH_SECTION_IMAGES: AcademyPathSectionImage[] = [
  {
    id: 0,
    sort: 0,
    title: "Learn. Teach. Grow. Together.",
    alt: "Learn. Teach. Grow. Together. Empowering students, educators, and businesses with knowledge, skills, and solutions for a better tomorrow.",
    image: "/images/academy/learn-teach-grow-together.png",
  },
];

function resolvePathSectionImage(src: string): string {
  if (src.startsWith("/")) return src;
  return getCourseImage(src, { width: 1920 });
}

export function PathwaysSection() {
  const data = useAcademyPageContent();
  const pathways = data?.pathways?.length ? data.pathways : PATHWAYS;
  const pathSectionImages = data?.cmsConnected
    ? data.pathSectionImages
    : data?.pathSectionImages?.length
      ? data.pathSectionImages
      : FALLBACK_PATH_SECTION_IMAGES;

  return (
    <Section width="lg">
      <SectionHeading eyebrow="Success Pathways" title="Two Doors. Both Lead to Success." />
      {pathSectionImages.length > 0 ? (
        <div className="mt-12 space-y-6">
          {pathSectionImages.map((item) => (
            <div
              key={item.id}
              className="overflow-hidden rounded-2xl border border-border shadow-[var(--shadow-card)]"
            >
              <Image
                src={resolvePathSectionImage(item.image)}
                alt={item.alt}
                width={1920}
                height={1080}
                className="h-auto w-full"
                sizes="(max-width: 1152px) 100vw, 1152px"
              />
            </div>
          ))}
        </div>
      ) : null}
      <div className="mt-12 grid gap-6 md:grid-cols-2">
        {pathways.map((path) => {
          const Icon = getAcademyIcon(path.icon, Rocket);
          return (
            <Card key={path.title} className="border-border shadow-[var(--shadow-card)]">
              <CardContent className="p-8">
                <span
                  className={
                    path.tone === "accent"
                      ? "flex size-12 items-center justify-center rounded-xl bg-accent/15 text-accent"
                      : "flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary"
                  }
                >
                  <Icon className="size-6" />
                </span>
                <h3 className="mt-4 text-xl font-extrabold text-primary">{path.title}</h3>
                <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                  {path.points.map((p) => (
                    <li key={p} className="flex gap-2">
                      <Check className="mt-0.5 size-4 shrink-0 text-accent" />
                      {p}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          );
        })}
      </div>

  

      <div className="mt-12 rounded-2xl bg-primary p-8 text-center text-primary-foreground">
        <div className="flex items-center justify-center gap-2 text-accent">
          <Repeat className="size-5" />
          <span className="text-sm font-bold uppercase tracking-wider">
            Path 3 · Both (most common)
          </span>
        </div>
        <p className="mx-auto mt-3 max-w-2xl text-lg italic">
          &ldquo;Work a corporate job. Build experience and savings. Launch your startup later with
          Innovera alumni co-founders.&rdquo;
        </p>
      </div>
    </Section>
  );
}
