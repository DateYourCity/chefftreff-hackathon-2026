"use client";

import { useMemo, useState } from "react";
import {
  Apple,
  ArrowLeft,
  Brain,
  Check,
  Dumbbell,
  Droplets,
  MoonStar,
  Sparkles,
} from "lucide-react";

import {
  CheckInChoiceChips,
  CheckInSectionCard,
  CheckInSurfaceCard,
} from "@/components/check-in/check-in-ui";
import { checkInTheme, checkInThemeVars } from "@/components/check-in/theme";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

const habitOptions = {
  diet: [
    "Mostly whole foods",
    "Balanced with a few treats",
    "Convenience-heavy day",
    "Skipped or irregular meals",
  ],
  exercise: ["0", "1-2", "3-4", "5+"],
  stress: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
  sleep: ["Poor", "Fair", "Good", "Restorative"],
};

const dailyHighlights = [
  {
    label: "Diet pulse",
    value: "4.5 servings",
    tone: "Fruit and veg estimate",
  },
  {
    label: "Activity",
    value: "3-4 sessions",
    tone: "Exercise frequency this week",
  },
  {
    label: "Stress",
    value: "4 / 10",
    tone: "Low-to-moderate load",
  },
];

export default function DailyCheckInPage() {
  const [dietQuality, setDietQuality] = useState("Balanced with a few treats");
  const [exerciseFrequency, setExerciseFrequency] = useState("3-4");
  const [stressLevel, setStressLevel] = useState("4");
  const [sleepSatisfaction, setSleepSatisfaction] = useState("Good");
  const [fruitVeg, setFruitVeg] = useState("4.5");
  const [waterGlasses, setWaterGlasses] = useState("7");
  const [reflection, setReflection] = useState(
    "Lunch was balanced, stress rose a bit in the afternoon, and an evening walk helped."
  );

  const completion = useMemo(() => {
    const answers = [
      dietQuality,
      exerciseFrequency,
      stressLevel,
      sleepSatisfaction,
      fruitVeg,
      waterGlasses,
      reflection,
    ];

    return Math.round(
      (answers.filter((answer) => answer.trim().length > 0).length /
        answers.length) *
        100
    );
  }, [
    dietQuality,
    exerciseFrequency,
    stressLevel,
    sleepSatisfaction,
    fruitVeg,
    waterGlasses,
    reflection,
  ]);

  const stressTone =
    Number(stressLevel) <= 3
      ? "Calm baseline"
      : Number(stressLevel) <= 6
        ? "Manageable load"
        : "Recovery needed";

  return (
    <main
      style={checkInThemeVars}
      className={cn(
        "relative flex min-h-full flex-col overflow-hidden",
        checkInTheme.root
      )}
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
            {/*<p className="text-sm font-medium text-[var(--checkin-warm-text)]">
              Lifestyle survey data
            </p>*/}
            <h1 className="max-w-[11ch] text-[2.7rem] leading-[0.92] font-semibold tracking-[-0.09em] text-foreground">
              Log today&apos;s health habits.
            </h1>
            {/*<p className="max-w-[31ch] text-sm leading-6 text-muted-foreground">
              Capture self-reported diet quality, exercise frequency, stress
              level, sleep, and hydration with a guided mobile-friendly survey.
            </p>*/}
          </div>
        </div>

        <CheckInSurfaceCard
          className={cn(
            "mt-7 animate-in fade-in slide-in-from-bottom-3 duration-500",
            checkInTheme.strongCard
          )}
        >
          <CardContent className="p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1.5">
                <p className="text-sm text-[var(--checkin-white-text-soft)]">
                  Check-in progress
                </p>
                <h2 className="text-[2rem] leading-none font-semibold tracking-[-0.07em]">
                  {completion}% logged
                </h2>
              </div>
              { /* 
              <div className="rounded-2xl bg-[var(--checkin-white-muted)] px-4 py-3 text-right backdrop-blur-sm">
                <p className="text-[11px] tracking-[0.18em] text-[var(--checkin-white-text-faint)] uppercase">
                  Outcome
                </p>
                <p className="mt-1 text-sm font-medium">Ready to save</p> 
              </div>*/}
            </div>

            <div className="mt-5 space-y-2.5">
              <div className="flex items-center justify-between text-xs text-[var(--checkin-white-text-soft)]">
                <span>7 lifestyle prompts</span>
                {/*<span>Quick to complete</span>*/}
              </div>
              <Progress value={completion} className="h-2.5 bg-white/14" />
            </div>

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
          </CardContent>
        </CheckInSurfaceCard>

        <div className="mt-6 space-y-5">
          <CheckInSectionCard
            icon={Apple}
            label="Nutrition"
            title="How nourishing did your meals feel?"
            description="Use natural language for the user while still mapping cleanly to structured survey data."
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

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2.5">
                <Label htmlFor="fruit-veg" className="text-sm font-semibold">
                  Fruit + veg servings
                </Label>
                <Input
                  id="fruit-veg"
                  inputMode="decimal"
                  value={fruitVeg}
                  onChange={(event) => setFruitVeg(event.target.value)}
                  className="bg-[#fcfcfa]"
                />
              </div>
              <div className="rounded-3xl bg-[var(--checkin-warm-surface)] p-5">
                <p className="text-xs font-medium tracking-[0.18em] text-[var(--checkin-warm-text)] uppercase">
                  Survey mapping
                </p>
                <p className="mt-2.5 text-sm font-semibold text-foreground">
                  `diet_quality_score`
                </p>
                <p className="mt-1.5 text-sm leading-5 text-muted-foreground">
                  This section also supports `fruit_veg_servings_daily`.
                </p>
              </div>
            </div>
          </CheckInSectionCard>

          <CheckInSectionCard
            icon={Dumbbell}
            label="Movement"
            title="How active have you been this week?"
          >
            <div className="space-y-3">
              <Label className="text-sm font-semibold text-foreground">
                Exercise frequency
              </Label>
              <CheckInChoiceChips
                options={habitOptions.exercise}
                value={exerciseFrequency}
                onChange={setExerciseFrequency}
              />
            </div>

            <div className="rounded-md border border-[var(--checkin-border)] bg-[var(--checkin-brand-mint)] p-5">
              <div className="flex items-center gap-3.5">
                <div className="flex size-10 items-center justify-center rounded-2xl bg-white text-[var(--checkin-brand)] shadow-sm">
                  <Sparkles className="size-4" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-foreground">
                    Tip
                  </p>
                  <p className="text-sm leading-5 text-muted-foreground">
                   Connect your fitness tracker for better data.
                  </p>
                </div>
              </div>
            </div>
          </CheckInSectionCard>

          <CheckInSectionCard
            icon={Brain}
            label="Stress"
            title="What does your stress level feel like?"
            description="Keep the clinical 1 to 10 scale, but present it with softer framing."
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
          </CheckInSectionCard>

          <CheckInSectionCard
            icon={MoonStar}
            label="Recovery"
            title="How restorative was your sleep?"
            description="A friendly recovery prompt helps the screen feel less like a spreadsheet and more like a guided check-in."
          >
            <div className="space-y-3">
              <Label className="text-sm font-semibold text-foreground">
                Sleep satisfaction
              </Label>
              <CheckInChoiceChips
                options={habitOptions.sleep}
                value={sleepSatisfaction}
                onChange={setSleepSatisfaction}
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
                  <Droplets className="size-5" />
                </div>
                <div className="space-y-3">
                  <Badge
                    variant="secondary"
                    className={cn(
                      "rounded-full px-3 py-1 text-[11px] tracking-[0.18em] uppercase",
                      checkInTheme.softBadge
                    )}
                  >
                    Hydration
                  </Badge>
                  <div className="space-y-1.5">
                    <CardTitle className="text-[1.65rem] leading-tight tracking-[-0.06em]">
                      Add a couple of quick numeric entries.
                    </CardTitle>
                    <CardDescription className="max-w-[29ch]">
                      Finish the survey with simple hydration data and an
                      optional context note.
                    </CardDescription>
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-5 px-6 pb-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2.5">
                  <Label htmlFor="water" className="text-sm font-semibold">
                    Water glasses
                  </Label>
                  <Input
                    id="water"
                    inputMode="numeric"
                    value={waterGlasses}
                    onChange={(event) => setWaterGlasses(event.target.value)}
                    className="bg-white"
                  />
                </div>
                <div className="rounded-3xl bg-[var(--checkin-brand)] p-5 text-white">
                  <p className="text-xs tracking-[0.18em] text-[var(--checkin-white-text-faint)] uppercase">
                    Logged now
                  </p>
                  <p className="mt-2.5 text-3xl font-semibold tracking-[-0.06em]">
                    {waterGlasses || "0"}
                  </p>
                  <p className="mt-1.5 text-sm text-[var(--checkin-white-text-soft)]">
                    glasses today
                  </p>
                </div>
              </div>

              <Separator />

              <div className="space-y-2.5">
                <Label htmlFor="reflection" className="text-sm font-semibold">
                  Anything affecting your routine today?
                </Label>
                <textarea
                  id="reflection"
                  value={reflection}
                  onChange={(event) => setReflection(event.target.value)}
                  className="min-h-32 w-full rounded-3xl border border-input bg-white px-4 py-3.5 text-sm leading-6 text-foreground shadow-xs outline-none transition-[color,box-shadow] placeholder:text-muted-foreground/80 focus-visible:border-ring focus-visible:ring-4 focus-visible:ring-ring/15"
                  placeholder="Travel day, overtime, poor sleep, social plans, or anything else worth noting."
                />
              </div>
            </CardContent>
          </CheckInSurfaceCard>
        </div>

        <div className="mt-6 rounded-[2rem] border border-[var(--checkin-border)] bg-[var(--checkin-card)] p-5 shadow-lg shadow-[var(--checkin-shadow)] backdrop-blur-sm">
          <div className="flex items-start gap-3.5">
            <div className="mt-0.5 flex size-10 items-center justify-center rounded-2xl bg-[var(--checkin-brand)] text-white">
              <Check className="size-4" />
            </div>
            <div className="space-y-1.5">
              <p className="text-sm font-semibold text-foreground">
                Submission preview
              </p>
              <p className="text-sm leading-5 text-muted-foreground">
                This screen captures the core lifestyle survey inputs in a way
                that is approachable for patients and straightforward to map
                into structured records.
              </p>
            </div>
          </div>

          <div className="mt-5 flex gap-3">
            <Button
              className={cn(
                "h-12 flex-1 rounded-2xl",
                checkInTheme.brandButton
              )}
            >
              Save check-in
            </Button>
            <Button
              variant="outline"
              className="h-12 rounded-2xl border-[var(--checkin-border-strong)] bg-white px-5"
            >
              Preview data
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
