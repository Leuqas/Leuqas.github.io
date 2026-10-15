import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { articleUrl, publishedArticles, readingTime, type Article } from "@/lib/articles";

function dateLabel(date?: string) {
  return date ? new Intl.DateTimeFormat("en", { dateStyle: "long", timeZone: "UTC" }).format(new Date(`${date}T00:00:00Z`)) : null;
}

function Meta({ article }: { article: Article }) {
  return <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
    {dateLabel(article.publishedAt) && <time dateTime={article.publishedAt}>{dateLabel(article.publishedAt)}</time>}
    {dateLabel(article.publishedAt) && <span aria-hidden="true">·</span>}
    <span>{readingTime(article)} min read</span>{article.category && <><span aria-hidden="true">·</span><span>{article.category}</span></>}
  </div>;
}

function ArticleLink({ article }: { article: Article }) {
  return <Link to={articleUrl(article.slug)} className="group block rounded-lg border border-border bg-card p-5 transition-colors hover:border-primary/30 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4 md:p-6">
    <Meta article={article} />
    <h2 className="mt-3 font-serif text-2xl font-medium leading-tight tracking-tight group-hover:text-primary md:text-3xl">{article.title}<ArrowUpRight aria-hidden="true" className="ml-2 inline h-5 w-5 align-baseline opacity-0 transition group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:opacity-100" /></h2>
    <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">{article.excerpt}</p>
    <span className="mt-4 inline-block text-xs font-bold uppercase tracking-[0.18em] text-primary">Read essay <span aria-hidden="true">→</span></span>
  </Link>;
}

export function BlogPage() {
  return <main className="blog-shell pt-16">
    <section className="mx-auto max-w-5xl px-5 pb-10 pt-16 md:pb-16 md:pt-24">
      <Link to="/" className="blog-back"><ArrowLeft size={15}/> Back to portfolio</Link>
      <p className="section-label mt-10">Notes, essays &amp; experiments</p>
      <h1 className="mt-3 max-w-3xl font-serif text-6xl font-medium leading-[0.98] tracking-tight md:text-8xl">Writing &amp; <span className="text-primary">notes.</span></h1>
      <p className="mt-6 max-w-xl text-base leading-8 text-muted-foreground">A growing collection of essays, observations, experiments, and ideas. Some are finished; others are still taking shape.</p>
    </section>
    <div className="mx-auto max-w-5xl px-5">
      <section className="py-12 md:py-16" aria-labelledby="recent-writing-heading">
        <div className="mb-6 border-b border-border pb-4"><p className="section-label">Recent writing</p><h2 id="recent-writing-heading" className="sr-only">Recent writing</h2></div>
        <div className="grid gap-4">{publishedArticles.map((article) => <ArticleLink key={article.slug} article={article}/>)}</div>
      </section>
    </div>
  </main>;
}

export function ArticlePage() {
  const { slug } = useParams();
  const article = publishedArticles.find((post) => post.slug === slug);
  if (!article) return <main className="blog-shell min-h-screen px-5 pt-32"><div className="mx-auto max-w-3xl"><p className="section-label">404 · not found</p><h1 className="mt-4 font-serif text-5xl">This page is still unwritten.</h1><Link to="/blog/" className="blog-back mt-8"><ArrowLeft size={15}/> Return to recent writing</Link></div></main>;
  const related = publishedArticles.filter((post) => post.slug !== article.slug && (post.tags ?? []).some((tag) => (article.tags ?? []).includes(tag))).slice(0, 2);
  return <main className="blog-shell min-h-screen pt-16">
    <article>
      <header className="mx-auto max-w-3xl px-5 pb-12 pt-14 md:pb-16 md:pt-20">
        <nav aria-label="Breadcrumb" className="blog-back"><Link to="/blog/">Writing</Link>{article.category && <><span aria-hidden="true">/</span><span>{article.category}</span></>}</nav>
        {article.category && <p className="section-label mt-10">{article.category}</p>}
        <h1 className="mt-4 font-serif text-5xl font-medium leading-[1.02] tracking-tight md:text-7xl">{article.title}</h1>
        {article.subtitle && <p className="mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">{article.subtitle}</p>}
        <div className="mt-7"><Meta article={article}/>{article.updatedAt && <p className="mt-2 text-xs text-muted-foreground">Updated <time dateTime={article.updatedAt}>{dateLabel(article.updatedAt)}</time></p>}</div>
        {article.tags && article.tags.length > 0 && <div className="mt-8 flex flex-wrap gap-2">{article.tags.map((tag) => <span className="tag" key={tag}>{tag}</span>)}</div>}
      </header>
      <div className="blog-prose mx-auto max-w-[56rem] px-6 sm:px-5">
        <div dangerouslySetInnerHTML={{ __html: article.contentHtml }} />
      </div>
    </article>
    <footer className="mx-auto max-w-3xl px-5 pb-20 pt-12">
      <div className="border-t border-border pt-7"><Link to="/blog/" className="blog-back"><ArrowLeft size={15}/> Back to all writing</Link></div>
      {related.length > 0 && <section className="mt-12" aria-labelledby="related-heading"><p className="section-label">Keep reading</p><h2 id="related-heading" className="mt-2 font-serif text-3xl">Related notes</h2><div className="mt-6 grid gap-7 sm:grid-cols-2">{related.map((post) => <ArticleLink key={post.slug} article={post}/>)}</div></section>}
    </footer>
  </main>;
}
