import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  MessageCircleMore,
  Phone,
  X,
} from "lucide-react";
import {
  ContainerAnimated,
  ContainerScroll,
  ContainerStagger,
  ContainerSticky,
  GalleryCol,
  GalleryContainer,
} from "@/components/ui/animated-gallery";

type Photo = { thumb: string; full: string; name: string };

const thumbModules = import.meta.glob<string>(
  "@/assets/images/explainedPH/thumbs/*.webp",
  { eager: true, query: "?url", import: "default" },
);
const fullModules = import.meta.glob<string>(
  "@/assets/images/explainedPH/*.webp",
  { eager: true, query: "?url", import: "default" },
);

const thumbByName = new Map<string, string>();
for (const [p, url] of Object.entries(thumbModules)) {
  const name = p.split("/").pop();
  if (name) thumbByName.set(name, url);
}

const photos: Photo[] = Object.entries(fullModules)
  .filter(([p]) => !p.includes("/thumbs/"))
  .map(([p, full]) => {
    const name = p.split("/").pop() ?? p;
    const thumb = thumbByName.get(name);
    if (!thumb) {
      // eslint-disable-next-line no-console
      console.warn(
        `[gallery] missing thumb for ${name}; falling back to full URL. Run \`npm run optimize:images\`.`,
      );
    }
    return { thumb: thumb ?? full, full, name };
  })
  .sort((a, b) => a.name.localeCompare(b.name));

const allImages = photos;

