# Personal Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the bilingual (EN/RO) personal website — homepage (hero/typewriter, about, projects, contact), `/work` (CV timeline), and `/articles` (static MDX) — on top of the existing Next.js 16 + shadcn/ui scaffold.

**Architecture:** App Router routes move under `app/[locale]/`, driven by `next-intl` (prefix-always routing, `proxy.ts`). A two-layer component system — existing shadcn primitives plus new `components/site/*` compositions — reads only semantic color tokens, so it stays theme-agnostic. CV/project content lives in a typed, per-locale data module (`lib/content/cv.ts`); articles are filesystem MDX per locale under `content/articles/<locale>/`.

**Tech Stack:** Next.js 16 (App Router), React 19, TypeScript, Tailwind v4, shadcn/ui, `next-intl` (new), `next-themes`, `motion`, `react-hook-form` + `zod` + `@hookform/resolvers`, `gray-matter` + `next-mdx-remote` + `reading-time`, `sonner`, `lucide-react`.

**Spec:** `docs/superpowers/specs/2026-09-21-personal-website-design.md`

## Global Constraints

- Next.js 16 renamed `middleware.ts` → `proxy.ts` (function named/exported `proxy` or default export). This project uses `proxy.ts`, never `middleware.ts` — confirmed against `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/proxy.md`.
- `params` (and `searchParams`) in layouts/pages are `Promise`s — always `await params`. Use the globally-available `PageProps<'/route'>` / `LayoutProps<'/route'>` typed helpers (Next.js generates these; no import needed) instead of hand-typing `{ params: Promise<...> }`.
- Locale routing: prefix always shown (`/en`, `/ro`), default locale `en`, via `next-intl`'s `defineRouting`/`createMiddleware`/`createNavigation`. Locale-aware `Link`/`useRouter`/`usePathname` come from `i18n/navigation.ts`, never `next/link` or `next/navigation`, inside anything under `app/[locale]/`.
- Do **not** enable next-intl's strict typed-messages augmentation (`declare module 'next-intl' {...}`). Keep `t(key)` accepting plain `string` — several call sites (e.g. the theme toggle) build the key dynamically from data.
- Every component under `components/ui/*` and `components/site/*` reads colors only via semantic Tailwind tokens (`bg-background`, `text-brand`, `text-muted-foreground`, ...), never raw colors — this is what keeps the extensible-theme mechanism (documented in `app/globals.css`) working without touching components.
- No automated test framework exists and none is introduced (per spec §12, §10 — YAGNI). Each task's verification step is `yarn lint`, `yarn build` (for anything touching routes/pages — it statically generates both locales and exercises `generateStaticParams`), and a manual dev-server check at the URLs listed in that task.
- Package manager is Yarn (`packageManager: yarn@1.22.22` in `package.json`) — use `yarn add` / `yarn <script>`, not `npm`.
- `next-intl` isn't installed yet, so its exact-version API can't be checked against local docs before Task 1 Step 1. The APIs used throughout this plan (`defineRouting`, `createNavigation`, `createMiddleware`, `hasLocale`, `getRequestConfig`, `NextIntlClientProvider`, `useTranslations`/`getTranslations`, `useFormatter`/`getFormatter`, `useLocale`, `t.raw()`) are stable, long-standing next-intl APIs. If any of them fail to compile after install, check `node_modules/next-intl/README.md` (or its `dist/types`) for the installed version before guessing.

---

## File Structure

```
proxy.ts                                  new — next-intl locale detection/redirect
i18n/routing.ts                           new — locales, default locale, prefix strategy
i18n/navigation.ts                        new — locale-aware Link/useRouter/usePathname
i18n/request.ts                           new — per-request message loading
messages/en.json                          new — all UI copy, English
messages/ro.json                          new — all UI copy, Romanian
next.config.ts                            modify — wrap with next-intl plugin
app/layout.tsx                            delete — replaced by app/[locale]/layout.tsx
app/page.tsx                              delete — replaced by app/[locale]/page.tsx
app/[locale]/layout.tsx                   new — root layout: html/body, fonts, providers, chrome
app/[locale]/page.tsx                     new — homepage, built incrementally (Tasks 1, 4-7)
app/[locale]/work/page.tsx                new — CV timeline
app/[locale]/articles/page.tsx            new — article listing
app/[locale]/articles/[slug]/page.tsx     new — article detail (MDX)
lib/site-config.ts                        modify — drop text content, keep identity/links/nav keys
lib/theme-config.ts                       modify — drop hardcoded labels (now translated)
lib/content/cv.ts                         new — types + getCvContent(locale)
lib/content/cv.en.ts                      new — English CV/about/projects content
lib/content/cv.ro.ts                      new — Romanian translation of the above
lib/content/articles.ts                   new — MDX loader (list/get/slugs)
lib/seo.ts                                new — alternates.languages helper
hooks/use-typewriter.ts                   new — typewriter animation hook
components/theme-toggle.tsx               modify — localized labels
components/site/site-header.tsx           new
components/site/site-footer.tsx           new
components/site/locale-switcher.tsx       new
components/site/mobile-nav.tsx            new
components/site/typewriter.tsx            new
components/site/hero.tsx                  new
components/site/about-section.tsx         new
components/site/project-card.tsx          new
components/site/projects-section.tsx      new
components/site/contact-form.tsx          new
components/site/contact-section.tsx       new
components/site/timeline-item.tsx         new
components/site/article-card.tsx          new
content/articles/en/hello-world.mdx       new — example article
content/articles/ro/hello-world.mdx       new — same article, Romanian
```

---

### Task 1: next-intl foundation & route migration

**Files:**
- Create: `i18n/routing.ts`
- Create: `i18n/navigation.ts`
- Create: `i18n/request.ts`
- Create: `proxy.ts`
- Create: `messages/en.json`
- Create: `messages/ro.json`
- Modify: `next.config.ts`
- Delete: `app/layout.tsx`, `app/page.tsx`
- Create: `app/[locale]/layout.tsx`
- Create: `app/[locale]/page.tsx`

**Interfaces:**
- Produces: `routing: ReturnType<typeof defineRouting>` and `type Locale = (typeof routing.locales)[number]` from `i18n/routing.ts` — every later task imports `Locale` from here. `{ Link, redirect, usePathname, useRouter, getPathname }` from `i18n/navigation.ts` — every later task uses `Link`/`usePathname`/`useRouter` from here instead of `next/link` / `next/navigation`.
- Produces: `messages/en.json` and `messages/ro.json` define the full message contract used by every later task (namespaces: `nav`, `theme`, `localeSwitcher`, `hero`, `about`, `projects`, `work`, `articles`, `contact`, `footer`, `meta`). Later tasks only read keys from these files; they don't add new top-level namespaces.

- [ ] **Step 1: Install next-intl**

Run: `yarn add next-intl`

- [ ] **Step 2: Create `i18n/routing.ts`**

```ts
import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "ro"],
  defaultLocale: "en",
  localePrefix: "always",
});

export type Locale = (typeof routing.locales)[number];
```

- [ ] **Step 3: Create `i18n/navigation.ts`**

```ts
import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
```

- [ ] **Step 4: Create `i18n/request.ts`**

```ts
import { hasLocale } from "next-intl";
import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
    // Fixed to avoid UTC-midnight date-only strings (e.g. article dates)
    // rolling back a day when formatted on a machine whose local timezone
    // is behind UTC.
    timeZone: "Europe/Bucharest",
  };
});
```

- [ ] **Step 5: Create `proxy.ts`** (Next.js 16 renamed `middleware.ts` → `proxy.ts` — see Global Constraints)

```ts
import createMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";

export default createMiddleware(routing);

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
```

- [ ] **Step 6: Update `next.config.ts`**

```ts
import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  /* config options here */
};

export default withNextIntl(nextConfig);
```

- [ ] **Step 7: Create `messages/en.json`**

```json
{
  "meta": {
    "title": "Cristian Gatu — Full-Stack Developer",
    "description": "Senior Full-Stack Engineer building scalable, API-driven systems across fintech, supply chain, and publishing. React, Next.js, Node.js, GraphQL, PostgreSQL."
  },
  "nav": {
    "home": "Home",
    "work": "Work",
    "articles": "Articles",
    "contact": "Contact",
    "menu": "Menu"
  },
  "theme": {
    "light": "Light",
    "dark": "Dark",
    "system": "System",
    "toggle": "Toggle theme"
  },
  "localeSwitcher": {
    "label": "Change language"
  },
  "hero": {
    "greeting": "Hi, I'm",
    "roles": ["front-end developer", "back-end developer", "full-stack developer"],
    "ctaProjects": "View projects",
    "ctaContact": "Contact me"
  },
  "about": {
    "eyebrow": "About",
    "title": "A bit about me",
    "skillsTitle": "Core skills"
  },
  "projects": {
    "eyebrow": "Selected work",
    "title": "Projects",
    "description": "A few things I've built or maintained along the way.",
    "viewProject": "View project"
  },
  "work": {
    "eyebrow": "Career",
    "title": "Work experience",
    "description": "Six-plus years building and scaling web applications across fintech, supply chain, and digital publishing.",
    "educationTitle": "Education"
  },
  "articles": {
    "eyebrow": "Writing",
    "title": "Articles",
    "description": "Notes and write-ups on things I've learned building software.",
    "empty": "No articles published yet — check back soon.",
    "readMore": "Read article",
    "back": "Back to articles",
    "readingTime": "{minutes, plural, one {# min read} other {# min read}}"
  },
  "contact": {
    "eyebrow": "Get in touch",
    "title": "Contact",
    "description": "Have a project in mind or just want to say hi? Send me a message.",
    "nameLabel": "Name",
    "nameError": "Please enter at least 2 characters.",
    "emailLabel": "Email",
    "emailError": "Please enter a valid email address.",
    "messageLabel": "Message",
    "messageError": "Please enter at least 10 characters.",
    "send": "Send message",
    "sending": "Sending...",
    "successTitle": "Message sent",
    "successDescription": "Thanks for reaching out — I'll get back to you soon."
  },
  "footer": {
    "rights": "All rights reserved."
  }
}
```

