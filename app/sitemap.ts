import type { MetadataRoute } from "next";
import { routing, type Locale } from "@/i18n/routing";
import { siteConfig } from "@/lib/site-config";
import { getAllArticles } from "@/lib/content/articles";

const STATIC_PATHS: {
  pathname: string;
  changeFrequency: NonNullable<
    MetadataRoute.Sitemap[number]["changeFrequency"]
  >;
  priority: number;
}[] = [
  { pathname: "", changeFrequency: "monthly", priority: 1 },
  { pathname: "/work", changeFrequency: "monthly", priority: 0.8 },
  { pathname: "/articles", changeFrequency: "weekly", priority: 0.7 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  for (const { pathname, changeFrequency, priority } of STATIC_PATHS) {
    const languages = Object.fromEntries(
      routing.locales.map((locale) => [
        locale,
        `${siteConfig.url}/${locale}${pathname}`,
      ])
    );
    for (const locale of routing.locales) {
      entries.push({
        url: `${siteConfig.url}/${locale}${pathname}`,
        lastModified: new Date(),
        changeFrequency,
        priority,
        alternates: { languages },
      });
    }
  }

  const articlesByLocale = Object.fromEntries(
    routing.locales.map((locale) => [locale, getAllArticles(locale)])
  ) as Record<Locale, ReturnType<typeof getAllArticles>>;

  const allSlugs = new Set(
    routing.locales.flatMap((locale) =>
      articlesByLocale[locale].map((article) => article.slug)
    )
  );

  for (const slug of allSlugs) {
    const availableLocales = routing.locales.filter((locale) =>
      articlesByLocale[locale].some((article) => article.slug === slug)
    );
    const languages = Object.fromEntries(
      availableLocales.map((locale) => [
        locale,
        `${siteConfig.url}/${locale}/articles/${slug}`,
      ])
    );

    for (const locale of availableLocales) {
      const article = articlesByLocale[locale].find((a) => a.slug === slug)!;
      entries.push({
        url: `${siteConfig.url}/${locale}/articles/${slug}`,
        lastModified: new Date(article.date),
        changeFrequency: "monthly",
        priority: 0.6,
        alternates: { languages },
      });
    }
  }

  return entries;
}
