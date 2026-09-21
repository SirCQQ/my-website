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