- [ ] **Step 8: Create `messages/ro.json`**

```json
{
  "meta": {
    "title": "Cristian Gatu — Dezvoltator Full-Stack",
    "description": "Inginer Full-Stack Senior care construiește sisteme scalabile, bazate pe API, în fintech, supply chain și publicare digitală. React, Next.js, Node.js, GraphQL, PostgreSQL."
  },
  "nav": {
    "home": "Acasă",
    "work": "Experiență",
    "articles": "Articole",
    "contact": "Contact",
    "menu": "Meniu"
  },
  "theme": {
    "light": "Luminos",
    "dark": "Întunecat",
    "system": "Sistem",
    "toggle": "Schimbă tema"
  },
  "localeSwitcher": {
    "label": "Schimbă limba"
  },
  "hero": {
    "greeting": "Salut, sunt",
    "roles": ["dezvoltator front-end", "dezvoltator back-end", "dezvoltator full-stack"],
    "ctaProjects": "Vezi proiectele",
    "ctaContact": "Contactează-mă"
  },
  "about": {
    "eyebrow": "Despre mine",
    "title": "Câteva lucruri despre mine",
    "skillsTitle": "Competențe cheie"
  },
  "projects": {
    "eyebrow": "Proiecte selectate",
    "title": "Proiecte",
    "description": "Câteva lucruri la care am lucrat sau pe care le întrețin.",
    "viewProject": "Vezi proiectul"
  },
  "work": {
    "eyebrow": "Carieră",
    "title": "Experiență profesională",
    "description": "Peste șase ani de experiență în construirea și scalarea aplicațiilor web în fintech, supply chain și publicare digitală.",
    "educationTitle": "Educație"
  },
  "articles": {
    "eyebrow": "Scriu despre",
    "title": "Articole",
    "description": "Notițe și articole despre lucruri pe care le-am învățat construind software.",
    "empty": "Niciun articol publicat încă — revino în curând.",
    "readMore": "Citește articolul",
    "back": "Înapoi la articole",
    "readingTime": "{minutes, plural, one {# minut de citit} few {# minute de citit} other {# de minute de citit}}"
  },
  "contact": {
    "eyebrow": "Hai să vorbim",
    "title": "Contact",
    "description": "Ai un proiect în minte sau vrei doar să spui salut? Trimite-mi un mesaj.",
    "nameLabel": "Nume",
    "nameError": "Te rog introdu cel puțin 2 caractere.",
    "emailLabel": "Email",
    "emailError": "Te rog introdu o adresă de email validă.",
    "messageLabel": "Mesaj",
    "messageError": "Te rog introdu cel puțin 10 caractere.",
    "send": "Trimite mesajul",
    "sending": "Se trimite...",
    "successTitle": "Mesaj trimis",
    "successDescription": "Mulțumesc că ai scris — revin cu un răspuns cât de curând."
  },
  "footer": {
    "rights": "Toate drepturile rezervate."
  }
}
```

- [ ] **Step 9: Delete `app/layout.tsx` and `app/page.tsx`**

Run: `rm app/layout.tsx app/page.tsx`

- [ ] **Step 10: Create `app/[locale]/layout.tsx`**

```tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { siteConfig } from "@/lib/site-config";
import "../globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: siteConfig.title,
  description: siteConfig.description,
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function RootLayout({
  children,
  params,
}: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  return (
    <html
      lang={locale}
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <NextIntlClientProvider>
          <ThemeProvider>
            <main className="flex flex-1 flex-col">{children}</main>
            <Toaster />
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
```

- [ ] **Step 11: Create `app/[locale]/page.tsx`** (minimal placeholder — replaced in Task 4)

```tsx
import { getTranslations } from "next-intl/server";

export default async function HomePage() {
  const t = await getTranslations("hero");

  return (
    <div className="flex flex-1 items-center justify-center py-32">
      <p className="text-2xl font-medium">{t("greeting")}</p>
    </div>
  );
}
```

- [ ] **Step 12: Verify**

Run: `yarn lint`
Expected: no errors.

Run: `yarn build`
Expected: build succeeds; output lists `/en` and `/ro` as static routes.

Run: `yarn dev`, then open `http://localhost:3000/` in a browser.
Expected: redirects to `/en` and shows "Hi, I'm". Open `http://localhost:3000/ro` — shows "Salut, sunt".

- [ ] **Step 13: Commit**

```bash
git add i18n messages proxy.ts next.config.ts app/[locale] package.json yarn.lock
git add -u app/layout.tsx app/page.tsx
git commit -m "Add next-intl foundation and migrate routes under [locale]"
```

---

### Task 2: Site chrome — header, footer, locale switcher

**Files:**
- Modify: `lib/site-config.ts`
- Modify: `lib/theme-config.ts`
- Modify: `components/theme-toggle.tsx`
- Create: `components/site/locale-switcher.tsx`
- Create: `components/site/mobile-nav.tsx`
- Create: `components/site/site-header.tsx`
- Create: `components/site/site-footer.tsx`
- Modify: `app/[locale]/layout.tsx`

**Interfaces:**
- Consumes: `routing`, `Locale` from `i18n/routing.ts`; `Link`, `usePathname`, `useRouter` from `i18n/navigation.ts` (Task 1); `nav`/`theme`/`localeSwitcher`/`footer` message namespaces (Task 1).
- Produces: `SiteHeader` and `SiteFooter` components, consumed by `app/[locale]/layout.tsx` from this task on. `siteConfig.nav: { key: string; href: string }[]` — later tasks that add homepage sections must use the matching `id` (`about`, `projects`, `contact`) so the `/#contact`-style nav links resolve.

- [ ] **Step 1: Rewrite `lib/site-config.ts`**

```ts
export const siteConfig = {
  name: "Cristian Gatu",
  title: "Cristian Gatu — Full-Stack Developer",
  description:
    "Senior Full-Stack Engineer building scalable, API-driven systems across fintech, supply chain, and publishing. React, Next.js, Node.js, GraphQL, PostgreSQL.",
  url: "https://sircqq.vercel.app",
  location: "Iași, Romania",
  email: "gatucristian@gmail.com",
  links: {
    // TODO: add your GitHub profile URL
    github: "",
    linkedin: "https://www.linkedin.com/in/cristian-gatu-06b0811a1/",
  },
  nav: [
    { key: "home", href: "/" },
    { key: "work", href: "/work" },
    { key: "articles", href: "/articles" },
    { key: "contact", href: "/#contact" },
  ],
} as const;
```

- [ ] **Step 2: Rewrite `lib/theme-config.ts`** (labels now come from translations, not this file)

```ts
import { Laptop, Moon, Sun, type LucideIcon } from "lucide-react";

export type ThemeOption = {
  value: string;
  icon: LucideIcon;
};

/**
 * Every theme available to the switcher. To add a new theme later:
 *   1. add a token block for it in app/globals.css (see comment there)
 *   2. add its name to the `themes` array in components/theme-provider.tsx
 *   3. add an entry here so it shows up in the switcher
 *   4. add a matching label under `theme.<value>` in every messages/*.json file
 * No other code needs to change.
 */
export const THEMES: ThemeOption[] = [
  { value: "light", icon: Sun },
  { value: "dark", icon: Moon },
  { value: "system", icon: Laptop },
];
```

- [ ] **Step 3: Update `components/theme-toggle.tsx`** to read labels from `next-intl`

```tsx
"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { useTranslations } from "next-intl";
import { Moon, Sun } from "lucide-react";

import { THEMES } from "@/lib/theme-config";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const t = useTranslations("theme");
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label={t("toggle")}
          className="text-muted-foreground hover:text-foreground"
        >
          {mounted ? (
            <>
              <Sun className="size-4 scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
              <Moon className="absolute size-4 scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
            </>
          ) : (
            <Sun className="size-4" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {THEMES.map(({ value, icon: Icon }) => (
          <DropdownMenuItem key={value} onClick={() => setTheme(value)}>
            <Icon className="size-4" />
            <span>{t(value)}</span>
            {mounted && theme === value ? (
              <span className="ml-auto text-xs text-muted-foreground">•</span>
            ) : null}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
```

- [ ] **Step 4: Create `components/site/locale-switcher.tsx`**

```tsx
"use client";

import { Globe } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const LOCALE_LABELS: Record<string, string> = {
  en: "English",
  ro: "Română",
};

export function LocaleSwitcher() {
  const locale = useLocale();
  const t = useTranslations("localeSwitcher");
  const pathname = usePathname();
  const router = useRouter();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label={t("label")}
          className="text-muted-foreground hover:text-foreground"
        >
          <Globe className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {routing.locales.map((loc) => (
          <DropdownMenuItem
            key={loc}
            onClick={() => router.replace(pathname, { locale: loc })}
          >
            <span>{LOCALE_LABELS[loc]}</span>
            {loc === locale ? (
              <span className="ml-auto text-xs text-muted-foreground">•</span>
            ) : null}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
```

