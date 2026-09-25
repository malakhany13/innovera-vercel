"use client";

import LegalDocumentLayout from "@/src/components/ui/LegalDocumentLayout";
import { cookiesContent } from "@/src/pages/Legal/cookiesContent";

export default function Cookies() {
  return (
    <LegalDocumentLayout
      title={cookiesContent.title}
      lastUpdated={cookiesContent.lastUpdated}
      lead={cookiesContent.lead}
      sections={cookiesContent.sections}
      footer={cookiesContent.footer}
    />
  );
}
