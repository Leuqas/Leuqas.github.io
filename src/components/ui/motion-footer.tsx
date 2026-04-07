"use client";

import * as React from "react";
import { useEffect, useRef } from "react";
import { ArrowUp, Instagram, Mail, MessageCircleMore, Phone } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";
import { profile } from "@/lib/content";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800;900&display=swap');

.cinematic-footer-wrapper {
  font-family: 'Plus Jakarta Sans', sans-serif;
  -webkit-font-smoothing: antialiased;
  --pill-bg-1: color-mix(in oklch, var(--foreground) 3%, transparent);
  --pill-bg-2: color-mix(in oklch, var(--foreground) 1%, transparent);
  --pill-shadow: color-mix(in oklch, var(--background) 50%, transparent);
  --pill-highlight: color-mix(in oklch, var(--foreground) 10%, transparent);
  --pill-inset-shadow: color-mix(in oklch, var(--background) 80%, transparent);
  --pill-border: color-mix(in oklch, var(--foreground) 8%, transparent);
  --pill-bg-1-hover: color-mix(in oklch, var(--foreground) 8%, transparent);
  --pill-bg-2-hover: color-mix(in oklch, var(--foreground) 2%, transparent);
  --pill-border-hover: color-mix(in oklch, var(--foreground) 20%, transparent);
  --pill-shadow-hover: color-mix(in oklch, var(--background) 70%, transparent);
  --pill-highlight-hover: color-mix(in oklch, var(--foreground) 20%, transparent);
}

@keyframes footer-breathe {
  0% { transform: translate(-50%, -50%) scale(1); opacity: 0.6; }
  100% { transform: translate(-50%, -50%) scale(1.1); opacity: 1; }
}

@keyframes footer-scroll-marquee {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}

.animate-footer-breathe {
  animation: footer-breathe 8s ease-in-out infinite alternate;
}

.animate-footer-scroll-marquee {
  animation: footer-scroll-marquee 36s linear infinite;
}

.footer-bg-grid {
  background-size: 60px 60px;
  background-image:
    linear-gradient(to right, color-mix(in oklch, var(--foreground) 3%, transparent) 1px, transparent 1px),
    linear-gradient(to bottom, color-mix(in oklch, var(--foreground) 3%, transparent) 1px, transparent 1px);
  mask-image: linear-gradient(to bottom, transparent, black 30%, black 70%, transparent);
}

.footer-aurora {
  background: radial-gradient(
    circle at 50% 50%,
    color-mix(in oklch, var(--primary) 15%, transparent) 0%,
    color-mix(in oklch, var(--secondary) 15%, transparent) 40%,
    transparent 70%
  );
}

