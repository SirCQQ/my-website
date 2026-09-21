import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import readingTime from "reading-time";
import { z } from "zod";
import type { Locale } from "@/i18n/routing";

const frontmatterSchema = z.object({
  title: z.string(),
  date: z.string(),
  excerpt: z.string(),
  tags: z.array(z.string()).default([]),
});

export type ArticleSummary = {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  tags: string[];
  readingMinutes: number;
};

export type Article = ArticleSummary & {
  content: string;
};

function articlesDirectory(locale: Locale): string {
  return path.join(process.cwd(), "content", "articles", locale);
}

function readArticleFile(locale: Locale, slug: string): Article | null {
  const filePath = path.join(articlesDirectory(locale), `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(raw);
  const frontmatter = frontmatterSchema.parse(data);

  return {
    ...frontmatter,
    slug,
    readingMinutes: Math.max(1, Math.ceil(readingTime(content).minutes)),
    content,
  };
}

export function getAllArticleSlugs(locale: Locale): string[] {
  const dir = articlesDirectory(locale);
  if (!fs.existsSync(dir)) return [];

  return fs
    .readdirSync(dir)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => file.replace(/\.mdx$/, ""));
}

export function getAllArticles(locale: Locale): ArticleSummary[] {
  return getAllArticleSlugs(locale)
    .map((slug) => readArticleFile(locale, slug))
    .filter((article): article is Article => article !== null)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .map((article) => ({
      slug: article.slug,
      title: article.title,
      date: article.date,
      excerpt: article.excerpt,
      tags: article.tags,
      readingMinutes: article.readingMinutes,
    }));
}

export function getArticleBySlug(locale: Locale, slug: string): Article | null {
  return readArticleFile(locale, slug);
}
