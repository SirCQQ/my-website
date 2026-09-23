"use client";

import { useRef } from "react";
import { useInView } from "motion/react";
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
import { useMotionPreference } from "@/components/motion-provider";
import { useTypewriterOnce } from "@/hooks/use-typewriter-once";
import type { ArticleSummary } from "@/lib/content/articles";

export function ArticleCard({ article }: { article: ArticleSummary }) {
  const t = useTranslations("articles");
  const format = useFormatter();
  const { reduceMotion } = useMotionPreference();

  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  const title = useTypewriterOnce(article.title, {
    start: isInView,
    skip: reduceMotion,
  });
  const titleDone = title.length === article.title.length;
  const excerpt = useTypewriterOnce(article.excerpt, {
    start: isInView && titleDone,
    skip: reduceMotion,
    speed: 12,
  });

  return (
    <Card ref={ref}>
      <CardHeader>
        <CardTitle>
          <Link href={`/articles/${article.slug}`} className="hover:underline">
            {title}
            {isInView && !titleDone && !reduceMotion ? (
              <span
                aria-hidden
                className="ml-0.5 inline-block h-[1em] w-0.5 translate-y-[0.15em] animate-pulse bg-brand align-middle"
              />
            ) : null}
          </Link>
        </CardTitle>
        <CardDescription>
          {format.dateTime(new Date(article.date), { dateStyle: "long" })}
          {" · "}
          {t("readingTime", { minutes: article.readingMinutes })}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <p className="text-sm text-muted-foreground">
          {excerpt}
          {isInView &&
          titleDone &&
          excerpt.length < article.excerpt.length &&
          !reduceMotion ? (
            <span
              aria-hidden
              className="ml-0.5 inline-block h-[1em] w-0.5 translate-y-[0.15em] animate-pulse bg-brand align-middle"
            />
          ) : null}
        </p>
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
