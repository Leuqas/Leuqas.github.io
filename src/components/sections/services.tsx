import { Cog, Globe, LifeBuoy } from "lucide-react";
import { services } from "@/lib/content";

const icons = [Globe, Cog, LifeBuoy];

export function ServicesSection() {
  return (
    <section id="services" className="border-t border-border px-5 py-20 md:py-28">
      <div className="mx-auto max-w-5xl">
        <p className="section-label">Services</p>
        <h2 className="section-title mt-4">Useful work, clearly scoped.</h2>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">
          Straightforward offers for businesses that need outcomes: better visibility,
          smoother operations, and less manual work.
        </p>
      <div className="mt-10 grid gap-4 md:grid-cols-3">
        {services.map((service, index) => {
          const Icon = icons[index] ?? Globe;
          return (
            <article key={service.title} className="card-clean p-6">
              <Icon className="h-6 w-6 text-primary" />
              <h3 className="mt-5 text-2xl font-semibold">{service.title}</h3>
              <p className="mt-4 text-sm leading-7 text-muted-foreground">{service.description}</p>
            </article>
          );
        })}
      </div>
      </div>
    </section>
  );
}
