import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Section, SectionHeading } from "@/components/ui/section";
import { TimelineItem } from "@/components/site/timeline-item";
import { getCvContent, getYearsOfExperience } from "@/lib/content/cv";
import type { Locale } from "@/i18n/routing";
import { buildAlternates, buildSocialMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/work">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "work" });
  const description = t("description", { years: getYearsOfExperience() });

  return {
    title: t("title"),
    alternates: buildAlternates("/work", locale as Locale),
    ...buildSocialMetadata(locale as Locale, t("title"), description),
  };
}

export default async function WorkPage({ params }: PageProps<"/[locale]/work">) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("work");
  const cv = getCvContent(locale as Locale);

  return (
    <Section>
      <SectionHeading
        as="h1"
        eyebrow={t("eyebrow")}
        title={t("title")}
        description={t("description", { years: getYearsOfExperience() })}
      />
      <div className="mx-auto mt-16 max-w-2xl space-y-10">
        {cv.experience.map((experience, index) => (
          <TimelineItem
            key={`${experience.company}-${experience.period}`}
            experience={experience}
            index={index}
            isLast={index === cv.experience.length - 1}
          />
        ))}
      </div>
      <div className="mx-auto mt-16 max-w-2xl">
        <h3 className="text-lg font-semibold">{t("educationTitle")}</h3>
        <div className="mt-4 space-y-4">
          {cv.education.map((edu) => (
            <div key={`${edu.institution}-${edu.period}`}>
              <p className="font-medium">{edu.degree}</p>
              <p className="text-sm text-muted-foreground">
                {edu.institution} · {edu.location} · {edu.period}
              </p>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}
