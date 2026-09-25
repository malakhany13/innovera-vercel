"use client";

import LegalDocumentLayout from "@/src/components/ui/LegalDocumentLayout";
import { internshipTermsContent } from "@/src/pages/Legal/internshipTermsContent";

export default function InternshipTerms() {
  return (
    <LegalDocumentLayout
      title={internshipTermsContent.title}
      lastUpdated={internshipTermsContent.lastUpdated}
      lead={internshipTermsContent.lead}
      sections={internshipTermsContent.sections}
      footer={internshipTermsContent.footer}
    />
  );
}
