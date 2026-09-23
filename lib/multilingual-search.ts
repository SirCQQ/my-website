import { routing, type Locale } from "@/i18n/routing";
import { siteConfig } from "@/lib/site-config";
import { stripDiacritics } from "@/lib/utils";
import enMessages from "@/messages/en.json";
import roMessages from "@/messages/ro.json";

type Messages = typeof enMessages;

const ALL_MESSAGES: Record<Locale, Messages> = {
  en: enMessages,
  ro: roMessages,
};

/**
 * A translated string's value in every configured locale, e.g.
 * `keywordsFor("nav", "work")` -> ["Work", "Experiență"]. Used as cmdk
 * `keywords` so the command palette matches a query typed in any
 * supported language regardless of the site's current locale, and to
 * build the alias list the 404 terminal resolves typed page names against.
 */
export function keywordsFor<N extends keyof Messages>(
  namespace: N,
  key: keyof Messages[N]
): string[] {
  return routing.locales.map(
    (locale) => ALL_MESSAGES[locale][namespace][key] as string
  );
}

function normalize(value: string): string {
  return stripDiacritics(value.trim().toLowerCase());
}

/**
 * Resolves free-typed input (any configured language, "cd " prefix
 * optional) to a known nav route, or null if nothing matches — used by
 * the interactive 404 terminal.
 */
export function resolveNavQuery(query: string): string | null {
  const normalized = normalize(query)
    .replace(/^cd\s+/, "")
    .replace(/^[~/]+/, "")
    .replace(/\/+$/, "");

  if (normalized === "" || normalized === "~") return "/";

  for (const item of siteConfig.nav) {
    const aliases = [item.key, ...keywordsFor("nav", item.key)];
    if (aliases.some((alias) => normalize(alias) === normalized)) {
      return item.href;
    }
  }

  return null;
}
