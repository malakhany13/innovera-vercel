"use client";

import { useAcademyPageContent } from "./AcademySeedContext";
import { Section, SectionHeading } from "./primitives";
import { READINESS_GAP } from "@/data/academy";

function GapBar({ label, value, tone }: { label: string; value: number; tone: "accent" | "primary" }) {
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <span className="text-sm font-medium text-muted-foreground">{label}</span>
        <span className={tone === "accent" ? "text-2xl font-extrabold text-accent" : "text-2xl font-extrabold text-primary"}>
          {value}%
        </span>
      </div>
      <div className="mt-2 h-3 w-full overflow-hidden rounded-full bg-secondary">
        <div
          className={tone === "accent" ? "h-full rounded-full bg-accent" : "h-full rounded-full bg-primary"}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

export function ProblemSection() {
  const data = useAcademyPageContent();
  const gap =
    data?.readinessGap && data.readinessGap.length >= 2 ? data.readinessGap : READINESS_GAP;

  return (
    <Section surface width="md">
      <SectionHeading eyebrow="The Startup Readiness Gap" title="Strong skills. Few founders." />
      <div className="mt-10 grid items-center gap-8 md:grid-cols-2">
        <figure className="rounded-2xl bg-card p-8 shadow-[var(--shadow-card)]">
          <figcaption className="mb-6 text-sm font-semibold text-primary">
            Engineering graduates — skills vs. launch ability
          </figcaption>
          <div className="space-y-6">
            <GapBar label={gap[0].label} value={gap[0].value} tone="accent" />
            <GapBar label={gap[1].label} value={gap[1].value} tone="primary" />
          </div>
        </figure>
        <blockquote className="rounded-2xl border-l-4 border-accent bg-secondary p-8 text-lg font-medium italic text-secondary-foreground">
          &ldquo;Innovera Academy closes that gap. Not with theory. With building, funding, and a backup
          plan.&rdquo;
        </blockquote>
      </div>
    </Section>
  );
}
