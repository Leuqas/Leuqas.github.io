import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { parse as parseYaml } from "yaml";
import { marked } from "marked";

const base = "https://leuqas.github.io";
const root = process.cwd();
const dist = resolve(root, "dist");
const template = await readFile(resolve(dist, "index.html"), "utf8");
const sourceDir = resolve(root, "src/content/articles");
const entries = await Promise.all((await readdir(sourceDir)).filter((name) => name.endsWith(".md")).map(async (name) => {
  const source = await readFile(resolve(sourceDir, name), "utf8");
  const match = source.match(/^---\s*\r?\n([\s\S]*?)\r?\n---\s*\r?\n?([\s\S]*)$/);
  if (!match) throw new Error(`${name} is missing YAML front matter`);
  const metadata = parseYaml(match[1]);
  return { ...metadata, content: match[2].trim(), contentHtml: marked.parse(match[2].trim(), { async: false }) };
}));
const published = entries.filter((entry) => entry.status === "published").sort((a, b) => (b.publishedAt ?? "").localeCompare(a.publishedAt ?? ""));

function escapeHtml(value = "") {
  return String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#39;");
}
function pageHtml({ title, description, url, type = "website", jsonLd, bodyMarkup = "" }) {
  let html = template
    .replace(/\s*<link rel="canonical" href="[^"]*" \/>/, "")
    .replace(/\s*<meta property="og:[^"]*" content="[^"]*" \/>/g, "")
    .replace(/\s*<meta name="twitter:[^"]*" content="[^"]*" \/>/g, "")
    .replace(/\s*<script type="application\/ld\+json">[\s\S]*?<\/script>/, "");
  const head = `\n    <link rel="canonical" href="${url}" />\n    <meta property="og:type" content="${type}" />\n    <meta property="og:title" content="${escapeHtml(title)}" />\n    <meta property="og:description" content="${escapeHtml(description)}" />\n    <meta property="og:url" content="${url}" />\n    <meta property="og:site_name" content="Leuqas Yabot" />\n    <meta name="twitter:card" content="summary" />\n    <meta name="twitter:title" content="${escapeHtml(title)}" />\n    <meta name="twitter:description" content="${escapeHtml(description)}" />\n    <script type="application/ld+json">${JSON.stringify(jsonLd).replaceAll("<", "\\u003c")}</script>`;
  html = html.replace(/<meta\s+name="description"[\s\S]*?\/>/, `<meta name="description" content="${escapeHtml(description)}" />`).replace("</head>", `${head}\n  </head>`).replace(/<title>[^<]*<\/title>/, `<title>${escapeHtml(title)}</title>`).replace(/<div id="root">[\s\S]*?<!-- \/static-home-shell -->\s*<\/div>/, `<div id="root">${bodyMarkup}</div>`);
  return html;
}
function readingTime(entry) {
  const words = entry.content.replace(/```[\s\S]*?```/g, " ").replace(/[#>*_`~\[\]()!-]/g, " ").trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 220));
}
const archiveUrl = `${base}/blog/`;
const archiveLd = { "@context": "https://schema.org", "@type": "CollectionPage", name: "Recent writing | Leuqas Yabot", description: "A growing collection of essays, observations, experiments, and ideas.", url: archiveUrl, isPartOf: { "@type": "WebSite", name: "Leuqas Yabot", url: `${base}/` }, mainEntity: { "@type": "ItemList", itemListElement: published.map((entry, index) => ({ "@type": "ListItem", position: index + 1, url: `${base}/blog/${entry.slug}/`, name: entry.title })) } };
await mkdir(resolve(dist, "blog"), { recursive: true });
const archiveMarkup = `<main><header><p>Notes, essays &amp; experiments</p><h1>Writing &amp; notes</h1><p>A growing collection of essays, observations, experiments, and ideas.</p></header><section><h2>Recent writing</h2><ul>${published.map((entry) => `<li><a href="/blog/${escapeHtml(entry.slug)}/">${escapeHtml(entry.title)}</a><p>${escapeHtml(entry.excerpt)}</p></li>`).join("")}</ul></section></main>`;
await writeFile(resolve(dist, "blog/index.html"), pageHtml({ title: "Writing & Notes | Leuqas Yabot", description: "A growing collection of personal essays, observations, experiments, and ideas by Leuqas Yabot.", url: archiveUrl, jsonLd: archiveLd, bodyMarkup: archiveMarkup }));

for (const entry of published) {
  const url = `${base}/blog/${entry.slug}/`;
  const jsonLd = { "@context": "https://schema.org", "@type": "BlogPosting", headline: entry.title, description: entry.description, url, mainEntityOfPage: url, author: { "@type": "Person", name: entry.author ?? "Leuqas Yabot" }, publisher: { "@type": "Person", name: entry.author ?? "Leuqas Yabot" }, ...(entry.category ? { articleSection: entry.category } : {}), ...(entry.tags?.length ? { keywords: entry.tags.join(", ") } : {}), timeRequired: `PT${readingTime(entry)}M`, ...(entry.publishedAt ? { datePublished: entry.publishedAt } : {}), ...(entry.updatedAt ? { dateModified: entry.updatedAt } : {}) };
  const pageDir = resolve(dist, "blog", entry.slug);
  await mkdir(pageDir, { recursive: true });
  const articleMarkup = `<main><nav aria-label="Breadcrumb"><a href="/blog/">Writing</a>${entry.category ? ` / ${escapeHtml(entry.category)}` : ""}</nav><article><header>${entry.category ? `<p>${escapeHtml(entry.category)}</p>` : ""}<h1>${escapeHtml(entry.title)}</h1>${entry.subtitle ? `<p>${escapeHtml(entry.subtitle)}</p>` : ""}${entry.author ? `<p>By ${escapeHtml(entry.author)}</p>` : ""}<p>${readingTime(entry)} min read</p></header>${entry.contentHtml}</article><a href="/blog/">Back to all writing</a></main>`;
  await writeFile(resolve(pageDir, "index.html"), pageHtml({ title: `${entry.title} | Leuqas Yabot`, description: entry.description, url, type: "article", jsonLd, bodyMarkup: articleMarkup }));
}

const urls = [`${base}/`, `${base}/photography/`, archiveUrl, ...published.map((entry) => `${base}/blog/${entry.slug}/`)];
const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((url) => `  <url><loc>${url}</loc></url>`).join("\n")}\n</urlset>\n`;
await writeFile(resolve(dist, "sitemap.xml"), xml);
await writeFile(resolve(dist, "robots.txt"), `User-agent: *\nAllow: /\nSitemap: ${base}/sitemap.xml\n`);
