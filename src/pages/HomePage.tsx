import { AboutSection } from "@/components/sections/about";
import { HeroSection } from "@/components/sections/hero";
import { ProjectsSection } from "@/components/sections/projects";
import { ServicesSection } from "@/components/sections/services";
import { CinematicFooter } from "@/components/ui/motion-footer";

export function HomePage() {
  return (
    <main>
      <HeroSection />
      <ProjectsSection />
      <AboutSection />
      <ServicesSection />
      <CinematicFooter />
    </main>
  );
}
