import { ArrowRight, Code } from "lucide-react";
import { motion } from "motion/react";
import { useMockFormSubmit } from "@/src/hooks/useMockFormSubmit";

export default function ContactFormSection() {
  const { isSubmitting, isSubmitted, handleSubmit, reset } = useMockFormSubmit();

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100"
    >
      {isSubmitted ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Code className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-bold mb-2">Message Sent!</h3>
          <p className="text-slate-600 mb-8">Thank you for reaching out. We will get back to you shortly.</p>
          <button
            onClick={reset}
            className="px-6 py-2.5 bg-slate-100 text-slate-800 rounded-lg font-medium hover:bg-slate-200 transition-colors"
          >
            Send Another Message
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
            <input required type="text" id="name" className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-cyan focus:border-transparent transition-all" placeholder="John Doe" />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
            <input required type="email" id="email" className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-cyan focus:border-transparent transition-all" placeholder="john@company.com" />
          </div>
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-2">Message</label>
            <textarea required id="message" rows={4} className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-cyan focus:border-transparent transition-all resize-none" placeholder="How can we help you?"></textarea>
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 py-3 bg-brand-cyan text-white rounded-lg font-medium hover:bg-opacity-90 transition-all disabled:opacity-70"
          >
            {isSubmitting ? "Sending..." : (
              <>Send Message <ArrowRight className="w-4 h-4" /></>
            )}
          </button>
        </form>
      )}
    </motion.div>
  );
}
