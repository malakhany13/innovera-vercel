import { motion } from "motion/react";
import { industries } from "@/constants";

export default function HomeIndustriesSection() {
  return (
    <section className="py-24 bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <h2 className="text-sm font-bold text-brand-cyan uppercase tracking-[0.2em] mb-4">Industries & Sectors</h2>
          <h3 className="text-4xl lg:text-5xl font-display font-bold text-brand-navy mb-6">Industries We Serve</h3>
          <p className="text-slate-500 text-lg">
            Delivering specialized technology and transformation strategies across key regional industries.
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-x-4 gap-y-12 justify-items-center">
          {industries.map((industry, idx) => (
            <motion.div
              key={industry.name}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
              className="flex flex-col items-center gap-4 group cursor-pointer w-full text-center"
            >
              <industry.icon className="w-10 h-10 text-slate-400 group-hover:text-brand-cyan transition-colors stroke-[1.5] group-hover:scale-110 duration-300" />
              <span className="text-[15px] font-medium text-slate-600 group-hover:text-brand-navy transition-colors">
                {industry.name}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
