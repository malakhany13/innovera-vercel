"use client";

import type { ReactNode } from "react";
import OptimizedImage from "@/components/ui/OptimizedImage";

const AUTH_HERO_IMAGE = "/images/internship/Gemini_Generated_Image_dpvsv9dpvsv9dpvs.jpg";

interface AuthShellProps {
  title: ReactNode;
  children: ReactNode;
}

export const authFieldClass =
  "w-full rounded-xl bg-slate-100 border border-transparent px-4 py-3.5 text-sm text-slate-800 placeholder:text-slate-400 outline-none focus:bg-white focus:border-brand-cyan focus:ring-2 focus:ring-brand-cyan/20 transition";

export const authButtonClass =
  "w-full inline-flex items-center justify-center gap-2 mt-2 px-8 py-3.5 rounded-full bg-brand-cyan text-white font-bold shadow-lg shadow-brand-cyan/20 hover:bg-cyan-500 transition-colors disabled:opacity-60";

export default function AuthShell({ title, children }: AuthShellProps) {
  return (
    <div className="bg-white min-h-[70vh]">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <OptimizedImage
            src={AUTH_HERO_IMAGE}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-slate-900/55" />
        </div>

        <div className="relative max-w-3xl mx-auto px-6 pt-16 pb-28 sm:pt-20 sm:pb-36 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-white leading-tight">
            {title}
          </h1>
        </div>
      </section>

      <section className="relative z-10 max-w-xl mx-auto px-6 -mt-20 sm:-mt-28 pb-20">
        <div className="bg-white rounded-[1.75rem] shadow-[0_16px_50px_-12px_rgba(15,23,42,0.18)] border border-slate-100 px-6 sm:px-10 py-8 sm:py-10">
          {children}
        </div>
      </section>
    </div>
  );
}
