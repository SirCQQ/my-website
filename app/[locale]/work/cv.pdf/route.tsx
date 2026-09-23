import { Font, renderToBuffer } from "@react-pdf/renderer";
import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { getCvContent } from "@/lib/content/cv";
import { CvDocument } from "@/components/pdf/cv-document";
import { loadGoogleFont } from "@/lib/google-font";

let fontsRegistered: Promise<void> | null = null;

function registerCvFonts() {
  if (!fontsRegistered) {
    fontsRegistered = (async () => {
      const [regular, bold] = await Promise.all([
        loadGoogleFont("Inter", 400),
        loadGoogleFont("Inter", 700),
      ]);
      Font.register({
        family: "Inter",
        fonts: [
          { src: `data:font/ttf;base64,${Buffer.from(regular).toString("base64")}`, fontWeight: 400 },
          { src: `data:font/ttf;base64,${Buffer.from(bold).toString("base64")}`, fontWeight: 700 },
        ],
      });
    })();
  }
  return fontsRegistered;
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ locale: string }> }
) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  await registerCvFonts();

  const cv = getCvContent(locale);
  const buffer = await renderToBuffer(<CvDocument cv={cv} locale={locale} />);

  return new Response(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="cristian-gatu-cv-${locale}.pdf"`,
      "Cache-Control": "public, max-age=3600",
    },
  });
}
