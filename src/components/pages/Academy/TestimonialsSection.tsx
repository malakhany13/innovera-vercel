"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { useAcademyPageContent } from "./AcademySeedContext";
import { Section, SectionHeading } from "./primitives";
import { TESTIMONIALS } from "@/data/academy";

export function TestimonialsSection() {
  const data = useAcademyPageContent();
  const testimonials = data?.testimonials?.length ? data.testimonials : TESTIMONIALS;

  return (
    <Section surface width="lg">
      <SectionHeading
        eyebrow="Testimonials"
        title="Real Students. Real Startups. Real Outcomes."
      />
      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {testimonials.map((t) => (
          <Card key={t.name} className="flex flex-col border-border shadow-[var(--shadow-card)]">
            <CardContent className="flex flex-1 flex-col p-7">
              <div className="flex items-center gap-3">
                <Avatar className="size-12">
                  <AvatarFallback className="bg-primary text-lg font-bold text-primary-foreground">
                    {t.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-bold text-primary">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.school}</p>
                </div>
              </div>
              <p className="mt-4 flex-1 text-sm italic text-foreground">&ldquo;{t.quote}&rdquo;</p>
              <p className="mt-4 rounded-lg bg-accent/10 p-3 text-xs font-semibold text-primary">
                Outcome: {t.outcome}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </Section>
  );
}
