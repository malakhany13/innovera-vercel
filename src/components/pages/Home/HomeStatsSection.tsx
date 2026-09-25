import { Building, Handshake, UserCheck, Users } from "lucide-react";
import { motion } from "motion/react";
import AnimatedCounter from "@/src/components/ui/AnimatedCounter";

const STATS = [
  { icon: Building, value: 500, suffix: "+", label: "Enterprise Clients", delay: 0.1 },
  { icon: UserCheck, value: 50, suffix: "+", label: "Expert Instructors", delay: 0.2 },
  { icon: Users, value: 10, suffix: "k+", label: "Professionals Trained", delay: 0.3 },
  { icon: Handshake, value: 15, suffix: "+", label: "Global Tech Partners", delay: 0.4 },
] as const;

export default function HomeStatsSection() {
  return (
    <section className="py-24 bg-brand-navy text-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-brand-cyan/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/4" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center divide-x divide-white/10">
          {STATS.map(({ icon: Icon, value, suffix, label, delay }) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay }}
              className="flex flex-col items-center justify-center p-4"
            >
              <div className="flex items-center justify-center gap-3 mb-2 text-brand-cyan">
                <Icon className="w-8 h-8 opacity-80 shrink-0" />
                <AnimatedCounter value={value} suffix={suffix} />
              </div>
              <div className="text-brand-cyan/80 text-sm md:text-base uppercase tracking-widest font-semibold">
                {label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
