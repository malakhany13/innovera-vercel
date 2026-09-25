"use client";

import type { AboutPageContent } from "@/features/directus/types";
import { AboutSeedProvider } from "./AboutSeedContext";
import {
  AboutCoreValuesSection,
  AboutEcosystemSection,
  AboutGlobalPresenceSection,
  AboutHeroSection,
  AboutMissionVisionSection,
  AboutWhyInnoveraSection,
} from "./sections";

interface AboutProps {
  initialAboutPage?: AboutPageContent | null;
}

export default function About({ initialAboutPage = null }: AboutProps) {
  return (
    <AboutSeedProvider aboutPage={initialAboutPage}>
      <div className="min-h-screen bg-white">
        <AboutHeroSection />
        <AboutMissionVisionSection />
        <AboutEcosystemSection />
        <AboutCoreValuesSection />
        <AboutWhyInnoveraSection />
        <AboutGlobalPresenceSection />
      </div>
    </AboutSeedProvider>
  );
}
