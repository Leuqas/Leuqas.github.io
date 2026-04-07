import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, ImageIcon, X } from "lucide-react";
import { projects } from "@/lib/content";

const projectGalleryMap: Record<string, string[]> = {
  "Legalease PH": [
    "/images/legal1.png",
    "/images/legal2.png",
    "/images/legal3.png",
    "/images/legal4.png",
  ],
  "Business Website Concepts": [
    "/images/cafe1.png",
    "/images/cafe2.png",
    "/images/cafe3.png",
    "/images/cafe4.png",
  ],
  "HR/Admin Steps & Loyalty Tracker Dashboard": [
    "/images/admin1.png",
  ],
  "Cabanatuan Tricycle Meter": [
    "/images/tri1.jpg",
    "/images/tri2.jpg",
  ],
};

function getThumbWidthClass(imageCount: number) {
  if (imageCount <= 1) return "min-w-full";
  if (imageCount === 2) return "min-w-[44%]";
  if (imageCount === 3) return "min-w-[46%]";
  return "min-w-[42%]";
}

function getOverlapOffset(imageCount: number) {
  if (imageCount <= 1) return 0;
  if (imageCount === 2) return -100;
  if (imageCount === 3) return -150;
  return -170;
}

function isLikelyPortrait(src: string) {
  // return /tri\d+\.(png|jpe?g|webp)$/i.test(src);
  return false; 
}

