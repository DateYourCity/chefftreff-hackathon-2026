"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Brain, Sparkles, Waves } from "lucide-react";
import { useRouter } from "next/navigation";

import {
  CheckInChoiceChips,
  CheckInSectionCard,
  CheckInSurfaceCard,
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
  stress: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
} as const;

function getSupplementRecommendation(data: SubmittedCheckIn) {
  const stress = Number(data.stressLevel);
  const water = Number(data.waterGlasses);

  if (water <= 4) {
    return {
      title: "Electrolyte support",
      detail:
        "An electrolyte drink mix may help support hydration on low-intake days.",
      note: "This fits the low water intake recorded in today’s check-in.",
      href: "https://drinklmnt.com/products/lmnt-recharge-electrolyte-drink",
    };
  }

  if (stress >= 7) {
    return {
      title: "Magnesium glycinate",
      detail:
        "Magnesium glycinate may be worth discussing for evening recovery support.",
      note: "This fits the higher stress level recorded today.",
      href: "https://www.thorne.com/products/dp/magnesium-glycinate",
    };
  }

  return {
    title: "Electrolyte support",
    detail: "A simple hydration support product can help maintain fluid balance.",
    note: "This is an optional suggestion based on your daily check-in.",
    href: "https://drinklmnt.com/products/lmnt-recharge-electrolyte-drink",
  };
}

function buildRecommendations(data: SubmittedCheckIn): Recommendation[] {
  const recommendations: Recommendation[] = [];
  const stress = Number(data.stressLevel);
  const water = Number(data.waterGlasses);

  if (water <= 4) {
    recommendations.push({
      title: "Increase fluids earlier",
      detail: "Aim for 2 glasses in the morning and 2 before mid-afternoon.",
      reason: "Low fluid intake can worsen fatigue, focus, and headache risk.",
    });
  } else {
    recommendations.push({
      title: "Maintain fluid intake",
      detail: "Keep fluids steady across the day instead of catching up late.",
      reason: "Your fluid intake is already within a helpful range.",
    });
  }

  if (stress >= 7) {
    recommendations.push({
      title: "Reduce evening load",
      detail: "Protect 20 to 30 minutes tonight for a calm, screen-light reset.",
      reason: "High stress today suggests recovery needs attention now.",
    });
  } else {
    recommendations.push({
      title: "Keep stress stable",
      detail: "Use one short reset break to keep pressure from building tomorrow.",
      reason: "Your stress level looks manageable today.",
    });
  }

  return recommendations;
}

