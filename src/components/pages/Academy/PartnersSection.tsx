"use client";

import { useAcademyPageContent } from "./AcademySeedContext";
import { getCourseImage } from "@/lib/directus";
import { Section } from "./primitives";
import { PARTNERS } from "@/data/academy";

function resolvePartnerLogoSrc(logo?: string): string | undefined {
  if (!logo) return undefined;
  if (logo.startsWith("/")) return logo;
  if (logo.startsWith("http")) return logo;
  return getCourseImage(logo);
}

export function PartnersSection() {
  const data = useAcademyPageContent();
  const partners = data?.cmsConnected
    ? data.partners
    : data?.partners?.length
      ? data.partners
      : PARTNERS;

  return (
    <Section width="md" className="py-16">
      <div className="text-center">
        <span className="eyebrow">Partners &amp; Accreditation</span>
        <h2 className="mt-3 text-2xl font-extrabold text-primary md:text-3xl">
          Trusted by Academic Institutions &amp; Industry Enterprises
        </h2>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-6">
          {partners.map((p) => {
            const logo = resolvePartnerLogoSrc(p.logo);

            return logo ? (
              <div key={p.name} className="relative h-12 w-28 shrink-0 lg:w-32">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={logo}
                  alt={p.name}
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-contain grayscale transition-all duration-300 hover:grayscale-0"
                />
              </div>
            ) : (
              <span
                key={p.name}
                className="flex h-12 items-center rounded-lg border border-border px-4 text-sm font-semibold text-muted-foreground"
              >
                {p.name}
              </span>
            );
          })}
        </div>
      </div>
    </Section>
  );
}
