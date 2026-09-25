"use client";

import { ArrowRight } from "lucide-react";
import HowToBuySteps from "./HowToBuySteps";

export default function HowToBuy() {
  return (
    <div className="pt-24 pb-16 min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h1 className="text-4xl lg:text-5xl font-display font-bold mb-6 text-brand-navy">How to Buy</h1>
          <p className="text-brand-gray max-w-2xl mx-auto text-lg">
            Purchasing our enterprise security solutions is simple. Follow these steps to get started with Innovera's industry-leading products.
          </p>
        </div>

        <HowToBuySteps />

        <div className="mt-16 text-center">
          <a href="/contact" className="inline-flex items-center gap-2 px-8 py-3 bg-brand-cyan text-white rounded-full font-medium hover:bg-opacity-90 transition-all">
            Contact Sales <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
}
