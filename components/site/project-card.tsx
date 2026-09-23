"use client";

import Image from "next/image";
import { motion } from "motion/react";
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
import { useMotionPreference } from "@/components/motion-provider";
import type { Project } from "@/lib/content/cv";

export function ProjectCard({
  project,
  index = 0,
}: {
  project: Project;
  index?: number;
}) {
  const t = useTranslations("projects");
  const { reduceMotion } = useMotionPreference();

  return (
    <motion.div
      // Remounting on toggle is required: motion/react only reads
      // MotionConfig's reducedMotion setting once, when a component first
      // mounts — it does not react to it changing afterwards. The key
      // forces a fresh mount (and a fresh read) every time the setting
      // flips, so already-visible cards actually respond to the toggle.
      key={String(reduceMotion)}
      initial={reduceMotion ? false : { opacity: 0, y: 28 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
    >
      <Card className="transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:ring-brand/40">
        {project.image ? (
          <div className="-mx-(--card-spacing) -mt-(--card-spacing) mb-4 flex h-52 items-center justify-center overflow-hidden rounded-t-xl bg-white p-8">
            <Image
              src={project.image}
              alt={project.name}
              width={480}
              height={200}
              className="h-full w-full object-contain transition-transform duration-300 group-hover/card:scale-105"
            />
          </div>
        ) : null}
        <CardHeader>
          <CardTitle>{project.name}</CardTitle>
          {project.period ? (
            <CardDescription>{project.period}</CardDescription>
          ) : null}
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {project.description ? (
            <p className="text-sm text-muted-foreground">
              {project.description}
            </p>
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
    </motion.div>
  );
}
