import { NextRequest, NextResponse } from "next/server";
import { laravelApiOrigins } from "@/lib/laravel/config";

const UPSTREAM_HEADERS = {
  Accept: "image/*,*/*",
  "ngrok-skip-browser-warning": "true",
  "User-Agent": "InnoveraNextAssetProxy/1.0",
} as const;

const IMAGE_MAGIC: Array<{ mime: string; bytes: number[] }> = [
  { mime: "image/png", bytes: [0x89, 0x50, 0x4e, 0x47] },
  { mime: "image/jpeg", bytes: [0xff, 0xd8, 0xff] },
  { mime: "image/gif", bytes: [0x47, 0x49, 0x46, 0x38] },
  { mime: "image/webp", bytes: [0x52, 0x49, 0x46, 0x46] },
];

function sniffImageMime(bytes: Uint8Array): string | null {
  for (const candidate of IMAGE_MAGIC) {
    if (
      candidate.bytes.every((value, index) => bytes[index] === value) &&
      (candidate.mime !== "image/webp" ||
        (bytes[8] === 0x57 && bytes[9] === 0x45 && bytes[10] === 0x42 && bytes[11] === 0x50))
    ) {
      return candidate.mime;
    }
  }
  return null;
}

function allowedHostnames(origins: string[]): Set<string> {
  const hosts = new Set<string>();
  for (const origin of origins) {
    try {
      hosts.add(new URL(origin).hostname);
    } catch {
      // ignore malformed env values
    }
  }
  return hosts;
}

/**
 * Proxy Laravel `/storage/...` assets so next/image (and the browser) get a real
 * image. Tries {@link LARAVEL_API_BASE_URL} first, then
 * {@link LARAVEL_API_FALLBACK_BASE_URL} with the same `/storage/...` path.
 *
 * GET /api/laravel-asset?url=<absolute-laravel-storage-url>
 */
export async function GET(request: NextRequest) {
  const raw = request.nextUrl.searchParams.get("url")?.trim();
  if (!raw) {
    return NextResponse.json({ error: "Missing url" }, { status: 400 });
  }

  let target: URL;
  try {
    target = new URL(raw);
  } catch {
    return NextResponse.json({ error: "Invalid url" }, { status: 400 });
  }

  if (target.protocol !== "http:" && target.protocol !== "https:") {
    return NextResponse.json({ error: "Unsupported protocol" }, { status: 400 });
  }

  const origins = laravelApiOrigins();
  if (origins.length === 0) {
    return NextResponse.json({ error: "Laravel API is not configured" }, { status: 503 });
  }

  const hosts = allowedHostnames(origins);
  if (!hosts.has(target.hostname)) {
    return NextResponse.json({ error: "Host not allowed" }, { status: 403 });
  }

  if (!target.pathname.startsWith("/storage/")) {
    return NextResponse.json({ error: "Path not allowed" }, { status: 403 });
  }

  const storagePath = `${target.pathname}${target.search}`;
  // Prefer configured origins (primary → fallback), then the exact requested URL.
  const candidates = [
    ...origins.map((origin) => `${origin}${storagePath}`),
    target.toString(),
  ].filter((url, index, list) => list.indexOf(url) === index);

  const failures: string[] = [];

  for (const candidate of candidates) {
    try {
      const upstream = await fetch(candidate, {
        headers: UPSTREAM_HEADERS,
        cache: "no-store",
      });

      if (!upstream.ok) {
        failures.push(`${candidate} → HTTP ${upstream.status}`);
        continue;
      }

      const bytes = new Uint8Array(await upstream.arrayBuffer());
      const sniffed = sniffImageMime(bytes);
      const headerType = upstream.headers.get("content-type") || "";

      if (!sniffed && headerType.includes("text/html")) {
        failures.push(`${candidate} → HTML`);
        continue;
      }

      if (!sniffed && !headerType.startsWith("image/")) {
        failures.push(`${candidate} → not an image (${headerType || "unknown"})`);
        continue;
      }

      return new NextResponse(bytes, {
        status: 200,
        headers: {
          "Content-Type": sniffed || headerType || "application/octet-stream",
          "Cache-Control": "public, max-age=3600",
        },
      });
    } catch {
      failures.push(`${candidate} → fetch failed`);
    }
  }

  return NextResponse.json(
    {
      error: "Unable to fetch image from any Laravel origin",
      tried: failures,
    },
    { status: 502 },
  );
}
