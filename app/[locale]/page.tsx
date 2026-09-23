import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Hero } from "@/components/site/hero";
import { AboutSection } from "@/components/site/about-section";
import { ProjectsSection } from "@/components/site/projects-section";
import { GithubActivitySection } from "@/components/site/github-activity-section";
import { ContactSection } from "@/components/site/contact-section";
import { getCvContent } from "@/lib/content/cv";
import type { Locale } from "@/i18n/routing";
import { buildAlternates, buildSocialMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site-config";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });

  return {
    title: t("title"),
    alternates: buildAlternates("", locale as Locale),
    ...buildSocialMetadata(locale as Locale, "", t("title"), t("description")),
  };
}

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  setRequestLocale(locale);

  const cv = getCvContent(locale as Locale);

  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: siteConfig.name,
    url: siteConfig.url,
    jobTitle: "Full-Stack Developer",
    description: cv.summary,
    address: { "@type": "PostalAddress", addressLocality: siteConfig.location },
    email: `mailto:${siteConfig.email}`,
    sameAs: [siteConfig.links.github, siteConfig.links.linkedin].filter(Boolean),
    knowsAbout: cv.coreSkills,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(personJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <Hero summary={cv.summary} />
      <AboutSection paragraphs={cv.about.paragraphs} coreSkills={cv.coreSkills} />
      <ProjectsSection projects={cv.projects} />
      <GithubActivitySection />
      <ContactSection />
    </>
  );
}
