/**
 * Static export build: Next.js `output: "export"` cannot include Route Handlers
 * or runtime-dynamic payment tokens. Temporarily stash those folders, build,
 * then restore them so `next dev` still has APIs.
 *
 * Pipeline:
 * 1. Download Directus CMS assets → public/cms-images (offline images)
 * 2. next build → `.static-out/` (includes /payment/fallback shell; tokens resolved client-side)
 * 3. Promote `training.html` → `training/index.html` (Laravel-friendly)
 * 4. Publish `.static-out` → `export/`
 */
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const stashRoot = path.join(root, ".static-export-stash");

const toStash = [
  { from: path.join(root, "src", "app", "api"), name: "api" },
  // payment/ stays in the export — client calls Laravel /api/payment/* directly
];

/** Route segment config — Next requires literal true/false strings. */
const segmentPatches = [
  {
    label: "payment page",
    path: path.join(root, "src", "app", "payment", "[token]", "page.tsx"),
    apply(source) {
      return source
        .replace(
          'export const dynamic = "force-dynamic";',
          'export const dynamic = "force-static";',
        )
        .replace("export const dynamicParams = true;", "export const dynamicParams = false;");
    },
  },
  {
    label: "payment result page",
    path: path.join(root, "src", "app", "payment", "[token]", "result", "page.tsx"),
    apply(source) {
      return source
        .replace(
          'export const dynamic = "force-dynamic";',
          'export const dynamic = "force-static";',
        )
        .replace("export const dynamicParams = true;", "export const dynamicParams = false;");
    },
  },
  {
    label: "catch-all page",
    path: path.join(root, "src", "app", "[[...segments]]", "page.tsx"),
    apply(source) {
      return source.replace(
        "export const dynamicParams = true;",
        "export const dynamicParams = false;",
      );
    },
  },
];
const segmentOriginals = new Map();

function patchPagesForStaticExport() {
  for (const item of segmentPatches) {
    if (!fs.existsSync(item.path)) continue;
    const original = fs.readFileSync(item.path, "utf8");
    const patched = item.apply(original);
    if (patched === original) {
      console.warn(
        `[build:static] ${item.label} segment config markers not found — static export may fail`,
      );
      continue;
    }
    segmentOriginals.set(item.path, original);
    fs.writeFileSync(item.path, patched, "utf8");
    console.log(`[build:static] patched ${item.label} for static export (dynamicParams=false)`);
  }
}

function restorePatchedPages() {
  for (const [filePath, original] of segmentOriginals) {
    fs.writeFileSync(filePath, original, "utf8");
    console.log("[build:static] restored", path.relative(root, filePath), "for next-dev");
  }
  segmentOriginals.clear();
}

/**
 * Load `.env.local` into `process.env` when keys are unset (Next does this for
 * `next build`; we need the same for the asset download pre-step).
 */
function loadEnvLocal() {
  const envPath = path.join(root, ".env.local");
  if (!fs.existsSync(envPath)) return;
  const text = fs.readFileSync(envPath, "utf8");
  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const eq = line.indexOf("=");
    if (eq <= 0) continue;
    const key = line.slice(0, eq).trim();
    let value = line.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
}

function stashDir(from, to) {
  if (!fs.existsSync(from)) return false;
  fs.mkdirSync(path.dirname(to), { recursive: true });
  if (fs.existsSync(to)) fs.rmSync(to, { recursive: true, force: true });
  fs.cpSync(from, to, { recursive: true });
  fs.rmSync(from, { recursive: true, force: true });
  return true;
}

function restoreDir(from, to) {
  if (!fs.existsSync(from)) return;
  if (fs.existsSync(to)) fs.rmSync(to, { recursive: true, force: true });
  fs.cpSync(from, to, { recursive: true });
  fs.rmSync(from, { recursive: true, force: true });
}

