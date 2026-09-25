"use client";

import type { AcademyPageContent } from "@/features/directus/types";
import { AcademySeedProvider } from "./AcademySeedContext";
import { HeroSection } from "./HeroSection";
import { ProblemSection } from "./ProblemSection";
import { OutcomesSection } from "./OutcomesSection";
import { FlywheelSection } from "./FlywheelSection";
import { ComparisonSection } from "./ComparisonSection";
import { PathwaysSection } from "./PathwaysSection";
import { WalkAwaySection } from "./WalkAwaySection";
import { AudienceSection } from "./AudienceSection";
import { TestimonialsSection } from "./TestimonialsSection";
import { PartnersSection } from "./PartnersSection";
import { FaqSection } from "./FaqSection";
import { CtaSection } from "./CtaSection";

interface AcademyProps {
  initialAcademyPage?: AcademyPageContent | null;
}

export default function Academy({ initialAcademyPage = null }: AcademyProps) {
  return (
    <AcademySeedProvider academyPage={initialAcademyPage}>
      <div className="academy min-h-screen bg-background">
        <HeroSection />
        <ProblemSection />
        <OutcomesSection />
        <FlywheelSection />
        <ComparisonSection />
        <PathwaysSection />
        <WalkAwaySection />
        <AudienceSection />
        <TestimonialsSection />
        <PartnersSection />
        <FaqSection />
        <CtaSection />
      </div>
    </AcademySeedProvider>
  );
}
