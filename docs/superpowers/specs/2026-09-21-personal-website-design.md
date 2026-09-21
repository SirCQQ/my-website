# Personal website — design spec

Date: 2026-09-21
Status: Approved for implementation planning

## 1. Goal

Build Cristian Gatu's personal website on the existing Next.js + shadcn/ui
scaffold: a homepage with a hero/typewriter intro, an about blurb, a
projects showcase, and a contact form; a `/work` page rendering CV/work
history as a timeline; an `/articles` section backed by static MDX files;
full bilingual support (English/Romanian); and a small, reusable design
system so new sections/themes are cheap to add later.

## 2. Existing foundation (already in the repo, not being rebuilt)

- Next.js 16 (App Router), React 19, Tailwind v4, shadcn/ui (`style:
  radix-nova`, `iconLibrary: lucide`).
- Theme system: `next-themes` + `lib/theme-config.ts` (`THEMES` array) +
  semantic OKLCH tokens in `app/globals.css`, documented as extensible
  (adding a theme = one token block + one array entry, no component
  changes).
- `lib/site-config.ts`: name, role, `roles` (front-end/back-end/full-stack,
  for the typewriter), summary, nav, contact email, links.
- Layout primitives: `components/ui/container.tsx`, `components/ui/
  section.tsx` (`Section`, `SectionHeading`) — already establish the
  spacious rhythm (`py-20 sm:py-28`, `max-w-5xl`, centered heading with
  eyebrow/title/description).
- shadcn primitives already installed: button, card, badge, tabs, sheet,
  tooltip, dropdown-menu, avatar, separator, input, textarea, label,
  skeleton, sonner.
- Data sources: `CV_Cristian_Gatu.json` (personal, summary, experience[8],
  personal_projects[2], education, languages), `linkedin_experience.json`
  (supplementary/cross-check, not a primary source), `docs/
  CV_Cristian_Gatu.md`.
- Packages already installed that this build relies on: `motion`,
  `react-hook-form`, `@hookform/resolvers`, `zod`, `gray-matter`,
  `next-mdx-remote`, `reading-time`, `sonner`, `lucide-react`.

## 3. New package

- `next-intl` — App Router i18n (routing, middleware, message catalogs,
  `useTranslations`/`getTranslations`). Approved by the user; install
  during implementation.

## 4. Information architecture & routing

Locale-prefixed routing via `next-intl`, prefix always shown, English
default:

```
app/
  [locale]/
    layout.tsx                — root layout: <html lang>/<body>, fonts, NextIntlClientProvider, SiteHeader/SiteFooter
    page.tsx                   — homepage: Hero, About, Projects, Contact
    work/page.tsx
    articles/page.tsx
    articles/[slug]/page.tsx
middleware.ts                 — next-intl middleware (locale detect + redirect)
i18n/
  routing.ts                   — locales ["en","ro"], defaultLocale "en", localePrefix "always"
  request.ts                   — getRequestConfig, loads messages per request
messages/
  en.json
  ro.json
```

`/` redirects to `/en`. Every page sets `alternates.languages` in its
`generateMetadata` so `/en/x` and `/ro/x` cross-link correctly for SEO.
Nav (`siteConfig.nav`) becomes locale-aware (labels move to message
catalogs; hrefs stay locale-relative and are built with next-intl's
locale-aware `Link`).

## 5. Design system — two layers

**Layer 1 (exists):** shadcn primitives in `components/ui/*`, plus
`Container`/`Section`/`SectionHeading`. No changes needed beyond what
new sections require (e.g. a `Badge` variant if needed).

**Layer 2 (new):** `components/site/*` — composed, site-specific,
reusable across pages. Every component reads color exclusively through
semantic tokens (`bg-background`, `text-brand`, ...), so it keeps
working unmodified when a new theme is added later. Components:

- `SiteHeader` — logo/name, nav links (from `siteConfig.nav` + message
  catalog), `ThemeToggle` (existing), locale switcher, mobile nav via
  existing `Sheet`.
- `SiteFooter` — social links, email, © line.
- `Hero` — name, `Typewriter`, summary lede, CTA buttons.
- `Typewriter` — small custom hook (`useTypewriter`), not `motion`;
  cycles through localized roles, respects `prefers-reduced-motion`
  (skips animation, shows the first role statically).
- `ProjectCard` — name, description, stack badges, links.
- `TimelineItem` — role, company, period, intro, highlights, stack
  badges; used on `/work`.
