import { Download, Eye } from "lucide-react";
import { getAssetUrl } from "@/lib/directus";
import { cn } from "@/lib/utils";

interface CourseOutlinePdfLinkProps {
  attachment: string | null | undefined;
  className?: string;
}

/** View + download links for Directus course PDF (`pdf` field). */
export default function CourseOutlinePdfLink({
  attachment,
  className,
}: CourseOutlinePdfLinkProps) {
  if (!attachment?.trim()) return null;

  const value = attachment.trim();

  // Laravel hands back a ready-made link (`/api/v1/courses/{id}/syllabus`);
  // only bare Directus asset ids need resolving.
  let href: string;
  if (/^(https?:)?\/\//.test(value) || value.startsWith("/")) {
    href = value;
  } else {
    try {
      href = getAssetUrl(value);
    } catch {
      return null;
    }
  }

  const downloadHref = href.includes("?")
    ? `${href}&download=`
    : href.startsWith("/cms-images/")
      ? href
      : `${href}?download=`;

  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row items-stretch sm:items-center gap-2",
        className,
      )}
    >
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-bold rounded-full border border-brand-cyan/30 text-brand-navy bg-brand-cyan/5 hover:bg-brand-cyan/10 hover:border-brand-cyan/50 transition-colors"
      >
        <Eye className="w-4 h-4 text-brand-cyan shrink-0" />
        View PDF
      </a>
      <a
        href={downloadHref}
        target="_blank"
        rel="noopener noreferrer"
        download
        className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-bold rounded-full bg-brand-navy text-white hover:bg-brand-navy/90 transition-colors"
      >
        <Download className="w-4 h-4 shrink-0" />
        Download PDF
      </a>
    </div>
  );
}
