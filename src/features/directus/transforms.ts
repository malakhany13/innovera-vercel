import type {
  AboutHero,
  AboutMissionVision,
  AboutPageContent,
  AboutSectionHeader,
  AcademyPageContent,
  DirectusAcademyPageItem,
  Course,
  DirectusAboutPageItem,
  DirectusCourse,
  DirectusHomePageItem,
  HeroSlide,
  HomePageContactPhoto,
  HomePageContent,
  HomePageFeaturedNews,
  HomePagePartner,
  HomePageVendor,
  SectionImage,
  DirectusEventsPageItem,
  DirectusNewsPageItem,
  DirectusPartnersPageItem,
  EventsPageContent,
  EventsPageEvent,
  EventsPageGridHeader,
  EventsPageHero,
  NewsPageArticle,
  NewsPageContent,
  NewsPageGridHeader,
  PartnersPageContent,
  DirectusServicesPageItem,
  ServicesPageContent,
  AboutOffice,
} from "./types";
import { resolveCourseVendor } from "@/src/lib/vendors";

const ABOUT_OFFICE_COUNTRY_ORDER = ["egypt", "saudi arabia", "oman"];

/** Keep one office per country; prefer rows with images / richer data. */
function dedupeAboutOffices(offices: AboutOffice[]): AboutOffice[] {
  const byCountry = new Map<string, AboutOffice>();

  for (const office of offices) {
    const key = office.country.trim().toLowerCase();
    if (!key) continue;

    const existing = byCountry.get(key);
    if (!existing) {
      byCountry.set(key, office);
      continue;
    }

    const score = (o: AboutOffice) =>
      (o.image ? 4 : 0) +
      (o.address ? 2 : 0) +
      (o.phone ? 1 : 0) +
      (o.email ? 1 : 0) +
      o.id / 1000;

    if (score(office) >= score(existing)) {
      byCountry.set(key, office);
    }
  }

  const preferred = ABOUT_OFFICE_COUNTRY_ORDER.map((country) =>
    byCountry.get(country),
  ).filter((office): office is AboutOffice => Boolean(office));

  // Only Egypt / Oman / Saudi Arabia on About.
  if (preferred.length > 0) return preferred;

  return [...byCountry.values()].sort((a, b) => a.sort - b.sort);
}

function parseToStringArray(value: unknown): string[] {
  if (value == null) return [];
  if (Array.isArray(value)) {
    return value.filter(Boolean).map(String);
  }
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) return [];
    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed)) {
        return parsed.filter(Boolean).map(String);
      }
    } catch {
      // fall through to delimiter split
    }
    return trimmed
      .split(/\n|,/)
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return [];
}

function normalizeHandsOn(value: DirectusCourse["handsOn"]): {
  items: string[];
  flag: boolean;
} {
  if (typeof value === "boolean") {
    return {
      items: value ? ["Hands-on labs and practical exercises included"] : [],
      flag: value,
    };
  }
  if (Array.isArray(value)) {
    const items = value.filter(Boolean).map(String);
    return { items, flag: items.length > 0 };
  }
  const items = parseToStringArray(value);
  return { items, flag: items.length > 0 };
}

export function normalizeCourse(
  row: DirectusCourse,
  directusLogoMap?: Record<string, string | null>,
): Course {
  const handsOn = normalizeHandsOn(row.handsOn);
  const vendor = resolveCourseVendor({
    vendor_key: row.vendor_key,
    vendor_name: row.vendor_name,
    vendor_logo: row.vendor_logo,
    title: row.title,
    directusLogoMap,
  });

  const rawCourseId = row.Course_ID;
  const courseId =
    rawCourseId == null
      ? null
      : String(rawCourseId).trim() || null;

  const attachmentRaw = row.pdf ?? row.Attachment;
  let attachment: string | null = null;
  if (typeof attachmentRaw === "string" && attachmentRaw.trim()) {
    attachment = attachmentRaw.trim();
  } else if (
    attachmentRaw &&
    typeof attachmentRaw === "object" &&
    typeof attachmentRaw.id === "string" &&
    attachmentRaw.id.trim()
  ) {
    attachment = attachmentRaw.id.trim();
  }

  return {
    id: row.id,
    courseId,
    track: row.track,
    title: row.title,
    level: row.level,
    hours: row.hours,
    format: row.format,
    image: row.image,
    attachment,
    whatYouWillCover: parseToStringArray(row.whatYouWillCover),
    prerequisites: parseToStringArray(row.prerequisites),
    handsOn: handsOn.items,
    handsOnFlag: handsOn.flag,
    vendor,
  };
}