function restoreAll() {
  for (const item of toStash) {
    restoreDir(path.join(stashRoot, item.name), item.from);
  }
  if (fs.existsSync(stashRoot)) {
    fs.rmSync(stashRoot, { recursive: true, force: true });
  }
}

let restored = false;
function safeRestore() {
  if (restored) return;
  restored = true;
  restorePatchedPages();
  restoreAll();
  console.log("[build:static] restored api/");
}

process.on("exit", safeRestore);
process.on("SIGINT", () => {
  safeRestore();
  process.exit(1);
});
process.on("uncaughtException", (err) => {
  console.error(err);
  safeRestore();
  process.exit(1);
});

loadEnvLocal();

fs.mkdirSync(stashRoot, { recursive: true });

for (const item of toStash) {
  if (stashDir(item.from, path.join(stashRoot, item.name))) {
    console.log(`[build:static] stashed ${item.name}/ for export`);
  }
}

const nextDir = path.join(root, ".next");
if (fs.existsSync(nextDir)) {
  const trash = path.join(root, `.next-trash-${Date.now()}`);
  try {
    fs.renameSync(nextDir, trash);
    fs.rmSync(trash, { recursive: true, force: true });
  } catch {
    try {
      fs.rmSync(nextDir, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 });
    } catch (err) {
      console.warn("[build:static] could not fully clear .next — continuing", err.message);
    }
  }
  console.log("[build:static] cleared .next cache");
}

// `directus.ts` imports this JSON at load time — empty/truncated files abort download.
const cmsAssetMapPath = path.join(root, "src", "generated", "cms-asset-map.json");
function ensureCmsAssetMapStub() {
  fs.mkdirSync(path.dirname(cmsAssetMapPath), { recursive: true });
  let needsReset = true;
  if (fs.existsSync(cmsAssetMapPath)) {
    try {
      const raw = fs.readFileSync(cmsAssetMapPath, "utf8").trim();
      if (raw) {
        JSON.parse(raw);
        needsReset = false;
      }
    } catch {
      needsReset = true;
    }
  }
  if (needsReset) {
    fs.writeFileSync(cmsAssetMapPath, "{}\n", "utf8");
    console.log("[build:static] repaired empty/invalid cms-asset-map.json stub");
  }
}
ensureCmsAssetMapStub();

console.log("[build:static] downloading CMS assets for offline static export…");
const downloadResult = spawnSync(
  "npx",
  ["tsx", "scripts/download-cms-assets.ts"],
  {
    cwd: root,
    stdio: "inherit",
    shell: true,
    env: process.env,
  },
);
if (downloadResult.status !== 0) {
  console.error("[build:static] CMS asset download failed — aborting static export");
  safeRestore();
  process.exit(downloadResult.status ?? 1);
}

function copyDirMerge(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const ent of fs.readdirSync(src, { withFileTypes: true })) {
    const from = path.join(src, ent.name);
    const to = path.join(dest, ent.name);
    if (ent.isDirectory()) {
      copyDirMerge(from, to);
    } else {
      fs.copyFileSync(from, to);
    }
  }
}

/**
 * Publish `.static-out` → `export`. Prefer atomic rename; on Windows locks, merge-copy
 * and keep `.static-out` if `export/` cannot be fully replaced (so the build is not lost).
 */
function publishStaticOut(staticOutDir, outDir) {
  if (!fs.existsSync(staticOutDir)) {
    throw new Error(`Missing static export dir: ${staticOutDir}`);
  }

  const trainingIndex = path.join(staticOutDir, "training", "index.html");
  if (!fs.existsSync(trainingIndex)) {
    throw new Error(
      `Static export incomplete: missing ${trainingIndex}. HTML promotion may have failed.`,
    );
  }

  let replaced = false;
  if (fs.existsSync(outDir)) {
    try {
      fs.rmSync(outDir, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 });
      replaced = !fs.existsSync(outDir);
    } catch (err) {
      console.warn(
        "[build:static] could not replace export/ (close any terminal whose cwd is inside export/) — merging:",
        err.message,
      );
    }
  } else {
    replaced = true;
  }

  if (replaced) {
    fs.renameSync(staticOutDir, outDir);
    console.log("[build:static] published .static-out → export/");
    return;
  }

  copyDirMerge(staticOutDir, outDir);
  const outTrainingIndex = path.join(outDir, "training", "index.html");
  if (!fs.existsSync(outTrainingIndex)) {
    throw new Error(
      `Merge into export/ failed (still missing training/index.html). ` +
        `Leave the folder export/ in all terminals, then re-run. ` +
        `A complete export is available at .static-out/`,
    );
  }
  console.log(
    "[build:static] merged .static-out into export/ (kept .static-out as backup because export/ was locked)",
  );
}

