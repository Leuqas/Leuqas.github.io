import { profile } from "@/lib/content";

export function CertificationSection() {
  return (
    <section id="certification" className="border-t border-border px-5 py-20 md:py-28">
      <div className="mx-auto max-w-5xl">
        <p className="section-label">Certification</p>
        <a
          href={profile.certification}
          target="_blank"
          rel="noreferrer"
          className="mt-6 block rounded-lg border border-border bg-card p-5 transition hover:border-primary/40 hover:text-primary"
        >
          <span className="flex items-start gap-4">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-[#0a0a23] p-1">
              <img src="/images/freecodecamp.webp" alt="freeCodeCamp" className="h-full w-full object-contain" />
            </span>
            <span>
              <span className="block font-semibold">
                freeCodeCamp Legacy Responsive Web Design · Feb 2022
              </span>
              <span className="mt-1 block text-sm text-muted-foreground">
                300 hours of coursework completed at age 12
              </span>
              <span className="mt-2 block text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Credential ID: leuqas-rwd
              </span>
            </span>
          </span>
        </a>
      </div>
    </section>
  );
}
