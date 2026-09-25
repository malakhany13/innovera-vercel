import type { Course, HomePageVendor } from "@/src/api/types";
import { COURSE_VENDOR_BY_TITLE } from "@/src/data/courseVendorMap";
import { VENDORS } from "@/constants";
import { isUsableLaravelStoragePath, laravelStoragePath } from "@/lib/laravel/media";

export interface VendorInfo {
  key: string;
  name: string;
  logo: string;
}

/** Canonical vendor order + static logo fallback used when Directus has no image. */
export const VENDOR_CATALOG: Record<string, VendorInfo> = {
  AICERTs: { key: "AICERTs", name: "AICERTs", logo: VENDORS.AICERTS.logo },
  Fortinet: { key: "Fortinet", name: "Fortinet", logo: VENDORS.FORTINET.logo },
  "Palo Alto Networks": { key: "Palo Alto Networks", name: "Palo Alto Networks", logo: VENDORS.PALO_ALTO.logo },
  "Courses by Innovera": {
    key: "Courses by Innovera",
    name: "courses by innovera",
    logo: VENDORS.COURSES_BY_INNOVERA.logo,
  },
  Hanwha: { key: "Hanwha", name: "Hanwha", logo: VENDORS.HANWHA.logo },
  H3C: { key: "H3C", name: "H3C", logo: VENDORS.H3C.logo },
  "Innovera Academy": { key: "Innovera Academy", name: "Innovera", logo: VENDORS.INNOVERA.logo },
};

export const VENDOR_LIST = Object.values(VENDOR_CATALOG).filter(
  (vendor) => vendor.key !== "Innovera Academy",
);

/** Map messy Directus labels onto canonical catalog keys. */
const VENDOR_ALIASES: Record<string, string> = {
  innovera: "Innovera Academy",
  "innovera academy": "Innovera Academy",
  "courses by innovera": "Courses by Innovera",
  aicerts: "AICERTs",
  fortinet: "Fortinet",
  "palo alto": "Palo Alto Networks",
  "palo alto network": "Palo Alto Networks",
  "palo alto networks": "Palo Alto Networks",
  hanwha: "Hanwha",
  h3c: "H3C",
};

/** Always show these in Home Certified Partners even if no course matches. */
const ALWAYS_SHOW_HOME_VENDORS = new Set(["Courses by Innovera"]);

function normalizeVendorLookup(value: string): string {
  return value.trim().replace(/\s+/g, " ").toLowerCase();
}

/** Resolve a Directus/user label to the canonical catalog key when possible. */
export function canonicalizeVendorKey(
  keyOrName: string | null | undefined,
): string | undefined {
  if (!keyOrName?.trim()) return undefined;
  const trimmed = keyOrName.trim().replace(/\s+/g, " ");
  if (VENDOR_CATALOG[trimmed]) return trimmed;

  const alias = VENDOR_ALIASES[normalizeVendorLookup(trimmed)];
  if (alias) return alias;

  const matched = VENDOR_LIST.find(
    (vendor) =>
      normalizeVendorLookup(vendor.key) === normalizeVendorLookup(trimmed) ||
      normalizeVendorLookup(vendor.name) === normalizeVendorLookup(trimmed),
  );
  return matched?.key;
}

export function getVendorByKey(keyOrName: string | null | undefined): VendorInfo | undefined {
  if (!keyOrName) return undefined;
  const canonical = canonicalizeVendorKey(keyOrName);
  if (canonical && VENDOR_CATALOG[canonical]) return VENDOR_CATALOG[canonical];
  return VENDOR_LIST.find(
    (vendor) => vendor.key === keyOrName || vendor.name === keyOrName,
  );
}

export function buildDirectusVendorLogoMap(
  homeVendors: HomePageVendor[],
): Record<string, string | null> {
  const map: Record<string, string | null> = {};
  for (const vendor of homeVendors) {
    const key = canonicalizeVendorKey(vendor.vendorKey) ?? vendor.vendorKey?.trim();
    if (key && vendor.image && map[key] == null) {
      map[key] = vendor.image;
    }
  }
  return map;
}

export function resolveCourseVendor(input: {
  vendor_key?: string | null;
  vendor_name?: string | null;
  vendor_logo?: string | null;
  title?: string;
  directusLogoMap?: Record<string, string | null>;
}): { key: string; name: string; logo: string | null } | undefined {
  let key =
    canonicalizeVendorKey(input.vendor_key) ||
    canonicalizeVendorKey(input.vendor_name) ||
    undefined;

  if (!key && input.title) {
    key = canonicalizeVendorKey(COURSE_VENDOR_BY_TITLE[input.title]);
  }
  if (!key) {
    // Keep raw trimmed key so unknown vendors still appear once (not blank).
    const raw = input.vendor_key?.trim() || input.vendor_name?.trim();
    const logoOnly = input.vendor_logo?.trim();
    // Laravel may send only `vendor_logo_path` (full URL) with null key/name.
    if (!raw && !logoOnly) return undefined;
    key = raw ? raw.replace(/\s+/g, " ") : "partner";
  }

  const catalog = getVendorByKey(key);
  const laravelLogo = input.vendor_logo?.trim() || null;
  // Prefer `/images/vendors/…` (or usable storage). Bare UUID storage paths
  // 400 in next/image — fall through to Directus/catalog CDN logos.
  const usableLaravelLogo =
    laravelLogo &&
    (laravelLogo.startsWith("/images/vendors/") ||
      /^https?:\/\//i.test(laravelLogo) ||
      !laravelStoragePath(laravelLogo) ||
      isUsableLaravelStoragePath(laravelLogo))
      ? laravelLogo
      : null;
  const logo =
    usableLaravelLogo ||
    input.directusLogoMap?.[key] ||
    catalog?.logo ||
    null;

  return {
    key,
    name: catalog?.name || input.vendor_name?.trim().replace(/\s+/g, " ") || key,
    logo,
  };
}

