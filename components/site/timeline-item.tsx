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
