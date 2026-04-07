import { AboutSection } from "@/components/sections/about";
import { HeroSection } from "@/components/sections/hero";
import { MarqueeStripSection } from "@/components/sections/marquee-strip";
import { ProjectsSection } from "@/components/sections/projects";
import { ServicesSection } from "@/components/sections/services";
import { WhyWorkSection } from "@/components/sections/why-work";
import { CinematicFooter } from "@/components/ui/motion-footer";

function App() {
  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <main className="relative z-10">
        <HeroSection />
        <CinematicFooter />
        <AboutSection />
        <ServicesSection />
        <ProjectsSection />
        <WhyWorkSection />
      </main>
    </div>
  );
}

export default App;
