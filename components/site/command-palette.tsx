"use client";

import { useEffect, useState } from "react";
import { defaultFilter } from "cmdk";
import { useLocale, useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import {
  Briefcase,
  FileText,
  Globe,
  House,
  Laptop,
  Mail,
  Moon,
  Newspaper,
  SquareTerminal,
  Sun,
  Zap,
  ZapOff,
} from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { useMotionPreference } from "@/components/motion-provider";
import { siteConfig } from "@/lib/site-config";
import { GithubIcon, LinkedinIcon } from "@/components/icons";
import type { ArticleSummary } from "@/lib/content/articles";
import { stripDiacritics } from "@/lib/utils";

function diacriticInsensitiveFilter(
  value: string,
  search: string,
  keywords?: string[],
) {
  return defaultFilter(
    stripDiacritics(value),
    stripDiacritics(search),
    keywords?.map(stripDiacritics),
  );
}

const NAV_ICONS = {
  home: House,
  work: Briefcase,
  articles: Newspaper,
  contact: Mail,
} as const;

const LOCALE_LABELS: Record<string, string> = {
  en: "English",
  ro: "Română",
};

export function CommandPalette({ articles }: { articles: ArticleSummary[] }) {
  const [open, setOpen] = useState(false);
  const t = useTranslations("commandPalette");
  const tNav = useTranslations("nav");
  const tTheme = useTranslations("theme");
  const tMotion = useTranslations("motion");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const { setTheme } = useTheme();
  const { reduceMotion, setReduceMotion } = useMotionPreference();

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((value) => !value);
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  function run(action: () => void) {
    setOpen(false);
    action();
  }

  return (
    <>
      <Button
        variant="outline"
        onClick={() => setOpen(true)}
        className="hidden h-8 w-56 items-center justify-between px-2.5 text-muted-foreground sm:inline-flex"
      >
        <span className="flex items-center gap-1.5 truncate">
          <SquareTerminal className="size-4 shrink-0" />
          <span className="truncate">{t("triggerLabel")}</span>
        </span>
        <kbd className="shrink-0 rounded border border-border bg-muted px-1.5 py-0.5 text-xs">
          ⌘K
        </kbd>
      </Button>
      <Button
        variant="ghost"
        size="icon"
        aria-label={t("triggerLabel")}
        onClick={() => setOpen(true)}
        className="text-muted-foreground hover:text-foreground sm:hidden"
      >
        <SquareTerminal className="size-4" />
      </Button>

      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        title={t("triggerLabel")}
        description={t("description")}
        filter={diacriticInsensitiveFilter}
      >
        <CommandInput placeholder={t("placeholder")} />
        <CommandList>
          <CommandEmpty>{t("empty")}</CommandEmpty>
          <CommandGroup heading={t("groupNavigation")}>
            {siteConfig.nav.map((item) => {
              const Icon = NAV_ICONS[item.key];
              const label = tNav(item.key);
              return (
                <CommandItem
                  key={item.key}
                  value={label}
                  onSelect={() => run(() => router.push(item.href))}
                >
                  <Icon />
                  <span>{label}</span>
                </CommandItem>
              );
            })}
          </CommandGroup>
          {articles.length > 0 ? (
            <>
              <CommandSeparator />
              <CommandGroup heading={t("groupArticles")}>
                {articles.map((article) => (
                  <CommandItem
                    key={article.slug}
                    value={article.title}
                    keywords={article.tags}
                    onSelect={() =>
                      run(() => router.push(`/articles/${article.slug}`))
                    }
                  >
                    <FileText />
                    <span>{article.title}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </>
          ) : null}
          <CommandSeparator />
          <CommandGroup heading={t("groupActions")}>
            <CommandItem
              value={t("setTheme", { theme: tTheme("light") })}
              onSelect={() => run(() => setTheme("light"))}
            >
              <Sun />
              <span>{t("setTheme", { theme: tTheme("light") })}</span>
            </CommandItem>
            <CommandItem
              value={t("setTheme", { theme: tTheme("dark") })}
              onSelect={() => run(() => setTheme("dark"))}
            >
              <Moon />
              <span>{t("setTheme", { theme: tTheme("dark") })}</span>
            </CommandItem>
            <CommandItem
              value={t("setTheme", { theme: tTheme("system") })}
              onSelect={() => run(() => setTheme("system"))}
            >
              <Laptop />
              <span>{t("setTheme", { theme: tTheme("system") })}</span>
            </CommandItem>
            <CommandItem
              value={reduceMotion ? tMotion("enable") : tMotion("disable")}
              onSelect={() => run(() => setReduceMotion(!reduceMotion))}
            >
              {reduceMotion ? <Zap /> : <ZapOff />}
              <span>
                {reduceMotion ? tMotion("enable") : tMotion("disable")}
              </span>
            </CommandItem>
            {routing.locales
              .filter((loc) => loc !== locale)
              .map((loc) => (
                <CommandItem
                  key={loc}
                  value={t("switchLanguage", { language: LOCALE_LABELS[loc] })}
                  onSelect={() =>
                    run(() => router.replace(pathname, { locale: loc }))
                  }
                >
                  <Globe />
                  <span>
                    {t("switchLanguage", { language: LOCALE_LABELS[loc] })}
                  </span>
                </CommandItem>
              ))}
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading={t("groupLinks")}>
            {siteConfig.links.github ? (
              <CommandItem
                value="GitHub"
                onSelect={() =>
                  run(() =>
                    window.open(
                      siteConfig.links.github,
                      "_blank",
                      "noopener,noreferrer",
                    ),
                  )
                }
              >
                <GithubIcon className="size-4" />
                <span>GitHub</span>
              </CommandItem>
            ) : null}
            <CommandItem
              value="LinkedIn"
              onSelect={() =>
                run(() =>
                  window.open(
                    siteConfig.links.linkedin,
                    "_blank",
                    "noopener,noreferrer",
                  ),
                )
              }
            >
              <LinkedinIcon className="size-4" />
              <span>LinkedIn</span>
            </CommandItem>
            <CommandItem
              value={t("sendEmail")}
              onSelect={() =>
                run(() => {
                  window.location.href = `mailto:${siteConfig.email}`;
                })
              }
            >
              <Mail />
              <span>{t("sendEmail")}</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
