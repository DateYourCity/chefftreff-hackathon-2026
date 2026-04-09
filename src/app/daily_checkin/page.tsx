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
import { useRouter } from "next/navigation";

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
import {
  buildDailyCheckInChatContext,
  type Recommendation,
  type SubmittedCheckIn,
  saveCoachChatContext,
} from "@/lib/chat-context";
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
} as const;

function buildRecommendations(data: SubmittedCheckIn): Recommendation[] {
  const recommendations: Recommendation[] = [];
  const stress = Number(data.stressLevel);
  const water = Number(data.waterGlasses);
  const fruitVeg = Number(data.fruitVeg);
  const activeMinutes = data.movementMinutes;

  if (water <= 4) {
    recommendations.push({
      title: "Increase fluids earlier",
      detail: "Aim for 2 glasses before lunch and 1 in the afternoon.",
      reason:
        "Low fluid intake may worsen fatigue and concentration later in the day.",
    });
  } else {
    recommendations.push({
      title: "Maintain fluid intake",
      detail:
        "Keep the same pattern and spread intake across the day.",
      reason: "Your fluid intake is already within a helpful range.",
    });
  }

  if (fruitVeg <= 3 || data.mealRhythm !== "Regular meals") {
    recommendations.push({
      title: "Improve lunch structure",
      detail: "Add protein, fiber, and one fruit or vegetable at lunch.",
      reason:
        "Meal timing and food quality may be contributing to lower afternoon energy.",
    });
  } else {
    recommendations.push({
      title: "Keep the meal pattern stable",
      detail: "Use the same meal structure again tomorrow.",
      reason:
        "Your meals appear consistent and supportive today.",
    });
  }

  if (activeMinutes === "0" || activeMinutes === "<15" || data.movementBreaks === "0") {
    recommendations.push({
      title: "Add one short activity block",
      detail: "Plan a 10 to 15 minute walk or mobility session tomorrow.",
      reason:
        "A short planned activity is realistic and may improve energy and focus.",
    });
  } else {
    recommendations.push({
      title: "Use movement for recovery",
      detail: "Keep activity light and use it to reduce stress.",
      reason:
        "You were active today, so the next benefit is better recovery.",
    });
  }

  if (stress >= 7 || data.sleepSatisfaction === "Poor" || data.energyLevel === "Drained") {
    recommendations.push({
      title: "Simplify the evening",
      detail: "Keep dinner light and reduce stimulation before bed.",
      reason:
        "Stress and recovery appear to be the main issues today.",
    });
  } else {
    recommendations.push({
      title: "Keep the evening routine",
      detail: "Use a consistent wind-down and avoid late tasks.",
      reason:
        "Your recovery markers are stable and worth maintaining.",
    });
  }

  return recommendations;
}

function buildCoachIntro(data: SubmittedCheckIn, recommendations: Recommendation[]) {
  const stress = Number(data.stressLevel);
  const fruitVeg = Number(data.fruitVeg);
  const water = Number(data.waterGlasses);

  return [
    "I reviewed your daily check-in.",
    `${fruitVeg} produce servings, ${water} glasses of water, ${data.movementMinutes} of ${data.movementType.toLowerCase()} movement, stress ${stress}/10, ${data.sleepSatisfaction.toLowerCase()} sleep, and ${data.energyLevel.toLowerCase()} energy.`,
    `Overall, the day looks mostly stable, with mild strain later in the day.`,
    `Suggested priorities: ${recommendations
      .slice(0, 2)
      .map((item) => item.title.toLowerCase())
      .join(" and ")}.`,
    "You can ask about the recommendations, next steps, or priorities.",
  ].join(" ");
}