- `ArticleCard` — title, excerpt, date, reading time, tags.
- `ContactForm` — react-hook-form + zod, localized labels/validation
  messages, `sonner` success toast, no backend (see §8).

`motion` is used for section-entrance fades/slides (hero, cards on
scroll into view), not for the typewriter itself.

## 6. Content data layer

Raw JSON stays as source data but is not imported directly by
components. A typed layer translates and shapes it:

```
lib/
  content/
    cv.ts        — types (Experience, Project, Education) + getCvContent(locale)
    cv.en.ts      — English content (sourced from CV_Cristian_Gatu.json, as-is)
    cv.ro.ts      — Romanian translation (summary, per-job intro + highlights,
                    project descriptions; company names, tech stack, and
                    periods are translated where they're not proper nouns,
                    e.g. "March 2025 – Present" → "Martie 2025 – Prezent")
```

`siteConfig.roles` (typewriter strings) and other locale-dependent site
strings move into `messages/{en,ro}.json` under a `hero.roles` key
(array) rather than staying hardcoded in `lib/site-config.ts`.

## 7. Homepage (`app/[locale]/page.tsx`)

- **Hero**: name, `Typewriter` over `hero.roles`, one-paragraph summary,
  two CTAs (View projects / Contact me) linking to in-page anchors.
- **About**: 2–3 short paragraphs distilled from the CV summary +
  standout highlights, plus a row of `core_skills` as badges.
- **Projects**: grid of `ProjectCard`, data from
  `getCvContent(locale).projects` (currently 2 entries — Catena
  Electric internal tool, Personal Portfolio). Grid degrades gracefully
  with few items (no fake placeholders).
- **Contact** (`#contact`): `ContactForm`. On submit: client-side
  validation only, then a success toast and form reset — no network
  call. `onSubmit` is a single isolated function so wiring a real
  backend (e.g. Resend via Vercel Marketplace) later is a localized
  change.

## 8. `/work`

Vertical timeline built from `getCvContent(locale).experience` (8
entries): title, company, location, period, intro, highlights, stack
badges. Reuses `Section`/`SectionHeading`/`TimelineItem`. Also renders
education from the same content module.

## 9. `/articles`

Filesystem-backed MDX, no CMS:

```
content/
  articles/
    en/hello-world.mdx
    ro/hello-world.mdx
```

- Frontmatter schema validated with `zod` (title, date, excerpt, tags).
- `lib/content/articles.ts`: `getAllArticles(locale)`,
  `getArticleBySlug(locale, slug)` using `gray-matter` for frontmatter
  and `reading-time` for read time.
- `/articles` lists `ArticleCard`s for the current locale.
- `/articles/[slug]` renders via `next-mdx-remote`, statically generated
  with `generateStaticParams` per locale.
- One example article is written in both `en` and `ro` as the template;
  no other content is invented.

## 10. Out of scope (explicitly not building now)

- Contact form backend/email delivery (no Resend/db integration yet).
- CMS or database-backed articles.
- Additional themes beyond light/dark/system (mechanism must stay
  ready for it, per §2, but no new theme is added).
- GitHub link in `siteConfig.links.github` stays empty/TODO unless the
  user supplies it.

## 11. Implementation phases

1. **Foundation** — `next-intl` install/config (`middleware.ts`,
   `i18n/routing.ts`, `i18n/request.ts`, `messages/en.json` +
   `messages/ro.json` skeletons), replace `app/layout.tsx` with
   `app/[locale]/layout.tsx` as the new root layout (fonts move here
   too — `app/` has no `page.tsx` of its own, so Next.js allows the
   root `<html>/<body>` to live at the `[locale]` segment),
   `SiteHeader`/`SiteFooter`, update metadata (currently still "Create
   Next App").
2. **Content layer** — `lib/content/cv.ts` + `cv.en.ts` + `cv.ro.ts`
   (translation work happens here).
3. **Homepage** — Hero/Typewriter, About, Projects, Contact.
4. **`/work`** — timeline page.
5. **Articles** — MDX loader + `/articles` + `/articles/[slug]` + one
   bilingual example article.

## 12. Testing/verification

- `yarn lint` and `yarn build` must pass (build exercises static
  generation for both locales and the example article).
- Manual pass in a browser: both locales render, locale switch works
  and preserves the current path, theme toggle still works across
  locales, contact form validates and shows the success toast, nav
  works on mobile (`Sheet`).
- No automated test framework exists in the repo yet; none is being
  introduced as part of this build (YAGNI — add one if/when the site
  grows logic worth unit-testing).
