import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, ExternalLink, X } from "lucide-react";
import { projects } from "@/lib/content";

function getStatusClass(status: string) {
  if (status === "Live") return "bg-emerald-100 text-emerald-800 border-emerald-200";
  if (status === "Completed") return "bg-blue-100 text-blue-800 border-blue-200";
  if (status.includes("LGU")) return "bg-amber-100 text-amber-800 border-amber-200";
  if (status.includes("concluded")) return "bg-zinc-100 text-zinc-700 border-zinc-200";
  return "bg-purple-100 text-purple-800 border-purple-200";
}

export function ProjectsSection() {
  const [activeGallery, setActiveGallery] = useState<{
    projectTitle: string;
    images: string[];
    index: number;
  } | null>(null);

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
    <section id="projects" className="border-t border-border px-5 py-20 md:py-28">
      <div className="mx-auto max-w-5xl">
        <p className="section-label">things i made</p>
        <h2 className="section-title mt-4">Selected works.</h2>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">
          Recent builds for clients across health, mobility, and small business. Each project documents the problem, the build, and the outcome.
        </p>

        <div className="mt-14">
          {projects.map((project, projectIndex) => (
            <article
              key={project.title}
              className="grid gap-8 border-b border-border py-12 first:border-t md:grid-cols-[0.18fr_1fr_0.75fr]"
            >
              <div className="font-serif text-6xl font-semibold text-foreground/35 md:text-7xl">
                {String(projectIndex + 1).padStart(2, "0")}
              </div>

              <div>
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h3 className="text-3xl font-semibold tracking-tight">
                      {project.title}
                    </h3>
                    <p className="mt-2 text-sm font-semibold text-muted-foreground">
                      {project.period}
                    </p>
                  </div>
                  <span className={`rounded-full border px-3 py-1 text-xs font-bold ${getStatusClass(project.status)}`}>
                    {project.status}
                  </span>
                </div>

                <div className="mt-7 space-y-6">
                  <div>
                    <p className="section-label">Problem</p>
                    <p className="mt-2 leading-7 text-muted-foreground">{project.problem}</p>
                  </div>
                  <div>
                    <p className="section-label">Solution</p>
                    <p className="mt-2 leading-7 text-muted-foreground">{project.solution}</p>
                  </div>
                </div>

                <div className="mt-7 flex flex-wrap gap-2">
                  {project.stack.map((item) => (
                    <span key={item} className="tag">
                      {item}
                    </span>
                  ))}
                </div>

                {"url" in project && project.url ? (
                  <a
                    href={project.url as string}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    {(project.url as string).replace(/^https?:\/\//, "")}
                  </a>
                ) : null}
              </div>

              <div>
                {project.images.length > 0 ? (
                  <div className="grid grid-cols-2 gap-2">
                    {project.images.map((image, imageIndex) => (
                      <button
                        key={image}
                        type="button"
                        onClick={() => openGallery(project.title, project.images, imageIndex)}
                        className="group overflow-hidden rounded-sm border border-border bg-secondary"
                      >
                        <img
                          src={image}
                          alt={`${project.title} screenshot ${imageIndex + 1}`}
                          className="h-36 w-full object-cover transition duration-500 group-hover:scale-105 md:h-44"
                          loading="lazy"
                        />
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="flex min-h-48 items-end rounded-sm border border-dashed border-border bg-secondary p-5">
                    <p className="section-label">Private build · images withheld</p>
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
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
