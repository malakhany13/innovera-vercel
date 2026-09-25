/**
 * Next 16 `output: "export"` writes per-segment RSC payloads into NESTED
 * directories:
 *
 *     courses/__next.$oc$segments/__PAGE__.txt
 *     payment/__next.$oc$segments/$d$token/__PAGE__.txt
 *
 * ...but its client router requests the FLAT, dot-joined form:
 *
 *     courses/__next.$oc$segments.__PAGE__.txt
 *     payment/__next.$oc$segments.$d$token.__PAGE__.txt
 *
 * The result is a 404 on every prefetch — ~16 console errors per page load, and
 * a prefetch cache that never populates, so client-side navigation falls back to
 * fetching on click instead of using a warm cache.
 *
 * This copies each nested payload to the flat name the router asks for. Purely
 * additive: the nested originals are left in place, so whichever form Next asks
 * for resolves.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

/** Collect every file under `dir`, as paths relative to `dir`. */
function filesUnder(dir) {
  const out = [];
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      for (const nested of filesUnder(full)) {
        out.push(path.join(ent.name, nested));
      }
    } else if (ent.isFile()) {
      out.push(ent.name);
    }
  }
  return out;
}

/**
 * @param {string} dir export root
 * @returns {number} number of flat payload files written
 */
export function flattenRscSegments(dir) {
  let written = 0;

  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, ent.name);

    if (!ent.isDirectory()) continue;

    // Recurse into normal route directories first.
    if (!ent.name.startsWith("__next.")) {
      written += flattenRscSegments(full);
      continue;
    }

    // `__next.*` directory: emit a dot-joined sibling for every file inside.
    for (const rel of filesUnder(full)) {
      const flatName = `${ent.name}.${rel.split(path.sep).join(".")}`;
      const dest = path.join(dir, flatName);
      if (fs.existsSync(dest)) continue;
      fs.copyFileSync(path.join(full, rel), dest);
      written += 1;
    }
  }

  return written;
}

// CLI. Matches promote-export-html.mjs: an `import.meta.url === file://argv[1]`
// guard silently does nothing on Windows, where argv[1] is `D:\...` rather than
// a file URL — which is exactly how this step shipped as a no-op once already.
const cliRoot =
  process.argv[2] ??
  path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "export");
if (cliRoot) {
  const n = flattenRscSegments(path.resolve(cliRoot));
  console.log(`[flatten-rsc-segments] wrote ${n} flat RSC payload file(s)`);
}