.footer-glass-pill {
  background: linear-gradient(145deg, var(--pill-bg-1) 0%, var(--pill-bg-2) 100%);
  box-shadow:
    0 10px 30px -10px var(--pill-shadow),
    inset 0 1px 1px var(--pill-highlight),
    inset 0 -1px 2px var(--pill-inset-shadow);
  border: 1px solid var(--pill-border);
  backdrop-filter: blur(16px);
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.footer-glass-pill:hover {
  background: linear-gradient(145deg, var(--pill-bg-1-hover) 0%, var(--pill-bg-2-hover) 100%);
  border-color: var(--pill-border-hover);
  box-shadow:
    0 20px 40px -10px var(--pill-shadow-hover),
    inset 0 1px 1px var(--pill-highlight-hover);
  color: var(--foreground);
}

.footer-giant-bg-text {
  font-size: 24vw;
  line-height: 0.75;
  font-weight: 900;
  letter-spacing: -0.05em;
  color: transparent;
  -webkit-text-stroke: 1px color-mix(in oklch, var(--foreground) 5%, transparent);
  background: linear-gradient(180deg, color-mix(in oklch, var(--foreground) 10%, transparent) 0%, transparent 60%);
  -webkit-background-clip: text;
  background-clip: text;
}

.footer-text-glow {
  background: linear-gradient(180deg, var(--foreground) 0%, color-mix(in oklch, var(--foreground) 40%, transparent) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  filter: drop-shadow(0px 0px 20px color-mix(in oklch, var(--foreground) 15%, transparent));
}

.footer-heading-highlight {
  position: absolute;
  inset: -0.08em -0.18em -0.06em -0.18em;
  z-index: -1;
  border-radius: 0;
  background-color: #1d4ed8;
  background-image: linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%);
  border: 1px solid #3b82f6;
  box-shadow:
    0 10px 18px -12px rgba(37, 99, 235, 0.95),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  opacity: 1;
}

.footer-heading-text {
  display: block;
  white-space: nowrap;
  position: relative;
  z-index: 1;
  color: #ffffff;
}

.footer-heading-shell {
  position: relative;
  display: block;
  width: fit-content;
  margin-inline: auto;
  isolation: isolate;
}

.footer-heading-shell + .footer-heading-shell {
  margin-top: 0.16em;
}
`;

export type MagneticButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  React.AnchorHTMLAttributes<HTMLAnchorElement> & {
    as?: React.ElementType;
  };

const MagneticButton = React.forwardRef<HTMLElement, MagneticButtonProps>(
  ({ className, children, as: Component = "button", ...props }, forwardedRef) => {
    const localRef = useRef<HTMLElement>(null);

    useEffect(() => {
      if (typeof window === "undefined") return;
      const element = localRef.current;
      if (!element) return;

      const handleMouseMove = (event: MouseEvent) => {
        const rect = element.getBoundingClientRect();
        const x = event.clientX - rect.left - rect.width / 2;
        const y = event.clientY - rect.top - rect.height / 2;

        gsap.to(element, {
          x: x * 0.25,
          y: y * 0.25,
          rotationX: -y * 0.08,
          rotationY: x * 0.08,
          scale: 1.03,
          ease: "power2.out",
          duration: 0.3,
        });
      };

      const handleMouseLeave = () => {
        gsap.to(element, {
          x: 0,
          y: 0,
          rotationX: 0,
          rotationY: 0,
          scale: 1,
          ease: "elastic.out(1, 0.3)",
          duration: 1,
        });
      };

      element.addEventListener("mousemove", handleMouseMove);
      element.addEventListener("mouseleave", handleMouseLeave);

      return () => {
        element.removeEventListener("mousemove", handleMouseMove);
        element.removeEventListener("mouseleave", handleMouseLeave);
      };
    }, []);

    return (
      <Component
        ref={(node: HTMLElement) => {
          (localRef as React.MutableRefObject<HTMLElement | null>).current = node;
          if (typeof forwardedRef === "function") forwardedRef(node);
          else if (forwardedRef)
            (forwardedRef as React.MutableRefObject<HTMLElement | null>).current =
              node;
        }}
        className={cn("cursor-pointer", className)}
        {...props}
      >
        {children}
      </Component>
    );
  }
);
MagneticButton.displayName = "MagneticButton";

const MarqueeItem = () => (
  <div className="flex items-center space-x-8 px-5">
    <span>Function over fluff</span> <span className="text-primary/60">✦</span>
    <span>Custom systems</span> <span className="text-secondary/60">✦</span>
    <span>Local business focus</span> <span className="text-primary/60">✦</span>
    <span>Fast practical builds</span> <span className="text-secondary/60">✦</span>
  </div>
);

export function CinematicFooter() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      const revealTargets = sectionRef.current?.querySelectorAll("[data-footer-reveal]");
      if (!revealTargets || revealTargets.length === 0) return;

      gsap.fromTo(
        revealTargets,
        { y: 18, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, stagger: 0.1, ease: "power2.out" }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />
      <section
        id="contact"
        ref={sectionRef}
        className="cinematic-footer-wrapper relative mt-8 w-full overflow-hidden bg-background py-12 text-foreground md:mt-10 md:py-16"
      >
        <div className="container relative">
          <div className="footer-aurora pointer-events-none absolute left-1/2 top-1/2 z-0 h-[60vh] w-[80vw] -translate-x-1/2 -translate-y-1/2 animate-footer-breathe rounded-[50%] blur-[80px]" />
          <div className="footer-bg-grid pointer-events-none absolute inset-0 z-0" />

          <div
            data-footer-reveal
            className="footer-giant-bg-text pointer-events-none absolute bottom-2 left-1/2 z-0 -translate-x-1/2 select-none whitespace-nowrap opacity-70"
          >
            LEUQAS
          </div>

          <div
            data-footer-reveal
            className="absolute left-0 top-3 z-10 w-full overflow-hidden border-y border-border/50 bg-background/60 py-3 shadow-2xl backdrop-blur-md"
          >
            <div className="animate-footer-scroll-marquee flex w-max text-xs font-bold uppercase tracking-[0.25em] text-muted-foreground md:text-sm">
              <MarqueeItem />
              <MarqueeItem />
            </div>
          </div>

          <div className="relative z-10 mx-auto mt-16 flex w-full max-w-5xl flex-col items-center justify-center px-4 md:mt-24 md:px-6">
            <h2
              data-footer-reveal
              className="mb-10 text-center text-3xl font-black tracking-tight leading-[1.02] sm:text-4xl md:text-7xl"
            >
              <span className="footer-heading-shell">
                <span className="footer-heading-highlight" aria-hidden="true" />
                <span className="footer-heading-text">
                  Let&apos;s build what your
                </span>
              </span>

              <span className="footer-heading-shell">
                <span className="footer-heading-highlight" aria-hidden="true" />
                <span className="footer-heading-text">
                  business actually needs.
                </span>
              </span>
            </h2>

            <div data-footer-reveal className="flex w-full flex-col items-center gap-5">
              <div className="flex w-full flex-wrap justify-center gap-4">
                <MagneticButton
                  as="a"
                  href={profile.messenger}
                  target="_blank"
                  rel="noreferrer"
                  className="footer-glass-pill group flex items-center gap-3 rounded-full px-7 py-4 text-sm font-bold text-foreground md:text-base"
                >
                  <MessageCircleMore className="h-5 w-5 text-primary transition-colors group-hover:text-foreground" />
                  Message Me on Facebook
                </MagneticButton>

                <MagneticButton
                  as="a"
                  href={`mailto:${profile.email}`}
                  className="footer-glass-pill group flex items-center gap-3 rounded-full px-7 py-4 text-sm font-bold text-foreground md:text-base"
                >
                  <Mail className="h-5 w-5 text-primary transition-colors group-hover:text-foreground" />
                  Email Me Directly
                </MagneticButton>
              </div>

              <div className="mt-1 flex w-full flex-wrap justify-center gap-3 md:gap-5">
                <MagneticButton
                  as="a"
                  href="tel:09914486773"
                  className="footer-glass-pill flex items-center gap-2 rounded-full px-5 py-2 text-xs font-medium text-muted-foreground hover:text-foreground md:text-sm"
                >
                  <Phone className="h-4 w-4" />
                  0991 448 6773
                </MagneticButton>
                <MagneticButton
                  as="a"
                  href={profile.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="footer-glass-pill flex items-center gap-2 rounded-full px-5 py-2 text-xs font-medium text-muted-foreground hover:text-foreground md:text-sm"
                >
                  <Instagram className="h-4 w-4" />
                  @lekw.as
                </MagneticButton>
              </div>
            </div>
          </div>

        </div>
      </section>
    </>
  );
}