- [ ] **Step 5: Create `components/site/mobile-nav.tsx`**

```tsx
"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { siteConfig } from "@/lib/site-config";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export function MobileNav() {
  const t = useTranslations("nav");
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label={t("menu")}
          className="sm:hidden"
        >
          <Menu className="size-4" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right">
        <SheetTitle className="sr-only">{t("menu")}</SheetTitle>
        <nav className="mt-10 flex flex-col gap-6 px-6 text-lg font-medium">
          {siteConfig.nav.map((item) => (
            <Link key={item.key} href={item.href} onClick={() => setOpen(false)}>
              {t(item.key)}
            </Link>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
```

- [ ] **Step 6: Create `components/site/site-header.tsx`**

```tsx
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { siteConfig } from "@/lib/site-config";
import { Container } from "@/components/ui/container";
import { ThemeToggle } from "@/components/theme-toggle";
import { LocaleSwitcher } from "@/components/site/locale-switcher";
import { MobileNav } from "@/components/site/mobile-nav";

export function SiteHeader() {
  const t = useTranslations("nav");

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur">
      <Container className="flex h-16 items-center justify-between">
        <Link href="/" className="font-semibold tracking-tight">
          {siteConfig.name}
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-medium sm:flex">
          {siteConfig.nav.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              {t(item.key)}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-1">
          <LocaleSwitcher />
          <ThemeToggle />
          <MobileNav />
        </div>
      </Container>
    </header>
  );
}
```

- [ ] **Step 7: Create `components/site/site-footer.tsx`**

```tsx
import { useTranslations } from "next-intl";
import { Github, Linkedin, Mail } from "lucide-react";
import { Container } from "@/components/ui/container";
import { siteConfig } from "@/lib/site-config";

export function SiteFooter() {
  const t = useTranslations("footer");
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border/60">
      <Container className="flex flex-col items-center justify-between gap-4 py-8 text-sm text-muted-foreground sm:flex-row">
        <p>
          © {year} {siteConfig.name}. {t("rights")}
        </p>
        <div className="flex items-center gap-4">
          {siteConfig.links.github ? (
            <a
              href={siteConfig.links.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="hover:text-foreground"
            >
              <Github className="size-4" />
            </a>
          ) : null}
          <a
            href={siteConfig.links.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="hover:text-foreground"
          >
            <Linkedin className="size-4" />
          </a>
          <a
            href={`mailto:${siteConfig.email}`}
            aria-label="Email"
            className="hover:text-foreground"
          >
            <Mail className="size-4" />
          </a>
        </div>
      </Container>
    </footer>
  );
}
```

- [ ] **Step 8: Wire header/footer into `app/[locale]/layout.tsx`**

In `app/[locale]/layout.tsx`, add the imports and render `SiteHeader`/`SiteFooter` around `children`:

```tsx
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
```

```tsx
        <NextIntlClientProvider>
          <ThemeProvider>
            <SiteHeader />
            <main className="flex flex-1 flex-col">{children}</main>
            <SiteFooter />
            <Toaster />
          </ThemeProvider>
        </NextIntlClientProvider>
```

(Replaces the previous `<main>...</main><Toaster />` block from Task 1 Step 10.)

- [ ] **Step 9: Verify**

Run: `yarn lint && yarn build`
Expected: no errors.

Run: `yarn dev`, open `http://localhost:3000/en`.
Expected: header shows "Cristian Gatu", nav links "Home / Work / Articles / Contact", a globe icon (locale switcher) and theme toggle on the right. Switching locale via the globe changes nav text to Romanian and keeps you on the same path. Resizing the window below `sm` hides the inline nav and shows a hamburger button that opens a slide-over with the same links. Footer shows the current year, LinkedIn and mail icons (no GitHub icon, since the link is empty).

- [ ] **Step 10: Commit**

```bash
git add lib/site-config.ts lib/theme-config.ts components/theme-toggle.tsx components/site app/[locale]/layout.tsx
git commit -m "Add localized site header, footer, and locale switcher"
```

---

### Task 3: CV content layer & `/work` page

**Files:**
- Create: `lib/content/cv.ts`
- Create: `lib/content/cv.en.ts`
- Create: `lib/content/cv.ro.ts`
- Create: `components/site/timeline-item.tsx`
- Create: `app/[locale]/work/page.tsx`

**Interfaces:**
- Produces: `getCvContent(locale: Locale): CvContent` and the `Experience`, `Education`, `Project`, `CvContent` types from `lib/content/cv.ts` — Tasks 4-7 (homepage sections) and this task's work page all consume this.
- Consumes: `Locale` from `i18n/routing.ts` (Task 1); `work` message namespace (Task 1); `Section`/`SectionHeading` from `components/ui/section.tsx` (existing); `Badge` from `components/ui/badge.tsx` (existing).

- [ ] **Step 1: Create `lib/content/cv.ts`**

```ts
import type { Locale } from "@/i18n/routing";
import { en } from "./cv.en";
import { ro } from "./cv.ro";

export type Experience = {
  title: string;
  company: string;
  location: string;
  period: string;
  intro: string;
  highlights: string[];
  stack: string[];
};

export type Education = {
  degree: string;
  institution: string;
  location: string;
  period: string;
};

export type Project = {
  name: string;
  description?: string;
  period?: string;
  url?: string;
  stack: string[];
};

export type CvContent = {
  summary: string;
  about: { paragraphs: string[] };
  coreSkills: string[];
  experience: Experience[];
  education: Education[];
  projects: Project[];
};

const content: Record<Locale, CvContent> = { en, ro };

export function getCvContent(locale: Locale): CvContent {
  return content[locale];
}
```

- [ ] **Step 2: Create `lib/content/cv.en.ts`**