export function normalizeCourses(rows: DirectusCourse[]): Course[] {
  return rows.map((row) => normalizeCourse(row));
}

export function normalizeHeroSlide(row: DirectusHomePageItem): HeroSlide {
  return {
    id: row.id,
    sort: row.sort ?? 0,
    title: row.title ?? `Hero slide ${row.id}`,
    image: row.Image,
  };
}

export function normalizeSectionImage(row: DirectusHomePageItem): SectionImage {
  return {
    id: row.id,
    sort: row.sort ?? 0,
    title: row.title ?? row.section_key ?? `Section image ${row.id}`,
    sectionKey: row.section_key ?? "",
    image: row.Image,
  };
}

export function normalizeVendor(row: DirectusHomePageItem): HomePageVendor {
  return {
    id: row.id,
    sort: row.sort ?? 0,
    name: row.name ?? row.vendor_key ?? `Vendor ${row.id}`,
    vendorKey: row.vendor_key ?? row.name ?? "",
    image: row.Image,
  };
}

export function normalizePartner(row: DirectusHomePageItem): HomePagePartner {
  return {
    id: row.id,
    sort: row.sort ?? 0,
    name: row.name ?? `Partner ${row.id}`,
    image: row.Image,
  };
}

export function normalizeContactPhoto(row: DirectusHomePageItem): HomePageContactPhoto {
  return {
    id: row.id,
    sort: row.sort ?? 0,
    title: row.title ?? `Contact photo ${row.id}`,
    image: row.Image,
  };
}

export function normalizeFeaturedNews(row: DirectusHomePageItem): HomePageFeaturedNews {
  return {
    id: row.id,
    sort: row.sort ?? 0,
    title: row.title ?? "",
    date: row.date ?? "",
    category: row.category ?? "",
    image: row.Image,
  };
}

export function normalizeHomePage(rows: DirectusHomePageItem[]): HomePageContent {
  const heroSlides = rows
    .filter((row) => row.type === "hero_slide" && row.Image)
    .sort((a, b) => (a.sort ?? 0) - (b.sort ?? 0))
    .map(normalizeHeroSlide);

  const sectionImages = rows
    .filter((row) => row.type === "section_image" && row.Image)
    .sort((a, b) => (a.sort ?? 0) - (b.sort ?? 0))
    .map(normalizeSectionImage);

  const vendors = rows
    .filter((row) => row.type === "vendor")
    .sort((a, b) => (a.sort ?? 0) - (b.sort ?? 0))
    .map(normalizeVendor);

  const partners = rows
    .filter((row) => row.type === "partner")
    .sort((a, b) => (a.sort ?? 0) - (b.sort ?? 0))
    .map(normalizePartner);

  const contactPhotos = rows
    .filter((row) => row.type === "contact_photo")
    .sort((a, b) => (a.sort ?? 0) - (b.sort ?? 0))
    .map(normalizeContactPhoto);

  const featuredNews = rows
    .filter((row) => row.type === "featured_news")
    .sort((a, b) => (a.sort ?? 0) - (b.sort ?? 0))
    .map(normalizeFeaturedNews);

  return { heroSlides, sectionImages, vendors, partners, contactPhotos, featuredNews };
}





