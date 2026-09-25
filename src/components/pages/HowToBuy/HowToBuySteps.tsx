import { motion } from "motion/react";
import { HOW_TO_BUY_STEPS } from "./constants";

export default function HowToBuySteps() {
  return (
    <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
      {HOW_TO_BUY_STEPS.map((item, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 relative"
        >
          <div className="w-12 h-12 bg-brand-cyan/10 text-brand-cyan rounded-xl flex items-center justify-center font-bold text-xl mb-6">
            {item.step}
          </div>
          <h3 className="text-xl font-bold mb-3">{item.title}</h3>
          <p className="text-slate-600">{item.desc}</p>
        </motion.div>
      ))}
    </div>
  );
}
