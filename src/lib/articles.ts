import { marked } from "marked";
import { parse as parseYaml } from "yaml";

export type Article = {
  slug: string;
  title: string;
  description: string;
  excerpt: string;
  subtitle?: string;
  author?: string;
  category?: string;
  tags?: string[];
  publishedAt?: string;
  updatedAt?: string;
  status: "draft" | "published";
  content: string;
  contentHtml: string;
};

const files = import.meta.glob<string>("@/content/articles/*.md", { eager: true, query: "?raw", import: "default" });

function parseArticle(source: string): Article {
  const match = source.match(/^---\s*\r?\n([\s\S]*?)\r?\n---\s*\r?\n?([\s\S]*)$/);
  if (!match) throw new Error("Article is missing YAML front matter.");
  const metadata = parseYaml(match[1]) as Omit<Article, "content" | "contentHtml">;
  const content = match[2].trim();
  return { ...metadata, content, contentHtml: marked.parse(content, { async: false }) as string };
}

export const articles = Object.values(files).map(parseArticle);
export const publishedArticles = articles
  .filter((article) => article.status === "published")
  .sort((a, b) => (b.publishedAt ?? "").localeCompare(a.publishedAt ?? ""));

export function readingTime(article: Article) {
  const words = article.content.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 220));
}

export function articleUrl(slug: string) {
  return `/blog/${slug}/`;
}