export function normalizeNewsArticle(row: DirectusNewsPageItem): NewsPageArticle {
  return {
    id: row.id,
    externalId: row.external_id,
    sort: row.sort ?? 0,
    title: row.title ?? "",
    date: row.date ?? "",
    category: row.category ?? "",
    excerpt: row.excerpt ?? "",
    image: row.image_url ?? row.Image,
    featured: row.featured ?? false,
  };
}

function normalizeNewsGridHeader(row: DirectusNewsPageItem): NewsPageGridHeader {
  return {
    id: row.id,
    sort: row.sort ?? 0,
    title: row.title ?? "Latest News",
    image: row.image_url ?? row.Image,
  };
}

export function normalizeNewsPage(rows: DirectusNewsPageItem[]): NewsPageContent {
  const gridHeaderRow = rows.find((row) => row.type === "grid_header");
  const articles = rows
    .filter((row) => row.type === "article")
    .sort((a, b) => (a.sort ?? 0) - (b.sort ?? 0))
    .map(normalizeNewsArticle);

  return {
    gridHeader: gridHeaderRow ? normalizeNewsGridHeader(gridHeaderRow) : null,
    articles,
  };
}

export function normalizeEventsPageEvent(row: DirectusEventsPageItem): EventsPageEvent {
  return {
    id: row.id,
    externalId: row.external_id,
    sort: row.sort ?? 0,
    title: row.title ?? "",
    date: row.date ?? "",
    location: row.location ?? "",
    category: row.category ?? "",
    description: row.description ?? "",
    image: row.image_url ?? row.Image,
  };
}

export function normalizeEventsPage(rows: DirectusEventsPageItem[]): EventsPageContent {
  const heroRow = rows.find((row) => row.type === "hero");
  const gridHeaderRow = rows.find((row) => row.type === "grid_header");
  const events = rows
    .filter((row) => row.type === "event")
    .sort((a, b) => (a.sort ?? 0) - (b.sort ?? 0))
    .map(normalizeEventsPageEvent);

  const hero: EventsPageHero | null = heroRow
    ? {
        badge: heroRow.badge ?? "Stay Connected",
        title: heroRow.title ?? "Events & Conferences",
        description: heroRow.description ?? "",
      }
    : null;

  const gridHeader: EventsPageGridHeader | null = gridHeaderRow
    ? { title: gridHeaderRow.title ?? "Upcoming Events" }
    : null;

  return { hero, gridHeader, events };
}

