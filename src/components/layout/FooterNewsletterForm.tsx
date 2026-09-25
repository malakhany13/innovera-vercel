"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { toast } from "sonner";

export default function FooterNewsletterForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const form = e.currentTarget;
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success("Thank you for subscribing to our newsletter!");
      form.reset();
    }, 1500);
  };

  return (
    <form className="flex gap-2" onSubmit={handleSubmit}>
      <input
        type="email"
        required
        placeholder="Email"
        className="bg-white/10 border-none rounded-lg px-4 py-2 text-sm w-full focus:ring-1 focus:ring-brand-cyan placeholder:text-slate-400"
      />
      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-brand-cyan p-2 rounded-lg hover:bg-white hover:text-brand-cyan transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center min-w-[36px]"
      >
        {isSubmitting ? (
          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
          <ArrowRight className="w-5 h-5" />
        )}
      </button>
    </form>
  );
}
