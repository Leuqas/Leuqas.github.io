import entries from "./articles.json";

export type Article = {
  slug: string;
  title: string;
  description: string;
  excerpt: string;
  subtitle: string;
  category: string;
  tags: string[];
  publishedAt?: string;
  updatedAt?: string;
  status: "draft" | "published";
  featured?: boolean;
  content: { type: "paragraph" | "heading" | "quote"; text: string }[];
};

// Add new entries to articles.json. Dates remain unset until publication.
export const articles = entries as Article[];
export const publishedArticles = articles.filter((article) => article.status === "published");

export function readingTime(article: Article) {
  const words = article.content.map((block) => block.text).join(" ").trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 220));
}

export function articleUrl(slug: string) {
  return `/blog/${slug}/`;
}
