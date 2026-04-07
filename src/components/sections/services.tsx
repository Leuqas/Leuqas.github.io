import { Cog, Globe, LifeBuoy } from "lucide-react";
import { services } from "@/lib/content";

const icons = [Globe, Cog, LifeBuoy];

export function ServicesSection() {
  return (
    <section id="services" className="container py-16 md:py-24">
      <h2 className="section-title">Services</h2>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        Straightforward offers for businesses that need outcomes: better visibility,
        smoother operations, and less manual work.
      </p>
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {services.map((service, index) => {
          const Icon = icons[index] ?? Globe;
          return (
            <article key={service.title} className="glass rounded-3xl p-6">
              <Icon className="h-6 w-6 text-primary" />
              <h3 className="mt-4 text-lg font-semibold">{service.title}</h3>
              <p className="mt-3 text-sm text-muted-foreground">{service.description}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
