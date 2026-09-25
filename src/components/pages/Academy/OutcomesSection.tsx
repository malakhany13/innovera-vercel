"use client";

import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Legend,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
  } from "recharts";
  import { useAcademyPageContent } from "./AcademySeedContext";
  import { Section, SectionHeading } from "./primitives";
  import { COHORT_GROWTH, OUTCOME_DISTRIBUTION } from "@/data/academy";
  
  const PIE_COLORS = ["var(--accent)", "var(--primary)", "var(--muted-foreground)"];
  
  function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
    return (
      <figure className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
        <figcaption className="mb-4 text-sm font-semibold text-primary">{title}</figcaption>
        <div className="h-72 w-full">{children}</div>
      </figure>
    );
  }
  
  export function OutcomesSection() {
    const data = useAcademyPageContent();
    const outcomeDistribution = data?.outcomeDistribution?.length
      ? data.outcomeDistribution
      : OUTCOME_DISTRIBUTION;
    const cohortGrowth = data?.cohortGrowth?.length ? data.cohortGrowth : COHORT_GROWTH;

    return (
      <Section width="lg">
        <SectionHeading
          eyebrow="Outcomes by the Numbers"
          title="Every Cohort Compounds. Every Student Wins."
        />
        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          <ChartCard title="Where graduates land (% of cohort)">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={outcomeDistribution}
                  dataKey="value"
                  nameKey="label"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={3}
                >
                  {outcomeDistribution.map((entry, i) => (
                    <Cell key={entry.label} fill={PIE_COLORS[i % PIE_COLORS.length]} stroke="var(--card)" />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    borderRadius: 12,
                    border: "1px solid var(--border)",
                    background: "var(--card)",
                    color: "var(--foreground)",
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>
          <ChartCard title="Planned NUPS and startups funded">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={cohortGrowth} barGap={6}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="cohort" stroke="var(--muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                <Tooltip
                  cursor={{ fill: "var(--secondary)" }}
                  contentStyle={{
                    borderRadius: 12,
                    border: "1px solid var(--border)",
                    background: "var(--card)",
                    color: "var(--foreground)",
                  }}
                />
                <Legend />
                <Bar dataKey="mvps" name="MVPs built" fill="var(--primary)" radius={[6, 6, 0, 0]} />
                <Bar dataKey="funded" name="Startups funded" fill="var(--accent)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      </Section>
    );
  }
  