export function enrichCoursesWithDirectusVendorLogos(
  courses: Course[],
  homeVendors: HomePageVendor[],
): Course[] {
  const logoMap = buildDirectusVendorLogoMap(homeVendors);

  return courses.map((course) => {
    const key =
      canonicalizeVendorKey(course.vendor?.key) ??
      (course.title ? canonicalizeVendorKey(COURSE_VENDOR_BY_TITLE[course.title]) : undefined);

    if (!key) return course;

    const logo = logoMap[key] ?? course.vendor?.logo ?? null;
    const catalog = getVendorByKey(key);
    return {
      ...course,
      vendor: {
        key,
        name: catalog?.name ?? course.vendor?.name ?? key,
        logo,
      },
    };
  });
}

export function courseMatchesVendor(course: Course, selectedVendor: string): boolean {
  if (selectedVendor === "All Vendors") return true;
  const selected = canonicalizeVendorKey(selectedVendor) ?? selectedVendor.trim();
  const vendorKey =
    canonicalizeVendorKey(course.vendor?.key) ?? course.vendor?.key ?? null;
  if (vendorKey) return vendorKey === selected;
  const vendorName =
    canonicalizeVendorKey(course.vendor?.name) ?? course.vendor?.name ?? null;
  return vendorName === selected;
}

export function getVendorFilterOptions(courses: Course[]): string[] {
  const keysFromCourses = courses
    .map((course) => canonicalizeVendorKey(course.vendor?.key) ?? course.vendor?.key)
    .filter((key): key is string => Boolean(key))
    .map((key) => key.replace(/\s+/g, " ").trim());

  // Dedupe by display name so "Innovera" / "Innovera Academy" can't both appear.
  const byDisplayName = new Map<string, string>();
  for (const key of keysFromCourses) {
    const catalog = getVendorByKey(key);
    const display = (catalog?.name ?? key).trim();
    const displayLookup = normalizeVendorLookup(display);
    if (!byDisplayName.has(displayLookup)) {
      byDisplayName.set(displayLookup, catalog?.key ?? key);
    }
  }

  const keys =
    byDisplayName.size > 0
      ? Array.from(byDisplayName.values())
      : VENDOR_LIST.map((vendor) => vendor.key);

  return ["All Vendors", ...keys.sort((a, b) => a.localeCompare(b))];
}

export interface HomeVendorDisplay {
  id: number;
  name: string;
  vendorKey: string;
  image: string | null;
}

export function buildHomeVendorList(
  courses: Course[],
  apiVendors: HomePageVendor[] = [],
): HomeVendorDisplay[] {
  const safeCourses = Array.isArray(courses) ? courses : [];
  const safeVendors = Array.isArray(apiVendors) ? apiVendors : [];

  const courseVendorKeys = new Set(
    safeCourses
      .map((course) => canonicalizeVendorKey(course.vendor?.key) ?? course.vendor?.key)
      .filter((key): key is string => Boolean(key)),
  );

  // Directus can return duplicate or missing vendors — dedupe by canonical key.
  const directusByKey = new Map<string, HomePageVendor>();
  for (const vendor of safeVendors) {
    const key = canonicalizeVendorKey(vendor.vendorKey) ?? vendor.vendorKey?.trim();
    if (key && !directusByKey.has(key)) {
      directusByKey.set(key, vendor);
    }
  }

  // Always iterate the canonical list so order is stable, every vendor appears once,
  // and curated local logos (e.g. /images/partners/*) win over broken Directus assets.
  return VENDOR_LIST.filter(
    (vendor) =>
      ALWAYS_SHOW_HOME_VENDORS.has(vendor.key) ||
      courseVendorKeys.size === 0 ||
      courseVendorKeys.has(vendor.key),
  ).map((vendor, index) => {
    const directus = directusByKey.get(vendor.key);
    const staticLogo = vendor.logo ?? null;
    const preferStatic =
      typeof staticLogo === "string" && staticLogo.startsWith("/images/");
    return {
      id: directus?.id ?? index,
      name: vendor.name,
      vendorKey: vendor.key,
      image: preferStatic ? staticLogo : directus?.image ?? staticLogo,
    };
  });
}

export function getDirectusVendorLogo(
  vendorKey: string,
  homeVendors: HomePageVendor[],
): string | null {
  const canonical = canonicalizeVendorKey(vendorKey) ?? vendorKey;
  const vendor = homeVendors.find(
    (item) => (canonicalizeVendorKey(item.vendorKey) ?? item.vendorKey) === canonical,
  );
  return vendor?.image ?? null;
}
