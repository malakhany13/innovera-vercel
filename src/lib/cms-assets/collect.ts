import {
  getAboutPage,
  getAcademyPage,
  getHomePage,
  getPartnersPage,
  getServicesPage,
} from "@/lib/directus";
import type {
  AboutPageContent,
  AcademyPageContent,
  HomePageContent,
  PartnersPageContent,
  ServicesPageContent,
} from "@/features/directus/types";
import { addAssetId } from "@/lib/cms-assets/parse-asset-ref";

function collectHomePageIds(content: HomePageContent, ids: Set<string>): void {
  for (const slide of content.heroSlides) addAssetId(ids, slide.image);
  for (const section of content.sectionImages) addAssetId(ids, section.image);
  for (const vendor of content.vendors) addAssetId(ids, vendor.image);
  for (const partner of content.partners) addAssetId(ids, partner.image);
  for (const photo of content.contactPhotos) addAssetId(ids, photo.image);
  for (const news of content.featuredNews) addAssetId(ids, news.image);
}

function collectAboutPageIds(content: AboutPageContent, ids: Set<string>): void {
  if (content.hero) {
    addAssetId(ids, content.hero.primary_image);
    addAssetId(ids, content.hero.secondary_image);
  }
  if (content.mission) addAssetId(ids, content.mission.image);
  if (content.vision) addAssetId(ids, content.vision.image);
  for (const feature of content.whyFeatures) addAssetId(ids, feature.image);
  for (const office of content.offices) addAssetId(ids, office.image);
}

function collectAcademyPageIds(content: AcademyPageContent, ids: Set<string>): void {
  for (const img of content.heroImages) addAssetId(ids, img.image);
  for (const img of content.pathSectionImages) addAssetId(ids, img.image);
  for (const partner of content.partners) addAssetId(ids, partner.logo);
}

function collectPartnersPageIds(content: PartnersPageContent, ids: Set<string>): void {
  if (content.hero) addAssetId(ids, content.hero.backgroundImage);
  for (const section of content.sections) addAssetId(ids, section.image);
}

function collectServicesPageIds(content: ServicesPageContent, ids: Set<string>): void {
  for (const card of content.cards) addAssetId(ids, card.image);
}

/**
 * Fetch Directus CMS surfaces used by static pages and collect unique asset ids.
 * Laravel-backed catalogs (courses / news / events) are skipped — their media is
 * `/storage/...` at runtime, not Directus `/cms-images/`.
 * Throws if Directus is unreachable (all loaders fail).
 */
export async function collectAllCmsAssetIds(): Promise<string[]> {
  const ids = new Set<string>();
  const errors: string[] = [];

  async function tryLoad<T>(
    label: string,
    fn: () => Promise<T>,
    fallback: T,
  ): Promise<T> {
    try {
      return await fn();
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      errors.push(`${label}: ${message}`);
      console.warn(`[cms-assets] ${label} failed:`, message);
      return fallback;
    }
  }

  // News / events / courses come from Laravel (`/storage/...`), not Directus.
  // Skip them here so a slow/down Laravel API does not stall `build:static`
  // for 20s×3. Directus CMS pages below are what populate `/cms-images/`.
  const [home, about, academy, partners, services] = await Promise.all([
    tryLoad("getHomePage", () => getHomePage(), null),
    tryLoad("getAboutPage", () => getAboutPage(), null),
    tryLoad("getAcademyPage", () => getAcademyPage(), null),
    tryLoad("getPartnersPage", () => getPartnersPage(), null),
    tryLoad("getServicesPage", () => getServicesPage(), null),
  ]);

  if (errors.length === 5) {
    throw new Error(
      `Directus unreachable — all CMS fetches failed. Is Directus running?\n` +
        errors.map((e) => `  - ${e}`).join("\n"),
    );
  }

  if (home) collectHomePageIds(home, ids);
  if (about) collectAboutPageIds(about, ids);
  if (academy) collectAcademyPageIds(academy, ids);
  if (partners) collectPartnersPageIds(partners, ids);
  if (services) collectServicesPageIds(services, ids);

  return [...ids].sort();
}
