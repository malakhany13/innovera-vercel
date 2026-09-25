/**
 * Whether static export should serve CMS assets from /cms-images instead of Directus.
 * Set only by `npm run build:static` — never in normal `next dev`.
 */
export function isCmsAssetsLocalMode(): boolean {
  return (
    process.env.NEXT_STATIC_EXPORT === "1" ||
    process.env.NEXT_PUBLIC_CMS_ASSETS_LOCAL === "1"
  );
}

export type CmsAssetMap = Record<string, string>;

/** Resolve a Directus file id to a local public path using the build-time map. */
export function resolveLocalCmsAssetUrl(
  id: string,
  map: CmsAssetMap,
): string | null {
  const path = map[id];
  return path ? path : null;
}
