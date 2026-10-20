import { useEffect } from "react";
import { AboutSection } from "@/components/sections/about";
import { HeroSection } from "@/components/sections/hero";
import { ProjectsSection } from "@/components/sections/projects";

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
