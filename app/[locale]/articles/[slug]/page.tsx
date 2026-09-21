import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getFormatter, getTranslations, setRequestLocale } from "next-intl/server";
import { Container } from "@/components/ui/container";
import { Link } from "@/i18n/navigation";
import { getAllArticleSlugs, getArticleBySlug } from "@/lib/content/articles";
import { routing, type Locale } from "@/i18n/routing";

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    getAllArticleSlugs(locale).map((slug) => ({ locale, slug }))
  );
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

  return (
    <Container className="py-20 sm:py-28">
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
