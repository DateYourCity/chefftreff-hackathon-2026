import type { ComponentType, ReactNode } from "react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

import { checkInTheme } from "./theme";

export function CheckInChoiceChips({
  options,
  value,
  onChange,
}: {
  options: string[];
  value: string;
  onChange: (next: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2.5">
      {options.map((option) => {
        const selected = value === option;

        return (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            className={cn(
              "rounded-full border px-4 py-2.5 text-sm font-medium transition-all",
              selected
                ? "border-[var(--checkin-brand)] bg-[var(--checkin-brand)] text-white shadow-lg shadow-[var(--checkin-shadow-strong)]"
                : "border-border/70 bg-white/85 text-foreground hover:border-[color:var(--checkin-brand)]/35 hover:bg-[var(--checkin-brand-mint)]"
            )}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}

export function CheckInSectionCard({
  icon: Icon,
  label,
  title,
  description,
  children,
}: {
  icon: ComponentType<{ className?: string }>;
  label: string;
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <Card className={cn("overflow-hidden", checkInTheme.card)}>
      <CardHeader className="gap-5 px-6 pt-6 pb-5">
        <div className="flex items-start gap-4">
          <div
            className={cn(
              "flex size-12 shrink-0 items-center justify-center rounded-2xl shadow-sm",
              checkInTheme.softBrandSurface
            )}
          >
            <Icon className="size-5" />
          </div>
          <div className="min-w-0 space-y-3">
            <Badge
              variant="secondary"
              className={cn(
                "rounded-full px-3 py-1 text-[11px] tracking-[0.18em] uppercase",
                checkInTheme.warmBadge
              )}
            >
              {label}
            </Badge>
            <div className="space-y-1.5">
              <CardTitle className="text-[1.65rem] leading-tight tracking-[-0.06em]">
                {title}
              </CardTitle>
              <CardDescription className="max-w-[31ch]">
                {description}
              </CardDescription>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-5 px-6 pb-6">{children}</CardContent>
    </Card>
  );
}

export function CheckInSurfaceCard({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <Card className={cn("overflow-hidden", checkInTheme.card, className)}>
      {children}
    </Card>
  );
}
