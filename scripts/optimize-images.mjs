/**
 * Convert all PNG/JPG/JPEG images under known asset folders to compressed
 * .webp variants and remove the originals so all references in the app
 * (which we update to .webp) stay valid.
 *
 * Usage:
 *   npm run optimize:images           # convert + delete originals
 *   npm run optimize:images -- --keep # convert but keep originals
 *   npm run optimize:images -- --dry  # show what would happen
 */
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

const TARGET_DIRS = [
  "public/images",
  "src/assets/images",
];

const QUALITY = 80;
const SOURCE_EXT = new Set([".png", ".jpg", ".jpeg"]);

const args = new Set(process.argv.slice(2));
const KEEP_ORIGINALS = args.has("--keep");
const DRY_RUN = args.has("--dry");

let totalBefore = 0;
let totalAfter = 0;
let converted = 0;
let skipped = 0;
let removed = 0;

async function walk(dir) {
  let entries;
  try {
    entries = await fs.readdir(dir, { withFileTypes: true });
  } catch {
    return;
  }
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) await walk(full);
    else if (e.isFile()) await processFile(full);
  }
}

async function processFile(file) {
  const ext = path.extname(file).toLowerCase();
  if (!SOURCE_EXT.has(ext)) return;

  const webpPath = file.slice(0, -path.extname(file).length) + ".webp";
  const rel = path.relative(ROOT, file);

  // If a .webp already exists, just clean up the original.
  try {
    await fs.access(webpPath);
    if (!KEEP_ORIGINALS && !DRY_RUN) {
      await fs.unlink(file);
      removed++;
      console.log(`• existing webp found, removed original: ${rel}`);
    } else {
      skipped++;
    }
    return;
  } catch {
    /* webp doesn't exist yet — proceed to convert */
  }

  const beforeStat = await fs.stat(file);
  totalBefore += beforeStat.size;

  if (DRY_RUN) {
    console.log(`[dry] would convert ${rel}`);
    return;
  }

  await sharp(file)
    .webp({ quality: QUALITY, effort: 6 })
    .toFile(webpPath);

  const afterStat = await fs.stat(webpPath);
  totalAfter += afterStat.size;
  converted++;

  const savedPct = Math.round((1 - afterStat.size / beforeStat.size) * 100);
  console.log(
    `✓ ${rel} → ${path.basename(webpPath)} ` +
      `(${fmt(beforeStat.size)} → ${fmt(afterStat.size)}, ${savedPct}% smaller)`
  );

  if (!KEEP_ORIGINALS) {
    await fs.unlink(file);
    removed++;
  }
}

function fmt(b) {
  if (b < 1024) return `${b} B`;
  if (b < 1024 ** 2) return `${(b / 1024).toFixed(1)} KB`;
  return `${(b / 1024 ** 2).toFixed(2)} MB`;
}

for (const rel of TARGET_DIRS) {
  await walk(path.join(ROOT, rel));
}

console.log(
  `\nDone. Converted ${converted}, skipped ${skipped}, removed ${removed} original(s). ` +
    (totalBefore
      ? `Bytes: ${fmt(totalBefore)} → ${fmt(totalAfter)} ` +
        `(${Math.round((1 - totalAfter / totalBefore) * 100)}% smaller)`
      : "")
);
