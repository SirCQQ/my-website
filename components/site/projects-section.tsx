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
      <div className="mx-auto mt-12 flex max-w-2xl flex-col gap-10">
        {projects.map((project, index) => (
          <ProjectCard key={project.name} project={project} index={index} />
        ))}
      </div>
    </Section>
  );
}