export function normalizeAboutPage(rows: DirectusAboutPageItem[]): AboutPageContent {
  const heroRows = rows
    .filter((row) => row.type === "hero")
    .sort((a, b) => (a.sort ?? 0) - (b.sort ?? 0));

  // The text content lives on the hero row that actually carries copy.
  const heroRow =
    heroRows.find((row) => row.title || row.subtitle || row.description) ?? heroRows[0];

  const pickImage = (row: DirectusAboutPageItem | undefined): string | null =>
    row ? row.image ?? row.image_url ?? null : null;

  // Hero images are delivered on `type: "hero"` rows (legacy data used `hero_image`).
  const heroImageRows = [
    ...rows.filter((row) => row.type === "hero_image"),
    ...heroRows.filter((row) => row.image ?? row.image_url),
  ];

  const primaryImageRow =
    heroImageRows.find((row) => row.section_key === "primary") ?? heroImageRows[0];
  const secondaryImageRow =
    heroImageRows.find((row) => row.section_key === "secondary") ??
    heroImageRows.find((row) => row !== primaryImageRow);

  const hero: AboutHero | null = heroRow
    ? {
        title: heroRow.title ?? "Empowering Talent.",
        subtitle: heroRow.subtitle ?? "Shaping the Future.",
        description: heroRow.description ?? "",
        content: heroRow.content ?? "",
        excerpt: heroRow.excerpt ?? "",
        paragraphs: [heroRow.description, heroRow.content, heroRow.excerpt].filter(
          (paragraph): paragraph is string => Boolean(paragraph),
        ),
        primary_image: pickImage(primaryImageRow),
        secondary_image: pickImage(secondaryImageRow),
      }
    : null;

  const normalizeMissionVision = (
    row: DirectusAboutPageItem | undefined,
  ): AboutMissionVision | null =>
    row
      ? {
          title: row.title ?? "",
          description: row.description ?? "",
          image: row.image ?? row.image_url ?? row.image,
          icon: row.category ?? "target",
        }
      : null;

  const sectionHeaders: Partial<Record<string, AboutSectionHeader>> = {};
  rows
    .filter((row) => row.type === "section_header")
    .forEach((row) => {
      if (!row.section_key) return;
      sectionHeaders[row.section_key] = {
        badge: row.badge ?? "",
        title: row.title ?? "",
        description: row.description ?? "",
      };
    });

  const coreValues = rows
    .filter((row) => row.type === "core_value")
    .sort((a, b) => (a.sort ?? 0) - (b.sort ?? 0))
    .map((row) => ({
      id: row.id,
      sort: row.sort ?? 0,
      title: row.title ?? "",
      description: row.description ?? "",
      icon: row.category ?? "shield",
    }));

  const whyFeatures = rows
    .filter((row) => row.type === "why_feature")
    .sort((a, b) => (a.sort ?? 0) - (b.sort ?? 0))
    .map((row) => ({
      id: row.id,
      sort: row.sort ?? 0,
      title: row.title ?? "",
      description: row.description ?? "",
      image: row.image_url ?? row.image,
    }));

  const ecosystemCards = rows
    .filter((row) => row.type === "ecosystem_card")
    .sort((a, b) => (a.sort ?? 0) - (b.sort ?? 0))
    .map((row) => ({
      id: row.id,
      sort: row.sort ?? 0,
      title: row.title ?? "",
      description: row.description ?? "",
      icon: row.category ?? "target",
      variant: row.group === "highlight" ? ("highlight" as const) : ("default" as const),
    }));

  const offices = dedupeAboutOffices(
    rows
      .filter((row) => row.type === "office")
      .map((row) => ({
        id: row.id,
        sort: row.sort ?? row.id,
        country: (row.name ?? row.title ?? "").trim(),
        city: (row.location ?? "").trim(),
        type: (row.category ?? "Regional Office").trim() || "Regional Office",
        address: (row.address ?? "").trim(),
        phone: (row.phone ?? "").trim(),
        email: (row.email ?? "").trim(),
        image: row.image_url ?? row.image,
      }))
      .filter((office) => office.country || office.city || office.address),
  );

  const socialLinks = rows
    .filter((row) => row.type === "social_link")
    .sort((a, b) => (a.sort ?? 0) - (b.sort ?? 0))
    .map((row) => ({
      id: row.id,
      sort: row.sort ?? 0,
      label: row.name ?? "",
      href: row.link ?? "",
      icon: row.category ?? "linkedin",
    }));

  return {
    hero,
    mission: normalizeMissionVision(rows.find((row) => row.type === "mission")),
    vision: normalizeMissionVision(rows.find((row) => row.type === "vision")),
    sectionHeaders,
    coreValues,
    whyFeatures,
    ecosystemCards,
    offices,
    socialLinks,
  };
}

