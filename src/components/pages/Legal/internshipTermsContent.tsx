import {
  BookOpen,
  CheckCircle2,
  Cpu,
  FileText,
  GraduationCap,
  RefreshCw,
  Scale,
  Shield,
  Wallet,
  Wifi,
} from "lucide-react";
import type { LegalSection } from "@/src/components/ui/LegalDocumentLayout";

/** Internship-only AI Interview Assessment terms (not the general site `/terms`). */
export const internshipTermsContent = {
  title: "Terms and Conditions for AI Interview Assessment & Educational Program",
  lastUpdated: "September 23, 2026",
  lead: "These Terms and Conditions govern your access to and use of the AI Interview Platform as part of Innovera's internship pathway. By registering for, paying for, or initiating an AI-driven interview, you agree to be bound by these Terms.",
  sections: [
    {
      icon: FileText,
      title: "1. Overview and Acceptance",
      content: (
        <p className="text-slate-600 leading-relaxed">
          These Terms and Conditions (&quot;Terms&quot;) govern your access to and use of the AI
          Interview Platform (&quot;Service&quot;). By registering for, paying for, or initiating
          an AI-driven interview, you agree to be bound by these Terms. If you do not agree, you
          may not proceed with the assessment.
        </p>
      ),
    },
    {
      icon: BookOpen,
      title: "2. Interview Structure and Track Selection",
      content: (
        <ul className="list-disc pl-6 text-slate-600 space-y-2">
          <li>
            <strong>Track Selection:</strong> Prior to initiating an interview, you must select a
            specific skill or career track. Once selected and confirmed, the track choice for that
            attempt is final and cannot be modified mid-session.
          </li>
          <li>
            <strong>Assessment Format:</strong> Each interview attempt consists of exactly five (5)
            questions tailored to your chosen track, evaluated by an artificial intelligence
            assessment system.
          </li>
          <li>
            <strong>Completion Requirements:</strong> You must complete all five questions within
            the designated timeframe for the interview attempt to be submitted and scored.
            Incomplete attempts due to user abandonment will be marked as failed.
          </li>
        </ul>
      ),
    },
    {
      icon: Wallet,
      title: "3. Fee Structure and Payment Terms",
      content: (
        <ul className="list-disc pl-6 text-slate-600 space-y-2">
          <li>
            <strong>Initial Attempt Fee:</strong> Access to the primary AI interview requires
            payment of the standard fee displayed during checkout.
          </li>
          <li>
            <strong>Payment Processing:</strong> All payments must be settled in full prior to
            unlocking the interview module.
          </li>
          <li>
            <strong>Non-Refundability:</strong> Interview fees are non-refundable once the
            assessment session has commenced, regardless of outcome, score, or partial completion.
          </li>
        </ul>
      ),
    },
    {
      icon: RefreshCw,
      title: "4. Retake Policy (Second Attempt)",
      content: (
        <ul className="list-disc pl-6 text-slate-600 space-y-2">
          <li>
            <strong>Discounted Rate:</strong> If you do not achieve a passing score on your first
            attempt, you are eligible for a second attempt within the same track at a reduced
            (discounted) fee.
          </li>
          <li>
            <strong>Content:</strong> The second attempt will present five (5) new or randomized
            questions relevant to the same selected track.
          </li>
        </ul>
      ),
    },
    {
      icon: GraduationCap,
      title: "5. Automatic Short Course Enrollment Policy",
      content: (
        <ul className="list-disc pl-6 text-slate-600 space-y-2">
          <li>
            <strong>Trigger Condition:</strong> If you receive a failing score on both your first
            attempt and your second attempt within the same track, you will be automatically
            enrolled in a targeted short course designed to bridge identified skill gaps.
          </li>
          <li>
            <strong>Cost:</strong> Enrollment in this designated short course is 100% free of
            charge. No additional fees, hidden charges, or subscription commitments are required.
          </li>
          <li>
            <strong>Course Assignment:</strong> The course assigned is determined by the system
            based on the selected track and your interview evaluation results.
          </li>
          <li>
            <strong>Non-Transferable:</strong> Free course enrollments are strictly
            non-transferable, cannot be exchanged for cash, credits, or alternative tracks, and are
            bound to the registered user&apos;s account.
          </li>
        </ul>
      ),
    },
    {
      icon: Cpu,
      title: "6. AI Evaluation and Scoring",
      content: (
        <ul className="list-disc pl-6 text-slate-600 space-y-2">
          <li>
            <strong>Automated Processing:</strong> Interviews are scored using automated artificial
            intelligence models trained to evaluate candidate answers against objective
            subject-matter criteria.
          </li>
          <li>
            <strong>Finality of Scores:</strong> Pass/Fail determinations generated by the AI
            evaluation system are final. Manual re-grading or human intervention is not provided,
            except in verified instances of platform-side technical failure.
          </li>
        </ul>
      ),
    },
    {
      icon: Shield,
      title: "7. User Conduct and Integrity",
      content: (
        <ul className="list-disc pl-6 text-slate-600 space-y-2">
          <li>
            <strong>Authenticity:</strong> You must complete the interview independently without
            unauthorized third-party assistance, generative AI tools, or external reference
            materials unless explicitly permitted.
          </li>
          <li>
            <strong>Prohibited Behavior:</strong> Any attempt to manipulate the AI assessment,
            reverse-evaluate prompt structures, or use fraudulent payment methods will result in
            immediate disqualification, forfeiture of fees, and cancellation of course access.
          </li>
        </ul>
      ),
    },
    {
      icon: Wifi,
      title: "8. System Requirements and Technical Disruptions",
      content: (
        <ul className="list-disc pl-6 text-slate-600 space-y-2">
          <li>
            You are responsible for ensuring a stable internet connection, compatible browser, and
            functioning hardware (e.g., microphone/camera, if required).
          </li>
          <li>
            If a technical disruption occurs on the platform&apos;s side, contact support at{" "}
            <a
              href="mailto:Academy@innoveracorp.com"
              className="font-semibold text-brand-cyan hover:underline"
            >
              Academy@innoveracorp.com
            </a>{" "}
            or WhatsApp{" "}
            <a
              href="https://wa.me/201070008672"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-brand-cyan hover:underline"
            >
              01070008672
            </a>{" "}
            within 48 hours to request a session reset.
          </li>
        </ul>
      ),
    },
    {
      icon: Scale,
      title: "9. Modifications to Terms",
      content: (
        <p className="text-slate-600 leading-relaxed">
          The platform reserves the right to modify pricing, retry discounts, and course offerings
          at any time. Any changes will apply to future interview purchases and will not affect
          active sessions already paid for.
        </p>
      ),
    },
  ] as LegalSection[],
  footer: (
    <div className="flex items-start gap-3 p-4 bg-brand-cyan/5 rounded-xl border border-brand-cyan/10">
      <CheckCircle2 className="w-5 h-5 text-brand-cyan shrink-0 mt-0.5" />
      <p className="text-sm text-slate-600 leading-relaxed">
        <strong className="text-brand-navy">Effective Date:</strong> September 23, 2026. These
        Terms apply only to the AI Interview Assessment and related internship educational
        program. For general website Terms, see{" "}
        <a href="/terms" className="font-semibold text-brand-cyan hover:underline">
          Terms of Service
        </a>
        .
      </p>
    </div>
  ),
};
