import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Typewriter } from "@/components/site/typewriter";
import { siteConfig } from "@/lib/site-config";

export function Hero({ summary }: { summary: string }) {
  const t = useTranslations("hero");
  const roles = t.raw("roles") as string[];

  return (
    <section className="py-28 sm:py-36">
      <Container className="flex flex-col items-start gap-6">
        <p className="text-sm font-medium tracking-wide text-muted-foreground uppercase">
          {t("greeting")}
        </p>
        <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-6xl">
          {siteConfig.name}
        </h1>
        <p className="text-2xl font-medium text-balance sm:text-3xl">
          <Typewriter words={roles} />
        </p>
        <p className="max-w-xl text-lg text-balance text-muted-foreground">
          {summary}
        </p>
        <div className="flex flex-wrap gap-3 pt-2">
          <Button asChild size="lg">
            <Link href="/#projects">{t("ctaProjects")}</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/#contact">{t("ctaContact")}</Link>
          </Button>
        </div>
      </Container>
    </section>
  );
}