// Best-effort clear of previous staging export + Next cache again (next-dev may
// have rewritten .next/dev while assets downloaded).
const staticOutDir = path.join(root, ".static-out");
const outDir = path.join(root, "export");
for (const dir of [staticOutDir, nextDir]) {
  if (!fs.existsSync(dir)) continue;
  try {
    fs.rmSync(dir, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 });
    console.log(`[build:static] cleared ${path.basename(dir)}/`);
  } catch (err) {
    console.warn(`[build:static] could not fully clear ${path.basename(dir)} — continuing`, err.message);
  }
}

patchPagesForStaticExport();

const result = spawnSync("npx", ["next", "build"], {
  cwd: root,
  stdio: "inherit",
  shell: true,
  env: {
    ...process.env,
    NEXT_STATIC_EXPORT: "1",
    NEXT_PUBLIC_STATIC_EXPORT: "1",
    NEXT_PUBLIC_CMS_ASSETS_LOCAL: "1",
  },
});

if (result.status === 0) {
  // Next emits `training.html`; Laravel needs `training/index.html`.
  console.log("[build:static] promoting flat HTML routes to */index.html…");
  const promote = spawnSync(
    process.execPath,
    [path.join(root, "scripts", "promote-export-html.mjs"), staticOutDir],
    { cwd: root, stdio: "inherit", shell: false },
  );
  if (promote.status !== 0) {
    console.error("[build:static] HTML promotion failed");
    safeRestore();
    process.exit(promote.status ?? 1);
  }

  // Next writes RSC segment payloads nested (__next.$oc$segments/__PAGE__.txt)
  // but its client router requests them flat (__next.$oc$segments.__PAGE__.txt),
  // 404ing every prefetch. Emit the flat form it actually asks for.
  console.log("[build:static] flattening RSC segment payloads…");
  const flatten = spawnSync(
    process.execPath,
    [path.join(root, "scripts", "flatten-rsc-segments.mjs"), staticOutDir],
    { cwd: root, stdio: "inherit", shell: false },
  );
  if (flatten.status !== 0) {
    console.error("[build:static] RSC payload flattening failed");
    safeRestore();
    process.exit(flatten.status ?? 1);
  }

  try {
    publishStaticOut(staticOutDir, outDir);
  } catch (err) {
    console.error("[build:static] failed to publish export/:", err.message);
    safeRestore();
    process.exit(1);
  }

  // Guard: never ship localhost URLs to a real host.
  //
  // Course/vendor image URLs are generated by LARAVEL's request-aware asset()
  // helper, so building against a local backend bakes http://localhost:8000/...
  // into the shipped HTML — broken and mixed-content-blocked in production.
  // This shipped once, and then shipped a second time when the ASSET_URL
  // workaround was forgotten, so it is enforced here rather than documented.
  //
  // Fix: either build against the production API, or set ASSET_URL=<public
  // origin> in the Laravel .env for the duration of the build. See README.
  const appUrl = (process.env.APP_URL ?? "").trim();
  const buildingForRemoteHost =
    appUrl !== "" && !/^https?:\/\/(localhost|127\.0\.0\.1|\[::1\])(:|\/|$)/i.test(appUrl);

  if (buildingForRemoteHost) {
    const offenders = findLocalhostRefs(outDir);
    if (offenders.length > 0) {
      const shown = offenders.slice(0, 10);
      console.error(
        `\n[build:static] ABORTING: APP_URL is "${appUrl}" but the export contains ` +
          `localhost URLs in ${offenders.length} file(s):`,
      );
      for (const { file, count, sample } of shown) {
        console.error(`  ${file} (${count}×) e.g. ${sample}`);
      }
      if (offenders.length > shown.length) {
        console.error(`  …and ${offenders.length - shown.length} more`);
      }
      console.error(
        "\nThese are almost certainly Laravel-generated image URLs. Set ASSET_URL=" +
          `${appUrl} in the Laravel .env (then config:clear + restart) and rebuild,\n` +
          "or build against the production API. See README → 'Image origin'.\n",
      );
      safeRestore();
      process.exit(1);
    }
    console.log("[build:static] verified: no localhost URLs in export/");

    // Next's page data (*.txt) stores long text as length-prefixed rows. A CR in
    // that text makes the payload depend on line-ending handling downstream
    // (git autocrlf strips it and the length no longer matches, freezing
    // client-side navigation). The Laravel mappers normalise CRLF, so any CR here
    // means a new unnormalised source — fail loudly instead of shipping it.
    const crFiles = findCarriageReturnPayloads(outDir);
    if (crFiles.length) {
      console.error(
        `[build:static] carriage returns found in ${crFiles.length} page data file(s), e.g. ${crFiles
          .slice(0, 3)
          .join(", ")}. Normalise CRLF to LF where that text is loaded.`,
      );
      safeRestore();
      process.exit(1);
    }
    console.log("[build:static] verified: no carriage returns in page data");
  }
}

