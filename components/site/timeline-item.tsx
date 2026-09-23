"use client";

import { motion } from "motion/react";
import { Badge } from "@/components/ui/badge";
import { useMotionPreference } from "@/components/motion-provider";
import type { Experience } from "@/lib/content/cv";

export function TimelineItem({
  experience,
  index,
  isLast,
}: {
  experience: Experience;
  index: number;
  isLast: boolean;
}) {
  const { reduceMotion } = useMotionPreference();
  const fromX = index % 2 === 0 ? -40 : 40;

  return (
    <motion.div
      // See project-card.tsx for why the remount key is needed: motion/react
      // only reads MotionConfig's reducedMotion setting once, at mount.
      key={String(reduceMotion)}
      initial={reduceMotion ? false : { opacity: 0, x: fromX }}
      whileInView={reduceMotion ? undefined : { opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="relative pl-8"
    >
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
    </motion.div>
  );
}
