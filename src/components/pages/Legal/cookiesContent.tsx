import { Cookie, Info, Settings, ShieldCheck } from "lucide-react";
import type { LegalSection } from "@/src/components/ui/LegalDocumentLayout";

export const cookiesContent = {
  title: "Cookie Policy",
  lastUpdated: "April 2026",
  lead: "This Cookie Policy explains how Innovera Corp uses cookies and similar technologies to recognize you when you visit our website. It explains what these technologies are and why we use them, as well as your rights to control our use of them.",
  sections: [
    {
      icon: Cookie,
      title: "1. What are cookies?",
      content: (
        <p className="text-slate-600 leading-relaxed">
          Cookies are small data files that are placed on your computer or mobile device when you visit a website. Cookies are widely used by website owners in order to make their websites work, or to work more efficiently, as well as to provide reporting information.
        </p>
      ),
    },
    {
      icon: Info,
      title: "2. Why do we use cookies?",
      content: (
        <>
          <p className="text-slate-600 leading-relaxed mb-4">
            We use first-party and third-party cookies for several reasons. Some cookies are required for technical reasons in order for our website to operate, and we refer to these as "essential" or "strictly necessary" cookies. Other cookies also enable us to track and target the interests of our users to enhance the experience on our website.
          </p>
          <ul className="list-disc pl-6 text-slate-600 space-y-2">
            <li><strong>Essential Cookies:</strong> These cookies are strictly necessary to provide you with services available through our website and to use some of its features, such as access to secure areas.</li>
            <li><strong>Performance and Functionality Cookies:</strong> These cookies are used to enhance the performance and functionality of our website but are non-essential to their use.</li>
            <li><strong>Analytics and Customization Cookies:</strong> These cookies collect information that is used either in aggregate form to help us understand how our website is being used or how effective our marketing campaigns are.</li>
            <li><strong>Advertising Cookies:</strong> These cookies are used to make advertising messages more relevant to you.</li>
          </ul>
        </>
      ),
    },
    {
      icon: Settings,
      title: "3. How can I control cookies?",
      content: (
        <p className="text-slate-600 leading-relaxed">
          You have the right to decide whether to accept or reject cookies. You can exercise your cookie rights by setting your preferences in the Cookie Consent Manager. You can also set or amend your web browser controls to accept or refuse cookies. If you choose to reject cookies, you may still use our website though your access to some functionality and areas of our website may be restricted.
        </p>
      ),
    },
    {
      icon: ShieldCheck,
      title: "4. Updates to this policy",
      content: (
        <p className="text-slate-600 leading-relaxed">
          We may update this Cookie Policy from time to time in order to reflect, for example, changes to the cookies we use or for other operational, legal, or regulatory reasons. Please therefore re-visit this Cookie Policy regularly to stay informed about our use of cookies and related technologies.
        </p>
      ),
    },
  ] as LegalSection[],
  footer: (
    <p className="text-slate-500 text-sm">
      If you have any questions about our use of cookies or other technologies, please email us at{" "}
      <a href="mailto:privacy@innoveracorp.com" className="text-brand-cyan hover:underline">privacy@innoveracorp.com</a>.
    </p>
  ),
};
