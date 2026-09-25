/**
 * Publish `export/` into the Laravel app's `public/` folder.
 *
 * The export and the Laravel app share one document root: Apache serves a file
 * when it exists, and Laravel's `routes/web.php` handles everything else. That
 * makes `public/` a *mirror* of `export/`, not a place to pile builds into.
 *
 * Copying without deleting is what went wrong before. Next names its assets by
 * build id and content hash, so every deploy left the previous build's files
 * behind — `public/_next` had eight build ids and 32 dead chunks against an
 * export containing one. Worse than the wasted space: a page removed from the
 * export keeps its old `<route>/index.html` in `public/` and goes on being
 * served forever, because Laravel's catch-all never sees the request.
 *
 * So this mirrors with deletion, while preserving the files `public/` owns in
 * its own right (Laravel's front controller, the rewrite rules, and the
 * runtime dirs Laravel generates).
 *
 * Usage:
 *   node scripts/deploy-to-laravel.mjs --target ../../innovera-profile---php/laravel/public
 *   node scripts/deploy-to-laravel.mjs --target <path> --dry-run
 */

import fs from "node:fs";
import path from "node:path";
import process from "node:process";

/**
 * Entries in `public/` that belong to Laravel, not to the export.
 * These are never deleted and never overwritten.
 */
const LARAVEL_OWNED = new Set([
  "index.php", // Laravel's front controller
  ".htaccess", // rewrite rules that hand unmatched paths to index.php
  "storage", // `artisan storage:link` symlink
  "build", // Vite output, if the backend ever uses it
  "hot", // Vite dev server marker
  "robots.txt", // hand-maintained; the export does not emit one
  ".user.ini", // php settings some shared hosts place here
  "cgi-bin", // cPanel creates this
]);

function parseArgs(argv) {
  const args = { target: null, dryRun: false };

  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === "--target") args.target = argv[++i];
    else if (argv[i] === "--dry-run") args.dryRun = true;
  }

  return args;
}

const { target, dryRun } = parseArgs(process.argv.slice(2));
const root = path.resolve(import.meta.dirname, "..");
const source = path.join(root, "export");

if (!target) {
  console.error(
    "[deploy] --target <laravel/public> is required.\n" +
      "         e.g. node scripts/deploy-to-laravel.mjs --target ../../innovera-profile---php/laravel/public",
  );
  process.exit(1);
}

const dest = path.resolve(target);

/** Refuse to mirror an export that never finished building. */
function assertUsableExport() {
  if (!fs.existsSync(source)) {
    console.error(`[deploy] no export at ${source}. Run \`npm run build:static\` first.`);
    process.exit(1);
  }

  for (const marker of ["index.html", path.join("training", "index.html")]) {
    if (!fs.existsSync(path.join(source, marker))) {
      console.error(
        `[deploy] export looks incomplete (missing ${marker}). ` +
          `Re-run \`npm run build:static\` rather than deploying a partial site.`,
      );
      process.exit(1);
    }
  }
}

/**
 * Refuse to mirror into a directory that is not a Laravel public folder.
 * Mirroring deletes, so a mistyped --target would otherwise wipe a real folder.
 */
function assertLaravelPublic() {
  if (!fs.existsSync(dest)) {
    console.error(`[deploy] target does not exist: ${dest}`);
    process.exit(1);
  }

  if (!fs.existsSync(path.join(dest, "index.php"))) {
    console.error(
      `[deploy] ${dest} has no index.php, so it does not look like Laravel's public/.\n` +
        `         Refusing to mirror — this step deletes files.`,
    );
    process.exit(1);
  }
}

let copied = 0;
let deleted = 0;

/** Copy `from` onto `to` only when the bytes differ, so mtimes stay meaningful. */
function copyFile(from, to) {
  const a = fs.statSync(from);
  let unchanged = false;

  if (fs.existsSync(to)) {
    const b = fs.statSync(to);
    unchanged = a.size === b.size && fs.readFileSync(from).equals(fs.readFileSync(to));
  }

  if (unchanged) return;

  if (!dryRun) fs.copyFileSync(from, to);
  copied++;
}

function removeEntry(target) {
  if (!dryRun) fs.rmSync(target, { recursive: true, force: true });
  deleted++;
  console.log(`  - ${path.relative(dest, target).replace(/\\/g, "/")}`);
}

/**
 * Make `toDir` match `fromDir`, preserving Laravel-owned entries at the root.
 */
function mirror(fromDir, toDir, isRoot) {
  if (!dryRun) fs.mkdirSync(toDir, { recursive: true });

  const wanted = new Map(
    fs.readdirSync(fromDir, { withFileTypes: true }).map((entry) => [entry.name, entry]),
  );

  // Delete anything present in the target but absent from the export.
  const existing = fs.existsSync(toDir)
    ? fs.readdirSync(toDir, { withFileTypes: true })
    : [];

  for (const entry of existing) {
    if (isRoot && LARAVEL_OWNED.has(entry.name)) continue;
    if (wanted.has(entry.name)) continue;
    removeEntry(path.join(toDir, entry.name));
  }

  for (const [name, entry] of wanted) {
    if (isRoot && LARAVEL_OWNED.has(name)) {
      console.log(`  = ${name} (Laravel-owned, left alone)`);
      continue;
    }

    const from = path.join(fromDir, name);
    const to = path.join(toDir, name);

    if (entry.isDirectory()) {
      // A file where a directory should be (or vice versa) has to go first.
      if (fs.existsSync(to) && !fs.statSync(to).isDirectory()) removeEntry(to);
      mirror(from, to, false);
    } else {
      if (fs.existsSync(to) && fs.statSync(to).isDirectory()) removeEntry(to);
      copyFile(from, to);
    }
  }
}

assertUsableExport();
assertLaravelPublic();

console.log(`[deploy] mirroring ${source}`);
console.log(`[deploy]        ->  ${dest}${dryRun ? "  (dry run)" : ""}`);
mirror(source, dest, true);

console.log(
  `[deploy] ${dryRun ? "would copy" : "copied"} ${copied} file(s), ` +
    `${dryRun ? "would delete" : "deleted"} ${deleted} stale entr${deleted === 1 ? "y" : "ies"}.`,
);

if (dryRun) {
  console.log("[deploy] dry run — nothing was written. Re-run without --dry-run to apply.");
}
