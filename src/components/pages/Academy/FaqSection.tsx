"use client";

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "@/components/ui/accordion";
  import { useAcademyPageContent } from "./AcademySeedContext";
  import { Section } from "./primitives";
  import { FAQ } from "@/data/academy";
  
  export function FaqSection() {
    const data = useAcademyPageContent();
    const faq = data?.faq?.length ? data.faq : FAQ;

    return (
      <Section surface width="sm">
        <div className="text-center">
          <span className="eyebrow">FAQ</span>
          <h2 className="mt-3 text-3xl font-extrabold text-primary md:text-4xl">
            Frequently Asked Questions
          </h2>
        </div>
        <Accordion className="mt-10">
          {faq.map((item, i) => (
            <AccordionItem
              key={item.q}
              value={`item-${i}`}
              className="mb-3 rounded-xl border border-border bg-card px-5 shadow-sm"
            >
              <AccordionTrigger className="text-base font-semibold text-primary hover:no-underline">
                {item.q}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{item.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Section>
    );
  }
  