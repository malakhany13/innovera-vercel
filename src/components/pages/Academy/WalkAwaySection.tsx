"use client";

import { Award } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useAcademyPageContent } from "./AcademySeedContext";
import { Section, SectionHeading } from "./primitives";
import { WALK_AWAY } from "@/data/academy";
import { getAcademyIcon } from "./constants";

export function WalkAwaySection() {
  const data = useAcademyPageContent();
  const walkAway = data?.walkAway?.length ? data.walkAway : WALK_AWAY;

  return (
    <Section surface width="lg">
      <SectionHeading
        eyebrow="What You Walk Away With"
        title="Tangible Assets. Not Just a Certificate."
      />
      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {walkAway.map((item) => {
          const Icon = getAcademyIcon(item.icon, Award);
          return (
          <Card key={item.title} className="border-border shadow-[var(--shadow-card)]">
            <CardContent className="flex gap-4 p-6">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-accent/15 text-accent">
                <Icon className="size-5" />
              </span>
              <div>
                <h3 className="font-bold text-primary">{item.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{item.desc}</p>
              </div>
            </CardContent>
          </Card>
          );
        })}
      </div>
      <div className="mx-auto mt-10 max-w-3xl rounded-2xl border-l-4 border-accent bg-card p-6 text-center shadow-[var(--shadow-card)]">
        <p className="font-medium text-foreground">
          Top graduates receive{" "}
          <span className="font-bold text-primary">non-dilutive micro-grants</span>. No equity. No
          repayment unless your startup raises significant external funding.
        </p>
      </div>
    </Section>
  );
}
