import { highlights, profile } from "@/lib/content";

export function AboutSection() {
  return (
    <section id="about" className="border-t border-border px-5 py-20 md:py-28">
      <div className="mx-auto grid max-w-5xl gap-12 md:grid-cols-[1.05fr_0.95fr]">
        <div>
          <p className="section-label">About</p>
          <h2 className="section-title mt-4">Student, builder, documenter.</h2>
          <div className="mt-8 space-y-5 text-lg leading-8 text-muted-foreground">
            <p>{profile.intro}</p>
            <p>
              I&apos;m {profile.name}, a {profile.role}. I focus on turning rough
              business problems into working products quickly, especially for owners
              who need practical tools more than decorative websites.
            </p>
            <p>
              Currently based in {profile.city}, studying at{" "}
              <strong className="font-semibold text-foreground">{profile.school}</strong>,
              and working toward Computer Science at the University of the Philippines.
            </p>
          </div>

          <div className="mt-10 border-t border-border pt-8">
            <p className="section-label">Certification</p>
            <a
              href={profile.certification}
              target="_blank"
              rel="noreferrer"
              className="mt-4 block rounded-lg border border-border bg-card p-5 transition hover:border-primary/40 hover:text-primary"
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
        </div>

        <div className="md:border-l md:border-border md:pl-10">
          <p className="section-label">Quick Facts</p>
          <ul className="mt-6 space-y-4">
            {highlights.map((item) => (
              <li key={item} className="border-b border-border pb-4 text-base leading-7">
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
