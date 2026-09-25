"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { type FormEvent, useState } from "react";
import OptimizedImage from "@/components/ui/OptimizedImage";
import {
  INTERNSHIP_FORM_HERO_IMAGE,
  INTERNSHIP_INTRO,
  INTERNSHIP_LEVELS,
  type InternshipLevel,
} from "./constants";

export interface InternshipFormValues {
  name: string;
  email: string;
  phone: string;
  whatsapp: string;
  university: string;
  major: string;
  level: InternshipLevel | "";
}

interface InternshipFormStepProps {
  initialValues?: Partial<InternshipFormValues>;
  onSubmit: (values: InternshipFormValues) => void;
}

const fieldClass =
  "w-full rounded-xl bg-slate-100 border border-transparent px-4 py-3.5 text-sm text-slate-800 placeholder:text-slate-400 outline-none focus:bg-white focus:border-brand-cyan focus:ring-2 focus:ring-brand-cyan/20 transition";

const emptyValues: InternshipFormValues = {
  name: "",
  email: "",
  phone: "",
  whatsapp: "",
  university: "",
  major: "",
  level: "",
};

export default function InternshipFormStep({
  initialValues,
  onSubmit,
}: InternshipFormStepProps) {
  const [values, setValues] = useState<InternshipFormValues>({
    ...emptyValues,
    ...initialValues,
  });
  /** Never autofilled — user must accept terms even when profile fields are prefilled. */
  const [termsConsent, setTermsConsent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = (key: keyof InternshipFormValues, value: string) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (
      !values.name.trim() ||
      !values.email.trim() ||
      !values.phone.trim() ||
      !values.whatsapp.trim() ||
      !values.university.trim() ||
      !values.major.trim() ||
      !values.level
    ) {
      setError("Please fill in all fields before submitting.");
      return;
    }
    if (!termsConsent) {
      setError("Please agree to the terms and conditions before submitting.");
      return;
    }
    setError(null);
    onSubmit(values);
  };

  return (
    <div className="bg-white min-h-[70vh]">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <OptimizedImage
            src={INTERNSHIP_FORM_HERO_IMAGE}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-slate-900/55" />
        </div>

        <div className="relative max-w-3xl mx-auto px-6 pt-16 pb-28 sm:pt-20 sm:pb-36 text-center">
          <h1 className="text-4xl sm:text-5xl font-display font-bold text-white leading-tight mb-5">
            Our <span className="text-brand-cyan">internship</span>
          </h1>
          <p className="text-white/90 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
            {INTERNSHIP_INTRO}
          </p>
        </div>
      </section>

      <section className="relative z-10 max-w-xl mx-auto px-6 -mt-20 sm:-mt-28 pb-20">
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-[1.75rem] shadow-[0_16px_50px_-12px_rgba(15,23,42,0.18)] border border-slate-100 px-6 sm:px-10 py-8 sm:py-10"
        >
          <div className="mb-8 text-center sm:text-left">
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-slate-800 mb-1">
              <span className="text-brand-cyan">internship</span> Form
            </h2>
            <p className="text-slate-400 text-sm">Sign up in our internship</p>
          </div>

          <div className="space-y-5">
            {(
              [
                ["name", "Name", "Your Name", "text"],
                ["email", "Email", "Your Email", "email"],
                ["phone", "Phone number", "Your Phone number", "tel"],
                ["whatsapp", "WhatsApp number", "Your Phone number", "tel"],
                ["university", "University", "Your University", "text"],
                ["major", "Major", "Your University Field", "text"],
              ] as const
            ).map(([key, label, placeholder, type]) => (
              <div key={key}>
                <label
                  htmlFor={`internship-${key}`}
                  className="block text-sm font-medium text-slate-700 mb-2"
                >
                  {label}
                </label>
                <input
                  id={`internship-${key}`}
                  type={type}
                  value={values[key]}
                  onChange={(e) => update(key, e.target.value)}
                  placeholder={placeholder}
                  className={fieldClass}
                  autoComplete="off"
                />
              </div>
            ))}

            <div>
              <label
                htmlFor="internship-level"
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                Level
              </label>
              <select
                id="internship-level"
                value={values.level}
                onChange={(e) => update("level", e.target.value)}
                className={`${fieldClass} appearance-none`}
              >
                <option value="" disabled>
                  -- Select --
                </option>
                {INTERNSHIP_LEVELS.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
            </div>

            <label className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 cursor-pointer">
              <input
                id="internship-terms"
                type="checkbox"
                checked={termsConsent}
                onChange={(e) => {
                  setTermsConsent(e.target.checked);
                  if (e.target.checked) setError(null);
                }}
                className="mt-0.5 size-4 rounded border-slate-300 text-brand-cyan focus:ring-brand-cyan/20"
              />
              <span className="text-sm text-slate-600 leading-relaxed">
                I agree to the{" "}
                <Link
                  href="/internship/terms"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-brand-cyan hover:underline"
                  onClick={(e) => e.stopPropagation()}
                >
                  terms and conditions
                </Link>{" "}
                and consent to Innovera contacting me about this internship.
              </span>
            </label>

            {error ? <p className="text-sm text-red-600">{error}</p> : null}

            <button
              type="submit"
              disabled={!termsConsent}
              className="w-full inline-flex items-center justify-center gap-2 mt-2 px-8 py-3.5 rounded-full bg-brand-cyan text-white font-bold shadow-lg shadow-brand-cyan/20 hover:bg-cyan-500 transition-colors disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none disabled:hover:bg-brand-cyan"
            >
              Submit
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