```ts
import type { CvContent } from "./cv";

export const en: CvContent = {
  summary:
    "Senior Full-Stack Engineer with 6+ years of experience designing and scaling API-driven systems across fintech, supply chain, and digital publishing. Deep expertise in React, Next.js, Node.js, GraphQL, and PostgreSQL, with a strong focus on system architecture, performance, and cloud infrastructure (AWS). Comfortable driving technical decisions, partnering with architects on system design, and mentoring junior engineers.",
  about: {
    paragraphs: [
      "I'm a Senior Full-Stack Engineer based in Iași, Romania, with 6+ years of experience building and scaling API-driven systems for fintech, supply chain, and digital publishing companies. My day-to-day centers on React, Next.js, Node.js, GraphQL, and PostgreSQL, but I care just as much about the system around the code — architecture, performance, and the cloud infrastructure it runs on.",
      "I've led legacy rewrites, built products from scratch, and spent a lot of time in the unglamorous but critical work of keeping distributed systems reliable. I like partnering closely with architects on system design, and I enjoy mentoring junior engineers — a good code review is one of the best ways I know to level up a team.",
      "Outside of client work, I keep a couple of side projects running, including this site, and I'm always looking for the next interesting problem to dig into.",
    ],
  },
  coreSkills: [
    "React",
    "Next.js",
    "TypeScript",
    "Node.js",
    "GraphQL",
    "PostgreSQL",
    "AWS",
  ],
  experience: [
    {
      title: "Full-Stack Developer",
      company: "rinf.tech",
      location: "Iași",
      period: "March 2025 – Present",
      intro:
        "Designing and scaling robust web applications in close collaboration with architects and senior engineers, contributing directly to system design and technical direction.",
      highlights: [
        "Architect scalable, maintainable systems using React, TypeScript, PostgreSQL, GraphQL, and AWS (including SQS)",
        "Shape sprint planning and technical direction within a cross-functional Agile team",
        "Optimize database performance and data access patterns for high-efficiency queries",
        "Diagnose and resolve complex reliability issues across distributed systems",
      ],
      stack: ["React", "TypeScript", "PostgreSQL", "GraphQL", "AWS", "SQS"],
    },
    {
      title: "Full-Stack Developer (Contract)",
      company: "Payset",
      location: "Remote",
      period: "April 2024 – May 2025",
      intro:
        "Built and scaled fintech applications handling financial data flows within a microservices architecture, with a strong emphasis on data integrity and system reliability.",
      highlights: [
        "Developed customer-facing interfaces in React and back-office tooling in Remix, backed by TypeScript and NestJS microservices",
        "Designed distributed systems for financial data flows, prioritizing consistency, reliability, and data integrity",
        "Integrated secure, high-performance APIs across services in a regulated banking environment",
        "Partnered with architects on service boundaries, integration patterns, and system design",
        "Debugged complex cross-service issues, improving production stability",
      ],
      stack: ["React", "Remix", "TypeScript", "NestJS", "PostgreSQL"],
    },
    {
      title: "Full-Stack Developer",
      company: "Eviden",
      location: "Remote",
      period: "March 2024 – April 2025",
      intro:
        "Built and scaled web applications in parallel with the Payset engagement, contributing to sprint planning and technical decision-making.",
      highlights: [
        "Developed and maintained applications using Next.js, TypeScript, PostgreSQL, and AWS",
        "Optimized database queries and improved overall application performance",
        "Diagnosed and resolved issues across existing production systems",
      ],
      stack: ["Next.js", "TypeScript", "PostgreSQL", "AWS"],
    },
    {
      title: "Full-Stack Developer",
      company: "Haufe Group",
      location: "Remote",
      period: "November 2022 – March 2024",
      intro:
        "Led the rewrite of a legacy company platform and delivered a second product build, shaping technical direction across both efforts.",
      highlights: [
        "Rewrote a legacy application end-to-end using Remix, GraphQL, TypeScript, AWS, and Pulumi (Infrastructure as Code)",
        "Built a second product using React, Next.js, Tailwind, Express, MongoDB, and PostgreSQL",
        "Shaped sprint planning and contributed to architectural decisions within an Agile team",
        "Delivered new features with clean, maintainable code following engineering best practices",
      ],
      stack: [
        "Remix",
        "GraphQL",
        "TypeScript",
        "AWS",
        "Pulumi",
        "React",
        "Next.js",
        "Tailwind",
        "Express",
        "MongoDB",
        "PostgreSQL",
      ],
    },
    {
      title: "Full-Stack Developer (Contract / Freelance)",
      company: "Seed2shelf Inc",
      location: "Romania / Remote",
      period: "December 2021 – July 2022",
      intro:
        "Owned the front-end and API architecture for a SaaS platform helping production labs manage inventory, transport, and workflow — including integration with Metrc.",
      highlights: [
        "Designed and built the front-end architecture and API layer from the ground up",
        "Authored technical documentation and led code reviews for the team",
        "Mentored two junior developers, supporting their technical growth",
        "Translated client requirements into clear technical tasks and sprint goals",
      ],
      stack: ["TypeScript", "Node.js", "React", "Next.js", "NestJS", "MariaDB", "Bitbucket"],
    },
    {
      title: "Full-Stack Developer",
      company: "Skywind Group",
      location: "Iași",
      period: "October 2020 – June 2021",
      intro:
        "Delivered two products end-to-end: a sports and betting content platform, and a property management app connecting landlords, administrators, and tenants.",
      highlights: [
        "Maintained and extended a legacy sports/betting platform, including a new calendar feature linking games to tagged articles",
        "Built a property management app, implementing pixel-perfect designs and integrating the subscription billing module",
        "Wrote reusable, maintainable React components and effective, well-documented APIs",
      ],
      stack: ["React", "Redux", "Express", "MongoDB", "MySQL", "Redis", "Styled-Components", "TypeScript"],
    },
    {
      title: "Full-Stack Developer",
      company: "Bytex Technologies",
      location: "Iași",
      period: "February 2019 – April 2020",
      intro:
        "Contributed to Powercode, an application helping telecom providers (TV, Internet, Telephone) manage clients and services.",
      highlights: [
        "Built invoice generation and automated PDF delivery via email",
        "Implemented user-defined fields, notifications, and permission management",
        "Maintained the codebase, fixed bugs, and implemented pixel-perfect UI designs",
      ],
      stack: ["JavaScript", "TypeScript", "Node.js", "React", "GraphQL", "MySQL"],
    },
    {
      title: "Web Application Developer (Internship)",
      company: "OSRAM Continental",
      location: "Iași",
      period: "February 2019 – May 2021",
      intro:
        "Built a desktop tool that parsed structured Excel files and let engineers organize parameters into sub-modules, streamlining internal workflows.",
      highlights: [
        "Delivered a cross-platform desktop application using React, Electron, and a Flask backend",
        "Optimized the application for large datasets",
        "Mentored an incoming intern and participated in code reviews",
      ],
      stack: ["React", "Electron", "Flask", "Node.js", "MySQL"],
    },
  ],
  education: [
    {
      degree: "Bachelor's Degree, Computer Science",
      institution: '"Alexandru Ioan Cuza" University',
      location: "Iași",
      period: "2017 – 2020",
    },
  ],
  projects: [
    {
      name: "Internal tool — Catena Electric Iași",
      description:
        "Freelance internal tool for drafting and editing contracts and amendments, with an integrated client database.",
      period: "2022 – present (occasional maintenance)",
      stack: ["Next.js", "MongoDB"],
    },
    {
      name: "Personal Portfolio",
      description:
        "This site — built with Next.js, shadcn/ui, and a bilingual, themeable design system.",
      url: "https://sircqq.vercel.app",
      stack: ["Next.js", "TypeScript", "Tailwind CSS"],
    },
  ],
};
```

- [ ] **Step 3: Create `lib/content/cv.ro.ts`**

```ts
import type { CvContent } from "./cv";

export const ro: CvContent = {
  summary:
    "Inginer Full-Stack Senior cu peste 6 ani de experiență în proiectarea și scalarea sistemelor bazate pe API în fintech, supply chain și publicare digitală. Expertiză solidă în React, Next.js, Node.js, GraphQL și PostgreSQL, cu accent pe arhitectura sistemelor, performanță și infrastructură cloud (AWS). Confortabil în a lua decizii tehnice, a colabora cu arhitecții la proiectarea sistemelor și a îndruma ingineri juniori.",
  about: {
    paragraphs: [
      "Sunt Inginer Full-Stack Senior din Iași, cu peste 6 ani de experiență în construirea și scalarea sistemelor bazate pe API pentru companii din fintech, supply chain și publicare digitală. Activitatea mea zilnică se concentrează pe React, Next.js, Node.js, GraphQL și PostgreSQL, dar îmi pasă la fel de mult de tot ce înconjoară codul — arhitectură, performanță și infrastructura cloud pe care rulează.",
      "Am condus rescrieri de aplicații legacy, am construit produse de la zero și am petrecut mult timp în munca mai puțin vizibilă, dar esențială, de a menține sistemele distribuite fiabile. Îmi place să colaborez îndeaproape cu arhitecții la design-ul sistemelor și mă bucur să îndrum ingineri juniori — un code review bun e una dintre cele mai bune metode pe care le știu pentru a ridica nivelul unei echipe.",
      "În afara proiectelor pentru clienți, mai am câteva proiecte personale active, inclusiv acest site, și sunt mereu în căutarea următoarei probleme interesante de rezolvat.",
    ],
  },
  coreSkills: [
    "React",
    "Next.js",
    "TypeScript",
    "Node.js",
    "GraphQL",
    "PostgreSQL",
    "AWS",
  ],
  experience: [
    {
      title: "Dezvoltator Full-Stack",
      company: "rinf.tech",
      location: "Iași",
      period: "Martie 2025 – Prezent",
      intro:
        "Proiectez și scalez aplicații web robuste în strânsă colaborare cu arhitecți și ingineri seniori, contribuind direct la design-ul sistemului și direcția tehnică.",
      highlights: [
        "Arhitecturez sisteme scalabile și ușor de întreținut folosind React, TypeScript, PostgreSQL, GraphQL și AWS (inclusiv SQS)",
        "Contribui la planificarea sprint-urilor și la direcția tehnică într-o echipă Agile cross-funcțională",
        "Optimizez performanța bazei de date și tiparele de acces la date pentru interogări eficiente",
        "Diagnostichez și rezolv probleme complexe de fiabilitate în sisteme distribuite",
      ],
      stack: ["React", "TypeScript", "PostgreSQL", "GraphQL", "AWS", "SQS"],
    },
    {
      title: "Dezvoltator Full-Stack (Contract)",
      company: "Payset",
      location: "Remote",
      period: "Aprilie 2024 – Mai 2025",
      intro:
        "Am construit și scalat aplicații fintech care gestionează fluxuri de date financiare într-o arhitectură de micro­servicii, cu accent puternic pe integritatea datelor și fiabilitatea sistemului.",
      highlights: [
        "Am dezvoltat interfețe pentru clienți în React și unelte back-office în Remix, susținute de micro­servicii TypeScript și NestJS",
        "Am proiectat sisteme distribuite pentru fluxuri de date financiare, prioritizând consistența, fiabilitatea și integritatea datelor",
        "Am integrat API-uri securizate și performante între servicii, într-un mediu bancar reglementat",
        "Am colaborat cu arhitecții la definirea limitelor serviciilor, tiparelor de integrare și design-ul sistemului",
        "Am depanat probleme complexe între servicii, îmbunătățind stabilitatea în producție",
      ],
      stack: ["React", "Remix", "TypeScript", "NestJS", "PostgreSQL"],
    },
    {
      title: "Dezvoltator Full-Stack",
      company: "Eviden",
      location: "Remote",
      period: "Martie 2024 – Aprilie 2025",
      intro:
        "Am construit și scalat aplicații web în paralel cu proiectul Payset, contribuind la planificarea sprint-urilor și la deciziile tehnice.",
      highlights: [
        "Am dezvoltat și întreținut aplicații folosind Next.js, TypeScript, PostgreSQL și AWS",
        "Am optimizat interogările bazei de date și am îmbunătățit performanța generală a aplicației",
        "Am diagnosticat și rezolvat probleme în sistemele existente aflate în producție",
      ],
      stack: ["Next.js", "TypeScript", "PostgreSQL", "AWS"],
    },
    {
      title: "Dezvoltator Full-Stack",
      company: "Haufe Group",
      location: "Remote",
      period: "Noiembrie 2022 – Martie 2024",
      intro:
        "Am condus rescrierea unei platforme legacy a companiei și am livrat un al doilea produs, conturând direcția tehnică pentru ambele proiecte.",
      highlights: [
        "Am rescris integral o aplicație legacy folosind Remix, GraphQL, TypeScript, AWS și Pulumi (Infrastructure as Code)",
        "Am construit un al doilea produs folosind React, Next.js, Tailwind, Express, MongoDB și PostgreSQL",
        "Am contribuit la planificarea sprint-urilor și la deciziile arhitecturale într-o echipă Agile",
        "Am livrat funcționalități noi cu cod curat și ușor de întreținut, respectând bunele practici de inginerie",
      ],
      stack: [
        "Remix",
        "GraphQL",
        "TypeScript",
        "AWS",
        "Pulumi",
        "React",
        "Next.js",
        "Tailwind",
        "Express",
        "MongoDB",
        "PostgreSQL",
      ],
    },
    {
      title: "Dezvoltator Full-Stack (Contract / Freelance)",
      company: "Seed2shelf Inc",
      location: "România / Remote",
      period: "Decembrie 2021 – Iulie 2022",
      intro:
        "Am fost responsabil de arhitectura front-end și API pentru o platformă SaaS care ajută laboratoare de producție să gestioneze inventarul, transportul și fluxul de lucru — inclusiv integrarea cu Metrc.",
      highlights: [
        "Am proiectat și construit de la zero arhitectura front-end și stratul de API",
        "Am redactat documentație tehnică și am coordonat code review-urile echipei",
        "Am îndrumat doi dezvoltatori juniori, susținându-le dezvoltarea tehnică",
        "Am tradus cerințele clienților în task-uri tehnice clare și obiective de sprint",
      ],
      stack: ["TypeScript", "Node.js", "React", "Next.js", "NestJS", "MariaDB", "Bitbucket"],
    },
    {
      title: "Dezvoltator Full-Stack",
      company: "Skywind Group",
      location: "Iași",
      period: "Octombrie 2020 – Iunie 2021",
      intro:
        "Am livrat integral două produse: o platformă de conținut sportiv și pariuri, și o aplicație de administrare a proprietăților care conectează proprietari, administratori și chiriași.",
      highlights: [
        "Am întreținut și extins o platformă legacy de sport/pariuri, inclusiv o funcționalitate nouă de calendar care leagă meciurile de articole etichetate",
        "Am construit o aplicație de administrare a proprietăților, implementând design-uri pixel-perfect și integrând modulul de facturare pentru abonamente",
        "Am scris componente React reutilizabile și ușor de întreținut, precum și API-uri eficiente și bine documentate",
      ],
      stack: ["React", "Redux", "Express", "MongoDB", "MySQL", "Redis", "Styled-Components", "TypeScript"],
    },
    {
      title: "Dezvoltator Full-Stack",
      company: "Bytex Technologies",
      location: "Iași",
      period: "Februarie 2019 – Aprilie 2020",
      intro:
        "Am contribuit la Powercode, o aplicație care ajută furnizorii de telecomunicații (TV, Internet, Telefonie) să gestioneze clienții și serviciile.",
      highlights: [
        "Am construit generarea facturilor și livrarea automată a PDF-urilor prin email",
        "Am implementat câmpuri definite de utilizator, notificări și gestionarea permisiunilor",
        "Am întreținut codul sursă, am reparat bug-uri și am implementat design-uri UI pixel-perfect",
      ],
      stack: ["JavaScript", "TypeScript", "Node.js", "React", "GraphQL", "MySQL"],
    },
    {
      title: "Dezvoltator de Aplicații Web (Internship)",
      company: "OSRAM Continental",
      location: "Iași",
      period: "Februarie 2019 – Mai 2021",
      intro:
        "Am construit o unealtă desktop care parsa fișiere Excel structurate și permitea inginerilor să organizeze parametri în sub-module, eficientizând fluxurile interne de lucru.",
      highlights: [
        "Am livrat o aplicație desktop cross-platform folosind React, Electron și un backend Flask",
        "Am optimizat aplicația pentru seturi mari de date",
        "Am îndrumat un nou intern și am participat la code review-uri",
      ],
      stack: ["React", "Electron", "Flask", "Node.js", "MySQL"],
    },
  ],
  education: [
    {
      degree: "Licență, Informatică",
      institution: 'Universitatea "Alexandru Ioan Cuza"',
      location: "Iași",
      period: "2017 – 2020",
    },
  ],
  projects: [
    {
      name: "Unealtă internă — Catena Electric Iași",
      description:
        "Unealtă internă freelance pentru redactarea și editarea contractelor și actelor adiționale, cu bază de date de clienți integrată.",
      period: "2022 – prezent (mentenanță ocazională)",
      stack: ["Next.js", "MongoDB"],
    },
    {
      name: "Portofoliu Personal",
      description:
        "Acest site — construit cu Next.js, shadcn/ui și un sistem de design bilingv, cu teme configurabile.",
      url: "https://sircqq.vercel.app",
      stack: ["Next.js", "TypeScript", "Tailwind CSS"],
    },
  ],
};
```

