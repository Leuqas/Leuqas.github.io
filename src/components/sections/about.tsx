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
              and working toward Computer Science at the <strong className="font-semibold text-foreground">University of the Philippines</strong>.
            </p>
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
