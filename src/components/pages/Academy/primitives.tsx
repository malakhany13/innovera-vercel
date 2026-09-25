import { cn } from "@/lib/utils";

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  surface?: boolean;
  width?: "sm" | "md" | "lg" | "xl";
}

const WIDTHS: Record<NonNullable<SectionProps["width"]>, string> = {
  sm: "max-w-3xl",
  md: "max-w-5xl",
  lg: "max-w-6xl",
  xl: "max-w-7xl",
};

export function Section({
  surface = false,
  width = "lg",
  className,
  children,
  ...props
}: SectionProps) {
  return (
    <section className={cn("py-20", surface && "bg-surface", className)} {...props}>
      <div className={cn("mx-auto px-6", WIDTHS[width])}>{children}</div>
    </section>
  );
}

interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  className?: string;
}

export function SectionHeading({ eyebrow, title, className }: SectionHeadingProps) {
  return (
    <div className={cn("mx-auto max-w-2xl text-center", className)}>
      <span className="eyebrow">{eyebrow}</span>
      <h2 className="mt-3 text-3xl font-extrabold text-primary md:text-4xl">{title}</h2>
    </div>
  );
}