/**
 * Page data files (*.txt) under `dir` that contain a carriage return.
 * @param {string} dir
 * @returns {string[]}
 */
function findCarriageReturnPayloads(dir) {
  const hits = [];
  (function walk(current) {
    for (const ent of fs.readdirSync(current, { withFileTypes: true })) {
      const full = path.join(current, ent.name);
      if (ent.isDirectory()) walk(full);
      else if (ent.isFile() && ent.name.endsWith(".txt") && fs.readFileSync(full).includes(13)) {
        hits.push(path.relative(dir, full));
      }
    }
  })(dir);
  return hits;
}

/**
 * Scan exported HTML, JS and RSC payloads for localhost URLs.
 * @param {string} dir
 * @returns {{file: string, count: number, sample: string}[]}
 */
function findLocalhostRefs(dir) {
  const hits = [];
  const re = /https?:\/\/(?:localhost|127\.0\.0\.1)(?::\d+)?[^\s"'<>\\)]*/gi;

  /** @param {string} current */
  function walk(current) {
    for (const ent of fs.readdirSync(current, { withFileTypes: true })) {
      const full = path.join(current, ent.name);
      if (ent.isDirectory()) {
        walk(full);
      } else if (ent.isFile() && /\.(html|js|txt|json|css)$/.test(ent.name)) {
        // JS is scanned too: an env value inlined into the client bundle (e.g.
        // NEXT_PUBLIC_DIRECTUS_URL=http://localhost:8055) once shipped this way
        // and made every visitor's browser call its own machine.
        const matches = fs.readFileSync(full, "utf8").match(re);
        if (matches?.length) {
          hits.push({
            file: path.relative(dir, full),
            count: matches.length,
            sample: matches[0],
          });
        }
      }
    }
  }

  walk(dir);
  return hits;
}

// Reset to `{}` (valid empty JSON) so `next dev` never imports a stale local map.
// The static `export/` already inlined paths + copied cms-images.
try {
  fs.writeFileSync(cmsAssetMapPath, "{}\n", "utf8");
  console.log("[build:static] reset cms-asset-map.json stub for development");
} catch (err) {
  console.warn("[build:static] could not reset cms-asset-map.json:", err.message);
}

safeRestore();
process.exit(result.status ?? 1);
