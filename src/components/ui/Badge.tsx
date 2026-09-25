import { cn } from "@/lib/utils";

type Variant = "primary" | "success" | "warning" | "danger" | "neutral";

const styles: Record<Variant, string> = {
  primary: "badge-primary",
  success: "badge-success",
  warning: "badge-warning",
  danger: "badge-danger",
  neutral: "badge-neutral",
};

export function Badge({
  variant = "neutral",
  children,
  className,
}: {
  variant?: Variant;
  children: React.ReactNode;
  className?: string;
}) {
  return <span className={cn("badge", styles[variant], className)}>{children}</span>;
}
