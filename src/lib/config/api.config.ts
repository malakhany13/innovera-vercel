import { PUBLIC_DIRECTUS_URL } from "@/lib/config/directus.config";
import Config from "@/lib/config/app.config";

/**
 * Public API origin used by the Redux store (RTK Query / browser fetches).
 * Empty = same-origin Next BFF ({@link Config.BACK_END_URL}).
 */
export const API_BASE_URL = Config.BACK_END_URL;

export const API_CONFIG = {
  /** Browser API base (= Config.BACK_END_URL; empty → localhost:3001 in next-dev). */
  baseUrl: API_BASE_URL,
  BACK_END_URL: API_BASE_URL,
  /** Server upstream Laravel host (BFF target). */
  LARAVEL_API_BASE_URL: Config.LARAVEL_API_BASE_URL,
  directus: {
    endpoints: {
      homePage: "/items/Home_Page",
      solutionsPage: "/items/Solutions_Page?filter[type][_eq]=solution&sort=sort",
      aboutPage: "/items/About_Page?sort=sort",
      academyPage: "/items/Academy_page",
      partnersPage: "/items/Our_Partners",
      servicesPage: "/items/Services_Page?sort=id",
    },
  },
} as const;

/**
 * Public Directus URL for asset links (images).
 * Comes from NEXT_PUBLIC_DIRECTUS_URL (localhost only as a local-dev fallback).
 */
export const DIRECTUS_URL = PUBLIC_DIRECTUS_URL;
