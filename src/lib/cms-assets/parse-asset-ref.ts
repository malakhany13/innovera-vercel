import { getPublicDirectusUrl, getServerDirectusUrl } from "@/lib/config/directus.config";

/** Directus file UUID (with or without braces). */
const ASSET_UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const ASSET_PATH_RE =
  /\/assets\/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})(?:\?|$)/i;

function directusBases(): string[] {
  const bases = new Set<string>();
  try {
    bases.add(getServerDirectusUrl());
  } catch {
    /* ignore */
  }
  try {
    bases.add(getPublicDirectusUrl());
  } catch {
    /* ignore */
  }
  bases.delete("");
  return [...bases];
}

/**
 * Extract a Directus asset file id from a CMS field value.
 * Returns null for external URLs, empty values, or non-asset strings.
 */
export function extractDirectusAssetId(
  value: string | { id: string } | null | undefined,
): string | null {
  if (value == null) return null;

  if (typeof value === "object" && "id" in value && typeof value.id === "string") {
    const id = value.id.trim();
    return ASSET_UUID_RE.test(id) ? id : null;
  }

  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!trimmed) return null;

  if (ASSET_UUID_RE.test(trimmed)) return trimmed;

  const pathMatch = trimmed.match(ASSET_PATH_RE);
  if (pathMatch?.[1]) {
    if (trimmed.startsWith("/assets/")) return pathMatch[1];
    for (const base of directusBases()) {
      if (trimmed.startsWith(base)) return pathMatch[1];
    }
    try {
      const url = new URL(trimmed);
      if (url.pathname.includes("/assets/")) return pathMatch[1];
    } catch {
      /* ignore */
    }
  }

  return null;
}

export function addAssetId(target: Set<string>, value: unknown): void {
  if (value == null) return;
  if (
    typeof value === "string" ||
    (typeof value === "object" && value !== null && "id" in value)
  ) {
    const id = extractDirectusAssetId(value as string | { id: string });
    if (id) target.add(id);
  }
}
