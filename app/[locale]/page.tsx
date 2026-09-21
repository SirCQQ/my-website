import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Hero } from "@/components/site/hero";
import { AboutSection } from "@/components/site/about-section";
import { ProjectsSection } from "@/components/site/projects-section";
import { ContactSection } from "@/components/site/contact-section";
import { getCvContent } from "@/lib/content/cv";
import type { Locale } from "@/i18n/routing";
import { buildLanguageAlternates } from "@/lib/seo";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });

  return {
    title: t("title"),
    alternates: { languages: buildLanguageAlternates("") },
  };
}

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  setRequestLocale(locale);

  const cv = getCvContent(locale as Locale);

  return (
    <>
      <Hero summary={cv.summary} />
      <AboutSection paragraphs={cv.about.paragraphs} coreSkills={cv.coreSkills} />
      <ProjectsSection projects={cv.projects} />
      <ContactSection />
    </>
  );
}