export function normalizePartnersPage(
  rows: DirectusPartnersPageItem[],
): PartnersPageContent {
  const heroRow = rows.find(
    (row) => (row.type ?? "").trim().toLowerCase() === "hero",
  );
  const hero: PartnersPageContent["hero"] = heroRow
    ? {
        badge: heroRow.badge ?? "",
        title: heroRow.title ?? "",
        subtitle: heroRow.subtitle ?? "",
        description: heroRow.description ?? "",
        backgroundImage: heroRow.image ?? heroRow.image_url ?? heroRow.Image ?? null,
      }
    : null;

  const sections = rows
    .slice()
    .sort((a, b) => (a.sort ?? a.id) - (b.sort ?? b.id))
    // The hero row is rendered separately, so keep it out of the sections grid.
    .filter((row) => (row.type ?? "").trim().toLowerCase() !== "hero")
    .map((row) => ({
      id: row.id,
      sort: row.sort ?? row.id,
      title: row.title ?? row.name ?? "",
      description: row.description ?? "",
      icon: (row.icon ?? row.category ?? row.type ?? "partners").trim(),
      image: row.image ?? row.image_url ?? row.Image ?? null,
    }))
    .filter((section) => section.title || section.description || section.image);

  return { hero, sections };
}

function parseServicesFeatureList(value: unknown): string[] {
  if (!value) return [];
  if (Array.isArray(value)) {
    return value
      .map((item) => (typeof item === "string" ? item.trim() : String(item).trim()))
      .filter(Boolean);
  }
  if (typeof value !== "string") return [];
  const trimmed = value.trim();
  if (!trimmed) return [];
  try {
    const parsed: unknown = JSON.parse(trimmed);
    if (Array.isArray(parsed)) return parseServicesFeatureList(parsed);
  } catch {
    // Not JSON — fall through to delimiter split.
  }
  return trimmed
    .split(/[\n,|]/)
    .map((part) => part.trim())
    .filter(Boolean);
}

function resolveServicesImage(
  value: DirectusServicesPageItem["image"],
): string | null {
  if (!value) return null;
  if (typeof value === "string") return value.trim() || null;
  if (typeof value === "object" && typeof value.id === "string" && value.id.trim()) {
    return value.id.trim();
  }
  return null;
}

export function normalizeServicesPage(
  rows: DirectusServicesPageItem[],
): ServicesPageContent {
  const cards = rows
    .slice()
    .sort((a, b) => a.id - b.id)
    .map((row) => ({
      id: row.id,
      title: (row.title ?? "").trim(),
      description: (row.desc ?? "").trim(),
      image: resolveServicesImage(row.image),
      features: parseServicesFeatureList(row.services),
    }))
    .filter((card) => card.title || card.description || card.image);

  return { cards };
}

/** Coerce a Directus comparison cell into a boolean (`true`/`false`) or free-text label. */
function parseComparisonCell(value: string | null): boolean | string {
  if (value == null) return false;
  const trimmed = value.trim();
  const lower = trimmed.toLowerCase();
  if (lower === "true" || lower === "yes") return true;
  if (lower === "" || lower === "false" || lower === "no") return false;
  return trimmed;
}

function resolveDirectusImageField(
  value: DirectusAcademyPageItem["Image"] | DirectusAcademyPageItem["image"] | string | null | undefined,
): string | undefined {
  if (!value) return undefined;
  if (typeof value === "string") return value || undefined;
  if (typeof value === "object" && "id" in value && value.id) return value.id;
  return undefined;
}

export function emptyAcademyPageContent(): AcademyPageContent {
  return { ...normalizeAcademyPage([]), cmsConnected: false };
}

function normalizeAcademyItemType(type: string | null | undefined): string {
  return (type ?? "").trim().toLowerCase();
}

