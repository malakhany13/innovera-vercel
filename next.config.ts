import type { NextConfig } from "next";
import fs from "fs";
import path from "path";
import bundleAnalyzer from "@next/bundle-analyzer";
import { getPublicDirectusUrl } from "./src/lib/config/directus.config";

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

/**
 * Directus host for image remotePatterns + rewrites.
 * Production: set NEXT_PUBLIC_DIRECTUS_URL (and DIRECTUS_URL for server fetches).
 * Localhost is only the fallback when the env var is unset.
 */
const DIRECTUS_URL = getPublicDirectusUrl();

/** Laravel API origin for next-dev payment / v1 rewrites. */
const LARAVEL_REWRITE_URL = (
  process.env.NEXT_PUBLIC_LARAVEL_API_BASE_URL?.trim() ||
  process.env.LARAVEL_API_BASE_URL?.trim() ||
  process.env.PAYMENT_API_BASE_URL?.trim() ||
  "https://www.innoveracorp.com"
).replace(/\/$/, "");

function isLocalDirectusHost(): boolean {
  try {
    const { hostname } = new URL(DIRECTUS_URL);
    return (
      hostname === "localhost" ||
      hostname === "127.0.0.1" ||
      hostname === "::1"
    );
  } catch {
    return true;
  }
}

const allowLocalDirectusImages = isLocalDirectusHost();

/** Parse the Directus base URL into the parts next/image expects. */
function directusRemotePattern() {
  try {
    const url = new URL(DIRECTUS_URL);
    return {
      protocol: url.protocol.replace(":", "") as "http" | "https",
      hostname: url.hostname,
      port: url.port || undefined,
      pathname: "/assets/**",
    };
  } catch {
    // Fallback pattern if NEXT_PUBLIC_DIRECTUS_URL is malformed (local dev).
    return {
      protocol: "http" as const,
      hostname: "localhost",
      port: "8055",
      pathname: "/assets/**",
    };
  }
}

/**
 * Parse Laravel/ngrok origin into next/image remotePatterns.
 * Laravel serves course images from multiple paths — `/storage/**` (disk-backed
 * uploads), `/images/**` (static seed assets), and bare UUID paths at root
 * (legacy image_path values) — so allow the whole origin rather than one prefix.
 */
function laravelRemotePattern() {
  if (!LARAVEL_REWRITE_URL) return null;
  try {
    const url = new URL(LARAVEL_REWRITE_URL);
    return {
      protocol: url.protocol.replace(":", "") as "http" | "https",
      hostname: url.hostname,
      port: url.port || undefined,
      pathname: "/**",
    };
  } catch {
    return null;
  }
}

function isLocalHostname(hostname: string): boolean {
  return (
    hostname === "localhost" ||
    hostname === "127.0.0.1" ||
    hostname === "::1"
  );
}

function isLocalLaravelHost(): boolean {
  try {
    return isLocalHostname(new URL(LARAVEL_REWRITE_URL).hostname);
  } catch {
    return false;
  }
}

const laravelImagePattern = laravelRemotePattern();

/**
 * Laravel `APP_URL` is often `http://127.0.0.1:8000` in local Magico, even when
 * Next proxies to another origin — allow those asset hosts for next/image.
 */
const LOCAL_LARAVEL_IMAGE_PATTERNS = [
  {
    protocol: "http" as const,
    hostname: "127.0.0.1",
    port: "8000",
    pathname: "/**",
  },
  {
    protocol: "http" as const,
    hostname: "localhost",
    port: "8000",
    pathname: "/**",
  },
] as const;

/** Next 16 blocks private-IP image optimization unless this is on. */
const allowLocalImageIps =
  allowLocalDirectusImages ||
  isLocalLaravelHost() ||
  process.env.NODE_ENV !== "production";
/** External image hosts used in CMS/constants (Google Drive, partner logos, news). */
const EXTERNAL_IMAGE_HOSTS = [
  "lh3.googleusercontent.com",
  "drive.google.com",
  "images.unsplash.com",
  "ui-avatars.com",
  "www.aicerts.io",
  "cdn.aicerts.ai",
  "www.mintformations.co.uk",
  "almolakhasalektesady.com",
  "media.radiotunisienne.tn",
  "s3-eu-west-1.amazonaws.com",
  "upload.wikimedia.org",
  "techtorium.ac.nz",
  "www.innoveracorp.com",
  "innoveracorp.com",
  "static.cdnlogo.com",
  "i0.wp.com",
] as const;

function httpsRemotePattern(hostname: string, pathname = "/**") {
  return {
    protocol: "https" as const,
    hostname,
    pathname,
  };
}

const isStaticExport = process.env.NEXT_STATIC_EXPORT === "1";

