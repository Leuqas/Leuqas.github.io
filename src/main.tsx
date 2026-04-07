import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

function Root() {
  return (
    <>
      <style>{`
        .cinematic-footer-wrapper [data-footer-reveal][class*="z-20"] > :nth-child(1),
        .cinematic-footer-wrapper [data-footer-reveal][class*="z-20"] > :nth-child(2) {
          display: none !important;
        }
      `}</style>

      <App />

      <footer className="container py-8 text-center">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground md:text-xs">
          © 2026 Leuqas Yabot. Built in Nueva Ecija.
        </p>
        <p className="mt-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground md:text-xs">
          Built by a student developer who ships
        </p>
      </footer>
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
);
