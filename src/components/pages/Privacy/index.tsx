"use client";

import LegalDocumentLayout from "@/src/components/ui/LegalDocumentLayout";
import { privacyContent } from "@/src/pages/Legal/privacyContent";

export default function Privacy() {
  return (
    <LegalDocumentLayout
      title={privacyContent.title}
      lastUpdated={privacyContent.lastUpdated}
      lead={privacyContent.lead}
      sections={privacyContent.sections}
      footer={privacyContent.footer}
    />
  );
}
