import { getFormatter, getTranslations } from "next-intl/server";
import { Section, SectionHeading } from "@/components/ui/section";
import { getGithubActivity, type GithubActivityItem } from "@/lib/github";
import { siteConfig } from "@/lib/site-config";

function activityValues(item: GithubActivityItem) {
  return { repo: item.repo, count: item.commitCount ?? 1 };
}

export async function GithubActivitySection() {
  const [t, format, activity] = await Promise.all([
    getTranslations("github"),
    getFormatter(),
    getGithubActivity(),
  ]);

  if (activity.length === 0) return null;

  return (
    <Section id="activity">
      <SectionHeading
        eyebrow={t("eyebrow")}
        title={t("title")}
        description={t("description")}
      />
      <div className="mx-auto mt-12 max-w-2xl divide-y divide-border overflow-hidden rounded-lg border border-border">
        {activity.map((item) => (
          <a
            key={item.id}
            href={item.repoUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-between gap-4 px-5 py-4 text-sm transition-colors hover:bg-muted/50"
          >
            <span>{t(item.kind, activityValues(item))}</span>
            <span className="shrink-0 text-muted-foreground">
              {format.relativeTime(new Date(item.createdAt))}
            </span>
          </a>
        ))}
      </div>
      <div className="mt-6 text-center">
        <a
          href={siteConfig.links.github}
          target="_blank"
          rel="noreferrer"
          className="text-sm font-medium text-brand hover:underline"
        >
          {t("viewProfile")}
        </a>
      </div>
    </Section>
  );
}
