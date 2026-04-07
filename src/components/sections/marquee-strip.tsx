const MARQUEE_ITEMS = [
  "Built for function, not just looks",
  "Websites that bring real customers",
  "Reservation and scheduling systems",
  "Fast builds for local businesses",
  "Custom tools over generic templates",
];

function MarqueeTrack() {
  return (
    <div className="flex items-center gap-4 px-2 md:gap-6">
      {MARQUEE_ITEMS.map((item) => (
        <div key={item} className="inline-flex items-center gap-4 md:gap-6">
          <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground md:text-xs">
            {item}
          </span>
          <span className="text-primary/70">✦</span>
        </div>
      ))}
    </div>
  );
}

export function MarqueeStripSection() {
  return (
    <section className="container mt-3 md:mt-4">
      <div className="glass overflow-hidden rounded-2xl border-white/15 py-2">
        <div className="flex w-max animate-marquee-scroll whitespace-nowrap">
          <MarqueeTrack />
          <MarqueeTrack />
        </div>
      </div>
    </section>
  );
}
