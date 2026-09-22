import { getTranslations } from "next-intl/server";
import { Section, SectionHeading } from "@/components/ui/section";
import { Link } from "@/i18n/navigation";

export default async function NotFound() {
  const t = await getTranslations("notFound");

  return (
    <Section>
      <SectionHeading
        as="h1"
        title={t("title")}
        description={t("description")}
      />
      <div className="mt-8 flex justify-center">
        <Link
          href="/"
          className="text-sm font-medium text-brand hover:underline"
        >
          {t("homeLink")}
        </Link>
      </div>
    </Section>
  );
}
