import { motion } from "motion/react";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

export interface LegalSection {
  icon: LucideIcon;
  title: string;
  content: ReactNode;
}

interface LegalDocumentLayoutProps {
  title: string;
  lastUpdated: string;
  lead: string;
  sections: LegalSection[];
  footer: ReactNode;
}

export default function LegalDocumentLayout({
  title,
  lastUpdated,
  lead,
  sections,
  footer,
}: LegalDocumentLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-24">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center"
        >
          <h1 className="text-4xl md:text-5xl font-display font-bold text-brand-navy mb-6">{title}</h1>
          <p className="text-slate-600 text-lg">Last Updated: {lastUpdated}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-slate-100 prose prose-slate max-w-none"
        >
          <p className="lead text-lg text-slate-700 mb-8">{lead}</p>

          <div className="space-y-12">
            {sections.map((section) => {
              const Icon = section.icon;
              return (
                <section key={section.title}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-brand-cyan/10 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-brand-cyan" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 m-0">{section.title}</h2>
                  </div>
                  {section.content}
                </section>
              );
            })}
          </div>

          <div className="mt-12 pt-8 border-t border-slate-100">{footer}</div>
        </motion.div>
      </div>
    </div>
  );
}