export function normalizeAcademyPage(
  rows: DirectusAcademyPageItem[],
): AcademyPageContent {
  const byType = (type: DirectusAcademyPageItem["type"]) =>
    rows
      .filter((row) => normalizeAcademyItemType(row.type) === normalizeAcademyItemType(type))
      .sort((a, b) => (a.sort ?? 0) - (b.sort ?? 0));

  const readinessGap = byType("gap_stat").map((row) => ({
    label: row.title ?? "",
    value: row.value_a ?? 0,
  }));

  const outcomeDistribution = byType("outcome_slice").map((row) => ({
    label: row.title ?? "",
    value: row.value_a ?? 0,
  }));

  const cohortGrowth = byType("cohort_point").map((row) => ({
    cohort: row.title ?? "",
    mvps: row.value_a ?? 0,
    funded: row.value_b ?? 0,
  }));

  const flywheel = byType("flywheel_phase").map((row) => ({
    phase: row.title ?? "",
    weeks: row.subtitle ?? "",
    subtitle: row.description ?? "",
    points: parseToStringArray(row.points),
    deliverable: row.extra ?? "",
    icon: row.icon ?? "Lightbulb",
  }));

  const comparison = byType("comparison_row").map((row) => ({
    feature: row.title ?? "",
    uni: parseComparisonCell(row.cell_uni),
    online: parseComparisonCell(row.cell_online),
    weekend: parseComparisonCell(row.cell_weekend),
    innovera: parseComparisonCell(row.cell_innovera),
  }));

  const pathways = byType("pathway").map((row) => ({
    title: row.title ?? "",
    points: parseToStringArray(row.points),
    icon: row.icon ?? "Rocket",
    tone: row.tone === "primary" ? ("primary" as const) : ("accent" as const),
  }));

  const walkAway = byType("walk_away").map((row) => ({
    title: row.title ?? "",
    desc: row.description ?? "",
    icon: row.icon ?? "Award",
  }));

  const forYou = byType("for_you")
    .map((row) => row.title ?? "")
    .filter(Boolean);

  const notForYou = byType("not_for_you")
    .map((row) => row.title ?? "")
    .filter(Boolean);

  const testimonials = byType("testimonial").map((row) => ({
    name: row.title ?? "",
    school: row.subtitle ?? "",
    quote: row.description ?? "",
    outcome: row.extra ?? "",
  }));

  const partners = rows
    .filter((row) => {
      const type = normalizeAcademyItemType(row.type);
      return type === "partner-logo" || type === "partner_logo";
    })
    .sort((a, b) => (a.sort ?? 0) - (b.sort ?? 0))
    .map((row) => ({
      name: row.title ?? "",
      logo:
        resolveDirectusImageField(row.Image) ??
        resolveDirectusImageField(row.image) ??
        row.image_url ??
        row.logo ??
        undefined,
    }))
    .filter((row) => row.name);

  const faq = byType("faq").map((row) => ({
    q: row.title ?? "",
    a: row.description ?? "",
  }));

  const pathSectionImages = rows
    .filter((row) => normalizeAcademyItemType(row.type) === "path-section")
    .sort((a, b) => (a.sort ?? 0) - (b.sort ?? 0))
    .map((row) => {
      const image =
        resolveDirectusImageField(row.Image) ??
        resolveDirectusImageField(row.image) ??
        row.image_url ??
        row.logo ??
        "";
      return {
        id: row.id,
        sort: row.sort ?? 0,
        title: row.title ?? "",
        alt: row.description ?? row.title ?? "Academy pathways",
        image,
      };
    })
    .filter((row) => row.image);

  const heroImages = rows
    .filter((row) => normalizeAcademyItemType(row.type) === "hero")
    .sort((a, b) => (a.sort ?? 0) - (b.sort ?? 0))
    .map((row) => {
      const image =
        resolveDirectusImageField(row.Image) ??
        resolveDirectusImageField(row.image) ??
        row.image_url ??
        row.logo ??
        "";
      return {
        id: row.id,
        sort: row.sort ?? 0,
        title: row.title ?? "",
        alt: row.description ?? row.title ?? "Academy hero",
        image,
      };
    })
    .filter((row) => row.image);

  return {
    cmsConnected: true,
    heroImages,
    readinessGap,
    outcomeDistribution,
    cohortGrowth,
    flywheel,
    comparison,
    pathways,
    walkAway,
    forYou,
    notForYou,
    testimonials,
    partners,
    faq,
    pathSectionImages,
  };
}