- [ ] **Step 4: Create `components/site/timeline-item.tsx`**

```tsx
import { Badge } from "@/components/ui/badge";
import type { Experience } from "@/lib/content/cv";

export function TimelineItem({
  experience,
  isLast,
}: {
  experience: Experience;
  isLast: boolean;
}) {
  return (
    <div className="relative pl-8">
      <span className="absolute top-1.5 left-0 size-2.5 rounded-full bg-brand" />
      {!isLast ? (
        <span className="absolute top-4 bottom-[-2.5rem] left-[4.5px] w-px bg-border" />
      ) : null}
      <p className="text-sm text-muted-foreground">{experience.period}</p>
      <h3 className="mt-1 text-lg font-semibold">
        {experience.title}{" "}
        <span className="text-muted-foreground">· {experience.company}</span>
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">{experience.location}</p>
      <p className="mt-3 text-foreground/90">{experience.intro}</p>
      <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm text-muted-foreground">
        {experience.highlights.map((highlight) => (
          <li key={highlight}>{highlight}</li>
        ))}
      </ul>
      <div className="mt-4 flex flex-wrap gap-1.5">
        {experience.stack.map((tech) => (
          <Badge key={tech} variant="secondary">
            {tech}
          </Badge>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 5: Create `app/[locale]/work/page.tsx`**

```tsx
import { getTranslations } from "next-intl/server";
import { Section, SectionHeading } from "@/components/ui/section";
import { TimelineItem } from "@/components/site/timeline-item";
import { getCvContent } from "@/lib/content/cv";
import type { Locale } from "@/i18n/routing";

