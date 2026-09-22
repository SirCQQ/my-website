import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Section, SectionHeading } from "@/components/ui/section";
import { ArticleCard } from "@/components/site/article-card";
import { getAllArticles } from "@/lib/content/articles";
import type { Locale } from "@/i18n/routing";
import { buildLanguageAlternates } from "@/lib/seo";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/articles">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "articles" });

  return {
    title: t("title"),
    alternates: { languages: buildLanguageAlternates("/articles") },
  };
}

export default async function ArticlesPage({
  params,
}: PageProps<"/[locale]/articles">) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("articles");
  const articles = getAllArticles(locale as Locale);

  return (
    <Section>
      <SectionHeading
        as="h1"
        eyebrow={t("eyebrow")}
        title={t("title")}
        description={t("description")}
      />
      {articles.length === 0 ? (
        <p className="mx-auto mt-12 max-w-2xl text-center text-muted-foreground">
          {t("empty")}
        </p>
      ) : (
        <div className="mx-auto mt-12 grid max-w-4xl gap-6 sm:grid-cols-2">
          {articles.map((article) => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </div>
      )}
    </Section>
  );
}
