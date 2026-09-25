import { Eye, FileText, Lock, Server, UserCheck } from "lucide-react";
import type { LegalSection } from "@/src/components/ui/LegalDocumentLayout";

export const privacyContent = {
  title: "Privacy Policy",
  lastUpdated: "April 2026",
  lead: "At Innovera Corp, we are committed to protecting your privacy and ensuring the security of your personal data. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services.",
  sections: [
    {
      icon: FileText,
      title: "1. Information We Collect",
      content: (
        <>
          <p className="text-slate-600 leading-relaxed mb-4">
            We may collect personal information that you voluntarily provide to us when you express an interest in obtaining information about us or our products and services, when you participate in activities on the Website, or otherwise when you contact us.
          </p>
          <ul className="list-disc pl-6 text-slate-600 space-y-2">
            <li><strong>Personal Data:</strong> Name, email address, phone number, job title, and company name.</li>
            <li><strong>Usage Data:</strong> Information automatically collected when you visit our website, such as your IP address, browser type, operating system, and browsing behavior.</li>
            <li><strong>Training Data:</strong> Information related to your enrollment in our Academy, including educational background and certification progress.</li>
          </ul>
        </>
      ),
    },
    {
      icon: Server,
      title: "2. How We Use Your Information",
      content: (
        <>
          <p className="text-slate-600 leading-relaxed mb-4">We use the information we collect or receive:</p>
          <ul className="list-disc pl-6 text-slate-600 space-y-2">
            <li>To facilitate account creation and logon process.</li>
            <li>To send you marketing and promotional communications (you can opt-out at any time).</li>
            <li>To fulfill and manage your orders, payments, and training enrollments.</li>
            <li>To deliver targeted advertising and personalized content.</li>
            <li>To protect our Services and ensure cybersecurity.</li>
          </ul>
        </>
      ),
    },
    {
      icon: UserCheck,
      title: "3. Sharing Your Information",
      content: (
        <>
          <p className="text-slate-600 leading-relaxed mb-4">
            We only share information with your consent, to comply with laws, to provide you with services, to protect your rights, or to fulfill business obligations. We may share your data with:
          </p>
          <ul className="list-disc pl-6 text-slate-600 space-y-2">
            <li><strong>Service Providers:</strong> Third-party vendors who perform services for us or on our behalf.</li>
            <li><strong>Business Partners:</strong> We may share your information with our partners to offer you certain products, services, or promotions (e.g., NVIDIA, Palo Alto Networks Academy).</li>
            <li><strong>Legal Obligations:</strong> When required by law or in response to valid requests by public authorities.</li>
          </ul>
        </>
      ),
    },
    {
      icon: Lock,
      title: "4. Data Security",
      content: (
        <p className="text-slate-600 leading-relaxed">
          We have implemented appropriate technical and organizational security measures designed to protect the security of any personal information we process. However, despite our safeguards and efforts to secure your information, no electronic transmission over the Internet or information storage technology can be guaranteed to be 100% secure.
        </p>
      ),
    },
    {
      icon: Eye,
      title: "5. Your Privacy Rights",
      content: (
        <p className="text-slate-600 leading-relaxed">
          Depending on your location, you may have certain rights regarding your personal information, such as the right to request access, correction, or deletion of your data. To exercise these rights, please contact us using the details provided below.
        </p>
      ),
    },
  ] as LegalSection[],
  footer: (
    <p className="text-slate-500 text-sm">
      If you have questions or comments about this notice, you may email us at{" "}
      <a href="mailto:privacy@innoveracorp.com" className="text-brand-cyan hover:underline">privacy@innoveracorp.com</a>.
    </p>
  ),
};
