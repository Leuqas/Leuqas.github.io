import { useEffect } from "react";
import { AboutSection } from "@/components/sections/about";
import { CertificationSection } from "@/components/sections/certification";
import { HeroSection } from "@/components/sections/hero";
import { ProjectsSection } from "@/components/sections/projects";
import { ServicesSection } from "@/components/sections/services";
import { CinematicFooter } from "@/components/ui/motion-footer";

export function HomePage() {
  useEffect(() => {
    const t = setTimeout(() => window.scrollTo({ top: 0, behavior: "auto" }), 300);
    return () => clearTimeout(t);
  }, []);

  return (
    <main>
      <HeroSection />
      {/* <CertificationSection /> */}
      <ProjectsSection />
      <AboutSection />
    </main>
  );
}
