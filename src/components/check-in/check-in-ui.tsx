import type { ComponentType, ReactNode } from "react";
import { Apple, GlassWater } from "lucide-react";

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

export function WaterGlassRating({
  value,
  max = 8,
  onChange,
}: {
  value: number;
  max?: number;
  onChange: (next: number) => void;
}) {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-4 gap-2.5">
        {Array.from({ length: max }, (_, index) => {
          const glassValue = index + 1;
          const selected = glassValue <= value;

          return (
            <button
              key={glassValue}
              type="button"
              onClick={() => onChange(glassValue === value ? 0 : glassValue)}
              className={cn(
                "group flex flex-col items-center gap-2 rounded-3xl border px-3 py-3 transition-all",
                selected
                  ? "border-[var(--checkin-brand)] bg-[var(--checkin-brand-soft)] text-[var(--checkin-brand)] shadow-md shadow-[var(--checkin-shadow)]"
                  : "border-border/70 bg-white text-muted-foreground hover:border-[var(--checkin-brand)]/35 hover:bg-[var(--checkin-brand-mint)] hover:text-[var(--checkin-brand)]"
              )}
              aria-label={`Set water intake to ${glassValue} glasses`}
              aria-pressed={selected}
            >
              <GlassWater
                className={cn(
                  "size-6 transition-all",
                  selected
                    ? "fill-[var(--checkin-brand)] text-[var(--checkin-brand)]"
                    : "fill-transparent text-current"
                )}
              />
              <span className="text-xs font-medium">{glassValue}</span>
            </button>
          );
        })}
      </div>
      {/*<p className="text-xs leading-5 text-muted-foreground">
        Tap a glass to fill that amount and all previous glasses.
      </p>*/}
    </div>
  );
}

export function ServingRating({
  value,
  max = 8,
  onChange,
}: {
  value: number;
  max?: number;
  onChange: (next: number) => void;
}) {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-4 gap-2.5">
        {Array.from({ length: max }, (_, index) => {
          const servingValue = index + 1;
          const selected = servingValue <= value;

          return (
            <button
              key={servingValue}
              type="button"
              onClick={() => onChange(servingValue === value ? 0 : servingValue)}
              className={cn(
                "group flex flex-col items-center gap-2 rounded-3xl border px-3 py-3 transition-all",
                selected
                  ? "border-[var(--checkin-brand)] bg-[var(--checkin-brand-soft)] text-[var(--checkin-brand)] shadow-md shadow-[var(--checkin-shadow)]"
                  : "border-border/70 bg-white text-muted-foreground hover:border-[var(--checkin-brand)]/35 hover:bg-[var(--checkin-brand-mint)] hover:text-[var(--checkin-brand)]"
              )}
              aria-label={`Set fruit and veg servings to ${servingValue}`}
              aria-pressed={selected}
            >
              <Apple
                className={cn(
                  "size-6 transition-all",
                  selected
                    ? "fill-[var(--checkin-brand)] text-[var(--checkin-brand)]"
                    : "fill-transparent text-current"
                )}
              />
              <span className="text-xs font-medium">{servingValue}</span>
            </button>
          );
        })}
      </div>
     {/* <p className="text-xs leading-5 text-muted-foreground">
        Tap a serving to fill that amount and all previous servings.
      </p>*/}
    </div>
  );
}
