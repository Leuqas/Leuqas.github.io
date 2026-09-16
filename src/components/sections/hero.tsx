import { useEffect, useState } from "react";
import {
  ArrowRight,
  Camera,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import { ContainerAnimated, ContainerStagger } from "@/components/ui/animated-gallery";

function completedYears(start: Date, now: Date) {
  const anniversaryPending = now.getMonth() < start.getMonth()
    || (now.getMonth() === start.getMonth() && now.getDate() < start.getDate());
  return Math.max(0, now.getFullYear() - start.getFullYear() - Number(anniversaryPending));
}

function ExperienceBadge() {
  const [values] = useState(() => {
    const now = new Date();
    const birthDate = new Date(2009, 9, 5);
    // Use the 11th birthday consistently as the coding start date.
    const codingStartDate = new Date(birthDate.getFullYear() + 11, 9, 5);
    return {
      age: completedYears(birthDate, now),
      experience: completedYears(codingStartDate, now),
    };
  });
  const [progress, setProgress] = useState(() =>
    window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 1 : 0,
  );

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let startedAt: number | undefined;

    const tick = (timestamp: number) => {
      startedAt ??= timestamp;
      const elapsed = Math.min((timestamp - startedAt) / 900, 1);
      setProgress(1 - Math.pow(1 - elapsed, 3));
      if (elapsed < 1) frame = requestAnimationFrame(tick);
    };
    const finishIfReduced = () => {
      if (preference.matches) {
        cancelAnimationFrame(frame);
        setProgress(1);
      }
    };

    if (preference.matches) finishIfReduced();
    else frame = requestAnimationFrame(tick);
    preference.addEventListener("change", finishIfReduced);
    return () => {
      cancelAnimationFrame(frame);
      preference.removeEventListener("change", finishIfReduced);
    };
  }, []);

  return (
    <p className="mt-6 inline-flex rounded-full border border-primary/15 bg-accent px-4 py-2 text-sm font-bold text-accent-foreground">
      <span className="sr-only">
        {values.experience} years of experience as a {values.age}-year-old Web Developer
      </span>
      <span aria-hidden="true">
        <span className="inline-block text-right tabular-nums" style={{ minWidth: `${String(values.experience).length}ch` }}>
          {Math.round(values.experience * progress)}
        </span>{" "}years of experience as a{" "}
        <span className="inline-block text-right tabular-nums" style={{ minWidth: `${String(values.age).length}ch` }}>
          {Math.round(values.age * progress)}
        </span>-year-old Web Developer
      </span>
    </p>
  );
}

export function HeroSection() {
  return (
    <section className="relative flex min-h-screen items-start overflow-hidden px-5 pt-16 md:items-center">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle,hsl(var(--foreground)/0.13)_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(circle_at_center,black,transparent_72%)]" />
      <ContainerStagger className="mx-auto grid w-full max-w-5xl items-center gap-5 py-8 md:grid-cols-[1.1fr_0.9fr] md:gap-12 md:py-24">
        <div className="order-2 md:order-1">
          <ContainerAnimated>
            <p className="section-label inline-flex items-center gap-2">
              <MapPin className="h-3.5 w-3.5 text-primary" />
              Freelance Developer · Cabanatuan, Nueva Ecija
            </p>
          </ContainerAnimated>

          <ContainerAnimated>
            <h1 className="mt-8 text-6xl font-semibold leading-[0.9] tracking-tight md:text-8xl">
              Leuqas Yabot
            </h1>
            <p className="mt-3 text-sm font-semibold text-muted-foreground">He/Him</p>
          </ContainerAnimated>

          <ContainerAnimated>
            <ExperienceBadge />
          </ContainerAnimated>

          <ContainerAnimated>
            <p className="mt-8 max-w-xl text-sm leading-7 text-muted-foreground">
              Hello! I am a senior high school student who started coding at 11. At my
              early age, I already take on real client projects to not only build my
              portfolio, but also to fund my way to a Computer Science degree at the
              University of the Philippines. I build full stack websites with Node.js,
              React, Express, MongoDB, and PostgreSQL.
            </p>
          </ContainerAnimated>

          <ContainerAnimated className="mt-8 flex max-w-xl flex-wrap gap-x-5 gap-y-3 text-sm font-medium text-muted-foreground">
            <span className="inline-flex items-center gap-2">
              <MapPin className="h-3.5 w-3.5 text-primary" />
              Cabanatuan City, Nueva Ecija
            </span>
            <a href="mailto:yleuqas@gmail.com" className="inline-flex items-center gap-2 hover:text-primary">
              <Mail className="h-3.5 w-3.5 text-primary" />
              yleuqas@gmail.com
            </a>
            <a href="tel:09914486773" className="inline-flex items-center gap-2 hover:text-primary">
              <Phone className="h-3.5 w-3.5 text-primary" />
              09914486773
            </a>
            <a
              href="https://www.linkedin.com/in/leuqas"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 hover:text-primary"
            >
              <Linkedin className="h-3.5 w-3.5 text-primary" />
              leuqas
            </a>
            <a
              href="https://www.instagram.com/lekw.as/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 hover:text-primary"
            >
              <Instagram className="h-3.5 w-3.5 text-primary" />
              @lekw.as
            </a>
          </ContainerAnimated>

          <ContainerAnimated className="mt-9 flex flex-wrap gap-3">
            <a href="#projects" className="btn-primary gap-2">
              See Sample Work
              <ArrowRight className="h-4 w-4" />
            </a>
            <a href="/photography" className="btn-ghost gap-2">
              Photography Portfolio
              <Camera className="h-4 w-4" />
            </a>
          </ContainerAnimated>

          {/* <p className="mt-6 text-sm font-medium text-muted-foreground">
            5 years of experience · 16 years old
          </p> */}
        </div>

        <ContainerAnimated className="order-1 flex justify-center md:order-2 md:justify-end">
          <div className="relative md:hidden">
            <img
              src="/images/leuqas-cropped.webp"
              alt="Leuqas Yabot"
              className="h-28 w-28 rounded-full border-2 border-primary/20 object-cover shadow-lg"
            />
            <span className="absolute -bottom-1 -right-1 inline-flex items-center gap-1 rounded-full border border-primary/20 bg-background px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-primary shadow-sm">
              <MapPin className="h-3 w-3" />
              NE
            </span>
          </div>
          <img
            src="/images/leuqas.webp"
            alt="Leuqas Yabot"
            className="hidden w-full max-w-48 object-contain md:block md:max-w-[420px]"
          />
        </ContainerAnimated>
      </ContainerStagger>
    </section>


  );
}
