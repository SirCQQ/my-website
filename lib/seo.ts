import type { Metadata } from "next";
import { routing, type Locale } from "@/i18n/routing";
import { siteConfig } from "@/lib/site-config";

export function buildLanguageAlternates(
  pathname: string
): Record<Locale, string> {
  return Object.fromEntries(
    routing.locales.map((locale) => [
      locale,
      `${siteConfig.url}/${locale}${pathname}`,
    ])
  ) as Record<Locale, string>;
}

/** Canonical + hreflang alternates (including x-default) for a page that
 * exists in every locale. */
export function buildAlternates(
  pathname: string,
  locale: Locale
): Metadata["alternates"] {
  return {
    canonical: `${siteConfig.url}/${locale}${pathname}`,
    languages: {
      ...buildLanguageAlternates(pathname),
      "x-default": `${siteConfig.url}/${routing.defaultLocale}${pathname}`,
    },
  };
}

const OG_LOCALES: Record<Locale, string> = {
  en: "en_US",
  ro: "ro_RO",
};

/** Shared Open Graph + Twitter Card fields. The actual image is supplied
 * automatically by app/[locale]/opengraph-image.tsx for every page in the
 * locale segment, so callers only need pathname/title/description here. */
export function buildSocialMetadata(
  locale: Locale,
  pathname: string,
  title: string,
  description: string
): Pick<Metadata, "openGraph" | "twitter"> {
  return {
    openGraph: {
      title,
      description,
      url: `${siteConfig.url}/${locale}${pathname}`,
      siteName: siteConfig.name,
      locale: OG_LOCALES[locale],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}