export function PhotographyPage() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const columns = useMemo(() => {
    const third = Math.ceil(allImages.length / 3);
    return {
      leftImages: allImages.slice(0, third),
      middleImages: allImages.slice(third, third * 2),
      rightImages: allImages.slice(third * 2),
      middleStart: third,
      rightStart: third * 2,
    };
  }, []);

  const activePhoto = activeIndex !== null ? allImages[activeIndex] : null;

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActiveIndex(null);
      if (event.key === "ArrowLeft") showPrev();
      if (event.key === "ArrowRight") showNext();
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  });

  const showPrev = () => {
    setActiveIndex((current) => {
      if (current === null) return current;
      return (current - 1 + allImages.length) % allImages.length;
    });
  };

  const showNext = () => {
    setActiveIndex((current) => {
      if (current === null) return current;
      return (current + 1) % allImages.length;
    });
  };

  return (
    <main className="pt-16">
      <section id="gallery" className="relative w-full overflow-hidden bg-background">
        <ContainerStagger className="relative z-20 mx-auto flex max-w-5xl flex-col items-center gap-5 px-6 pb-4 pt-10 text-center md:pt-14">
          <ContainerAnimated>
            <Link
              to="/"
              className="section-label inline-flex items-center gap-2 hover:text-primary"
            >
              ← Web Development
            </Link>
          </ContainerAnimated>

          <ContainerAnimated>
            <div className="relative">
              <img
                src="/images/leuqas-cropped.webp"
                alt="Leuqas Yabot"
                className="h-24 w-24  rounded-full border-2 border-primary/20 object-cover shadow-lg md:h-28 md:w-28"
              />
              <span className="absolute -bottom-1 -right-1 inline-flex items-center gap-1 rounded-full border border-primary/20 bg-background px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-primary shadow-sm">
                <MapPin className="h-3 w-3" />
                NE
              </span>
            </div>
          </ContainerAnimated>

          <ContainerAnimated>
            <h1 className="font-serif text-5xl font-extralight leading-[0.95] tracking-tight md:text-7xl">
              Capturing{" "}
              <span className="font-serif font-extralight text-indigo-600">
                moments
              </span>{" "}
              <br className="hidden md:block" />
              that tell stories
            </h1>
          </ContainerAnimated>

          <ContainerAnimated>
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-muted-foreground">
              Leuqas Yabot · Photojournalist · Web Developer
            </p>
          </ContainerAnimated>

          <ContainerAnimated className="max-w-xl">
            <p className="text-sm leading-7 text-muted-foreground">
              Head photojournalist for Envirex documenting school events,
              community stories, and life in Cabanatuan, Nueva Ecija.
            </p>
          </ContainerAnimated>

          <ContainerAnimated>
            <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs font-medium text-muted-foreground">
              <a
                href="mailto:yleuqas@gmail.com"
                className="inline-flex items-center gap-1.5 hover:text-primary"
              >
                <Mail className="h-3.5 w-3.5 text-primary" />
                yleuqas@gmail.com
              </a>
              <a
                href="tel:09914486773"
                className="inline-flex items-center gap-1.5 hover:text-primary"
              >
                <Phone className="h-3.5 w-3.5 text-primary" />
                09914486773
              </a>
              <a
                href="https://www.linkedin.com/in/leuqas"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 hover:text-primary"
              >
                <Linkedin className="h-3.5 w-3.5 text-primary" />
                leuqas
              </a>
              <a
                href="https://www.instagram.com/lekw.as/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 hover:text-primary"
              >
                <Instagram className="h-3.5 w-3.5 text-primary" />
                @lekw.as
              </a>
            </div>
          </ContainerAnimated>

          <ContainerAnimated>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <a href="#gallery-grid" className="btn-primary gap-2">
                <MessageCircleMore className="h-4 w-4" />
                View gallery
              </a>
              <Link to="/" className="btn-ghost gap-2">
                Back to portfolio
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </ContainerAnimated>
        </ContainerStagger>

        <div
          className="pointer-events-none absolute inset-x-0 top-0 z-0 hidden h-[70vh] w-full opacity-60 md:block"
          style={{
            background: "linear-gradient(to right, gray, rebeccapurple, blue)",
            filter: "blur(84px)",
            mixBlendMode: "screen",
          }}
        />

      </section>

      <div className="relative z-10 -mt-[-50px] flex justify-center px-5 pb-2">
        <p className="inline-flex items-center gap-2 rounded-full border border-border bg-background/70 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground backdrop-blur-sm">
          <ChevronDown className="h-3.5 w-3.5 animate-bounce text-primary" />
          Scroll to explore · click any photo to enlarge
        </p>
      </div>

      <ContainerScroll id="gallery-grid" className="relative h-[700vh]">
        <ContainerSticky className="h-svh top-16">
          <GalleryContainer className="mx-auto max-w-6xl px-4">
            <GalleryCol yRange={["0%", "-75%"]} className="-mt-2 pb-[300px]">
              {columns.leftImages.map((photo, index) => {
                const globalIndex = index;
                return (
                  <button
                    key={`left-${photo.name}`}
                    type="button"
                    onClick={() => setActiveIndex(globalIndex)}
                    className="group block w-full overflow-hidden rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    aria-label={`Open photograph ${globalIndex + 1}`}
                  >
                    <img
                      className="aspect-video block h-auto max-h-full w-full cursor-zoom-in rounded-md object-cover shadow transition-transform duration-300 group-hover:scale-[1.02]"
                      src={photo.thumb}
                      alt={`Photograph ${globalIndex + 1}`}
                      loading="lazy"
                      decoding="async"
                      width={500}
                      height={281}
                    />
                  </button>
                );
              })}
            </GalleryCol>
            <GalleryCol className="-mt-20 pb-[300px]" yRange={["0%", "-80%"]}>
              {columns.middleImages.map((photo, index) => {
                const globalIndex = columns.middleStart + index;
                return (
                  <button
                    key={`mid-${photo.name}`}
                    type="button"
                    onClick={() => setActiveIndex(globalIndex)}
                    className="group block w-full overflow-hidden rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    aria-label={`Open photograph ${globalIndex + 1}`}
                  >
                    <img
                      className="aspect-video block h-auto max-h-full w-full cursor-zoom-in rounded-md object-cover shadow transition-transform duration-300 group-hover:scale-[1.02]"
                      src={photo.thumb}
                      alt={`Photograph ${globalIndex + 1}`}
                      loading="lazy"
                      decoding="async"
                      width={500}
                      height={281}
                    />
                  </button>
                );
              })}

              {/* "View all photos" tile — disguised as another gallery tile.
                  Opens the lightbox at index 0 so the user can step through
                  every photo using the existing prev/next + ESC keybindings. */}
              <button
                type="button"
                onClick={() => setActiveIndex(0)}
                className="group block w-full overflow-hidden rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                aria-label="Open all photos in lightbox"
              >
                <div className="aspect-video flex h-full w-full items-center justify-center rounded-md bg-foreground text-background shadow transition-transform duration-300 group-hover:scale-[1.02]">
                  <div className="flex flex-col items-center gap-3 px-4 text-center">
                    <span className="text-[11px] font-semibold uppercase tracking-[0.3em]">
                      View all photos
                    </span>
                    <ArrowUpRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                </div>
              </button>
            </GalleryCol>
            <GalleryCol yRange={["0%", "-65%"]} className="-mt-2 pb-[300px]">
              {columns.rightImages.map((photo, index) => {
                const globalIndex = columns.rightStart + index;
                return (
                  <button
                    key={`right-${photo.name}`}
                    type="button"
                    onClick={() => setActiveIndex(globalIndex)}
                    className="group block w-full overflow-hidden rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    aria-label={`Open photograph ${globalIndex + 1}`}
                  >
                    <img
                      className="aspect-video block h-auto max-h-full w-full cursor-zoom-in rounded-md object-cover shadow transition-transform duration-300 group-hover:scale-[1.02]"
                      src={photo.thumb}
                      alt={`Photograph ${globalIndex + 1}`}
                      loading="lazy"
                      decoding="async"
                      width={500}
                      height={281}
                    />
                  </button>
                );
              })}
            </GalleryCol>
          </GalleryContainer>
        </ContainerSticky>
      </ContainerScroll>

      <section className="relative z-10 mx-auto -mt-[20vh] flex max-w-5xl flex-col items-start justify-between gap-6 px-5 py-16 md:-mt-[10vh] md:flex-row md:items-center">
        <h2 className="text-4xl font-semibold tracking-tight md:text-5xl">This is also me —</h2>
        <Link to="/" className="btn-primary">
          Back to dev portfolio
        </Link>
        <p className="section-label md:text-right">Leuqas Yabot · Photography · 2025</p>
      </section>

      {activeIndex !== null && activePhoto ? (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/95 p-4 text-white">
          <button
            type="button"
            onClick={() => setActiveIndex(null)}
            className="absolute right-5 top-5 rounded-full border border-white/20 p-2 transition hover:bg-white hover:text-black"
            aria-label="Close lightbox"
          >
            <X className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={showPrev}
            className="absolute left-4 rounded-full border border-white/20 bg-black/40 p-3 transition hover:bg-white hover:text-black md:left-8"
            aria-label="Previous image"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <img
            src={activePhoto.full}
            alt={`Expanded photograph ${activeIndex + 1}`}
            className="max-h-[84vh] max-w-[92vw] rounded-sm object-contain"
            decoding="async"
          />
          <button
            type="button"
            onClick={showNext}
            className="absolute right-4 rounded-full border border-white/20 bg-black/40 p-3 transition hover:bg-white hover:text-black md:right-8"
            aria-label="Next image"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
          <p className="absolute bottom-6 text-xs uppercase tracking-[0.3em] text-white/70">
            {activeIndex + 1} / {allImages.length}
          </p>
        </div>
      ) : null}
    </main>
  );
}
