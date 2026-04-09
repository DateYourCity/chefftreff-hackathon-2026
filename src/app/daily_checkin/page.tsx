"use client";

import { useEffect, useRef, useState } from "react";
import {
  Apple,
  ArrowLeft,
  Brain,
  Dumbbell,
  MoonStar,
  Sparkles,
} from "lucide-react";

import {
  CheckInChoiceChips,
  CheckInSectionCard,
  CheckInSurfaceCard,
  ServingRating,
  WaterGlassRating,
} from "@/components/check-in/check-in-ui";
import { checkInTheme, checkInThemeVars } from "@/components/check-in/theme";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

const habitOptions = {
  diet: [
    "Mostly whole foods",
    "Balanced with a few treats",
    "Convenience-heavy day",
    "Skipped or irregular meals",
  ],
  meals: [
    "Regular meals",
    "Mostly regular",
    "Skipped one meal",
    "Very irregular",
  ],
  movementType: ["Walking", "Cardio", "Strength", "Mobility", "Mixed", "None"],
  movementMinutes: ["0", "<15", "15-30", "30-45", "45-60", "60+"],
  movementBreaks: ["0", "1-2", "3-4", "5+"],
  stress: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
  sleep: ["Poor", "Fair", "Good", "Restorative"],
  energy: ["Drained", "Low", "Steady", "Good", "High"],
};

