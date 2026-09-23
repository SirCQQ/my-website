import { ImageResponse } from "next/og";
import { getTranslations } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing } from "@/i18n/routing";
import { siteConfig } from "@/lib/site-config";

export const alt = siteConfig.name;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

async function loadGoogleFont(text: string, weight: number) {
  const url = `https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@${weight}&text=${encodeURIComponent(text)}`;
  const css = await (await fetch(url)).text();
  const match = css.match(/src: url\(([^)]+)\) format\('(?:opentype|truetype)'\)/);

  if (match) {
    const response = await fetch(match[1]);
    if (response.ok) return response.arrayBuffer();
  }

  throw new Error("Failed to load Google Font for the OG image");
}

export default async function Image({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const requested = (await params).locale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  const t = await getTranslations({ locale, namespace: "meta" });
  const tHero = await getTranslations({ locale, namespace: "hero" });
  const roles = tHero.raw("roles") as string[] | undefined;
  const roleLine = (roles ?? []).join(" · ");
  const description = t("description");

  const fullText = `${siteConfig.name} ${roleLine} ${description}`;
  const [regular, bold] = await Promise.all([
    loadGoogleFont(fullText, 400),
    loadGoogleFont(fullText, 700),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "#0a0a0a",
          fontFamily: "JetBrains Mono",
        }}
      >
        <div style={{ display: "flex", color: "#34d399", fontSize: 28 }}>
          {"> "}
          {siteConfig.name}
        </div>
        <div
          style={{
            display: "flex",
            color: "#fafafa",
            fontSize: 56,
            fontWeight: 700,
            marginTop: 24,
            maxWidth: 1000,
          }}
        >
          {roleLine}
        </div>
        <div
          style={{
            display: "flex",
            color: "#a3a3a3",
            fontSize: 28,
            marginTop: 32,
            maxWidth: 900,
          }}
        >
          {description}
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "JetBrains Mono", data: regular, weight: 400, style: "normal" },
        { name: "JetBrains Mono", data: bold, weight: 700, style: "normal" },
      ],
    }
  );
}
