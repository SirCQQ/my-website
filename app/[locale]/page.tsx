import { setRequestLocale } from "next-intl/server";
import { Hero } from "@/components/site/hero";
import { getCvContent } from "@/lib/content/cv";
import type { Locale } from "@/i18n/routing";

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  setRequestLocale(locale);

  const cv = getCvContent(locale as Locale);

  return (
    <>
      <Hero summary={cv.summary} />
    </>
  );
}
