# Photography Page — Performance Plan

> Status: planning · Owner: Leuqas · Last updated: 2026-05-12
>
> Goal: stop the photography page from lagging/crashing on mobile while preserving the parallax aesthetic and image quality. Add a small UX hint so visitors know the gallery is interactive.

---

## 1. Problem recap

Mobile browsers (especially iOS Safari and lower-end Android Chrome) lag and occasionally kill the tab when visiting `/photography`.

Confirmed root causes (ranked by impact):

1. **Decoded RAM blowup** — original photos are 4000-6000px wide. Each decodes to ~96 MB in the browser. 25 of them simultaneously = OOM.
2. **All images load eagerly** — `import.meta.glob({ eager: true })` + no `loading="lazy"` means every image is fetched and decoded on first paint.
3. **Heavy mobile compositor** — `mix-blend-mode: screen` + `blur(84px)` on the hero gradient stresses weak GPUs.
4. **Parallax 3D context** — `transformStyle: preserve-3d` + `perspective` forces every descendant onto the GPU compositor. Manageable on desktop, hostile on entry-level Android.

This plan tackles #1 and #2 directly with a two-tier image system, and #3 with a media query. #4 is left alone unless #1-3 don't fully resolve the issue.

---

## 2. Solution overview

### 2.1 Two-tier image system

Generate two WebP variants for every photo in `src/assets/images/explainedPH/`:

| Tier | Width | Quality | Used for | Approx weight |
|---|---|---|---|---|
| `thumb` | **500 px** | WebP q70 | Gallery grid | ~30-60 KB / image |
| `full` | **1600 px** | WebP q80 | Lightbox | ~200-500 KB / image |

Why these numbers:
- **500px thumb** stays sharp at column widths up to ~330px even at DPR 1.5-2 (covers all real devices given current `max-w-6xl` 3-col grid → ~376 px desktop column / ~33 vw mobile). Decoded RAM ≈ ~14 MB total for 25 thumbs (vs ~2.4 GB for raw originals — a ~170× reduction).
- **1600px full** is enough for a fullscreen lightbox on a 4K monitor without visible softening. Bigger than that wastes bandwidth.
- Both are WebP because we already migrated to it and Sharp encodes WebP very well.

### 2.2 Folder layout

```
src/assets/images/explainedPH/
  thumbs/                   ← NEW: 500 px variants (generated)
    DSC_0102.webp
    DSC_0156.webp
    ...
  DSC_0102.webp             ← resized in place to ≤ 1600 px (the "full" tier)
  DSC_0156.webp
  ...
```

- Originals get **resized in place** to ≤ 1600 px (no upscaling). They become the `full` tier.
- A new `thumbs/` subfolder holds the 500 px variants.
- Both committed to git. Combined extra weight ≈ 1.0-1.5 MB. Negligible.

### 2.3 UX hint

Add a small, static info pill **between the hero `<section>` and the `ContainerScroll`** (i.e. _outside_ the hero stagger, in the natural reading flow):

> ↓ Scroll to explore · click any photo to enlarge

- Subtle styling — muted-foreground color, same tracking as the existing section labels.
- A bouncing chevron icon (`lucide-react` `ChevronDown`) to draw the eye.
- No dismiss state, no persistence. Static is fine — visitors only need to see it once on first scroll.
- **Placement rationale**: keeping it outside the hero avoids re-bloating the recently-tightened mobile hero (`gap-5 py-8`) and gives the hint its own visual breathing room right where the gallery begins.

### 2.4 Mobile blur gate

Hide the `linear-gradient(... ) blur(84px) mix-blend-mode: screen` decoration on viewports `< md`. Keeps the desktop aesthetic, removes the mobile GPU stress.

---

## 3. Implementation plan

### Phase A — Build-time tooling (the script)

**File**: extend `scripts/optimize-images.mjs` OR add `scripts/generate-thumbnails.mjs`.

Decision: **extend the existing script** so a single command (`npm run optimize:images`) does everything. One source of truth, one mental model.

#### A.1 New script behavior

The script runs three passes, **strictly in this order** (so each pass operates on the output of the previous one):

