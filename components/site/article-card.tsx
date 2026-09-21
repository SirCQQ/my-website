import { useFormatter, useTranslations } from "next-intl";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "@/i18n/navigation";
import type { ArticleSummary } from "@/lib/content/articles";

export function ArticleCard({ article }: { article: ArticleSummary }) {
  const t = useTranslations("articles");
  const format = useFormatter();

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <Link href={`/articles/${article.slug}`} className="hover:underline">
            {article.title}
          </Link>
        </CardTitle>
        <CardDescription>
          {format.dateTime(new Date(article.date), { dateStyle: "long" })}
          {" · "}
          {t("readingTime", { minutes: article.readingMinutes })}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <p className="text-sm text-muted-foreground">{article.excerpt}</p>
        <div className="flex flex-wrap gap-1.5">
          {article.tags.map((tag) => (
            <Badge key={tag} variant="outline">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Link
          href={`/articles/${article.slug}`}
          className="text-sm font-medium text-brand hover:underline"
        >
          {t("readMore")}
        </Link>
      </CardFooter>
    </Card>
  );
}
