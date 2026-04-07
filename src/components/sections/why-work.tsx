const bullets = [
  "Fast execution from idea to working demo",
  "Custom workflows instead of copy-paste templates",
  "Business-focused features that owners can actually use",
  "Clear communication and practical recommendations",
];

export function WhyWorkSection() {
  return (
    <section className="container py-16 md:py-24">
      <div className="glass rounded-3xl p-6 md:p-10">
        <h2 className="section-title">Why Work With Me</h2>
        <p className="mt-4 max-w-2xl text-muted-foreground">
          You get a builder mindset: mabilis mag-ship, practical decisions, and systems
          tailored to your operations. Not design for design&apos;s sake.
        </p>
        <ul className="mt-8 grid gap-3 md:grid-cols-2">
          {bullets.map((item) => (
            <li key={item} className="rounded-2xl border border-white/10 bg-black/20 p-4 text-sm">
              {item}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