1. **Convert pass** (existing): convert any new `.png` / `.jpg` / `.jpeg` to `.webp` and delete originals.
2. **Resize-in-place pass** (NEW): for any `.webp` **directly inside** `src/assets/images/explainedPH/` (excluding `thumbs/`) whose width > 1600 px, resize in place to width 1600 px (height auto). Operates on `.webp` only — the convert pass already produced them, so no double-encoding.
3. **Thumbnail pass** (NEW): for every `.webp` directly inside `src/assets/images/explainedPH/`, generate a 500px-wide variant in `src/assets/images/explainedPH/thumbs/` if it doesn't exist or if the source file is newer (`mtime` check).

#### A.2 Sharp configuration

```js
// Resize originals to ≤1600 px, q80
sharp(file)
  .resize({ width: 1600, withoutEnlargement: true })
  .webp({ quality: 80, effort: 6 })
  .toFile(tempPath);

// Thumbnails at 500 px, q70
sharp(file)
  .resize({ width: 500, withoutEnlargement: true })
  .webp({ quality: 70, effort: 6 })
  .toFile(thumbPath);
```

Notes:
- `withoutEnlargement: true` prevents tiny images from being upscaled.
- Resize-in-place uses a temp file then renames, to avoid Sharp reading a file it's also writing.
- Skip files already at the target width (cheap stat check + `sharp.metadata()`).

#### A.3 Idempotency

- A second run should produce zero work. Use `mtime` comparison: regenerate thumb only if `source.mtime > thumb.mtime`.
- Resize-in-place skipped if `metadata.width <= 1600`.

#### A.4 Flags (preserve existing)

- `--keep` — don't delete `.png/.jpg` originals after webp conversion.
- `--dry` — log only, no writes.

No new flags. The idempotent skip-when-mtime-matches behavior makes a `--thumbs-only` shortcut redundant — a plain re-run is already fast.

#### A.5 Output

Emit a clear summary at the end:

```
✓ Resized 5 originals to ≤ 1600px
✓ Generated 25 thumbnails (avg ~45 KB)
Total photo footprint: 8.1 MB → ~9.2 MB (+1.1 MB for thumbs, ~170× decoded-RAM reduction)
```

### Phase B — Code changes

#### B.1 Two globs in `PhotographyPage.tsx`

Replace the single `imageModules` glob with two globs producing a paired array, using the **modern Vite glob syntax** (`query: "?url", import: "default"`) instead of the deprecated `as: "url"`:

```ts
const thumbModules = import.meta.glob<string>(
  "@/assets/images/explainedPH/thumbs/*.webp",
  { eager: true, query: "?url", import: "default" }
);
const fullModules = import.meta.glob<string>(
  "@/assets/images/explainedPH/*.webp",
  { eager: true, query: "?url", import: "default" }
);

type Photo = { thumb: string; full: string; name: string };

const thumbs = new Map<string, string>();
for (const [p, url] of Object.entries(thumbModules)) {
  thumbs.set(p.split("/").pop()!, url);
}

const photos: Photo[] = Object.entries(fullModules)
  .filter(([p]) => !p.includes("/thumbs/"))   // exclude thumbs subfolder
  .map(([p, full]) => {
    const name = p.split("/").pop()!;
    const thumb = thumbs.get(name) ?? full;   // fallback: missing thumb → use full URL
    if (!thumbs.has(name)) {
      console.warn(`[gallery] missing thumb for ${name}; using full URL. Run \`npm run optimize:images\`.`);
    }
    return { thumb, full, name };
  })
  .sort((a, b) => a.name.localeCompare(b.name));
```

Key points:
- **`/thumbs/` filter** on `fullModules` is required — Vite globs don't auto-exclude subfolders.
- **Thumb fallback**: if a photo was added without re-running the script, the gallery still renders (using the full URL) instead of breaking. A console warning surfaces the issue.
- **Modern syntax** silences the Vite 6 deprecation warning that the existing single glob currently emits.

#### B.2 Update gallery `<img>` tags

```tsx
<img
  src={photo.thumb}
  loading="lazy"
  decoding="async"
  width={500}
  height={281}  // 500 * 9/16; matches `aspect-video` crop
  className="...aspect-video...object-cover..."
/>
```

- `loading="lazy"` is critical — single biggest crash fix when combined with smaller thumbs.
- `decoding="async"` keeps decode off the main thread.
- `width`/`height` attrs reserve layout space, eliminating CLS and letting the browser skip work for offscreen images. Real intrinsic ratio is irrelevant here because `aspect-video object-cover` overrides the intrinsic ratio visually — the attrs are purely a layout-reservation hint.
- **Future**: capture per-image dimensions in the script and emit a manifest JSON for true intrinsic sizing. Out of scope for v1.

#### B.3 Update lightbox

```tsx
<img
  src={photos[activeIndex].full}
  alt={...}
  className="..."
