"use client";

import PartnersHeroSection from "./PartnersHeroSection";
import PartnersSectionsGrid from "./PartnersSectionsGrid";
import type { PartnersPageContent } from "@/features/directus/types";

interface PartnersProps {
  initialPartnersPage?: PartnersPageContent | null;
}

export default function Partners({ initialPartnersPage = null }: PartnersProps) {
  return (
    <div className="min-h-screen bg-slate-50">
      <PartnersHeroSection hero={initialPartnersPage?.hero ?? null} />
      <PartnersSectionsGrid sections={initialPartnersPage?.sections ?? []} />
    </div>
  );
}
