/**
 * Image pipeline for the portfolio.
 *
 * Three passes (in order):
 *   1. Convert .png/.jpg/.jpeg under TARGET_DIRS to .webp and delete originals.
 *   2. Resize-in-place any .webp directly inside PHOTO_DIR whose width > MAX_FULL_WIDTH.
 *      These become the "full" tier used by the lightbox.
 *   3. Generate 500-px-wide thumbnail variants in PHOTO_DIR/thumbs/ for the gallery grid.
 *
 * Idempotent: a second run reports zero work. mtime comparison gates the thumb pass;
 * width inspection gates the resize pass.
 *
 * Usage:
 *   npm run optimize:images           # convert + resize + thumbs
 *   npm run optimize:images -- --keep # keep .png/.jpg originals after convert
 *   npm run optimize:images -- --dry  # log only, no writes
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

// The photography gallery source folder. Resize + thumb passes target this only.
const PHOTO_DIR = path.join(ROOT, "src/assets/images/explainedPH");
const THUMB_DIR = path.join(PHOTO_DIR, "thumbs");

const FULL_QUALITY = 80;
const FULL_MAX_WIDTH = 1600;
const THUMB_QUALITY = 70;
const THUMB_WIDTH = 500;
const SHARP_EFFORT = 6;

const SOURCE_EXT = new Set([".png", ".jpg", ".jpeg"]);

const args = new Set(process.argv.slice(2));
const KEEP_ORIGINALS = args.has("--keep");
const DRY_RUN = args.has("--dry");

let totalBefore = 0;
let totalAfter = 0;
let converted = 0;
let skipped = 0;
let removed = 0;
let resizedInPlace = 0;
let resizeBytesBefore = 0;
let resizeBytesAfter = 0;
let thumbsCreated = 0;
let thumbsSkipped = 0;
let thumbBytesTotal = 0;

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
    .webp({ quality: FULL_QUALITY, effort: SHARP_EFFORT })
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

// ---------- Pass 2: resize-in-place .webp originals to ≤ FULL_MAX_WIDTH ----------
async function resizeFullPass() {
  let entries;
  try {
    entries = await fs.readdir(PHOTO_DIR, { withFileTypes: true });
  } catch {
    return;
  }

  for (const entry of entries) {
    if (!entry.isFile()) continue;
    if (path.extname(entry.name).toLowerCase() !== ".webp") continue;

    const file = path.join(PHOTO_DIR, entry.name);
    const rel = path.relative(ROOT, file);

    // Read once into a Node Buffer so Sharp never holds a Windows file handle.
    let sourceBuf;
    try {
      sourceBuf = await fs.readFile(file);
    } catch (err) {
      console.warn(`! couldn't read ${rel}: ${err.message}`);
      continue;
    }

    let meta;
    try {
      meta = await sharp(sourceBuf).metadata();
    } catch (err) {
      console.warn(`! couldn't read metadata for ${rel}: ${err.message}`);
      continue;
    }
    if (!meta.width || meta.width <= FULL_MAX_WIDTH) continue;

    const beforeSize = sourceBuf.byteLength;
    resizeBytesBefore += beforeSize;

    if (DRY_RUN) {
      console.log(`[dry] would resize ${rel} (${meta.width}px → ${FULL_MAX_WIDTH}px)`);
      continue;
    }

    // Process from buffer (no file handle) → overwrite original.
    const resizedBuf = await sharp(sourceBuf)
      .resize({ width: FULL_MAX_WIDTH, withoutEnlargement: true })
      .webp({ quality: FULL_QUALITY, effort: SHARP_EFFORT })
      .toBuffer();
    await fs.writeFile(file, resizedBuf);

    const afterSize = (await fs.stat(file)).size;
    resizeBytesAfter += afterSize;
    resizedInPlace++;

    const savedPct = Math.round((1 - afterSize / beforeSize) * 100);
    console.log(
      `→ resized ${rel} (${meta.width}px → ${FULL_MAX_WIDTH}px, ` +
        `${fmt(beforeSize)} → ${fmt(afterSize)}, ${savedPct}% smaller)`
    );
  }
}

// ---------- Pass 3: generate THUMB_WIDTH thumbnails into PHOTO_DIR/thumbs/ ----------
async function thumbnailPass() {
  let entries;
  try {
    entries = await fs.readdir(PHOTO_DIR, { withFileTypes: true });
  } catch {
    return;
  }

  if (!DRY_RUN) await fs.mkdir(THUMB_DIR, { recursive: true });

  for (const entry of entries) {
    if (!entry.isFile()) continue;
    if (path.extname(entry.name).toLowerCase() !== ".webp") continue;

    const source = path.join(PHOTO_DIR, entry.name);
    const thumb = path.join(THUMB_DIR, entry.name);
    const rel = path.relative(ROOT, thumb);

    // Skip if thumb exists and is newer than source.
    try {
      const [srcStat, thumbStat] = await Promise.all([
        fs.stat(source),
        fs.stat(thumb),
      ]);
      if (thumbStat.mtimeMs >= srcStat.mtimeMs) {
        thumbsSkipped++;
        continue;
      }
    } catch {
      /* thumb missing — fall through to generate */
    }

    if (DRY_RUN) {
      console.log(`[dry] would generate thumb ${rel}`);
      continue;
    }

    await sharp(source)
      .resize({ width: THUMB_WIDTH, withoutEnlargement: true })
      .webp({ quality: THUMB_QUALITY, effort: SHARP_EFFORT })
      .toFile(thumb);

    const size = (await fs.stat(thumb)).size;
    thumbBytesTotal += size;
    thumbsCreated++;
    console.log(`✓ thumb ${rel} (${fmt(size)})`);
  }
}

// ---------- Run all passes ----------

// Pass 1: convert PNG/JPG/JPEG → webp under all target dirs.
for (const rel of TARGET_DIRS) {
  await walk(path.join(ROOT, rel));
}

// Pass 2 & 3: only the photography gallery folder.
await resizeFullPass();
await thumbnailPass();

// ---------- Summary ----------

console.log("\n—— Summary ——");
if (converted || removed || skipped) {
  console.log(
    `Convert: ${converted} new webp, ${skipped} skipped, ${removed} original(s) removed` +
      (totalBefore
        ? ` — ${fmt(totalBefore)} → ${fmt(totalAfter)} ` +
          `(${Math.round((1 - totalAfter / totalBefore) * 100)}% smaller)`
        : "")
  );
} else {
  console.log("Convert: nothing to do.");
}

if (resizedInPlace) {
  console.log(
    `Resize:  ${resizedInPlace} file(s) shrunk to ≤ ${FULL_MAX_WIDTH}px ` +
      `— ${fmt(resizeBytesBefore)} → ${fmt(resizeBytesAfter)}`
  );
} else {
  console.log("Resize:  nothing to do (all originals already ≤ " + FULL_MAX_WIDTH + "px).");
}

if (thumbsCreated) {
  console.log(
    `Thumbs:  ${thumbsCreated} created (${thumbsSkipped} up-to-date), ` +
      `total ${fmt(thumbBytesTotal)}, avg ${fmt(Math.round(thumbBytesTotal / thumbsCreated))}`
  );
} else {
  console.log(`Thumbs:  ${thumbsSkipped} up-to-date, 0 created.`);
}
