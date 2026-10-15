import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Navbar } from "@/components/ui/navbar";
import { HomePage } from "@/pages/HomePage";
import { PhotographyPage } from "@/pages/PhotographyPage";
import { BlogPage, ArticlePage } from "@/pages/BlogPages";
import { articles } from "@/lib/articles";

function RouteMetadata() {
  const { pathname } = useLocation();
  useEffect(() => {
    if (pathname === "/blog/" || pathname === "/blog") {
      document.title = "Writing & Notes | Leuqas Yabot";
      return;
    }
    const slug = pathname.split("/").filter(Boolean).at(-1);
    if (pathname.startsWith("/blog/") && slug) {
      const article = articles.find((entry) => entry.slug === slug);
      document.title = article ? `${article.title} | Leuqas Yabot` : "Writing | Leuqas Yabot";
    }
  }, [pathname]);
  return null;
}

function App() {
  return (
    <BrowserRouter>
      <RouteMetadata />
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/photography" element={<PhotographyPage />} />
        <Route path="/blog/" element={<BlogPage />} />
        <Route path="/blog/:slug/" element={<ArticlePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