function buildCoachIntro(data: SubmittedCheckIn, recommendations: Recommendation[]) {
  const stress = Number(data.stressLevel);
  const water = Number(data.waterGlasses);

  return [
    "I reviewed your daily check-in.",
    `You logged ${water} glasses of water and stress ${stress}/10.`,
    "This suggests hydration and stress are the main areas to address today.",
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
  const [waterGlasses, setWaterGlasses] = useState("0");
  const [stressLevel, setStressLevel] = useState("0");
  const [isSummaryCompact, setIsSummaryCompact] = useState(false);
  const [submittedCheckIn, setSubmittedCheckIn] = useState<SubmittedCheckIn | null>(
    null
  );

  const answeredFields = [waterGlasses, stressLevel];

  const completion = Math.round(
    (answeredFields.filter((answer) => answer.trim().length > 0 && answer !== "0").length /
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
      label: "Hydrate",
      value: `${waterGlasses || "0"} glasses`,
      tone: Number(waterGlasses) <= 4 ? "Below target" : "On track",
    },
    {
      label: "Stress",
      value: `${stressLevel}/10`,
      tone: stressTone,
    },
  ];

  const submittedRecommendations = submittedCheckIn
    ? buildRecommendations(submittedCheckIn)
    : [];
  const supplementRecommendation = submittedCheckIn
    ? getSupplementRecommendation(submittedCheckIn)
    : null;

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
      dietQuality: "",
      mealRhythm: "",
      fruitVeg: "0",
      waterGlasses,
      movementType: "",
      movementMinutes: "",
      movementBreaks: "",
      stressLevel,
      sleepSatisfaction: "",
      energyLevel: "",
      reflection: "",
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
        summaryTitle: "Hydration and stress alert",
        summaryTheme: "Short daily check-in",
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

              <div className="mt-7 space-y-4">
                <h1 className="max-w-[11ch] text-[2.7rem] leading-[0.92] font-semibold tracking-[-0.09em] text-foreground">
                   Record today&apos;s health data.
                </h1>
                {/*<p className="max-w-[32ch] text-sm leading-6 text-muted-foreground">
                  Keep this short. Log the two signals that matter most today.
                </p>*/}
              </div>
            </div>

            <div className="mt-6 space-y-5">
              <CheckInSectionCard
                icon={Waves}
                label="Hydration"
                title="Water intake"
                description="Tap the number of glasses you had today."
              >
                <div className="space-y-2.5">
                  <Label className="text-sm font-semibold">Water glasses</Label>
                  <WaterGlassRating
                    value={Number(waterGlasses) || 0}
                    onChange={(next) => setWaterGlasses(String(next))}
                  />
                </div>

                <div className="rounded-3xl bg-[var(--checkin-brand)] p-5 text-white">
                  <p className="text-3xl font-semibold tracking-[-0.06em]">
                    {waterGlasses || "0"}
                  </p>
                  <p className="mt-1.5 text-sm text-[var(--checkin-white-text-soft)]">
                    glasses today
                  </p>
                  <p className="mt-2 text-sm leading-5 text-[var(--checkin-white-text-soft)]">
                    Low intake may affect focus and energy.
                  </p>
                </div>
              </CheckInSectionCard>

              <CheckInSectionCard
                icon={Brain}
                label="Stress"
                title="Stress level"
                description="Choose the level that fits today best."
              >
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between gap-3">
                    <Label className="text-sm font-semibold text-foreground">
                      Stress today
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

                <div className="rounded-3xl bg-[var(--checkin-warm-surface)] p-5">
                  <p className="text-3xl font-semibold tracking-[-0.06em] text-foreground">
                    {stressLevel}/10
                  </p>
                  <p className="mt-1.5 text-sm font-semibold text-foreground">
                    current stress
                  </p>
                  <p className="mt-2 text-sm leading-5 text-muted-foreground">
                    Higher stress increases the need for recovery support.
                  </p>
                </div>
              </CheckInSectionCard>
            </div>

            <div className="mt-6 rounded-[2rem] border border-[var(--checkin-border)] bg-[var(--checkin-card)] p-5 shadow-lg shadow-[var(--checkin-shadow)] backdrop-blur-sm">
              <div className="flex gap-3">
                <Button
                  className={cn("h-12 flex-1 rounded-2xl", checkInTheme.brandButton)}
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
                  The results highlight hydration and stress as the main areas to address.
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
                      Hydration and stress alert
                    </h2>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-3xl border border-[var(--checkin-white-border)] bg-[var(--checkin-white-muted)] p-4">
                    <p className="text-[11px] tracking-[0.16em] text-[var(--checkin-white-text-faint)] uppercase">
                      Hydrate
                    </p>
                    <p className="mt-2 text-base font-semibold">
                      {submittedCheckIn.waterGlasses} glasses
                    </p>
                    <p className="mt-1 text-[11px] text-[var(--checkin-white-text-muted)]">
                      Water intake today
                    </p>
                  </div>
                  <div className="rounded-3xl border border-[var(--checkin-white-border)] bg-[var(--checkin-white-muted)] p-4">
                    <p className="text-[11px] tracking-[0.16em] text-[var(--checkin-white-text-faint)] uppercase">
                      Stress
                    </p>
                    <p className="mt-2 text-base font-semibold">
                      {submittedCheckIn.stressLevel}/10
                    </p>
                    <p className="mt-1 text-[11px] text-[var(--checkin-white-text-muted)]">
                      Reported stress today
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
                        These recommendations are based on today&apos;s short check-in.
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

              {supplementRecommendation && (
                <CheckInSurfaceCard>
                  <CardHeader className="gap-4 px-6 pt-6 pb-5">
                    <div>
                      <CardTitle className="text-[1.7rem] tracking-[-0.06em]">
                        Suggested supplement
                      </CardTitle>
                      <CardDescription className="mt-1 max-w-[31ch]">
                        Optional support based on today&apos;s check-in.
                      </CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4 px-6 pb-6">
                    <div className="rounded-3xl border border-[var(--checkin-border)] bg-white/80 p-4">
                      <p className="text-sm font-semibold text-foreground">
                        {supplementRecommendation.title}
                      </p>
                      <p className="mt-1 text-sm leading-6 text-muted-foreground">
                        {supplementRecommendation.detail}
                      </p>
                      <p className="mt-2 text-xs leading-5 text-[var(--checkin-warm-text)]">
                        {supplementRecommendation.note}
                      </p>
                    </div>

                    <Button
                      asChild
                      className={cn("h-14 w-full rounded-2xl text-base", checkInTheme.brandButton)}
                    >
                      <a
                        href={supplementRecommendation.href}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Buy here
                      </a>
                    </Button>
                  </CardContent>
                </CheckInSurfaceCard>
              )}

              <CheckInSurfaceCard>
                <CardHeader className="gap-4 px-6 pt-6 pb-5">
                  <div>
                    <CardTitle className="text-[1.7rem] tracking-[-0.06em]">
                      Clinic follow-up
                    </CardTitle>
                    <CardDescription className="mt-1 max-w-[31ch]">
                      Recommended next step for higher stress days.
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4 px-6 pb-6">
                  <div className="rounded-3xl border border-[var(--checkin-border)] bg-white/80 p-4">
                    <p className="text-sm font-semibold text-foreground">
                      Stress-Management visit at our local clinic
                    </p>
                    <p className="mt-1 text-sm leading-6 text-muted-foreground">
                      A short clinic visit can help review your current stress load,
                      recovery habits, and practical support options.
                    </p>
                    <p className="mt-2 text-xs leading-5 text-[var(--checkin-warm-text)]">
                      Best fit when stress is recurring or feels harder to manage.
                    </p>
                  </div>

                  <Button
                    asChild
                    className={cn("h-14 w-full rounded-2xl text-base", checkInTheme.brandButton)}
                  >
                    <Link href="/medical_details?tab=visits">Book here</Link>
                  </Button>
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
