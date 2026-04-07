import { ArrowRight, MessageCircleMore } from "lucide-react";
import { profile } from "@/lib/content";

export function HeroSection() {
  return (
    <section className="relative isolate overflow-hidden pt-20 md:pt-28">
      <div className="grid-overlay absolute inset-0 -z-10 opacity-35" />
      <div className="container">
        <div className="glass animate-fade-up rounded-3xl p-6 md:p-10">
          <p className="mb-4 inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-primary">
            Freelance Developer • Nueva Ecija
          </p>
          <h1 className="max-w-4xl text-balance text-4xl font-black leading-tight md:text-6xl">
            {profile.name}
          </h1>
          <p className="mt-5 max-w-2xl text-pretty text-base text-muted-foreground md:text-lg">
            {profile.headline}
          </p>
          <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
            {profile.subheadline}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#contact"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-transform duration-300 hover:-translate-y-0.5"
            >
              <MessageCircleMore className="h-4 w-4" />
              Contact me
            </a>
            <a
              href="#projects"
              className="inline-flex items-center gap-2 rounded-full border border-white/20 px-5 py-3 text-sm font-semibold transition-colors hover:border-primary/40 hover:text-primary"
            >
              See Sample Work
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
