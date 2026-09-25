export const INTERNSHIP_INTRO =
  "Gain real-world experience through a structured, tech-driven pathway. Master track fundamentals with a 20-hour intensive course, complete an AI-interview evaluation (scored out of 100), and land your spot on active Innovera project teams.";

export const INTERNSHIP_LEVELS = [
  "First Year",
  "Second Year",
  "Third Year",
  "Fourth Year",
  "Fifth Year",
  "Graduate",
  "Junior",
 
 
] as const;

export type InternshipLevel = (typeof INTERNSHIP_LEVELS)[number];

export const INTERNSHIP_HERO_IMAGE = "/images/internship/form-hero.jpg";

export const INTERNSHIP_FORM_HERO_IMAGE = "/images/internship/Gemini_Generated_Image_dpvsv9dpvsv9dpvs.jpg";

/** Minimum AI interview score (%) required to pass. */
export const INTERNSHIP_PASS_PERCENT = 60;

/** True when `total / max` meets {@link INTERNSHIP_PASS_PERCENT}. */
export function isInternshipScorePassing(total: number, max: number): boolean {
  if (!Number.isFinite(total) || !Number.isFinite(max) || max <= 0) return false;
  return (total / max) * 100 >= INTERNSHIP_PASS_PERCENT;
}

/** Format backend price string/number for display (e.g. "299.00" → "299"). */
export function formatInternshipFee(price: string | number): string {
  const numeric =
    typeof price === "number" ? price : Number(String(price).trim().replace(/,/g, ""));
  if (!Number.isFinite(numeric)) return String(price).trim() || "0";
  return Number.isInteger(numeric)
    ? String(numeric)
    : numeric.toFixed(2).replace(/\.?0+$/, "");
}

export function getAssessmentBullets(
  feeAmount: string | number,
  isSecondTrial = false,
) {
  const fee = formatInternshipFee(feeAmount);
  return [
    {
      title: "Fee Amount",
      body: isSecondTrial
        ? `${fee} EGP retake fee for the AI interview assessment.`
        : `${fee} EGP administration fee for the AI interview assessment.`,
    },
    {
      title: "Purpose",
      body: "Covers the AI-powered interview assessment used to evaluate internship readiness.",
    },
    {
      title: "Process",
      body: "Payment must be completed before starting the assessment.",
    },
  ] as const;
}

/** Copy for Retake Policy — `feeAmount` must be dashboard `Second_price`. */
export function getAssessmentRetake(feeAmount: string | number) {
  const fee = formatInternshipFee(feeAmount);
  return `Retakes cost ${fee} EGP and are required if the score is below ${INTERNSHIP_PASS_PERCENT}%.`;
}

