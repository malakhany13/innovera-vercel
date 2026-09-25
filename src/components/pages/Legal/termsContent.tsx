import { AlertCircle, BookOpen, FileText, Lock, Scale, Shield } from "lucide-react";
import type { LegalSection } from "@/src/components/ui/LegalDocumentLayout";

export const termsContent = {
  title: "Terms and Conditions",
  lastUpdated: "April 2026",
  lead: "Welcome to Innovera Corp. These Terms and Conditions govern your use of our website, digital solutions, cybersecurity services, and training academy programs. By accessing our services, you agree to comply with these terms.",
  sections: [
    {
      icon: FileText,
      title: "1. Acceptance of Terms",
      content: (
        <p className="text-slate-600 leading-relaxed">
          By accessing and using the services provided by Innovera Corp ("the Company", "we", "us", or "our"), including but not limited to our digital solutions, cybersecurity consulting, and educational programs, you agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, you must not use our services.
        </p>
      ),
    },
    {
      icon: BookOpen,
      title: "2. Academy & Training Services",
      content: (
        <>
          <p className="text-slate-600 leading-relaxed mb-4">
            Our Training Academy provides professional certifications, mentorship, and university admission assistance.
          </p>
          <ul className="list-disc pl-6 text-slate-600 space-y-2">
            <li><strong>Enrollment:</strong> Registration for courses is subject to availability and approval.</li>
            <li><strong>Payments & Installments:</strong> Fees must be paid in full or through our approved installment partners (e.g., Fawry, ValU, InstaPay) prior to the commencement of the program.</li>
            <li><strong>Student Discounts:</strong> Valid university identification is required to claim student discounts. The Company reserves the right to verify the authenticity of submitted documents.</li>
            <li><strong>Intellectual Property:</strong> All course materials, presentations, and lab environments are the exclusive property of Innovera Corp or its partners and may not be reproduced or distributed without written consent.</li>
          </ul>
        </>
      ),
    },
    {
      icon: Shield,
      title: "3. Digital & Cybersecurity Solutions",
      content: (
        <>
          <p className="text-slate-600 leading-relaxed mb-4">For clients engaging with our B2B digital and cybersecurity services:</p>
          <ul className="list-disc pl-6 text-slate-600 space-y-2">
            <li><strong>Service Level Agreements (SLAs):</strong> Specific deliverables, timelines, and guarantees will be outlined in individual enterprise contracts.</li>
            <li><strong>Confidentiality:</strong> We adhere to strict Non-Disclosure Agreements (NDAs) to protect client data, infrastructure details, and proprietary information.</li>
            <li><strong>Authorized Access:</strong> Clients must ensure they have the legal right to authorize security assessments, penetration testing, or infrastructure modifications on their systems.</li>
          </ul>
        </>
      ),
    },
    {
      icon: Lock,
      title: "4. Data Privacy & Security",
      content: (
        <p className="text-slate-600 leading-relaxed">
          Your privacy is paramount. We process personal and corporate data in accordance with our Privacy Policy and applicable data protection laws. We employ industry-standard security measures to protect your information, but we cannot guarantee absolute security against sophisticated cyber threats.
        </p>
      ),
    },
    {
      icon: AlertCircle,
      title: "5. Limitation of Liability",
      content: (
        <p className="text-slate-600 leading-relaxed">
          To the maximum extent permitted by law, Innovera Corp shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the services.
        </p>
      ),
    },
    {
      icon: Scale,
      title: "6. Governing Law",
      content: (
        <p className="text-slate-600 leading-relaxed">
          These Terms shall be governed and construed in accordance with the laws of the Arab Republic of Egypt, without regard to its conflict of law provisions. Any dispute arising from these terms shall be subject to the exclusive jurisdiction of the courts located in Cairo, Egypt.
        </p>
      ),
    },
  ] as LegalSection[],
  footer: (
    <p className="text-slate-500 text-sm">
      If you have any questions about these Terms, please contact our legal department at{" "}
      <a href="mailto:legal@innoveracorp.com" className="text-brand-cyan hover:underline">legal@innoveracorp.com</a>.
    </p>
  ),
};