export default function DailyCheckInPage() {
  const pageRef = useRef<HTMLElement | null>(null);
  const [dietQuality, setDietQuality] = useState("Balanced with a few treats");
  const [mealRhythm, setMealRhythm] = useState("Mostly regular");
  const [fruitVeg, setFruitVeg] = useState("4");
  const [waterGlasses, setWaterGlasses] = useState("7");
  const [movementType, setMovementType] = useState("Walking");
  const [movementMinutes, setMovementMinutes] = useState("30-45");
  const [movementBreaks, setMovementBreaks] = useState("3-4");
  const [stressLevel, setStressLevel] = useState("4");
  const [sleepSatisfaction, setSleepSatisfaction] = useState("Good");
  const [energyLevel, setEnergyLevel] = useState("Steady");
  const [reflection, setReflection] = useState(
    "Meals felt balanced, I moved more after lunch, and stress was manageable once the afternoon rush passed."
  );
  const [isSummaryCompact, setIsSummaryCompact] = useState(false);

  const answeredFields = [
    dietQuality,
    mealRhythm,
    fruitVeg,
    waterGlasses,
    movementType,
    movementMinutes,
    movementBreaks,
    stressLevel,
    sleepSatisfaction,
    energyLevel,
    reflection,
  ];

  const completion = Math.round(
    (answeredFields.filter((answer) => answer.trim().length > 0).length /
      answeredFields.length) *
      100
  );

  const stressTone =
    Number(stressLevel) <= 3
      ? "Calm baseline"
      : Number(stressLevel) <= 6
        ? "Manageable load"
        : "Recovery needed";

  const dailyHighlights = [
    {
      label: "Nourishment",
      value: `${fruitVeg || "0"} servings`,
      tone: mealRhythm,
    },
    {
      label: "Movement",
      value: movementMinutes,
      tone: movementType,
    },
    {
      label: "Recovery",
      value: sleepSatisfaction,
      tone: `${stressLevel}/10 stress`,
    },
  ];

  useEffect(() => {
    const pageElement = pageRef.current;
    const scrollContainer = pageElement?.closest(".device-screen");

    if (!scrollContainer) {
      return;
    }

    const handleScroll = () => {
      setIsSummaryCompact(scrollContainer.scrollTop > 140);
    };

    handleScroll();
    scrollContainer.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      scrollContainer.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <main
      ref={pageRef}
      style={checkInThemeVars}
      className={cn("relative flex min-h-full flex-col", checkInTheme.root)}
    >
      <div
        aria-hidden="true"
        className={cn(
          "absolute inset-x-[-8%] top-[-3%] h-56 rounded-full blur-3xl",
          checkInTheme.warmGlow
        )}
      />
      <div
        aria-hidden="true"
        className={cn(
          "absolute right-[-20%] bottom-[24%] h-64 w-64 rounded-full blur-3xl",
          checkInTheme.coolGlow
        )}
      />

      <section className="relative mx-auto flex w-full max-w-[430px] flex-1 flex-col px-6 pt-8 pb-10">
        <div className="animate-in fade-in slide-in-from-top-3 duration-500">
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              size="icon-sm"
              className="rounded-full border-white/70 bg-white/75 backdrop-blur-sm"
            >
              <ArrowLeft className="size-4" />
              <span className="sr-only">Back</span>
            </Button>

            <Badge
              className={cn(
                "rounded-full px-3.5 py-1.5 text-[11px] font-semibold tracking-[0.22em] uppercase",
                checkInTheme.strongCard
              )}
            >
              Daily check-in
            </Badge>
          </div>

          <div className="mt-7 space-y-4">
            <p className="text-sm font-medium text-[var(--checkin-warm-text)]">
              Daily lifestyle pulse
            </p>
            <h1 className="max-w-[11ch] text-[2.7rem] leading-[0.92] font-semibold tracking-[-0.09em] text-foreground">
              Log today&apos;s health habits.
            </h1>
            <p className="max-w-[32ch] text-sm leading-6 text-muted-foreground">
              Start with nourishment, move into activity, then close with stress,
              sleep, and energy so the flow matches how most people recall a day.
            </p>
          </div>
        </div>

        <CheckInSurfaceCard
          className={cn(
            "sticky top-[4.5rem] z-20 mt-7 animate-in fade-in slide-in-from-bottom-3 duration-500 transition-all before:pointer-events-none before:absolute before:inset-x-5 before:-bottom-4 before:h-8 before:rounded-full before:bg-[var(--checkin-shadow)]/60 before:blur-2xl",
            checkInTheme.strongCard
          )}
        >
          <CardContent
            className={cn("transition-all", isSummaryCompact ? "p-4" : "p-6")}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1.5">
                <p
                  className={cn(
                    "text-[var(--checkin-white-text-soft)] transition-all",
                    isSummaryCompact ? "text-xs" : "text-sm"
                  )}
                >
                  Check-in progress
                </p>
                <h2
                  className={cn(
                    "leading-none font-semibold tracking-[-0.07em] transition-all",
                    isSummaryCompact ? "text-[1.55rem]" : "text-[2rem]"
                  )}
                >
                  {completion}% logged
                </h2>
              </div>
            </div>

            <div
              className={cn(
                "space-y-2.5 transition-all",
                isSummaryCompact ? "mt-3" : "mt-5"
              )}
            >
              <div
                className={cn(
                  "flex items-center justify-between text-[var(--checkin-white-text-soft)] transition-all",
                  isSummaryCompact ? "text-[11px]" : "text-xs"
                )}
              >
                <span>11 daily prompts</span>
                <span>{isSummaryCompact ? `${completion}%` : "Quick to complete"}</span>
              </div>
              <Progress value={completion} className="h-2.5 bg-white/14" />
            </div>

            {!isSummaryCompact && (
              <div className="mt-5 grid grid-cols-3 gap-3">
                {dailyHighlights.map((item) => (
                  <div
                    key={item.label}
                    className="rounded-3xl border border-[var(--checkin-white-border)] bg-[var(--checkin-white-muted)] p-4 backdrop-blur-sm"
                  >
                    <p className="text-[11px] tracking-[0.16em] text-[var(--checkin-white-text-faint)] uppercase">
                      {item.label}
                    </p>
                    <p className="mt-2.5 text-base font-semibold tracking-[-0.04em]">
                      {item.value}
                    </p>
                    <p className="mt-1.5 text-[11px] leading-4 text-[var(--checkin-white-text-muted)]">
                      {item.tone}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </CheckInSurfaceCard>

        <div className="mt-6 space-y-5">
          <CheckInSectionCard
            icon={Apple}
            label="Nourishment"
            title="Start with food and hydration."
            description="Keep the first section close to how the day actually felt: meal quality, meal rhythm, produce, and fluids."
          >
            <div className="space-y-3">
              <Label className="text-sm font-semibold text-foreground">
                Self-reported diet quality
              </Label>
              <CheckInChoiceChips
                options={habitOptions.diet}
                value={dietQuality}
                onChange={setDietQuality}
              />
            </div>

            <div className="space-y-3">
              <Label className="text-sm font-semibold text-foreground">
                Meal rhythm today
              </Label>
              <CheckInChoiceChips
                options={habitOptions.meals}
                value={mealRhythm}
                onChange={setMealRhythm}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2.5">
                <Label className="text-sm font-semibold">
                  Fruit + veg servings
                </Label>
                <ServingRating
                  value={Number(fruitVeg) || 0}
                  onChange={(next) => setFruitVeg(String(next))}
                />
              </div>
              <div className="space-y-2.5">
                <Label className="text-sm font-semibold">Water glasses</Label>
                <WaterGlassRating
                  value={Number(waterGlasses) || 0}
                  onChange={(next) => setWaterGlasses(String(next))}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-3xl bg-[var(--checkin-warm-surface)] p-5">
                <p className="text-3xl font-semibold tracking-[-0.06em] text-foreground">
                  {fruitVeg || "0"}
                </p>
                <p className="mt-1.5 text-sm font-semibold text-foreground">
                  produce servings
                </p>
                {/*<p className="mt-2 text-sm leading-5 text-muted-foreground">
                  Maps neatly to `fruit_veg_servings_daily`.
                </p>*/}
              </div>
              <div className="rounded-3xl bg-[var(--checkin-brand)] p-5 text-white">
                <p className="text-3xl font-semibold tracking-[-0.06em]">
                  {waterGlasses || "0"}
                </p>
                <p className="mt-1.5 text-sm text-[var(--checkin-white-text-soft)]">
                  glasses today
                </p>
                {/*<p className="mt-2 text-sm leading-5 text-[var(--checkin-white-text-soft)]">
                  A simple daily hydration pulse.
                </p>*/}
              </div>
            </div>
          </CheckInSectionCard>

          <CheckInSectionCard
            icon={Dumbbell}
            label="Movement"
            title="Capture what movement looked like today."
            description="Daily movement is more useful here than weekly frequency, so the questions focus on type, total minutes, and whether the day included activity breaks."
          >
            <div className="space-y-3">
              <Label className="text-sm font-semibold text-foreground">
                Primary movement type
              </Label>
              <CheckInChoiceChips
                options={habitOptions.movementType}
                value={movementType}
                onChange={setMovementType}
              />
            </div>

            <div className="space-y-3">
              <Label className="text-sm font-semibold text-foreground">
                Active minutes today
              </Label>
              <CheckInChoiceChips
                options={habitOptions.movementMinutes}
                value={movementMinutes}
                onChange={setMovementMinutes}
              />
            </div>

            <div className="space-y-3">
              <Label className="text-sm font-semibold text-foreground">
                Movement or stretch breaks
              </Label>
              <CheckInChoiceChips
                options={habitOptions.movementBreaks}
                value={movementBreaks}
                onChange={setMovementBreaks}
              />
            </div>

            <div className="rounded-md border border-[var(--checkin-border)] bg-[var(--checkin-brand-mint)] p-5">
              <div className="flex items-center gap-3.5">
                <div className="flex size-10 items-center justify-center rounded-2xl bg-white text-[var(--checkin-brand)] shadow-sm">
                  <Sparkles className="size-4" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-foreground">
                    Better daily signal
                  </p>
                  <p className="text-sm leading-5 text-muted-foreground">
                    This makes the check-in feel current instead of asking users
                    to mentally summarize an entire week.
                  </p>
                </div>
              </div>
            </div>
          </CheckInSectionCard>

          <CheckInSectionCard
            icon={MoonStar}
            label="Recovery"
            title="Close with stress, sleep, and energy."
            description="These belong together because they shape how the day felt and usually explain the rest of the check-in."
          >
            <div className="space-y-3.5">
              <div className="flex items-center justify-between gap-3">
                <Label className="text-sm font-semibold text-foreground">
                  Stress level
                </Label>
                <Badge
                  variant="secondary"
                  className="rounded-full bg-[#fff3e8] px-3 py-1 text-[var(--checkin-warm-text)]"
                >
                  {stressTone}
                </Badge>
              </div>
              <CheckInChoiceChips
                options={habitOptions.stress}
                value={stressLevel}
                onChange={setStressLevel}
              />
            </div>

            <div className="space-y-3">
              <Label className="text-sm font-semibold text-foreground">
                Last night&apos;s sleep
              </Label>
              <CheckInChoiceChips
                options={habitOptions.sleep}
                value={sleepSatisfaction}
                onChange={setSleepSatisfaction}
              />
            </div>

            <div className="space-y-3">
              <Label className="text-sm font-semibold text-foreground">
                Energy right now
              </Label>
              <CheckInChoiceChips
                options={habitOptions.energy}
                value={energyLevel}
                onChange={setEnergyLevel}
              />
            </div>
          </CheckInSectionCard>

          <CheckInSurfaceCard className="bg-[linear-gradient(180deg,_var(--checkin-card-strong)_0%,_rgba(246,249,247,0.94)_100%)]">
            <CardHeader className="gap-5 px-6 pt-6 pb-5">
              <div className="flex items-start gap-4">
                <div
                  className={cn(
                    "flex size-12 shrink-0 items-center justify-center rounded-2xl shadow-sm",
                    checkInTheme.softBrandSurface
                  )}
                >
                  <Brain className="size-5" />
                </div>
                <div className="space-y-3">
                  <Badge
                    variant="secondary"
                    className={cn(
                      "rounded-full px-3 py-1 text-[11px] tracking-[0.18em] uppercase",
                      checkInTheme.softBadge
                    )}
                  >
                    Context
                  </Badge>
                  <div className="space-y-1.5">
                    <CardTitle className="text-[1.65rem] leading-tight tracking-[-0.06em]">
                      Add anything that explains the day.
                    </CardTitle>
                    <CardDescription className="max-w-[29ch]">
                      Keep the last step open-ended for travel, overtime, illness,
                      social events, or anything else affecting today&apos;s pattern.
                    </CardDescription>
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-5 px-6 pb-6">
              <div className="space-y-2.5">
                <Label htmlFor="reflection" className="text-sm font-semibold">
                  What shaped your habits today?
                </Label>
                <textarea
                  id="reflection"
                  value={reflection}
                  onChange={(event) => setReflection(event.target.value)}
                  className="min-h-32 w-full rounded-3xl border border-input bg-white px-4 py-3.5 text-sm leading-6 text-foreground shadow-xs outline-none transition-[color,box-shadow] placeholder:text-muted-foreground/80 focus-visible:border-ring focus-visible:ring-4 focus-visible:ring-ring/15"
                  placeholder="Travel day, overtime, poor sleep, social plans, soreness, or anything else worth noting."
                />
              </div>
            </CardContent>
          </CheckInSurfaceCard>
        </div>

        <div className="mt-6 rounded-[2rem] border border-[var(--checkin-border)] bg-[var(--checkin-card)] p-5 shadow-lg shadow-[var(--checkin-shadow)] backdrop-blur-sm">
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="h-12 rounded-2xl border-[var(--checkin-border-strong)] bg-white px-5"
            >
              Preview data
            </Button>
            <Button
              className={cn("h-12 flex-1 rounded-2xl", checkInTheme.brandButton)}
            >
              Save check-in
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
