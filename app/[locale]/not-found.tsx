"use client";

import { useState, type KeyboardEvent } from "react";
import { useTranslations } from "next-intl";
import { Link, useRouter, usePathname } from "@/i18n/navigation";
import { Section } from "@/components/ui/section";
import { siteConfig } from "@/lib/site-config";
import { resolveNavQuery } from "@/lib/multilingual-search";

type HistoryEntry = { command: string; lines: string[]; tone: "error" | "info" };

const MAX_HISTORY = 8;

export default function NotFound() {
  const t = useTranslations("notFound");
  const tNav = useTranslations("nav");
  const pathname = usePathname();
  const router = useRouter();

  const [value, setValue] = useState("");
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  function easterEgg(command: string): string[] | null {
    const normalized = command.trim().toLowerCase();

    if (normalized === "help") {
      return [
        "available commands:",
        "  cd <page>   — jump to home, work, articles or contact (English or Română)",
        "  ls          — list pages",
        "  whoami",
      ];
    }
    if (normalized === "ls" || normalized === "ls -la" || normalized === "ls -l") {
      return siteConfig.nav.map((item) => `${tNav(item.key)}/`);
    }
    if (normalized === "whoami") {
      return [
        "a developer who ended up typing commands into a 404 page instead of just clicking a link",
      ];
    }
    if (normalized.startsWith("sudo")) {
      const user = siteConfig.email.split("@")[0];
      return [`${user} is not in the sudoers file. This incident will be reported.`];
    }
    if (normalized === "rm -rf /" || normalized === "rm -rf /*") {
      return ["nice try."];
    }

    return null;
  }

  function runCommand(raw: string) {
    const command = raw.trim();
    if (!command) return;

    const egg = easterEgg(command);
    if (egg) {
      setHistory((prev) =>
        [...prev, { command, lines: egg, tone: "info" as const }].slice(-MAX_HISTORY)
      );
      return;
    }

    const href = resolveNavQuery(command);
    if (href) {
      router.push(href);
      return;
    }

    const target = command.replace(/^cd\s+/i, "");
    setHistory((prev) =>
      [
        ...prev,
        {
          command,
          lines: [`zsh: no such file or directory: ${target}`],
          tone: "error" as const,
        },
      ].slice(-MAX_HISTORY)
    );
  }

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key !== "Enter") return;
    runCommand(value);
    setValue("");
  }

  return (
    <Section>
      <div
        className="mx-auto max-w-2xl overflow-hidden rounded-lg border border-border"
        onClick={(event) => {
          if (event.target instanceof HTMLElement && event.target.closest("a")) return;
          event.currentTarget.querySelector("input")?.focus();
        }}
      >
        <div className="flex items-center gap-1.5 border-b border-border bg-muted/50 px-4 py-2.5">
          <span className="size-2.5 rounded-full bg-red-500/70" />
          <span className="size-2.5 rounded-full bg-yellow-500/70" />
          <span className="size-2.5 rounded-full bg-green-500/70" />
          <span className="mx-auto text-xs text-muted-foreground">
            not-found — zsh
          </span>
        </div>
        <div className="px-5 py-6 text-sm leading-relaxed sm:px-8 sm:py-8 sm:text-base">
          <p className="text-muted-foreground">
            <span className="text-brand">$</span> cd {pathname}
          </p>
          <p className="mt-1 text-red-500 dark:text-red-400">
            zsh: no such file or directory: {pathname}
          </p>
          <p className="mt-6 text-muted-foreground">{t("hint")}</p>
          <p className="mt-2 text-muted-foreground">
            <span className="text-brand">$</span> ls ~
          </p>
          <div className="mt-2 flex flex-wrap gap-x-6 gap-y-2">
            {siteConfig.nav.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                className="font-medium text-brand hover:underline"
              >
                {tNav(item.key)}/
              </Link>
            ))}
          </div>

          {history.map((entry, index) => (
            <div key={index}>
              <p className="mt-4 text-muted-foreground">
                <span className="text-brand">$</span> {entry.command}
              </p>
              {entry.lines.map((line, lineIndex) => (
                <p
                  key={lineIndex}
                  className={
                    entry.tone === "error"
                      ? "text-red-500 dark:text-red-400"
                      : "text-muted-foreground"
                  }
                >
                  {line}
                </p>
              ))}
            </div>
          ))}

          <p className="mt-4 flex items-center gap-2 text-muted-foreground">
            <span className="text-brand">$</span>
            <input
              value={value}
              onChange={(event) => setValue(event.target.value)}
              onKeyDown={onKeyDown}
              autoFocus
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
              aria-label={t("inputLabel")}
              className="min-w-0 flex-1 bg-transparent text-foreground caret-brand outline-none"
            />
          </p>
        </div>
      </div>
    </Section>
  );
}
