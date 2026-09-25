"use client";

import LegalDocumentLayout from "@/src/components/ui/LegalDocumentLayout";
import { termsContent } from "@/src/pages/Legal/termsContent";

export default function Terms() {
  return (
    <LegalDocumentLayout
      title={termsContent.title}
      lastUpdated={termsContent.lastUpdated}
      lead={termsContent.lead}
      sections={termsContent.sections}
      footer={termsContent.footer}
    />
  );
}
