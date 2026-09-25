"use client";

import { Check, X } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAcademyPageContent } from "./AcademySeedContext";
import { Section, SectionHeading } from "./primitives";
import { COMPARISON, type CellValue } from "@/data/academy";

function Cell({ value }: { value: CellValue }) {
  if (value === true) return <Check className="mx-auto size-5 text-accent" strokeWidth={3} />;
  if (value === false) return <X className="mx-auto size-5 text-muted-foreground/40" />;
  return <span className="text-sm font-medium text-primary">{value}</span>;
}

const COLUMNS = ["University Capstone", "Online Course", "Startup Weekend"] as const;

export function ComparisonSection() {
  const data = useAcademyPageContent();
  const comparison = data?.comparison?.length ? data.comparison : COMPARISON;

  return (
    <Section surface width="lg">
      <SectionHeading
        eyebrow="What Makes Us Different"
        title="Not Another Online Course. Not a University Incubator."
      />
      <div className="mt-12 overflow-x-auto rounded-2xl border border-border bg-card shadow-[var(--shadow-card)]">
        <Table className="min-w-[640px]">
          <TableHeader>
            <TableRow className="bg-secondary/60 hover:bg-secondary/60">
              <TableHead className="px-5 py-4 font-bold text-primary">Capability</TableHead>
              {COLUMNS.map((col) => (
                <TableHead key={col} className="px-5 py-4 text-center font-semibold text-muted-foreground">
                  {col}
                </TableHead>
              ))}
              <TableHead className="px-5 py-4 text-center font-bold text-accent">
                Innovera Academy
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {comparison.map((row, idx) => (
              <TableRow key={row.feature} className={idx % 2 ? "bg-secondary/20" : ""}>
                <TableCell className="px-5 py-4 font-medium text-foreground">{row.feature}</TableCell>
                <TableCell className="px-5 py-4 text-center">
                  <Cell value={row.uni} />
                </TableCell>
                <TableCell className="px-5 py-4 text-center">
                  <Cell value={row.online} />
                </TableCell>
                <TableCell className="px-5 py-4 text-center">
                  <Cell value={row.weekend} />
                </TableCell>
                <TableCell className="bg-accent/5 px-5 py-4 text-center">
                  <Cell value={row.innovera} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <p className="mx-auto mt-8 max-w-3xl text-center text-lg font-semibold text-primary">
        The only program covering technical skills, business training, funding, AND a backup job
        — all in one 12–16 week flywheel.
      </p>
    </Section>
  );
}
