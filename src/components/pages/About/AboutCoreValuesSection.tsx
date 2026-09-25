import { Shield } from "lucide-react";
import { motion } from "motion/react";
import { useAboutPageContent } from "./AboutSeedContext";
import { FALLBACK_CORE_VALUES, FALLBACK_SECTION_HEADERS, getAboutIcon } from "./constants";

export default function AboutCoreValuesSection() {
  const aboutPage = useAboutPageContent();
  const header = aboutPage?.sectionHeaders.core_values ?? FALLBACK_SECTION_HEADERS.core_values;
  const coreValues = aboutPage?.coreValues.length ? aboutPage.coreValues : FALLBACK_CORE_VALUES;

  return (
    <section className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-sm font-bold text-brand-cyan uppercase tracking-[0.2em] mb-4">{header.badge}</h2>
          <h3 className="text-4xl lg:text-5xl font-display font-bold text-brand-navy">{header.title}</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {coreValues.map((value, idx) => {
            const Icon = getAboutIcon(value.icon, Shield);
            return (
              <motion.div
                key={value.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="p-8 rounded-3xl bg-white shadow-sm border border-slate-100 hover:shadow-xl hover:border-brand-cyan/30 transition-all group flex flex-col items-center text-center"
              >
                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-brand-cyan group-hover:text-white transition-colors">
                  <Icon className="w-8 h-8 text-brand-cyan group-hover:text-white transition-colors" />
                </div>
                <h4 className="text-xl font-bold text-brand-navy mb-3">{value.title}</h4>
                <p className="text-slate-600 leading-relaxed">{value.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
