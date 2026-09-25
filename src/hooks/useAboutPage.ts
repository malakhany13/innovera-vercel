// src/hooks/useAboutPage.ts
import { useEffect, useState } from "react";
import { getPublicDirectusUrl } from "@/lib/config/directus.config";
import { getAssetUrl } from "@/lib/directus";

interface AboutPageItem {
  id: number;
  type: string;
  sort: number | null;
  title: string | null;
  subtitle: string | null;
  description: string | null;
  content: string | null;
  excerpt: string | null;
  section_key: string | null;
  image: string | null;
}

interface AboutPageData {
  data: AboutPageItem[];
}

export function useAboutPage() {
  const [data, setData] = useState<AboutPageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const baseUrl = getPublicDirectusUrl();
        const res = await fetch(`${baseUrl}/items/About_Page`);
        if (!res.ok) throw new Error("Failed to fetch about page");
        const json = await res.json();
        setData(json);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Get hero content (type: "hero")
  const getHeroContent = () =>
    data?.data?.find((item) => item.type === "hero") || null;

  // Get hero images (type: "hero_image") optionally filtered by section_key
  const getHeroImages = (sectionKey?: string) =>
    data?.data?.filter((item) => {
      if (item.type !== "hero_image") return false;
      if (sectionKey && item.section_key !== sectionKey) return false;
      return true;
    }) || [];

  // Get items by type
  const getItemsByType = (type: string) =>
    data?.data?.filter((item) => item.type === type) || [];

  return { data, loading, error, getHeroContent, getHeroImages, getItemsByType };
}

/** Asset URL via NEXT_PUBLIC_DIRECTUS_URL (see directus.config). */
export function getDirectusAssetUrl(fileId: string) {
  return getAssetUrl(fileId);
}