/>
```

Optional polish: while the full-res loads, show the thumb as background:

```tsx
<div style={{ backgroundImage: `url(${photo.thumb})`, backgroundSize: "contain" }}>
  <img src={photo.full} ... />
</div>
```

Not strictly necessary; the thumb is so small it fades almost instantly.

#### B.4 Hint pill

Inside the hero `ContainerStagger`, after the existing CTA buttons, add:

```tsx
<ContainerAnimated>
  <p className="inline-flex items-center gap-2 text-xs font-medium text-muted-foreground/80">
    <ChevronDown className="h-3.5 w-3.5 animate-bounce text-primary" />
    Scroll to explore · click any photo to enlarge
  </p>
</ContainerAnimated>
```

- `animate-bounce` is a built-in Tailwind animation — no extra CSS.
- Place it as the last child of the hero stagger so it animates in last.

#### B.5 Mobile blur gate

```tsx
<div
  className="pointer-events-none absolute inset-x-0 top-0 z-0 hidden h-[70vh] w-full opacity-60 md:block"
  style={{ ... }}
/>
```

Single class addition: `hidden md:block`.

---

## 4. Testing & validation

After Phase A + B:

1. **Local dev**: `npm run dev`, scroll the gallery, click images. Verify thumbs are sharp and lightbox shows full-res.
2. **Network throttling**: Chrome DevTools → Slow 3G. Page should be interactive in < 3 s.
3. **Memory**: DevTools → Memory tab → take heap snapshot after gallery scroll. Realistic target: **< 150 MB JS heap** (was likely 300-500 MB before). The `< 150 MB` target is a smell test, not a hard gate.
4. **Real mobile device**: actual iPhone or Android. Open the deployed page. Scroll the full gallery. No tab kill.
5. **Lighthouse Mobile**: target Performance score ≥ 85, LCP < 2.5 s.
6. **Visual regression**: confirm thumbs in the gallery are visibly identical to before (just lighter on the wire).

---

## 5. Rollback strategy

Each phase is independent:
- **If Phase A breaks images**: `git revert` the script changes; manually delete `src/assets/images/explainedPH/thumbs/` if generated.
- **If Phase B breaks the page**: revert `PhotographyPage.tsx`; thumbs folder is harmless to keep around.
- The previous workflow (`optimize:images` without thumb generation) keeps working because we extend the script, not replace it.

---

## 6. Open questions / future work

- **Should `dist/assets` thumbs be served or inlined?** Vite already hashes and ships them — no extra config needed.
- **LQIP / blurhash placeholders?** Could replace thumbs with tiny base64-encoded blurry placeholders for LCP wins. Skipped for now — adds complexity for marginal benefit since thumbs are already small.
- **Disable parallax on mobile?** Punted to later. Reassess after Phase A+B + a real-device test. If still bad, gate `ContainerScroll` on `md:` and render a plain `column-count` masonry on mobile.
- **CDN with `srcset`?** Overkill for a portfolio. Two static tiers is enough.

---

## 7. Execution checklist

Tick as we go.

### Phase A — script
- [ ] Extend `scripts/optimize-images.mjs` with resize-in-place + thumbnail pass.
- [ ] Test idempotency (run twice, second run logs zero work).
- [ ] Run `npm run optimize:images` → 25 thumbs appear in `thumbs/`, originals resized to ≤ 1600 px.
- [ ] Commit `thumbs/` folder.

### Phase B — code
- [ ] Add paired `Photo[]` array in `PhotographyPage.tsx`.
- [ ] Swap gallery `<img>` to use `photo.thumb` + `loading="lazy"` + `decoding="async"` + explicit width/height.
- [ ] Swap lightbox `<img>` to use `photo.full`.
- [ ] Add hint pill **between hero `<section>` and `ContainerScroll`** (not inside hero stagger).
- [ ] Gate hero gradient blur with `hidden md:block`.

### Phase C — verify
- [ ] Local Lighthouse mobile run.
- [ ] Real device test (iPhone / Android).
- [ ] Deploy.
- [ ] Confirm crashes resolved.

---

## 8. Estimated effort

| Phase | Time |
|---|---|
| A (script) | ~30-45 min |
| B (code + hint) | ~30 min |
| C (testing + iterate) | ~30-45 min |
| **Total** | **~2 h** |

Worth it.
