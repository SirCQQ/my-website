import { routing, type Locale } from "@/i18n/routing";
import { siteConfig } from "@/lib/site-config";

export function buildLanguageAlternates(pathname: string): Record<Locale, string> {
  return Object.fromEntries(
    routing.locales.map((locale) => [
      locale,
      `${siteConfig.url}/${locale}${pathname}`,
    ])
  ) as Record<Locale, string>;
}