export default async function WorkPage({ params }: PageProps<"/[locale]/work">) {
  const { locale } = await params;
  const t = await getTranslations("work");
  const cv = getCvContent(locale as Locale);

  return (
    <Section>
      <SectionHeading
        eyebrow={t("eyebrow")}
        title={t("title")}
        description={t("description")}
      />
      <div className="mx-auto mt-16 max-w-2xl space-y-10">
        {cv.experience.map((experience, index) => (
          <TimelineItem
            key={`${experience.company}-${experience.period}`}
            experience={experience}
            isLast={index === cv.experience.length - 1}
          />
        ))}
      </div>
      <div className="mx-auto mt-16 max-w-2xl">
        <h3 className="text-lg font-semibold">{t("educationTitle")}</h3>
        <div className="mt-4 space-y-4">
          {cv.education.map((edu) => (
            <div key={`${edu.institution}-${edu.period}`}>
              <p className="font-medium">{edu.degree}</p>
              <p className="text-sm text-muted-foreground">
                {edu.institution} · {edu.location} · {edu.period}
              </p>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}
```

- [ ] **Step 6: Verify**

Run: `yarn lint && yarn build`
Expected: no errors.

Run: `yarn dev`, open `http://localhost:3000/en/work`.
Expected: 8 timeline entries from rinf.tech down to OSRAM Continental, each with period/title/company/location/intro/highlights/stack badges, connected by a vertical line, plus one Education entry below. Open `http://localhost:3000/ro/work` — same structure, fully in Romanian.

- [ ] **Step 7: Commit**

```bash
git add lib/content components/site/timeline-item.tsx app/[locale]/work
git commit -m "Add bilingual CV content layer and /work timeline page"
```

---

### Task 4: Hero section

**Files:**
- Create: `hooks/use-typewriter.ts`
- Create: `components/site/typewriter.tsx`
- Create: `components/site/hero.tsx`
- Modify: `app/[locale]/page.tsx`

**Interfaces:**
- Produces: `useTypewriter(words: string[]): string` from `hooks/use-typewriter.ts`. `Hero({ summary }: { summary: string })` from `components/site/hero.tsx` — reads `hero.roles` itself via `t.raw("roles")`, so callers only pass the CV summary string.
- Consumes: `getCvContent` (Task 3), `hero` message namespace (Task 1).

- [ ] **Step 1: Create `hooks/use-typewriter.ts`**

```ts
"use client";

import { useEffect, useState } from "react";

const TYPING_SPEED_MS = 55;
const DELETING_SPEED_MS = 30;
const PAUSE_AFTER_TYPED_MS = 1800;
const PAUSE_AFTER_DELETED_MS = 300;

export function useTypewriter(words: string[]): string {
  const [text, setText] = useState(words[0] ?? "");
  const [wordIndex, setWordIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (words.length === 0) return;

    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      setText(words[0]);
      return;
    }

    const currentWord = words[wordIndex % words.length];
    const atFullWord = text === currentWord;
    const atEmpty = text === "";

    let delay = isDeleting ? DELETING_SPEED_MS : TYPING_SPEED_MS;
    if (atFullWord && !isDeleting) delay = PAUSE_AFTER_TYPED_MS;
    if (atEmpty && isDeleting) delay = PAUSE_AFTER_DELETED_MS;

    const timeout = setTimeout(() => {
      if (isDeleting) {
        if (atEmpty) {
          setIsDeleting(false);
          setWordIndex((index) => (index + 1) % words.length);
        } else {
          setText(currentWord.slice(0, text.length - 1));
        }
      } else if (atFullWord) {
        setIsDeleting(true);
      } else {
        setText(currentWord.slice(0, text.length + 1));
      }
    }, delay);

    return () => clearTimeout(timeout);
  }, [text, isDeleting, wordIndex, words]);

  return text;
}
```

- [ ] **Step 2: Create `components/site/typewriter.tsx`**

```tsx
"use client";

import { useTypewriter } from "@/hooks/use-typewriter";

export function Typewriter({ words }: { words: string[] }) {
  const text = useTypewriter(words);

  return (
    <span className="text-brand">
      {text}
      <span
        aria-hidden
        className="ml-0.5 inline-block h-[1em] w-[2px] translate-y-[0.15em] animate-pulse bg-brand align-middle"
      />
    </span>
  );
}
```

- [ ] **Step 3: Create `components/site/hero.tsx`**

```tsx
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
```

- [ ] **Step 4: Replace `app/[locale]/page.tsx`**

```tsx
import { Hero } from "@/components/site/hero";
import { getCvContent } from "@/lib/content/cv";
import type { Locale } from "@/i18n/routing";

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  const cv = getCvContent(locale as Locale);

  return (
    <>
      <Hero summary={cv.summary} />
    </>
  );
}
```

- [ ] **Step 5: Verify**

Run: `yarn lint && yarn build`
Expected: no errors.

Run: `yarn dev`, open `http://localhost:3000/en`.
Expected: "HI, I'M" above "Cristian Gatu", then a line that types out "front-end developer", pauses, deletes, types "back-end developer", then "full-stack developer", looping, with a blinking caret. Below it, the English summary paragraph and two buttons. Open `/ro` — same behavior with Romanian roles/summary. In OS/browser settings, enabling "reduce motion" and reloading should show the first role statically with no animation.

- [ ] **Step 6: Commit**

```bash
git add hooks components/site/typewriter.tsx components/site/hero.tsx app/[locale]/page.tsx
git commit -m "Add hero section with typewriter role animation"
```

---

### Task 5: About section

**Files:**
- Create: `components/site/about-section.tsx`
- Modify: `app/[locale]/page.tsx`

**Interfaces:**
- Produces: `AboutSection({ paragraphs, coreSkills }: { paragraphs: string[]; coreSkills: string[] })`.
- Consumes: `Section`/`SectionHeading` (existing), `Badge` (existing), `about` message namespace (Task 1), `cv.about.paragraphs` / `cv.coreSkills` (Task 3).

- [ ] **Step 1: Create `components/site/about-section.tsx`**

```tsx
import { getTranslations } from "next-intl/server";
import { Section, SectionHeading } from "@/components/ui/section";
import { Badge } from "@/components/ui/badge";

export async function AboutSection({
  paragraphs,
  coreSkills,
}: {
  paragraphs: string[];
  coreSkills: string[];
}) {
  const t = await getTranslations("about");

  return (
    <Section id="about">
      <SectionHeading eyebrow={t("eyebrow")} title={t("title")} />
      <div className="mx-auto mt-10 max-w-2xl space-y-4 text-foreground/90">
        {paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
      <div className="mx-auto mt-8 max-w-2xl">
        <p className="text-sm font-medium text-muted-foreground">
          {t("skillsTitle")}
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {coreSkills.map((skill) => (
            <Badge key={skill} variant="outline">
              {skill}
            </Badge>
          ))}
        </div>
      </div>
    </Section>
  );
}
```

- [ ] **Step 2: Update `app/[locale]/page.tsx`**

```tsx
import { Hero } from "@/components/site/hero";
import { AboutSection } from "@/components/site/about-section";
import { getCvContent } from "@/lib/content/cv";
import type { Locale } from "@/i18n/routing";

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  const cv = getCvContent(locale as Locale);

  return (
    <>
      <Hero summary={cv.summary} />
      <AboutSection paragraphs={cv.about.paragraphs} coreSkills={cv.coreSkills} />
    </>
  );
}
```

- [ ] **Step 3: Verify**

Run: `yarn lint && yarn build`
Expected: no errors.

Run: `yarn dev`, open `http://localhost:3000/en#about` (and `/ro#about`).
Expected: "About" eyebrow, "A bit about me" heading, 3 paragraphs, then "Core skills" with 7 outlined badges (React, Next.js, TypeScript, Node.js, GraphQL, PostgreSQL, AWS).

- [ ] **Step 4: Commit**

```bash
git add components/site/about-section.tsx app/[locale]/page.tsx
git commit -m "Add about section to homepage"
```

---

### Task 6: Projects section

**Files:**
- Create: `components/site/project-card.tsx`
- Create: `components/site/projects-section.tsx`
- Modify: `app/[locale]/page.tsx`

**Interfaces:**
- Produces: `ProjectCard({ project }: { project: Project })`, `ProjectsSection({ projects }: { projects: Project[] })`.
- Consumes: `Project` type (Task 3), `Card`/`CardHeader`/`CardTitle`/`CardDescription`/`CardContent`/`CardFooter` (existing), `Badge` (existing), `projects` message namespace (Task 1).

- [ ] **Step 1: Create `components/site/project-card.tsx`**

```tsx
import { ExternalLink } from "lucide-react";
import { useTranslations } from "next-intl";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Project } from "@/lib/content/cv";

export function ProjectCard({ project }: { project: Project }) {
  const t = useTranslations("projects");

  return (
    <Card>
      <CardHeader>
        <CardTitle>{project.name}</CardTitle>
        {project.period ? <CardDescription>{project.period}</CardDescription> : null}
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {project.description ? (
          <p className="text-sm text-muted-foreground">{project.description}</p>
        ) : null}
        <div className="flex flex-wrap gap-1.5">
          {project.stack.map((tech) => (
            <Badge key={tech} variant="secondary">
              {tech}
            </Badge>
          ))}
        </div>
      </CardContent>
      {project.url ? (
        <CardFooter>
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-brand hover:underline"
          >
            {t("viewProject")}
            <ExternalLink className="size-3.5" />
          </a>
        </CardFooter>
      ) : null}
    </Card>
  );
}
```

- [ ] **Step 2: Create `components/site/projects-section.tsx`**

```tsx
import { getTranslations } from "next-intl/server";
import { Section, SectionHeading } from "@/components/ui/section";
import { ProjectCard } from "@/components/site/project-card";
import type { Project } from "@/lib/content/cv";

export async function ProjectsSection({ projects }: { projects: Project[] }) {
  const t = await getTranslations("projects");

  return (
    <Section id="projects">
      <SectionHeading
        eyebrow={t("eyebrow")}
        title={t("title")}
        description={t("description")}
      />
      <div className="mx-auto mt-12 grid max-w-4xl gap-6 sm:grid-cols-2">
        {projects.map((project) => (
          <ProjectCard key={project.name} project={project} />
        ))}
      </div>
    </Section>
  );
}
```

- [ ] **Step 3: Update `app/[locale]/page.tsx`**

```tsx
import { Hero } from "@/components/site/hero";
import { AboutSection } from "@/components/site/about-section";
import { ProjectsSection } from "@/components/site/projects-section";
import { getCvContent } from "@/lib/content/cv";
import type { Locale } from "@/i18n/routing";

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  const cv = getCvContent(locale as Locale);

  return (
    <>
      <Hero summary={cv.summary} />
      <AboutSection paragraphs={cv.about.paragraphs} coreSkills={cv.coreSkills} />
      <ProjectsSection projects={cv.projects} />
    </>
  );
}
```

- [ ] **Step 4: Verify**

Run: `yarn lint && yarn build`
Expected: no errors.

Run: `yarn dev`, open `http://localhost:3000/en#projects`.
Expected: two cards — "Internal tool — Catena Electric Iași" (period, description, Next.js/MongoDB badges, no link) and "Personal Portfolio" (description, badges, "View project" link opening `sircqq.vercel.app`). Clicking "View projects" in the hero scrolls here. `/ro#projects` shows the same cards translated ("Unealtă internă...", "Portofoliu Personal", "Vezi proiectul").

- [ ] **Step 5: Commit**

```bash
git add components/site/project-card.tsx components/site/projects-section.tsx app/[locale]/page.tsx
git commit -m "Add projects section to homepage"
```

---

### Task 7: Contact section

**Files:**
- Create: `components/site/contact-form.tsx`
- Create: `components/site/contact-section.tsx`
- Modify: `app/[locale]/page.tsx`

**Interfaces:**
- Produces: `ContactForm` (client component, no props), `ContactSection` (no props).
- Consumes: `Button`/`Input`/`Textarea`/`Label` (existing), `sonner`'s `toast` (existing `Toaster` mounted in Task 1), `contact` message namespace (Task 1).

- [ ] **Step 1: Create `components/site/contact-form.tsx`**

```tsx
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const contactSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email(),
  message: z.string().trim().min(10).max(2000),
});

type ContactValues = z.infer<typeof contactSchema>;

export function ContactForm() {
  const t = useTranslations("contact");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactValues>({
    resolver: zodResolver(contactSchema),
  });

  async function onSubmit() {
    // No backend yet: validated locally and surfaced as a success toast.
    // Replace this body with a real submit (e.g. a Server Action calling an
    // email provider) once the contact backend is wired up.
    await new Promise((resolve) => setTimeout(resolve, 400));
    toast.success(t("successTitle"), {
      description: t("successDescription"),
    });
    reset();
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-5"
      noValidate
    >
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="name">{t("nameLabel")}</Label>
        <Input
          id="name"
          autoComplete="name"
          aria-invalid={!!errors.name}
          {...register("name")}
        />
        {errors.name ? (
          <p className="text-sm text-destructive">{t("nameError")}</p>
        ) : null}
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="email">{t("emailLabel")}</Label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          aria-invalid={!!errors.email}
          {...register("email")}
        />
        {errors.email ? (
          <p className="text-sm text-destructive">{t("emailError")}</p>
        ) : null}
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="message">{t("messageLabel")}</Label>
        <Textarea
          id="message"
          rows={5}
          aria-invalid={!!errors.message}
          {...register("message")}
        />
        {errors.message ? (
          <p className="text-sm text-destructive">{t("messageError")}</p>
        ) : null}
      </div>
      <Button type="submit" disabled={isSubmitting} className="self-start">
        {isSubmitting ? t("sending") : t("send")}
      </Button>
    </form>
  );
}
```

- [ ] **Step 2: Create `components/site/contact-section.tsx`**

```tsx
import { getTranslations } from "next-intl/server";
import { Section, SectionHeading } from "@/components/ui/section";
import { ContactForm } from "@/components/site/contact-form";

export async function ContactSection() {
  const t = await getTranslations("contact");

  return (
    <Section id="contact">
      <SectionHeading
        eyebrow={t("eyebrow")}
        title={t("title")}
        description={t("description")}
      />
      <div className="mx-auto mt-10 max-w-lg">
        <ContactForm />
      </div>
    </Section>
  );
}
```

- [ ] **Step 3: Update `app/[locale]/page.tsx`**

```tsx
import { Hero } from "@/components/site/hero";
import { AboutSection } from "@/components/site/about-section";
import { ProjectsSection } from "@/components/site/projects-section";
import { ContactSection } from "@/components/site/contact-section";
import { getCvContent } from "@/lib/content/cv";
import type { Locale } from "@/i18n/routing";

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  const cv = getCvContent(locale as Locale);

  return (
    <>
      <Hero summary={cv.summary} />
      <AboutSection paragraphs={cv.about.paragraphs} coreSkills={cv.coreSkills} />
      <ProjectsSection projects={cv.projects} />
      <ContactSection />
    </>
  );
}
```

- [ ] **Step 4: Verify**

Run: `yarn lint && yarn build`
Expected: no errors.

Run: `yarn dev`, open `http://localhost:3000/en#contact`.
Expected: Name/Email/Message fields. Submitting empty shows the three inline error messages and does not submit. Filling all three fields and submitting briefly disables the button ("Sending..."), then shows a success toast ("Message sent" / description) and clears the form. `/ro#contact` shows the same flow in Romanian.

- [ ] **Step 5: Commit**

```bash
git add components/site/contact-form.tsx components/site/contact-section.tsx app/[locale]/page.tsx
git commit -m "Add contact section with validated, backend-less form"
```

---

### Task 8: Articles content loader & listing page

**Files:**
- Create: `lib/content/articles.ts`
- Create: `content/articles/en/hello-world.mdx`
- Create: `content/articles/ro/hello-world.mdx`
- Create: `components/site/article-card.tsx`
- Create: `app/[locale]/articles/page.tsx`

**Interfaces:**
- Produces: `getAllArticles(locale: Locale): ArticleSummary[]`, `getArticleBySlug(locale: Locale, slug: string): Article | null`, `getAllArticleSlugs(locale: Locale): string[]`, and the `ArticleSummary`/`Article` types from `lib/content/articles.ts` — Task 9's detail page consumes `getArticleBySlug` and `getAllArticleSlugs`.
- Consumes: `Locale` from `i18n/routing.ts`, `articles` message namespace (Task 1), `Card`/`Badge` (existing).

- [ ] **Step 1: Create `lib/content/articles.ts`**

```ts
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import readingTime from "reading-time";
import { z } from "zod";
import type { Locale } from "@/i18n/routing";

const frontmatterSchema = z.object({
  title: z.string(),
  date: z.string(),
  excerpt: z.string(),
  tags: z.array(z.string()).default([]),
});

export type ArticleSummary = {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  tags: string[];
  readingMinutes: number;
};

export type Article = ArticleSummary & {
  content: string;
};

function articlesDirectory(locale: Locale): string {
  return path.join(process.cwd(), "content", "articles", locale);
}

function readArticleFile(locale: Locale, slug: string): Article | null {
  const filePath = path.join(articlesDirectory(locale), `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(raw);
  const frontmatter = frontmatterSchema.parse(data);

  return {
    ...frontmatter,
    slug,
    readingMinutes: Math.max(1, Math.ceil(readingTime(content).minutes)),
    content,
  };
}

export function getAllArticleSlugs(locale: Locale): string[] {
  const dir = articlesDirectory(locale);
  if (!fs.existsSync(dir)) return [];

  return fs
    .readdirSync(dir)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => file.replace(/\.mdx$/, ""));
}

export function getAllArticles(locale: Locale): ArticleSummary[] {
  return getAllArticleSlugs(locale)
    .map((slug) => readArticleFile(locale, slug))
    .filter((article): article is Article => article !== null)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .map((article) => ({
      slug: article.slug,
      title: article.title,
      date: article.date,
      excerpt: article.excerpt,
      tags: article.tags,
      readingMinutes: article.readingMinutes,
    }));
}

export function getArticleBySlug(locale: Locale, slug: string): Article | null {
  return readArticleFile(locale, slug);
}
```

- [ ] **Step 2: Create `content/articles/en/hello-world.mdx`**

```mdx
---
title: "Hello, world"
date: "2026-09-21"
excerpt: "The first post on this site — why I'm building it, and what to expect here."
tags: ["meta"]
---

This is the first article on this site, and mostly a test of the pipes: Markdown in, a styled page out, in both English and Romanian.

## Why write here

I've wanted a place to write up the smaller things I learn while building software — a tricky bug, a pattern that turned out to matter, a tool that saved an afternoon. Nothing polished, just notes worth keeping.

## What's next

More posts, as they happen. If you're reading this and the articles list is still short, check back later.
```

- [ ] **Step 3: Create `content/articles/ro/hello-world.mdx`**

```mdx
---
title: "Salut, lume"
date: "2026-09-21"
excerpt: "Primul articol de pe acest site — de ce îl construiesc și la ce te poți aștepta aici."
tags: ["meta"]
---

Acesta este primul articol de pe acest site și, în mare parte, un test al fluxului: Markdown la intrare, o pagină stilizată la ieșire, atât în engleză, cât și în română.

## De ce scriu aici

Mi-am dorit un loc unde să notez lucrurile mai mici pe care le învăț construind software — un bug complicat, un pattern care s-a dovedit important, o unealtă care mi-a salvat o după-amiază. Nimic șlefuit, doar notițe care merită păstrate.

## Ce urmează

Mai multe articole, pe măsură ce apar. Dacă citești asta și lista de articole e încă scurtă, revino mai târziu.
```

- [ ] **Step 4: Create `components/site/article-card.tsx`**

```tsx
import { useFormatter, useTranslations } from "next-intl";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "@/i18n/navigation";
import type { ArticleSummary } from "@/lib/content/articles";

export function ArticleCard({ article }: { article: ArticleSummary }) {
  const t = useTranslations("articles");
  const format = useFormatter();

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <Link href={`/articles/${article.slug}`} className="hover:underline">
            {article.title}
          </Link>
        </CardTitle>
        <CardDescription>
          {format.dateTime(new Date(article.date), { dateStyle: "long" })}
          {" · "}
          {t("readingTime", { minutes: article.readingMinutes })}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <p className="text-sm text-muted-foreground">{article.excerpt}</p>
        <div className="flex flex-wrap gap-1.5">
          {article.tags.map((tag) => (
            <Badge key={tag} variant="outline">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Link
          href={`/articles/${article.slug}`}
          className="text-sm font-medium text-brand hover:underline"
        >
          {t("readMore")}
        </Link>
      </CardFooter>
    </Card>
  );
}
```

- [ ] **Step 5: Create `app/[locale]/articles/page.tsx`**

```tsx
import { getTranslations } from "next-intl/server";
import { Section, SectionHeading } from "@/components/ui/section";
import { ArticleCard } from "@/components/site/article-card";
import { getAllArticles } from "@/lib/content/articles";
import type { Locale } from "@/i18n/routing";

export default async function ArticlesPage({
  params,
}: PageProps<"/[locale]/articles">) {
  const { locale } = await params;
  const t = await getTranslations("articles");
  const articles = getAllArticles(locale as Locale);

  return (
    <Section>
      <SectionHeading
        eyebrow={t("eyebrow")}
        title={t("title")}
        description={t("description")}
      />
      {articles.length === 0 ? (
        <p className="mx-auto mt-12 max-w-2xl text-center text-muted-foreground">
          {t("empty")}
        </p>
      ) : (
        <div className="mx-auto mt-12 grid max-w-4xl gap-6 sm:grid-cols-2">
          {articles.map((article) => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </div>
      )}
    </Section>
  );
}
```

- [ ] **Step 6: Verify**

Run: `yarn lint && yarn build`
Expected: no errors.

Run: `yarn dev`, open `http://localhost:3000/en/articles`.
Expected: one card, "Hello, world", dated "September 21, 2026", "1 min read", excerpt, a "meta" badge, and a "Read article" link (the link 404s until Task 9 adds the detail route — that's expected at this point). `/ro/articles` shows "Salut, lume" with a Romanian date and "1 minut de citit".

- [ ] **Step 7: Commit**

```bash
git add lib/content/articles.ts content/articles components/site/article-card.tsx app/[locale]/articles/page.tsx
git commit -m "Add MDX articles loader and listing page"
```

---

### Task 9: Article detail page

**Files:**
- Create: `app/[locale]/articles/[slug]/page.tsx`

**Interfaces:**
- Consumes: `getArticleBySlug`, `getAllArticleSlugs` (Task 8), `routing` (Task 1), `articles` message namespace (Task 1).

- [ ] **Step 1: Create `app/[locale]/articles/[slug]/page.tsx`**

```tsx
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getFormatter, getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/container";
import { Link } from "@/i18n/navigation";
import { getAllArticleSlugs, getArticleBySlug } from "@/lib/content/articles";
import { routing, type Locale } from "@/i18n/routing";

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    getAllArticleSlugs(locale).map((slug) => ({ locale, slug }))
  );
}

export default async function ArticlePage({
  params,
}: PageProps<"/[locale]/articles/[slug]">) {
  const { locale, slug } = await params;
  const article = getArticleBySlug(locale as Locale, slug);
  if (!article) notFound();

  const t = await getTranslations("articles");
  const format = await getFormatter();

  return (
    <Container className="py-20 sm:py-28">
      <Link
        href="/articles"
        className="text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        ← {t("back")}
      </Link>
      <article className="prose prose-neutral mx-auto mt-8 max-w-2xl dark:prose-invert">
        <h1>{article.title}</h1>
        <p className="text-sm text-muted-foreground">
          {format.dateTime(new Date(article.date), { dateStyle: "long" })}
          {" · "}
          {t("readingTime", { minutes: article.readingMinutes })}
        </p>
        <MDXRemote source={article.content} />
      </article>
    </Container>
  );
}
```

- [ ] **Step 2: Verify**

Run: `yarn lint && yarn build`
Expected: no errors; build output includes `/en/articles/hello-world` and `/ro/articles/hello-world` as statically generated routes.

Run: `yarn dev`, open `http://localhost:3000/en/articles/hello-world`.
Expected: "← Back to articles" link, "Hello, world" as an `h1`, date + reading time line, then the rendered body with an `h2` "Why write here" and one more paragraph section, styled via the `prose` classes (readable measure, spaced headings). `/ro/articles/hello-world` shows the Romanian version. Clicking "Read article" from `/en/articles` now lands here instead of 404ing.

- [ ] **Step 3: Commit**

```bash
git add app/[locale]/articles/[slug]
git commit -m "Add article detail page with MDX rendering"
```

---

### Task 10: SEO metadata & final QA pass

**Files:**
- Create: `lib/seo.ts`
- Modify: `app/[locale]/layout.tsx`
- Modify: `app/[locale]/page.tsx`
- Modify: `app/[locale]/work/page.tsx`
- Modify: `app/[locale]/articles/page.tsx`
- Modify: `app/[locale]/articles/[slug]/page.tsx`

**Interfaces:**
- Produces: `buildLanguageAlternates(pathname: string): Record<Locale, string>` from `lib/seo.ts`, used by every page's `generateMetadata`.
- Consumes: `routing` (Task 1), `siteConfig.url`/`siteConfig.name` (Task 2), `meta` message namespace (Task 1).

- [ ] **Step 1: Create `lib/seo.ts`**

```ts
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
```

- [ ] **Step 2: Replace the static `metadata` export in `app/[locale]/layout.tsx` with `generateMetadata`**

Remove:

```tsx
export const metadata: Metadata = {
  title: siteConfig.title,
  description: siteConfig.description,
};
```

Add (keep the existing `Metadata` import from `next`; add `getTranslations` from `next-intl/server`):

```tsx
export async function generateMetadata({
  params,
}: LayoutProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });

  return {
    title: {
      default: t("title"),
      template: `%s · ${siteConfig.name}`,
    },
    description: t("description"),
    metadataBase: new URL(siteConfig.url),
  };
}
```

- [ ] **Step 3: Add `generateMetadata` to `app/[locale]/page.tsx`**

```tsx
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { buildLanguageAlternates } from "@/lib/seo";
```

```tsx
export async function generateMetadata({
  params,
}: PageProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });

  return {
    title: t("title"),
    alternates: { languages: buildLanguageAlternates("") },
  };
}
```

- [ ] **Step 4: Add `generateMetadata` to `app/[locale]/work/page.tsx`**

```tsx
import type { Metadata } from "next";
import { buildLanguageAlternates } from "@/lib/seo";
```

```tsx
export async function generateMetadata({
  params,
}: PageProps<"/[locale]/work">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "work" });

  return {
    title: t("title"),
    alternates: { languages: buildLanguageAlternates("/work") },
  };
}
```

(`getTranslations` is already imported in this file from Task 3; reuse it.)

- [ ] **Step 5: Add `generateMetadata` to `app/[locale]/articles/page.tsx`**

```tsx
import type { Metadata } from "next";
import { buildLanguageAlternates } from "@/lib/seo";
```

```tsx
export async function generateMetadata({
  params,
}: PageProps<"/[locale]/articles">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "articles" });

  return {
    title: t("title"),
    alternates: { languages: buildLanguageAlternates("/articles") },
  };
}
```

(`getTranslations` is already imported in this file from Task 8; reuse it.)

- [ ] **Step 6: Add `generateMetadata` to `app/[locale]/articles/[slug]/page.tsx`**

```tsx
import type { Metadata } from "next";
import { buildLanguageAlternates } from "@/lib/seo";
```

```tsx
export async function generateMetadata({
  params,
}: PageProps<"/[locale]/articles/[slug]">): Promise<Metadata> {
  const { locale, slug } = await params;
  const article = getArticleBySlug(locale as Locale, slug);
  if (!article) return {};

  return {
    title: article.title,
    description: article.excerpt,
    alternates: { languages: buildLanguageAlternates(`/articles/${slug}`) },
  };
}
```

(`getArticleBySlug` and `Locale` are already imported in this file from Task 9; reuse them.)

- [ ] **Step 7: Full verification pass**

Run: `yarn lint`
Expected: no errors.

Run: `yarn build`
Expected: build succeeds; static output includes `/en`, `/ro`, `/en/work`, `/ro/work`, `/en/articles`, `/ro/articles`, `/en/articles/hello-world`, `/ro/articles/hello-world`.

Run: `yarn dev` and manually walk through:
1. `http://localhost:3000/` redirects to `/en`.
2. View source (or inspect `<head>`) on `/en` and `/ro` — confirm `<title>` and `<meta name="description">` differ per locale, and `<link rel="alternate" hreflang="...">` tags point to both `/en...` and `/ro...` URLs.
3. Toggle theme (light/dark/system) on `/en`, then switch locale to `/ro` — theme selection persists.
4. Resize to a phone-width viewport — header collapses to the hamburger menu on every page, no horizontal scrolling anywhere (home, work, articles, article detail).
5. Submit the contact form with valid data — success toast appears, form clears.
6. Click through nav on both locales: Home, Work, Articles, an article, Contact (anchor scroll) — no 404s, no console errors.

- [ ] **Step 8: Commit**

```bash
git add lib/seo.ts app/[locale]
git commit -m "Add per-locale SEO metadata and language alternates"
```

---

## Self-Review Notes

- **Spec coverage:** §4 routing → Task 1; §5 design system layers → Tasks 2-9 (all `components/site/*` use semantic tokens only); §6 content layer → Task 3; §7 homepage (Hero/About/Projects/Contact) → Tasks 4-7; §8 `/work` → Task 3; §9 articles → Tasks 8-9; §10 (no backend/CMS/extra themes) → respected throughout, `ContactForm.onSubmit` isolated per spec; §11 phase order → matches task order; §12 verification → Global Constraints + every task's Step "Verify", consolidated in Task 10 Step 7.
- **Type consistency checked:** `Locale` (Task 1) used identically in `cv.ts`, `articles.ts`, `seo.ts`, and every page's `params`. `getCvContent`/`getAllArticles`/`getArticleBySlug`/`getAllArticleSlugs` signatures match between their Task 3/8 definitions and all later call sites. `siteConfig.nav[].key` values (`home`, `work`, `articles`, `contact`) match the `nav` namespace keys in both message files and the `id`s set on `AboutSection`/`ProjectsSection`/`ContactSection` (`about`, `projects`, `contact`).
- **Next.js 16 specifics confirmed against local docs** (not training-data defaults): `proxy.ts` instead of `middleware.ts`; `params`/`searchParams` as `Promise`; `PageProps<'/route'>` / `LayoutProps<'/route'>` typed helpers.