if (isStaticExport) {
  const apiDir = path.join(__dirname, "src", "app", "api");
  if (fs.existsSync(apiDir)) {
    throw new Error(
      "[next.config] NEXT_STATIC_EXPORT=1 but src/app/api still exists.\n" +
        "  Route Handlers cannot be part of `output: \"export\"`.\n" +
        "  Use `npm run build:static` (it stashes api/ before the build).\n" +
        "  Do not set NEXT_STATIC_EXPORT in .env.local for plain `npm run build`.",
    );
  }
}

const nextConfig: NextConfig = {
  // The static export has no runtime Directus (see IS_STATIC_CMS). Blank the
  // public URL in the client bundle so the build machine's Directus address —
  // usually http://localhost:8055 from .env.local — is never shipped. Build-time
  // fetches use the server-only DIRECTUS_URL and are unaffected.
  // Also bake STATIC_EXPORT so the client skips Next BFF `/api/*` and calls Laravel.
  ...(isStaticExport
    ? {
        env: {
          NEXT_PUBLIC_DIRECTUS_URL: "",
          NEXT_PUBLIC_STATIC_EXPORT: "1",
          NEXT_PUBLIC_CMS_ASSETS_LOCAL: "1",
        },
      }
    : {}),
  // Static HTML export (via `npm run build:static`).
  // `distDir` becomes the export folder when `output: "export"` (Next writes
  // manifests to `.next`). We use `.static-out` so a locked `export/` (e.g. a
  // shell cwd inside it on Windows) cannot fail the build; build-static then
  // promotes `*.html` → `*/index.html` and publishes to `export/`.
  // `__next.*` files are Next 16 RSC segment payloads — normal, not page HTML.
      ...(isStaticExport
    ? {
        output: "export" as const,
        distDir: ".static-out",
        // Directory-style hosting (Laravel/Apache): emit `<route>/index.html`
        // directly instead of flat `<route>.html`.
        trailingSlash: true,
        // API routes are stashed during export; skip stale .next/dev validators
        // that still reference them (often left by a concurrent `next-dev`).
        typescript: { ignoreBuildErrors: true },
      }
    : {}),

  // Every course page prerender fetches Laravel over a tunnel. Parallel workers
  // saturate it and every page then trips the 60s per-page timeout, so generate
  // pages one at a time. Also avoids Windows "spawn UNKNOWN" in multi-worker
  // "Collecting page data".
  experimental: {
    cpus: 10,
    staticGenerationMinPagesPerWorker: 1000,
    staticGenerationMaxConcurrency: 10,
    staticGenerationRetryCount: 1,
  },

  // Serial generation means a hung upstream would otherwise stall the build for
  // 60s per page. Upstream fetches abort well before this.
  staticPageGenerationTimeout: 30,

  // Opening the dev server via the LAN IP otherwise blocks /_next/* dev
  // resources (HMR), which leaves pages unhydrated.
  allowedDevOrigins: ["172.22.176.1"],

  turbopack: {
    root: path.join(__dirname),
  },

  images: {
    // Required for `output: "export"` (no Image Optimization server).
    ...(isStaticExport ? { unoptimized: true } : {}),
    // Next.js 16 blocks localhost/127.0.0.1 upstream fetches (SSRF).
    // Allow when Directus or Laravel is local, and in next-dev generally.
    dangerouslyAllowLocalIP: allowLocalImageIps,
    dangerouslyAllowSVG: true,
    contentDispositionType: "inline",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    localPatterns: [
      { pathname: "/api/directus/assets/**" },
      { pathname: "/api/laravel-asset" },
      { pathname: "/assets/**" },
      { pathname: "/images/**" },
      { pathname: "/cms-images/**" },
    ],
    remotePatterns: [
      directusRemotePattern(),
      ...(laravelImagePattern ? [laravelImagePattern] : []),
      ...LOCAL_LARAVEL_IMAGE_PATTERNS,
      ...EXTERNAL_IMAGE_HOSTS.map((hostname) =>
        hostname === "ui-avatars.com"
          ? httpsRemotePattern(hostname, "/api/**")
          : httpsRemotePattern(hostname),
      ),
    ],
  },

  // Rewrites need a Next server — skipped for static export.
  ...(!isStaticExport
    ? {
        async rewrites() {
          const rules = [
            {
              source: "/api/directus/:path*",
              destination: `${DIRECTUS_URL}/:path*`,
            },
          ];
          if (LARAVEL_REWRITE_URL) {
            rules.push(
              // So client fallback `/api/v1/news|events` hits Laravel, not the
              // App Router catch-all (which returns HTML 200).
              {
                source: "/api/v1/:path*",
                destination: `${LARAVEL_REWRITE_URL}/api/v1/:path*`,
              },
            );
          }
          return rules;
        },
      }
    : {}),
};

export default withBundleAnalyzer(nextConfig);