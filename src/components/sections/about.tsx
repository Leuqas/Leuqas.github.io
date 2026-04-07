import { highlights, profile } from "@/lib/content";

export function AboutSection() {
  return (
    <section id="about" className="container py-16 md:py-24">
      <div className="grid gap-8 md:grid-cols-[1.2fr_1fr]">
        <div className="glass rounded-3xl p-6 md:p-8">
          <h2 className="section-title">About Me</h2>
          <p className="mt-5 text-muted-foreground">{profile.intro}</p>
          <p className="mt-4 text-muted-foreground">
            I&apos;m {profile.name}, a {profile.role}. I focus on turning ideas into working
            products quickly, especially for owners who need practical tools more than
            fancy visuals.
          </p>
          <p className="mt-4 text-muted-foreground">
            Currently based in {profile.city}, and I&apos;m a <strong>{profile.school}</strong>.
          </p>
        </div>
        <div className="glass rounded-3xl p-6 md:p-8">
          <h3 className="text-lg font-semibold">Quick Facts</h3>
          <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
            {highlights.map((item) => (
              <li key={item} className="rounded-xl border border-white/10 bg-black/20 p-3">
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
