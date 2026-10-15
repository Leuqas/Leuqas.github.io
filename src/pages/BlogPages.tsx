import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowUpRight, Search } from "lucide-react";
import { articleUrl, publishedArticles, readingTime, type Article } from "@/lib/articles";

function dateLabel(date?: string) {
  return date ? new Intl.DateTimeFormat("en", { dateStyle: "long", timeZone: "UTC" }).format(new Date(`${date}T00:00:00Z`)) : null;
}

function Meta({ article }: { article: Article }) {
  return <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
    {dateLabel(article.publishedAt) && <time dateTime={article.publishedAt}>{dateLabel(article.publishedAt)}</time>}
    {dateLabel(article.publishedAt) && <span aria-hidden="true">·</span>}
    <span>{readingTime(article)} min read</span><span aria-hidden="true">·</span><span>{article.category}</span>
  </div>;
}

function ArticleLink({ article, featured = false }: { article: Article; featured?: boolean }) {
  return <Link to={articleUrl(article.slug)} className={`group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4 ${featured ? "" : ""}`}>
    <Meta article={article} />
    <h2 className={`mt-3 font-serif font-medium leading-tight tracking-tight group-hover:text-primary ${featured ? "text-4xl md:text-6xl" : "text-2xl md:text-3xl"}`}>{article.title}<ArrowUpRight aria-hidden="true" className="ml-2 inline h-5 w-5 align-baseline opacity-0 transition group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:opacity-100" /></h2>
    <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">{article.excerpt}</p>
    <span className="mt-4 inline-block text-xs font-bold uppercase tracking-[0.18em] text-primary">Read essay <span aria-hidden="true">→</span></span>
  </Link>;
}

export function BlogPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All writing");
  const categories = ["All writing", ...new Set(publishedArticles.map((post) => post.category))];
  const featured = publishedArticles.find((post) => post.featured);
  const showFeatured = featured && category === "All writing" && (!query || `${featured.title} ${featured.description} ${featured.tags.join(" ")}`.toLowerCase().includes(query.toLowerCase()));
  const posts = useMemo(() => publishedArticles
    .filter((post) => !showFeatured || post.slug !== featured?.slug)
    .filter((post) => category === "All writing" || post.category === category)
    .filter((post) => `${post.title} ${post.description} ${post.tags.join(" ")}`.toLowerCase().includes(query.toLowerCase()))
    .sort((a, b) => (b.publishedAt ?? "").localeCompare(a.publishedAt ?? "")), [category, query, featured?.slug, showFeatured]);

  return <main className="blog-shell pt-16">
    <section className="mx-auto max-w-5xl px-5 pb-10 pt-16 md:pb-16 md:pt-24">
      <Link to="/" className="blog-back"><ArrowLeft size={15}/> Back to portfolio</Link>
      <p className="section-label mt-10">Notes, essays &amp; experiments</p>
      <h1 className="mt-3 max-w-3xl font-serif text-6xl font-medium leading-[0.98] tracking-tight md:text-8xl">Writing &amp; <span className="text-primary">notes.</span></h1>
      <p className="mt-6 max-w-xl text-base leading-8 text-muted-foreground">A growing collection of essays, observations, experiments, and ideas. Some are finished; others are still taking shape.</p>
    </section>
    <div className="mx-auto max-w-5xl px-5">
      {showFeatured && <section className="blog-featured" aria-label="Featured writing"><p className="section-label mb-6">Featured essay</p><ArticleLink article={featured} featured/></section>}
      <section className="py-12 md:py-16" aria-labelledby="archive-heading">
        <div className="flex flex-col justify-between gap-5 border-b border-border pb-6 md:flex-row md:items-end">
          <div><p className="section-label">The archive</p><h2 id="archive-heading" className="mt-2 font-serif text-3xl md:text-4xl">All writing</h2></div>
          <label className="blog-search"><Search size={16} aria-hidden="true"/><span className="sr-only">Search articles</span><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search the archive" /></label>
        </div>
        <div className="flex flex-wrap gap-2 py-5" aria-label="Filter by category">
          {categories.map((item) => <button key={item} type="button" onClick={() => setCategory(item)} aria-pressed={category === item} className={`blog-filter ${category === item ? "is-active" : ""}`}>{item}</button>)}
        </div>
        {posts.length ? <div className="divide-y divide-border">{posts.map((article) => <article key={article.slug} className="blog-row"><ArticleLink article={article}/></article>)}</div> : <div className="blog-empty"><p className="font-serif text-2xl">Nothing here just yet.</p><p className="mt-2 text-sm text-muted-foreground">Try another search or category to find a note.</p><button onClick={() => { setQuery(""); setCategory("All writing"); }} className="mt-4 text-sm font-semibold text-primary underline underline-offset-4">Clear filters</button></div>}
      </section>
    </div>
  </main>;
}

export function ArticlePage() {
  const { slug } = useParams();
  const article = publishedArticles.find((post) => post.slug === slug);
  if (!article) return <main className="blog-shell min-h-screen px-5 pt-32"><div className="mx-auto max-w-3xl"><p className="section-label">404 · not found</p><h1 className="mt-4 font-serif text-5xl">This page is still unwritten.</h1><Link to="/blog/" className="blog-back mt-8"><ArrowLeft size={15}/> Return to the archive</Link></div></main>;
  const related = publishedArticles.filter((post) => post.slug !== article.slug && post.tags.some((tag) => article.tags.includes(tag))).slice(0, 2);
  return <main className="blog-shell min-h-screen pt-16">
    <article>
      <header className="mx-auto max-w-3xl px-5 pb-12 pt-14 md:pb-16 md:pt-20">
        <nav aria-label="Breadcrumb" className="blog-back"><Link to="/blog/">Writing</Link><span aria-hidden="true">/</span><span>{article.category}</span></nav>
        <p className="section-label mt-10">{article.category}</p>
        <h1 className="mt-4 font-serif text-5xl font-medium leading-[1.02] tracking-tight md:text-7xl">{article.title}</h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">{article.subtitle}</p>
        <div className="mt-7"><Meta article={article}/>{article.updatedAt && <p className="mt-2 text-xs text-muted-foreground">Updated <time dateTime={article.updatedAt}>{dateLabel(article.updatedAt)}</time></p>}</div>
        <div className="mt-8 flex flex-wrap gap-2">{article.tags.map((tag) => <span className="tag" key={tag}>{tag}</span>)}</div>
      </header>
      <div className="blog-prose mx-auto max-w-[42rem] px-5">
        {article.content.map((block, index) => block.type === "heading" ? <h2 key={index}>{block.text}</h2> : block.type === "quote" ? <blockquote key={index}>{block.text}</blockquote> : <p key={index}>{block.text}</p>)}
        <hr/><p className="text-sm text-muted-foreground">This is a placeholder entry. The full essay will appear here when it is ready.</p>
      </div>
    </article>
    <footer className="mx-auto max-w-3xl px-5 pb-20 pt-12">
      <div className="border-t border-border pt-7"><Link to="/blog/" className="blog-back"><ArrowLeft size={15}/> Back to all writing</Link></div>
      {related.length > 0 && <section className="mt-12" aria-labelledby="related-heading"><p className="section-label">Keep reading</p><h2 id="related-heading" className="mt-2 font-serif text-3xl">Related notes</h2><div className="mt-6 grid gap-7 sm:grid-cols-2">{related.map((post) => <ArticleLink key={post.slug} article={post}/>)}</div></section>}
    </footer>
  </main>;
}
