import { cn } from "@/lib/utils";
import { Container } from "@/components/ui/container";

export function Section({
  className,
  containerClassName,
  children,
  ...props
}: React.ComponentProps<"section"> & { containerClassName?: string }) {
  return (
    <section className={cn("py-20 sm:py-28", className)} {...props}>
      <Container className={containerClassName}>{children}</Container>
    </section>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  className,
  as = "h2",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  className?: string;
  as?: "h1" | "h2";
}) {
  const Heading = as;

  return (
    <div className={cn("mx-auto max-w-2xl text-center", className)}>
      {eyebrow ? (
        <p className="text-sm font-medium tracking-wide text-brand uppercase">
          {eyebrow}
        </p>
      ) : null}
      <Heading className="mt-3 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
        {title}
      </Heading>
      {description ? (
        <p className="mt-4 text-balance text-muted-foreground">
          {description}
        </p>
      ) : null}
    </div>
  );
}
