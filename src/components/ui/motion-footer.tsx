import { Instagram, Linkedin, Mail, MessageCircleMore, Phone } from "lucide-react";
import { profile } from "@/lib/content";

const marqueeItems = [
  "Function over fluff",
  "Custom systems",
  "Local business focus",
  "Fast practical builds",
];

function MarqueeTrack() {
  return (
    <div className="flex items-center gap-6 px-3">
      {marqueeItems.map((item) => (
        <div key={item} className="flex items-center gap-6">
          <span>{item}</span>
          <span className="text-primary">✦</span>
        </div>
      ))}
    </div>
  );
}

export function CinematicFooter() {
  return (
    <footer id="contact" className="border-t border-border px-5 py-20 md:py-28">
      <div className="mx-auto max-w-5xl">
        <div className="overflow-hidden border-y border-border py-3">
          <div className="flex w-max animate-marquee-scroll text-[11px] font-bold uppercase tracking-[0.28em] text-muted-foreground">
            <MarqueeTrack />
            <MarqueeTrack />
            <MarqueeTrack />
            <MarqueeTrack />
          </div>
        </div>

        <div className="mx-auto max-w-3xl py-16 text-center">
          <p className="section-label">Contact</p>
          <h2 className="mt-4 text-5xl font-semibold leading-[1.02] tracking-tight md:text-7xl">
            Let&apos;s build what your business actually needs.
          </h2>

          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <a href={profile.messenger} target="_blank" rel="noreferrer" className="btn-ghost rounded-full gap-2 hover:border-primary hover:bg-primary hover:text-primary-foreground">
              <MessageCircleMore className="h-4 w-4" />
              Facebook Messenger
            </a>
            <a href={`mailto:${profile.email}`} className="btn-ghost rounded-full gap-2 hover:border-primary hover:bg-primary hover:text-primary-foreground">
              <Mail className="h-4 w-4" />
              {profile.email}
            </a>
            <a href="tel:09914486773" className="btn-ghost rounded-full gap-2 hover:border-primary hover:bg-primary hover:text-primary-foreground">
              <Phone className="h-4 w-4" />
              09914486773
            </a>
            <a href={profile.instagram} target="_blank" rel="noreferrer" className="btn-ghost rounded-full gap-2 hover:border-primary hover:bg-primary hover:text-primary-foreground">
              <Instagram className="h-4 w-4" />
              instagram.com/lekw.as
            </a>
            <a href={profile.linkedin} target="_blank" rel="noreferrer" className="btn-ghost rounded-full gap-2 hover:border-primary hover:bg-primary hover:text-primary-foreground">
              <Linkedin className="h-4 w-4" />
              linkedin.com/in/leuqas
            </a>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-border pt-6 text-center text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground md:flex-row md:text-left">
          <p>© 2026 Leuqas Yabot · Built in Nueva Ecija</p>
          <a href={profile.linkedin} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 transition hover:text-primary">
            <Linkedin className="h-4 w-4" />
            LinkedIn
          </a>
        </div>
      </div>
    </footer>
  );
}
