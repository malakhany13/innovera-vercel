import type { Metadata } from "next";
import type { Course } from "@/features/directus/types";
import { FALLBACK_COURSE_IMAGE, getCourseDescription } from "@/lib/directus";

export const SITE_NAME = "Innovera";

function resolveSiteUrl(): string {
  const configured = process.env.APP_URL?.trim();
  if (configured && /^https?:\/\//i.test(configured)) {
    return configured.replace(/\/$/, "");
  }
  return "https://innoveracorp.com";
}

export const SITE_URL = resolveSiteUrl();

export const DEFAULT_OG_IMAGE =
  "https://lh3.googleusercontent.com/d/1pfHsxu1Xi9eNEA5j7K9EwH5tw7HBfbh9";

export interface PageMetadataInput {
  title: string;
  description: string;
  path: string;
  image?: string;
  type?: "website" | "article";
}

/** Build consistent SEO + Open Graph metadata for static pages. */
export function buildPageMetadata({
  title,
  description,
  path,
  image = DEFAULT_OG_IMAGE,
  type = "website",
}: PageMetadataInput): Metadata {
  const url = `${SITE_URL}${path}`;
  const ogTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: ogTitle,
      description,
      url,
      siteName: SITE_NAME,
      type,
      images: [{ url: image, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description,
      images: [image],
    },
  };
}

/** Course detail / enroll pages — OG image from Directus thumbnail when available. */
export function buildCourseMetadata(
  course: Course,
  options?: { path?: string; titlePrefix?: string },
): Metadata {
  const path = options?.path ?? `/courses/${course.id}`;
  const title = options?.titlePrefix
    ? `${options.titlePrefix}${course.title}`
    : course.title;

  return buildPageMetadata({
    title,
    description: getCourseDescription(course),
    path,
    image: course.image || FALLBACK_COURSE_IMAGE,
    type: "article",
  });
}
