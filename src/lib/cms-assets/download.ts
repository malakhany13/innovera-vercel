import fs from "node:fs";
import path from "node:path";
import {
  getDirectusAdminHeaders,
  getDirectusServerUrl,
} from "@/lib/directus-admin";
import { collectAllCmsAssetIds } from "@/lib/cms-assets/collect";
import type { CmsAssetMap } from "@/lib/cms-assets/local";

const CONTENT_TYPE_EXT: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/jpg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
  "image/svg+xml": ".svg",
  "image/avif": ".avif",
  "image/bmp": ".bmp",
  "image/x-icon": ".ico",
  "image/vnd.microsoft.icon": ".ico",
  "application/pdf": ".pdf",
  "video/mp4": ".mp4",
  "video/webm": ".webm",
  "application/octet-stream": ".bin",
};

function extensionFromContentType(contentType: string | null): string {
  if (!contentType) return ".bin";
  const mime = contentType.split(";")[0]?.trim().toLowerCase() ?? "";
  return CONTENT_TYPE_EXT[mime] ?? ".bin";
}

function extensionFromFilename(filename: string): string | null {
  const base = filename.split(/[/\\]/).pop() ?? filename;
  const match = base.match(/(\.[a-z0-9]{1,8})$/i);
  return match?.[1]?.toLowerCase() ?? null;
}

/** Parse Content-Disposition filename, if present. */
export function filenameFromContentDisposition(
  header: string | null,
): string | null {
  if (!header) return null;
  const utf8 = header.match(/filename\*\s*=\s*UTF-8''([^;]+)/i);
  if (utf8?.[1]) {
    try {
      return decodeURIComponent(utf8[1].trim().replace(/^["']|["']$/g, ""));
    } catch {
      return utf8[1].trim().replace(/^["']|["']$/g, "");
    }
  }
  const plain = header.match(/filename\s*=\s*([^;]+)/i);
  if (plain?.[1]) {
    return plain[1].trim().replace(/^["']|["']$/g, "");
  }
  return null;
}

function resolveExtension(
  contentType: string | null,
  contentDisposition: string | null,
): string {
  const fromName = filenameFromContentDisposition(contentDisposition);
  if (fromName) {
    const ext = extensionFromFilename(fromName);
    if (ext) return ext;
  }
  return extensionFromContentType(contentType);
}

function clearDirectoryContents(dir: string): void {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    return;
  }
  for (const entry of fs.readdirSync(dir)) {
    fs.rmSync(path.join(dir, entry), { recursive: true, force: true });
  }
}

async function downloadOneAsset(
  id: string,
  outDir: string,
  attempt = 1,
): Promise<string> {
  const base = getDirectusServerUrl();
  const url = `${base}/assets/${id}`;
  const response = await fetch(url, {
    headers: getDirectusAdminHeaders(),
    cache: "no-store",
  });

  if (!response.ok) {
    const retryable = response.status === 502 || response.status === 503 || response.status === 429;
    if (retryable && attempt < 4) {
      await new Promise((r) => setTimeout(r, attempt * 500));
      return downloadOneAsset(id, outDir, attempt + 1);
    }
    throw new Error(
      `Failed to download asset ${id}: HTTP ${response.status} from ${url}`,
    );
  }

  const contentType = response.headers.get("content-type");
  const contentDisposition = response.headers.get("content-disposition");
  const ext = resolveExtension(contentType, contentDisposition);
  const filename = `${id}${ext}`;
  const publicPath = `/cms-images/${filename}`;
  const diskPath = path.join(outDir, filename);

  const buffer = Buffer.from(await response.arrayBuffer());
  fs.writeFileSync(diskPath, buffer);
  return publicPath;
}

export interface DownloadCmsAssetsResult {
  map: CmsAssetMap;
  downloaded: number;
  ids: string[];
}

/**
 * Download every Directus asset referenced by generated pages into `public/cms-images`
 * and write `src/generated/cms-asset-map.json`. Each asset id is fetched at most once.
 */
export async function downloadAllCmsAssets(projectRoot: string): Promise<DownloadCmsAssetsResult> {
  const outDir = path.join(projectRoot, "public", "cms-images");
  const mapPath = path.join(projectRoot, "src", "generated", "cms-asset-map.json");

  clearDirectoryContents(outDir);
  fs.mkdirSync(path.dirname(mapPath), { recursive: true });

  const ids = await collectAllCmsAssetIds();
  console.log(`[cms-assets] Found ${ids.length} unique Directus asset id(s)`);

  const map: CmsAssetMap = {};
  const seen = new Set<string>();

  for (const id of ids) {
    if (seen.has(id)) continue;
    seen.add(id);
    const publicPath = await downloadOneAsset(id, outDir);
    map[id] = publicPath;
    console.log(`[cms-assets] Saved ${id} → ${publicPath}`);
  }

  fs.writeFileSync(mapPath, `${JSON.stringify(map, null, 2)}\n`, "utf8");
  console.log(`[cms-assets] Wrote map with ${Object.keys(map).length} entries → ${mapPath}`);

  return { map, downloaded: seen.size, ids };
}
