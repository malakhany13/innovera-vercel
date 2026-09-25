/**
 * Next.js `output: "export"` with trailingSlash:false writes `out/training.html`.
 * Directory hosts (Laravel, Apache) look for `out/training/index.html` for /training.
 *
 * Promote every `*.html` (except root index/404) into `<name>/index.html`, including
 * nested routes like `courses/1.html` → `courses/1/index.html`.
 * Leaves Next 16 RSC `__next.*` segment artifacts in place.
 */
import fs from "node:fs";
import path from "node:path";

/**
 * @param {string} dir
 * @returns {number} number of files promoted
 */
export function promoteExportHtmlToIndex(dir) {
  let promoted = 0;
  if (!fs.existsSync(dir)) return 0;

  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const ent of entries) {
    const full = path.join(dir, ent.name);

    if (ent.isDirectory()) {
      if (ent.name === "_next" || ent.name === "cms-images" || ent.name === "assets" || ent.name === "images") {
        continue;
      }
      promoted += promoteExportHtmlToIndex(full);
      continue;
    }

    if (!ent.isFile() || !ent.name.endsWith(".html")) continue;
    if (ent.name === "index.html" || ent.name === "404.html") continue;
    // Skip Next.js segment/RSC artifacts only

    if (ent.name.startsWith("__next") || ent.name === "_not-found.html") continue;

    const routeName = ent.name.slice(0, -".html".length);
    // Skip leftover Next internal folders named like __next.*
    if (routeName.startsWith("__next")) continue;
    const routeDir = path.join(dir, routeName);
    const dest = path.join(routeDir, "index.html");

    fs.mkdirSync(routeDir, { recursive: true });

    if (fs.existsSync(dest)) {
      // Prefer the newly built flat HTML over a stale index
      fs.rmSync(dest, { force: true });
    }

    fs.renameSync(full, dest);
    promoted += 1;
    console.log(`[promote-export-html] ${path.relative(dir, full) || ent.name} → ${path.join(routeName, "index.html")}`);
  }

  return promoted;
}

// CLI
const root = process.argv[2];
if (root) {
  const n = promoteExportHtmlToIndex(path.resolve(root));
  console.log(`[promote-export-html] promoted ${n} file(s)`);
}