export function ProjectsSection() {
  const initialOrders = useMemo(() => {
    return projects.map((project) => {
      const images = projectGalleryMap[project.title] ?? [project.image];
      return images.map((_, index) => index);
    });
  }, []);

  const [imageOrders, setImageOrders] = useState<number[][]>(initialOrders);
  const [activeGallery, setActiveGallery] = useState<{
    projectTitle: string;
    images: string[];
    index: number;
  } | null>(null);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setImageOrders((current) =>
        current.map((order) => {
          if (order.length <= 1) return order;
          return [...order.slice(1), order[0]];
        })
      );
    }, 2670);

    return () => window.clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActiveGallery(null);
      }
    };

    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  const openGallery = (projectTitle: string, images: string[], index: number) => {
    setActiveGallery({ projectTitle, images, index });
  };

  const showPrev = () => {
    if (!activeGallery) return;
    setActiveGallery({
      ...activeGallery,
      index:
        (activeGallery.index - 1 + activeGallery.images.length) %
        activeGallery.images.length,
    });
  };

  const showNext = () => {
    if (!activeGallery) return;
    setActiveGallery({
      ...activeGallery,
      index: (activeGallery.index + 1) % activeGallery.images.length,
    });
  };

  return (
    <section id="projects" className="container py-16 md:py-24">
      <h2 className="section-title">Projects</h2>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        Problem first, solution second. Here are sample builds and concepts focused on
        practical business results.
      </p>

      <div className="mt-10 grid gap-5">
        {projects.map((project, projectIndex) => {
          const galleryImages = projectGalleryMap[project.title] ?? [project.image];
          const orderedIndexes = imageOrders[projectIndex] ??
            galleryImages.map((_, index) => index);
          const isSingleImage = galleryImages.length === 1;
          const allPortrait = galleryImages.every((image) => isLikelyPortrait(image));
          const thumbWidthClass = getThumbWidthClass(galleryImages.length);
          const overlapOffset = getOverlapOffset(galleryImages.length);

          return (
            <article key={project.title} className="glass rounded-3xl p-6">
              <div
                className={`grid gap-5 ${
                  projectIndex % 2 === 0
                    ? "md:grid-cols-[1.2fr_0.8fr]"
                    : "md:grid-cols-[0.8fr_1.2fr]"
                }`}
              >
                <div className={`${projectIndex % 2 === 0 ? "md:order-1" : "md:order-2"}`}>
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-xl font-semibold">{project.title}</h3>
                    <button
                      type="button"
                      onClick={() =>
                        openGallery(
                          project.title,
                          galleryImages,
                          orderedIndexes[0] ?? 0
                        )
                      }
                      className="inline-flex items-center gap-1 text-xs uppercase tracking-wider text-primary transition-opacity hover:opacity-80"
                    >
                      <ImageIcon className="h-3.5 w-3.5" />
                      See Images
                    </button>
                  </div>
                  <p className="mt-4 text-sm text-muted-foreground">
                    <strong className="text-foreground">Problem:</strong> {project.problem}
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    <strong className="text-foreground">Solution:</strong> {project.solution}
                  </p>
                  <p className="mt-3 text-xs text-muted-foreground">{project.note}</p>
                </div>

                <div className={`${projectIndex % 2 === 0 ? "md:order-2" : "md:order-1"}`}>
                  <div
                    className={`relative rounded-2xl border border-white/10 bg-black/25 p-3 ${
                      isSingleImage ? "ml-auto w-fit min-h-0" : "h-full min-h-40"
                    }`}
                  >
                    <div
                      className={`flex h-full items-center pb-1 ${
                        isSingleImage
                          ? "justify-end overflow-visible"
                          : allPortrait
                            ? "justify-end gap-3 overflow-x-auto"
                            : "gap-2 overflow-x-auto"
                      }`}
                    >
                      {orderedIndexes.map((imageIndex, stackIndex) => (
                        (() => {
                          const imageSrc = galleryImages[imageIndex];
                          const portraitLike = isLikelyPortrait(imageSrc);

                          return (
                            <button
                              key={`${project.title}-${imageIndex}`}
                              type="button"
                              onClick={() =>
                                openGallery(project.title, galleryImages, imageIndex)
                              }
                              className={`group relative h-24 ${
                                portraitLike
                                  ? isSingleImage
                                    ? "ml-auto w-[110px] md:w-[128px] flex-none"
                                    : "w-[84px] md:w-[96px] flex-none"
                                  : isSingleImage
                                    ? "ml-auto w-auto flex-none"
                                    : `${thumbWidthClass} flex-1`
                              } rounded-xl border border-white/15 shadow-[0_14px_24px_rgba(2,6,23,1)] transition-transform duration-500 hover:scale-[1.03] hover:shadow-[0_22px_38px_rgba(2,6,23,0.85)] md:h-28`}
                              style={{
                                marginLeft:
                                  stackIndex === 0
                                    ? 0
                                    : portraitLike
                                      ? -24
                                      : overlapOffset,
                                zIndex: orderedIndexes.length - stackIndex,
                              }}
                            >
                              <img
                                src={imageSrc}
                                alt={`${project.title} screenshot ${imageIndex + 1}`}
                                className={`rounded-xl shadow-[0_8px_18px_rgba(0,0,0,0.45)] ${
                                  isSingleImage
                                    ? "ml-auto h-full w-auto max-w-[420px] object-contain object-right"
                                    : portraitLike
                                      ? "h-full w-full object-contain object-center"
                                      : "h-full w-full object-cover"
                                }`}
                                loading="lazy"
                              />
                              <span className="pointer-events-none absolute inset-0 rounded-xl bg-black/20 opacity-0 transition-opacity group-hover:opacity-100" />
                            </button>
                          );
                        })()
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {activeGallery ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <button
            type="button"
            onClick={() => setActiveGallery(null)}
            className="absolute right-5 top-5 rounded-full border border-white/20 p-2 text-white"
            aria-label="Close gallery"
          >
            <X className="h-5 w-5" />
          </button>

          <button
            type="button"
            onClick={showPrev}
            className="absolute left-4 rounded-full border border-white/20 bg-black/40 p-2 text-white md:left-8"
            aria-label="Previous image"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <div className="inline-flex max-w-[94vw] flex-col items-center rounded-2xl border border-white/20 bg-black/50 p-2">
            <img
              src={activeGallery.images[activeGallery.index]}
              alt={`${activeGallery.projectTitle} enlarged preview ${activeGallery.index + 1}`}
              className="max-h-[82vh] w-auto max-w-[92vw] rounded-xl bg-black/30 object-contain object-right"
            />
            <p className="mt-2 text-center text-xs text-white/70">
              {activeGallery.projectTitle} • {activeGallery.index + 1} / {activeGallery.images.length}
            </p>
          </div>

          <button
            type="button"
            onClick={showNext}
            className="absolute right-4 rounded-full border border-white/20 bg-black/40 p-2 text-white md:right-8"
            aria-label="Next image"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      ) : null}
    </section>
  );
}
