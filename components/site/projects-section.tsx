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
