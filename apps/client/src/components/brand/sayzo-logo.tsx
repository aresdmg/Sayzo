import { cn } from "@/lib/utils";

type SayzoLogoProps = {
  className?: string;
  labelClassName?: string;
  markClassName?: string;
  compact?: boolean;
};

export function SayzoLogo({
  className,
  labelClassName,
  markClassName,
  compact = false,
}: SayzoLogoProps) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div
        className={cn(
          "flex size-9 items-center justify-center rounded-md border border-blue-200/70 bg-blue-600 text-sm font-semibold text-white shadow-sm shadow-blue-950/10",
          compact && "size-8 rounded-md text-xs",
          markClassName
        )}
      >
        S
      </div>
      <div className={cn("font-heading text-base font-semibold tracking-tight text-zinc-950", labelClassName)}>
        Sayzo
      </div>
    </div>
  );
}
