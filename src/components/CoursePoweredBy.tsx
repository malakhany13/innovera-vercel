"use client";

import type { CourseVendor } from "@/src/api/types";
import { useGetHomePageQuery } from "@/src/hooks";
import { getCourseImage } from "@/lib/directus";
import { buildDirectusVendorLogoMap, getVendorByKey } from "@/lib/vendors";
import { useMemo } from "react";
import OptimizedImage from "@/components/ui/OptimizedImage";

interface CoursePoweredByProps {
  vendor?: CourseVendor;
  vendorKeys?: string[];
  className?: string;
  logoClassName?: string;
}

function vendorLogoSrc(logo: string | null | undefined, name: string): string {
  if (logo?.startsWith("/images/") || (logo && /^https?:\/\//i.test(logo))) {
    return logo;
  }
  if (logo) return getCourseImage(logo, { width: 200 });
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name.replace(/ /g, "+"))}&background=f8fafc&color=0f172a&font-size=0.33&bold=true&size=200`;
}

export default function CoursePoweredBy({
  vendor,
  vendorKeys,
  className = "",
  logoClassName = "h-8 max-w-[100px] object-contain",
}: CoursePoweredByProps) {
  const hasEmbeddedLogo = Boolean(vendor?.logo) && !vendorKeys?.length;
  const { data: homePage } = useGetHomePageQuery(undefined, { skip: hasEmbeddedLogo });
  const directusLogoMap = useMemo(
    () => buildDirectusVendorLogoMap(homePage?.vendors ?? []),
    [homePage?.vendors],
  );

  const logos = useMemo(() => {
    if (vendorKeys && vendorKeys.length > 0) {
      return vendorKeys
        .map((key) => {
          const catalog = getVendorByKey(key);
          const logo = directusLogoMap[key] ?? null;
          if (!logo && !catalog) return null;
          return {
            key,
            name: catalog?.name ?? key,
            logo,
          };
        })
        .filter((item): item is NonNullable<typeof item> => Boolean(item));
    }

    if (!vendor) return [];

    if (hasEmbeddedLogo && vendor.logo) {
      return [{ key: vendor.key, name: vendor.name, logo: vendor.logo }];
    }

    const logo = directusLogoMap[vendor.key] ?? vendor.logo ?? null;
    return [{ key: vendor.key, name: vendor.name, logo }];
  }, [vendor, vendorKeys, directusLogoMap, hasEmbeddedLogo]);

  const visibleLogos = logos.filter((item) => item.logo);
  if (visibleLogos.length === 0) return null;

  return (
    <div className={className}>
      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 block">
        Powered By
      </span>
      <div className="flex items-center gap-3 flex-wrap min-h-8">
        {visibleLogos.map((item) => (
          <div key={item.key} className="relative h-8 w-[100px] shrink-0">
            <OptimizedImage
              src={vendorLogoSrc(item.logo, item.name)}
              alt={item.name}
              fill
              sizes="100px"
              fallbackSrc={vendorLogoSrc(null, item.name)}
              className={logoClassName}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