export default function DailyCheckInPage() {
  const pageRef = useRef<HTMLElement | null>(null);
  const router = useRouter();
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
  const [submittedCheckIn, setSubmittedCheckIn] = useState<SubmittedCheckIn | null>(
    null
  );

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
      label: "Nourish",
      value: `${fruitVeg || "0"} servings`,
      tone: mealRhythm,
    },
    {
      label: "Move",
      value: movementMinutes,
      tone: movementType,
    },
    {
      label: "Recover",
      value: sleepSatisfaction,
      tone: `${stressLevel}/10 stress`,
    },
  ];

  const submittedRecommendations = submittedCheckIn
    ? buildRecommendations(submittedCheckIn)
    : [];

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

  const handleSubmit = () => {
    const submission: SubmittedCheckIn = {
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
    };

    setSubmittedCheckIn(submission);
    requestAnimationFrame(() => {
      pageRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  const handleOpenChat = () => {
    if (!submittedCheckIn) {
      return;
    }

    saveCoachChatContext(
      buildDailyCheckInChatContext({
        submittedCheckIn,
        recommendations: submittedRecommendations,
        intro: buildCoachIntro(submittedCheckIn, submittedRecommendations),
        summaryTitle: "Stable overall",
        summaryTheme: "Mild recovery strain",
      })
    );

    router.push("/chat");
  };

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
        {!submittedCheckIn ? (
          <>
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
                  Daily check-in
                </p>
                <h1 className="max-w-[11ch] text-[2.7rem] leading-[0.92] font-semibold tracking-[-0.09em] text-foreground">
                  Record today&apos;s health data.
                </h1>
                <p className="max-w-[32ch] text-sm leading-6 text-muted-foreground">
                  Complete the form in a simple daily order: nutrition, movement,
                  and recovery.
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
                className={cn(
                  "transition-all",
                  isSummaryCompact ? "p-4" : "p-6"
                )}
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
                    <span>{isSummaryCompact ? `${completion}%` : "Short form"}</span>
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
                title="Nutrition and hydration"
                description="Record meal quality, meal pattern, fruit and vegetables, and fluids."
              >
                <div className="space-y-3">
                  <Label className="text-sm font-semibold text-foreground">
                    Diet quality
                  </Label>
                  <CheckInChoiceChips
                    options={habitOptions.diet}
                    value={dietQuality}
                    onChange={setDietQuality}
                  />
                </div>

                <div className="space-y-3">
                  <Label className="text-sm font-semibold text-foreground">
                    Meal pattern
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
                    <p className="mt-2 text-sm leading-5 text-muted-foreground">
                      Fruit and vegetables today
                    </p>
                  </div>
                  <div className="rounded-3xl bg-[var(--checkin-brand)] p-5 text-white">
                    <p className="text-3xl font-semibold tracking-[-0.06em]">
                      {waterGlasses || "0"}
                    </p>
                    <p className="mt-1.5 text-sm text-[var(--checkin-white-text-soft)]">
                      glasses today
                    </p>
                    <p className="mt-2 text-sm leading-5 text-[var(--checkin-white-text-soft)]">
                      Daily fluid intake
                    </p>
                  </div>
                </div>
              </CheckInSectionCard>

              <CheckInSectionCard
                icon={Dumbbell}
                label="Movement"
                title="Physical activity"
                description="Record the main activity, active minutes, and movement breaks."
              >
                <div className="space-y-3">
                  <Label className="text-sm font-semibold text-foreground">
                    Main activity
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
                    Activity breaks
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
                        Note
                      </p>
                      <p className="text-sm leading-5 text-muted-foreground">
                        Daily activity data is easier to recall and more useful
                        than weekly estimates.
                      </p>
                    </div>
                  </div>
                </div>
              </CheckInSectionCard>

              <CheckInSectionCard
                icon={MoonStar}
                label="Recovery"
                title="Stress and recovery"
                description="Record stress, sleep, and current energy."
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
                      Sleep quality
                    </Label>
                  <CheckInChoiceChips
                    options={habitOptions.sleep}
                    value={sleepSatisfaction}
                    onChange={setSleepSatisfaction}
                  />
                </div>

                <div className="space-y-3">
                    <Label className="text-sm font-semibold text-foreground">
                      Current energy
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
                          Add context
                        </CardTitle>
                        <CardDescription className="max-w-[29ch]">
                          Add any factor that may have influenced today&apos;s results.
                        </CardDescription>
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-5 px-6 pb-6">
                  <div className="space-y-2.5">
                    <Label htmlFor="reflection" className="text-sm font-semibold">
                      Additional notes
                    </Label>
                    <textarea
                      id="reflection"
                      value={reflection}
                      onChange={(event) => setReflection(event.target.value)}
                      className="min-h-32 w-full rounded-3xl border border-input bg-white px-4 py-3.5 text-sm leading-6 text-foreground shadow-xs outline-none transition-[color,box-shadow] placeholder:text-muted-foreground/80 focus-visible:border-ring focus-visible:ring-4 focus-visible:ring-ring/15"
                      placeholder="For example: travel, overtime, illness, or poor sleep."
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
                  className={cn(
                    "h-12 flex-1 rounded-2xl",
                    checkInTheme.brandButton
                  )}
                  onClick={handleSubmit}
                >
                  Save check-in
                </Button>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="animate-in fade-in slide-in-from-top-3 duration-500">
              <div className="flex items-center justify-between">
                <Badge
                  className={cn(
                    "rounded-full px-3.5 py-1.5 text-[11px] font-semibold tracking-[0.22em] uppercase",
                    checkInTheme.strongCard
                  )}
                >
                  Submitted
                </Badge>
                <Button
                  variant="outline"
                  className="rounded-full border-white/70 bg-white/75 px-4 backdrop-blur-sm"
                  onClick={() => setSubmittedCheckIn(null)}
                >
                  Edit check-in
                </Button>
              </div>

              <div className="mt-7 space-y-4">
                <p className="text-sm font-medium text-[var(--checkin-warm-text)]">
                  Summary and recommendations
                </p>
                <h1 className="max-w-[12ch] text-[2.7rem] leading-[0.92] font-semibold tracking-[-0.09em] text-foreground">
                  Your summary is ready.
                </h1>
                <p className="max-w-[33ch] text-sm leading-6 text-muted-foreground">
                  The results show a mostly stable day with a few areas to
                  improve.
                </p>
              </div>
            </div>

            <CheckInSurfaceCard
              className={cn("mt-7 overflow-hidden", checkInTheme.strongCard)}
            >
              <CardContent className="space-y-5 p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm text-[var(--checkin-white-text-soft)]">
                      Case summary
                    </p>
                    <h2 className="mt-1 text-[1.9rem] leading-none font-semibold tracking-[-0.07em]">
                      Stable overall
                    </h2>
                  </div>
                  <div className="rounded-2xl bg-[var(--checkin-white-muted)] px-4 py-3 text-right backdrop-blur-sm">
                    <p className="text-[11px] tracking-[0.18em] text-[var(--checkin-white-text-faint)] uppercase">
                      Main theme
                    </p>
                    <p className="mt-1 text-sm font-medium">
                      Mild recovery strain
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="rounded-3xl border border-[var(--checkin-white-border)] bg-[var(--checkin-white-muted)] p-4">
                    <p className="text-[11px] tracking-[0.16em] text-[var(--checkin-white-text-faint)] uppercase">
                      Nourish
                    </p>
                    <p className="mt-2 text-base font-semibold">
                      {submittedCheckIn.dietQuality}
                    </p>
                    <p className="mt-1 text-[11px] text-[var(--checkin-white-text-muted)]">
                      {submittedCheckIn.fruitVeg} servings
                    </p>
                  </div>
                  <div className="rounded-3xl border border-[var(--checkin-white-border)] bg-[var(--checkin-white-muted)] p-4">
                    <p className="text-[11px] tracking-[0.16em] text-[var(--checkin-white-text-faint)] uppercase">
                      Move
                    </p>
                    <p className="mt-2 text-base font-semibold">
                      {submittedCheckIn.movementMinutes}
                    </p>
                    <p className="mt-1 text-[11px] text-[var(--checkin-white-text-muted)]">
                      {submittedCheckIn.movementType}
                    </p>
                  </div>
                  <div className="rounded-3xl border border-[var(--checkin-white-border)] bg-[var(--checkin-white-muted)] p-4">
                    <p className="text-[11px] tracking-[0.16em] text-[var(--checkin-white-text-faint)] uppercase">
                      Recover
                    </p>
                    <p className="mt-2 text-base font-semibold">
                      {submittedCheckIn.sleepSatisfaction}
                    </p>
                    <p className="mt-1 text-[11px] text-[var(--checkin-white-text-muted)]">
                      Stress {submittedCheckIn.stressLevel}/10
                    </p>
                  </div>
                </div>
              </CardContent>
            </CheckInSurfaceCard>

            <div className="mt-6 space-y-5">
              <CheckInSurfaceCard>
                <CardHeader className="gap-4 px-6 pt-6 pb-5">
                  <div className="flex items-start gap-4">
                    <div
                      className={cn(
                        "flex size-12 shrink-0 items-center justify-center rounded-2xl shadow-sm",
                        checkInTheme.softBrandSurface
                      )}
                    >
                      <Sparkles className="size-5" />
                    </div>
                    <div>
                        <CardTitle className="text-[1.7rem] tracking-[-0.06em]">
                        Recommendations
                      </CardTitle>
                      <CardDescription className="mt-1 max-w-[31ch]">
                        These recommendations are based on today&apos;s check-in.
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4 px-6 pb-6">
                  {submittedRecommendations.map((item) => (
                    <div
                      key={item.title}
                      className="rounded-3xl border border-[var(--checkin-border)] bg-white/80 p-4"
                    >
                      <p className="text-sm font-semibold text-foreground">
                        {item.title}
                      </p>
                      <p className="mt-1 text-sm leading-6 text-muted-foreground">
                        {item.detail}
                      </p>
                      <p className="mt-2 text-xs leading-5 text-[var(--checkin-warm-text)]">
                        Why: {item.reason}
                      </p>
                    </div>
                  ))}
                </CardContent>
              </CheckInSurfaceCard>

              <div className="rounded-[2rem] border border-[var(--checkin-border)] bg-[var(--checkin-card)] p-5 shadow-lg shadow-[var(--checkin-shadow)] backdrop-blur-sm">
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-foreground">
                    Open recommendation chat
                  </p>
                  <p className="text-sm leading-6 text-muted-foreground">
                    Continue in chat to ask follow-up questions about today&apos;s recommendations.
                  </p>
                </div>
                <Button
                  className={cn("mt-4 h-12 w-full rounded-2xl", checkInTheme.brandButton)}
                  onClick={handleOpenChat}
                >
                  Open chat
                </Button>
              </div>
            </div>
          </>
        )}
      </section>
    </main>
  );
}
