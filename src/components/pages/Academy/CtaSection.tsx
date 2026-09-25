import { ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function CtaSection() {
  return (
    <section id="apply" className="relative overflow-hidden bg-primary py-24 text-primary-foreground">
      <div className="absolute inset-0 opacity-10" style={{ background: "var(--gradient-hero)" }} />
      <div className="relative mx-auto max-w-3xl px-6 text-center">
        <span className="text-xs font-bold uppercase tracking-widest text-accent">
          Applications Open
        </span>
        <h2 className="mt-4 text-3xl font-extrabold leading-tight md:text-5xl">
          From Classroom to Co-Founder.
          <br />
          <span className="text-accent">Your Cohort Starts Soon.</span>
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-primary-foreground/85">
          Take the free Founder Readiness Scorecard, then apply for the next 12–16 week cohort.
          Leave with a working MVP, funding, and a backup job offer.
        </p>
        <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
          <a
            href="/contact"
            className={cn(
              buttonVariants({ size: "lg" }),
              "rounded-full bg-accent text-accent-foreground hover:bg-accent/90",
            )}
          >
            Apply Now <ArrowRight className="size-4" />
          </a>
          <a
            href="/courses"
            className={cn(
              buttonVariants({ size: "lg", variant: "outline" }),
              "rounded-full border-primary-foreground/40 bg-primary-foreground/10 text-primary-foreground backdrop-blur hover:bg-primary-foreground/20 hover:text-primary-foreground",
            )}
          >
           Browse Courses
          </a>
        </div>
        <p className="mt-6 text-sm text-primary-foreground/70">
          No equity taken · Non-dilutive micro-grants · Backup job offers from partners
        </p>
      </div>
    </section>
  );
}
