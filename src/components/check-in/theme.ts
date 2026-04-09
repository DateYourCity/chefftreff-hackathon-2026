import type { CSSProperties } from "react";

type CSSVariableStyles = CSSProperties & Record<`--${string}`, string>;

export const checkInThemeVars: CSSVariableStyles = {
  "--checkin-bg-start": "#fff8f1",
  "--checkin-bg-mid": "#f5f7f2",
  "--checkin-bg-end": "#eef4f1",
  "--checkin-glow-warm": "rgba(241, 189, 151, 0.42)",
  "--checkin-glow-cool": "rgba(93, 145, 111, 0.18)",
  "--checkin-brand": "#24543f",
  "--checkin-brand-strong": "#1f4a37",
  "--checkin-brand-soft": "#eef5f0",
  "--checkin-brand-mint": "#f4faf5",
  "--checkin-warm-soft": "#f5eee7",
  "--checkin-warm-surface": "#f7f3ee",
  "--checkin-warm-text": "#8a5f42",
  "--checkin-border": "#dfe7df",
  "--checkin-border-strong": "#d3ddd5",
  "--checkin-card": "rgba(255, 255, 255, 0.8)",
  "--checkin-card-strong": "rgba(255, 255, 255, 0.92)",
  "--checkin-white-muted": "rgba(255, 255, 255, 0.12)",
  "--checkin-white-border": "rgba(255, 255, 255, 0.1)",
  "--checkin-white-text-soft": "rgba(255, 255, 255, 0.72)",
  "--checkin-white-text-faint": "rgba(255, 255, 255, 0.65)",
  "--checkin-white-text-muted": "rgba(255, 255, 255, 0.68)",
  "--checkin-shadow": "rgba(69, 106, 86, 0.08)",
  "--checkin-shadow-strong": "rgba(36, 84, 63, 0.2)",
};

export const checkInTheme = {
  root:
    "bg-[linear-gradient(180deg,_var(--checkin-bg-start)_0%,_var(--checkin-bg-mid)_28%,_var(--checkin-bg-end)_100%)]",
  warmGlow:
    "bg-[radial-gradient(circle,_var(--checkin-glow-warm)_0%,_rgba(241,189,151,0)_72%)]",
  coolGlow:
    "bg-[radial-gradient(circle,_var(--checkin-glow-cool)_0%,_rgba(93,145,111,0)_70%)]",
  card:
    "border-white/70 bg-[var(--checkin-card)] shadow-xl shadow-[var(--checkin-shadow)] backdrop-blur-sm",
  strongCard:
    "border-white/70 bg-[var(--checkin-brand)] text-white shadow-2xl shadow-[var(--checkin-shadow-strong)]",
  brandButton:
    "bg-[var(--checkin-brand)] text-white hover:bg-[var(--checkin-brand-strong)]",
  softBrandSurface:
    "bg-[var(--checkin-brand-soft)] text-[var(--checkin-brand)]",
  warmBadge: "bg-[var(--checkin-warm-soft)] text-[var(--checkin-warm-text)]",
  softBadge: "bg-[var(--checkin-brand-soft)] text-[var(--checkin-brand)]",
} as const;
