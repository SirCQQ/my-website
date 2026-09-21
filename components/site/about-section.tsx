import { getTranslations } from "next-intl/server";
import { Section, SectionHeading } from "@/components/ui/section";
import { Badge } from "@/components/ui/badge";

export async function AboutSection({
  paragraphs,
  coreSkills,
}: {
  paragraphs: string[];
  coreSkills: string[];
}) {
  const t = await getTranslations("about");

  return (
    <Section id="about">
      <SectionHeading eyebrow={t("eyebrow")} title={t("title")} />
      <div className="mx-auto mt-10 max-w-2xl space-y-4 text-foreground/90">
        {paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
      <div className="mx-auto mt-8 max-w-2xl">
        <p className="text-sm font-medium text-muted-foreground">
          {t("skillsTitle")}
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {coreSkills.map((skill) => (
            <Badge key={skill} variant="outline">
              {skill}
            </Badge>
          ))}
        </div>
      </div>
    </Section>
  );
}
