import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";

const sectionLinks = [
  { label: "Work", id: "projects" },
  { label: "About", id: "about" },
  { label: "Services", id: "services" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const goToSection = (id: string) => {
    setOpen(false);

    if (location.pathname !== "/") {
      navigate(`/#${id}`);
      return;
    }

    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? "border-b border-border bg-white/90 shadow-sm backdrop-blur" : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-5xl items-center justify-between px-5">
        <Link
          to="/"
          className="font-serif text-2xl font-semibold italic tracking-tight text-foreground"
          onClick={() => setOpen(false)}
        >
          leuqas.
        </Link>

        <div className="hidden items-center gap-7 md:flex">
          {sectionLinks.map((link) => (
            <button
              key={link.id}
              type="button"
              onClick={() => goToSection(link.id)}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </button>
          ))}
          <Link
            to="/photography"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Photography
          </Link>
          <button type="button" onClick={() => goToSection("contact")} className="btn-primary">
            Hire me
          </button>
        </div>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-border bg-background md:hidden"
          onClick={() => setOpen((value) => !value)}
          aria-label="Toggle navigation"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {open ? (
        <div className="border-t border-border bg-background px-5 py-4 shadow-sm md:hidden">
          <div className="mx-auto flex max-w-5xl flex-col gap-3">
            {sectionLinks.map((link) => (
              <button
                key={link.id}
                type="button"
                onClick={() => goToSection(link.id)}
                className="rounded-md px-2 py-2 text-left text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground"
              >
                {link.label}
              </button>
            ))}
            <Link
              to="/photography"
              onClick={() => setOpen(false)}
              className="rounded-md px-2 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground"
            >
              Photography
            </Link>
            <button type="button" onClick={() => goToSection("contact")} className="btn-primary w-fit">
              Hire me
            </button>
          </div>
        </div>
      ) : null}
    </header>
  );
}
