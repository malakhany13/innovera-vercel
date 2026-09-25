"use client";

import { Check, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useAcademyPageContent } from "./AcademySeedContext";
import { Section, SectionHeading } from "./primitives";
import { FOR_YOU, NOT_FOR_YOU } from "@/data/academy";

export function AudienceSection() {
  const data = useAcademyPageContent();
  const forYou = data?.forYou?.length ? data.forYou : FOR_YOU;
  const notForYou = data?.notForYou?.length ? data.notForYou : NOT_FOR_YOU;

  return (
    <Section width="md">
      <SectionHeading eyebrow="Who Is This For?" title="You Are a Perfect Fit If…" />
      <div className="mt-12 grid gap-6 md:grid-cols-2">
        <Card className="border-border shadow-[var(--shadow-card)]">
          <CardContent className="p-8">
            <h3 className="font-bold text-primary">A great fit</h3>
            <ul className="mt-4 space-y-3 text-sm text-foreground">
              {forYou.map((f) => (
                <li key={f} className="flex gap-3">
                  <Check className="mt-0.5 size-5 shrink-0 text-accent" strokeWidth={3} />
                  {f}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
        <Card className="border-border shadow-[var(--shadow-card)]">
          <CardContent className="p-8">
            <h3 className="font-bold text-primary">Not for you if…</h3>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              {notForYou.map((f) => (
                <li key={f} className="flex gap-3">
                  <X className="mt-0.5 size-5 shrink-0 text-destructive" strokeWidth={3} />
                  {f}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </Section>
  );
}
