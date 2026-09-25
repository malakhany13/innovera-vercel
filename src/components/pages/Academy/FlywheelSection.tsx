"use client";

import { Check, Lightbulb } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useAcademyPageContent } from "./AcademySeedContext";
import { Section, SectionHeading } from "./primitives";
import { FLYWHEEL } from "@/data/academy";
import { getAcademyIcon } from "./constants";

export function FlywheelSection() {
  const data = useAcademyPageContent();
  const flywheel = data?.flywheel?.length ? data.flywheel : FLYWHEEL;

  return (
    <Section id="flywheel" width="xl">
      <SectionHeading
        eyebrow="The Innovera Flywheel"
        title="Four Engines. One Compounding Path to Founder."
      />
      <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {flywheel.map((phase, i) => {
          const Icon = getAcademyIcon(phase.icon, Lightbulb);
          return (
          <Card
            key={phase.phase}
            className="group flex flex-col border-border shadow-[var(--shadow-card)] transition-all hover:-translate-y-1 hover:shadow-[var(--shadow-elevated)]"
          >
            <CardContent className="flex flex-1 flex-col p-7">
              <div className="flex items-center justify-between">
                <span className="flex size-12 items-center justify-center rounded-xl bg-accent/15 text-accent">
                  <Icon className="size-6" />
                </span>
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  0{i + 1}
                </span>
              </div>
              <h3 className="mt-5 text-xl font-extrabold uppercase text-primary">{phase.phase}</h3>
              <p className="text-xs font-semibold text-accent">{phase.weeks}</p>
              <p className="mt-1 text-sm font-medium text-foreground">{phase.subtitle}</p>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                {phase.points.map((p) => (
                  <li key={p} className="flex gap-2">
                    <Check className="mt-0.5 size-4 shrink-0 text-accent" />
                    {p}
                  </li>
                ))}
              </ul>
              <p className="mt-5 rounded-lg bg-secondary p-3 text-xs font-medium text-secondary-foreground">
                <span className="font-bold text-primary">Deliverable: </span>
                {phase.deliverable}
              </p>
            </CardContent>
          </Card>
          );
        })}
      </div>
      <p className="mx-auto mt-10 max-w-3xl text-center text-muted-foreground">
        Graduates become mentors. Successful founders return as angels. Corporate hires become
        sponsors. <span className="font-semibold text-primary">The loop closes.</span>
      </p>
    </Section>
  );
}
