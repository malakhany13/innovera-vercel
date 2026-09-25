/**
 * Pre-static-export step: download Directus assets referenced by CMS pages
 * into public/cms-images and write src/generated/cms-asset-map.json.
 *
 * Run via: npm run download:cms-assets
 * (or automatically from build-static.mjs)
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");

/** Load `.env.local` before importing Directus modules (URLs resolve at import time). */
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

/** Keep stub parseable — `directus.ts` imports this JSON at module load. */
function ensureCmsAssetMapStub() {
  const mapPath = path.join(root, "src", "generated", "cms-asset-map.json");
  fs.mkdirSync(path.dirname(mapPath), { recursive: true });
  let needsReset = true;
  if (fs.existsSync(mapPath)) {
    try {
      const raw = fs.readFileSync(mapPath, "utf8").trim();
      if (raw) {
        JSON.parse(raw);
        needsReset = false;
      }
    } catch {
      needsReset = true;
    }
  }
  if (needsReset) {
    fs.writeFileSync(mapPath, "{}\n", "utf8");
    console.log("[cms-assets] repaired empty/invalid cms-asset-map.json stub");
  }
}

async function main() {
  loadEnvLocal();
  ensureCmsAssetMapStub();
  const { downloadAllCmsAssets } = await import("../src/lib/cms-assets/download");
  const result = await downloadAllCmsAssets(root);
  console.log(
    `[cms-assets] Done: ${result.downloaded} asset(s) ready for static export`,
  );
}

main().catch((err) => {
  console.error("[cms-assets] Fatal:", err instanceof Error ? err.message : err);
  process.exit(1);
});
