import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getFormatter, getTranslations, setRequestLocale } from "next-intl/server";
import { Container } from "@/components/ui/container";
import { Link } from "@/i18n/navigation";
import { getAllArticleSlugs, getArticleBySlug } from "@/lib/content/articles";
import { routing, type Locale } from "@/i18n/routing";
import { siteConfig } from "@/lib/site-config";
import { buildSocialMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    getAllArticleSlugs(locale).map((slug) => ({ locale, slug }))
  );
}

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/articles/[slug]">): Promise<Metadata> {
  const { locale, slug } = await params;
  const article = getArticleBySlug(locale as Locale, slug);
  if (!article) return {};

  const availableLocales = routing.locales.filter(
    (loc) => getArticleBySlug(loc, slug) !== null
  );
  const languages: Record<string, string> = Object.fromEntries(
    availableLocales.map((loc) => [
      loc,
      `${siteConfig.url}/${loc}/articles/${slug}`,
    ])
  );
  const xDefaultLocale = availableLocales.includes(routing.defaultLocale)
    ? routing.defaultLocale
    : availableLocales[0];
  languages["x-default"] = `${siteConfig.url}/${xDefaultLocale}/articles/${slug}`;
  const social = buildSocialMetadata(locale as Locale, article.title, article.excerpt);

  return {
    title: article.title,
    description: article.excerpt,
    alternates: {
      canonical: `${siteConfig.url}/${locale}/articles/${slug}`,
      languages,
    },
    ...social,
    openGraph: {
      ...social.openGraph,
      type: "article",
      publishedTime: article.date,
      tags: article.tags,
    },
  };
}

export default async function ArticlePage({
  params,
}: PageProps<"/[locale]/articles/[slug]">) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const article = getArticleBySlug(locale as Locale, slug);
  if (!article) notFound();

  const t = await getTranslations("articles");
  const format = await getFormatter();

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt,
    datePublished: article.date,
    inLanguage: locale,
    keywords: article.tags.join(", "),
    url: `${siteConfig.url}/${locale}/articles/${slug}`,
    author: { "@type": "Person", name: siteConfig.name, url: siteConfig.url },
    publisher: { "@type": "Person", name: siteConfig.name },
  };

  return (
    <Container className="py-20 sm:py-28">
      <script
        type="application/ld+json"
        // JSON-LD content is our own MDX frontmatter, not user input, but the
        // replace still guards against "</script>" breaking out of the tag.
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <Link
        href="/articles"
        className="text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        ← {t("back")}
      </Link>
      <article className="prose prose-neutral mx-auto mt-8 max-w-2xl dark:prose-invert">
        <h1>{article.title}</h1>
        <p className="text-sm text-muted-foreground">
          {format.dateTime(new Date(article.date), { dateStyle: "long" })}
          {" · "}
          {t("readingTime", { minutes: article.readingMinutes })}
        </p>
        <MDXRemote source={article.content} />
      </article>
    </Container>
  );
}
