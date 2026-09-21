import { getTranslations, setRequestLocale } from "next-intl/server";

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("hero");

  return (
    <div className="flex flex-1 items-center justify-center py-32">
      <p className="text-2xl font-medium">{t("greeting")}</p>
    </div>
  );
}
