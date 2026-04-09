"use client";

import { useEffect, useRef, useState } from "react";
import {
  Apple,
  ArrowLeft,
  Brain,
  Dumbbell,
  MessageCircle,
  MoonStar,
  Send,
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
} as const;

type SubmittedCheckIn = {
  dietQuality: string;
  mealRhythm: string;
  fruitVeg: string;
  waterGlasses: string;
  movementType: string;
  movementMinutes: string;
  movementBreaks: string;
  stressLevel: string;
  sleepSatisfaction: string;
  energyLevel: string;
  reflection: string;
};

type Recommendation = {
  title: string;
  detail: string;
  reason: string;
};

type ChatMessage = {
  id: string;
  role: "assistant" | "user";
  content: string;
};

function buildRecommendations(data: SubmittedCheckIn): Recommendation[] {
  const recommendations: Recommendation[] = [];
  const stress = Number(data.stressLevel);
  const water = Number(data.waterGlasses);
  const fruitVeg = Number(data.fruitVeg);
  const activeMinutes = data.movementMinutes;

  if (water <= 4) {
    recommendations.push({
      title: "Front-load hydration tomorrow",
      detail:
        "Aim for 2 glasses before lunch and keep one visible during the afternoon.",
      reason:
        "You logged low hydration, which can amplify afternoon fatigue and stress reactivity.",
    });
  } else {
    recommendations.push({
      title: "Keep the hydration rhythm steady",
      detail:
        "You are close to a strong baseline. Spread glasses earlier in the day so evening catch-up is not needed.",
      reason: "Your hydration is already a usable strength in this check-in.",
    });
  }

  if (fruitVeg <= 3 || data.mealRhythm !== "Regular meals") {
    recommendations.push({
      title: "Stabilize the middle of the day",
      detail:
        "Anchor lunch with protein, fiber, and one easy produce item like fruit, salad, or soup.",
      reason:
        "The meal pattern suggests a realistic risk for a post-lunch energy dip rather than a major nutrition issue.",
    });
  } else {
    recommendations.push({
      title: "Protect what is already working",
      detail:
        "Repeat the same meal structure that felt easiest today instead of over-optimizing tomorrow.",
      reason:
        "Your meal quality and produce intake suggest consistency matters more than adding complexity.",
    });
  }

  if (activeMinutes === "0" || activeMinutes === "<15" || data.movementBreaks === "0") {
    recommendations.push({
      title: "Add one intentional movement anchor",
      detail:
        "Choose a 10 to 15 minute walk after lunch or a short mobility block before dinner.",
      reason:
        "The daily activity pattern is light, so a single reliable anchor is more realistic than a full workout target.",
    });
  } else {
    recommendations.push({
      title: "Convert movement into recovery support",
      detail:
        "Keep the activity, but use one lighter walk or mobility block as a stress reset instead of pushing intensity.",
      reason:
        "You already moved today, so the opportunity is using movement to support recovery, not just volume.",
    });
  }

  if (stress >= 7 || data.sleepSatisfaction === "Poor" || data.energyLevel === "Drained") {
    recommendations.push({
      title: "Reduce friction tonight",
      detail:
        "Keep dinner simple, set a softer evening cutoff, and avoid making tomorrow morning harder than it needs to be.",
      reason:
        "The combination of stress, sleep, and energy suggests recovery capacity is the limiting factor right now.",
    });
  } else {
    recommendations.push({
      title: "Maintain a calm evening runway",
      detail:
        "Use a predictable wind-down and avoid stacking stimulating tasks late in the day.",
      reason:
        "Stress is manageable, so the focus should be preserving that rather than correcting a major issue.",
    });
  }

  return recommendations;
}

function buildCoachIntro(data: SubmittedCheckIn, recommendations: Recommendation[]) {
  const stress = Number(data.stressLevel);
  const fruitVeg = Number(data.fruitVeg);
  const water = Number(data.waterGlasses);

  return [
    "I reviewed your check-in and there is a believable pattern here:",
    `${data.dietQuality.toLowerCase()} meals, ${fruitVeg} produce servings, ${water} glasses of water, ${data.movementMinutes} of ${data.movementType.toLowerCase()} movement, stress ${stress}/10, and ${data.sleepSatisfaction.toLowerCase()} sleep with ${data.energyLevel.toLowerCase()} energy right now.`,
    `The most interesting part is that your day is not broadly off track. It looks more like a realistic afternoon strain pattern: enough healthy intent, but some stress and recovery friction keeping you from feeling fully steady.`,
    `I would start with these priorities: ${recommendations
      .slice(0, 2)
      .map((item) => item.title.toLowerCase())
      .join(" and ")}.`,
    "Ask me anything about why I suggested these, what to do tomorrow, or which recommendation matters most.",
  ].join(" ");
}

function getCoachReply(question: string, data: SubmittedCheckIn) {
  const normalized = question.toLowerCase();
  const stress = Number(data.stressLevel);
  const water = Number(data.waterGlasses);
  const fruitVeg = Number(data.fruitVeg);

  if (normalized.includes("why") && normalized.includes("hydr")) {
    return `Hydration stood out because you logged ${water} glasses. That is not disastrous, but in a day with stress at ${stress}/10 it can make concentration and afternoon energy feel more fragile.`;
  }

  if (normalized.includes("what should i eat") || normalized.includes("meal")) {
    return `I would keep it boring and effective: a protein-centered lunch with one produce anchor and a slow carb. The goal is stability, not perfection, because your check-in reads like a day that benefits from steadiness more than restriction.`;
  }

  if (normalized.includes("exercise") || normalized.includes("movement") || normalized.includes("workout")) {
    return `Based on ${data.movementMinutes} of ${data.movementType.toLowerCase()} movement today, I would not push harder just for the sake of it. A short walk or mobility block tomorrow is probably higher value than chasing a tougher session.`;
  }

  if (normalized.includes("stress") || normalized.includes("sleep") || normalized.includes("energy")) {
    return `The stress-sleep-energy cluster is the strongest explanation for your day. Stress at ${stress}/10 with ${data.sleepSatisfaction.toLowerCase()} sleep and ${data.energyLevel.toLowerCase()} energy suggests recovery is shaping everything else more than motivation is.`;
  }

  if (normalized.includes("most important") || normalized.includes("priority")) {
    if (stress >= 7) {
      return "The highest priority is reducing recovery friction tonight. When stress is elevated, a calmer evening routine is likely to improve tomorrow more than squeezing in extra optimization today.";
    }

    if (fruitVeg <= 3 || data.mealRhythm !== "Regular meals") {
      return "The highest priority is stabilizing meals tomorrow, especially lunch. Your check-in suggests the day would improve most from consistency rather than from a major behavior overhaul.";
    }

    return "The highest priority is preserving your current baseline. Nothing here looks alarming, so the best move is reinforcing the habits that already kept the day fairly stable.";
  }

  return `Given this check-in, I would read the day as mostly functional with one or two friction points rather than a major breakdown. The best next step is to keep tomorrow simple: steady meals, one intentional movement block, and an easier evening runway.`;
}

function ChatBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";

  return (
    <div className={cn("flex", isUser ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[85%] rounded-3xl px-4 py-3 text-sm leading-6 shadow-sm",
          isUser
            ? "rounded-br-md bg-[var(--checkin-brand)] text-white"
            : "rounded-bl-md border border-[var(--checkin-border)] bg-white text-foreground"
        )}
      >
        {message.content}
      </div>
    </div>
  );
}

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
  const [submittedCheckIn, setSubmittedCheckIn] = useState<SubmittedCheckIn | null>(
    null
  );
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");

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

    const recommendations = buildRecommendations(submission);

    setSubmittedCheckIn(submission);
    setChatMessages([
      {
        id: "assistant-initial",
        role: "assistant",
        content: buildCoachIntro(submission, recommendations),
      },
    ]);
    setChatInput("");
    requestAnimationFrame(() => {
      pageRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  const handleSendChat = () => {
    const trimmed = chatInput.trim();

    if (!trimmed || !submittedCheckIn) {
      return;
    }

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: trimmed,
    };

    const assistantMessage: ChatMessage = {
      id: `assistant-${Date.now()}`,
      role: "assistant",
      content: getCoachReply(trimmed, submittedCheckIn),
    };

    setChatMessages((current) => [...current, userMessage, assistantMessage]);
    setChatInput("");
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
                  Daily lifestyle pulse
                </p>
                <h1 className="max-w-[11ch] text-[2.7rem] leading-[0.92] font-semibold tracking-[-0.09em] text-foreground">
                  Log today&apos;s health habits.
                </h1>
                <p className="max-w-[32ch] text-sm leading-6 text-muted-foreground">
                  Start with nourishment, move into activity, then close with
                  stress, sleep, and energy so the flow matches how most people
                  recall a day.
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
                  </div>
                  <div className="rounded-3xl bg-[var(--checkin-brand)] p-5 text-white">
                    <p className="text-3xl font-semibold tracking-[-0.06em]">
                      {waterGlasses || "0"}
                    </p>
                    <p className="mt-1.5 text-sm text-[var(--checkin-white-text-soft)]">
                      glasses today
                    </p>
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
                        This makes the check-in feel current instead of asking
                        users to mentally summarize an entire week.
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
                          Keep the last step open-ended for travel, overtime,
                          illness, social events, or anything else affecting
                          today&apos;s pattern.
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
                  Summary + recommendation chat
                </p>
                <h1 className="max-w-[12ch] text-[2.7rem] leading-[0.92] font-semibold tracking-[-0.09em] text-foreground">
                  Your coach summary is ready.
                </h1>
                <p className="max-w-[33ch] text-sm leading-6 text-muted-foreground">
                  This case reads like a realistic busy-day pattern: decent
                  health intent overall, but recovery friction and afternoon
                  strain are where the recommendations become useful.
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
                      Mostly steady, mildly strained
                    </h2>
                  </div>
                  <div className="rounded-2xl bg-[var(--checkin-white-muted)] px-4 py-3 text-right backdrop-blur-sm">
                    <p className="text-[11px] tracking-[0.18em] text-[var(--checkin-white-text-faint)] uppercase">
                      Main theme
                    </p>
                    <p className="mt-1 text-sm font-medium">
                      Afternoon stress + recovery drag
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
                        Personalized recommendations
                      </CardTitle>
                      <CardDescription className="mt-1 max-w-[31ch]">
                        These are tailored to this specific check-in, not a
                        generic wellness list.
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

              <CheckInSurfaceCard>
                <CardHeader className="gap-4 px-6 pt-6 pb-5">
                  <div className="flex items-start gap-4">
                    <div
                      className={cn(
                        "flex size-12 shrink-0 items-center justify-center rounded-2xl shadow-sm",
                        checkInTheme.softBrandSurface
                      )}
                    >
                      <MessageCircle className="size-5" />
                    </div>
                    <div>
                      <CardTitle className="text-[1.7rem] tracking-[-0.06em]">
                        Ask about the recommendations
                      </CardTitle>
                      <CardDescription className="mt-1 max-w-[31ch]">
                        The coach can explain tradeoffs, suggest next steps, or
                        tell you which recommendation matters most.
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4 px-6 pb-6">
                  <div className="space-y-3 rounded-3xl bg-[var(--checkin-warm-surface)] p-4">
                    {chatMessages.map((message) => (
                      <ChatBubble key={message.id} message={message} />
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {[
                      "Why is hydration a focus?",
                      "What should I prioritize tomorrow?",
                      "What kind of movement would help most?",
                    ].map((prompt) => (
                      <button
                        key={prompt}
                        type="button"
                        onClick={() => setChatInput(prompt)}
                        className="rounded-full border border-[var(--checkin-border)] bg-white px-3 py-2 text-xs font-medium text-foreground transition-colors hover:bg-[var(--checkin-brand-mint)]"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>

                  <form
                    onSubmit={(event) => {
                      event.preventDefault();
                      handleSendChat();
                    }}
                    className="flex items-end gap-3"
                  >
                    <textarea
                      value={chatInput}
                      onChange={(event) => setChatInput(event.target.value)}
                      className="min-h-24 flex-1 rounded-3xl border border-input bg-white px-4 py-3.5 text-sm leading-6 text-foreground shadow-xs outline-none transition-[color,box-shadow] placeholder:text-muted-foreground/80 focus-visible:border-ring focus-visible:ring-4 focus-visible:ring-ring/15"
                      placeholder="Ask why these recommendations were chosen, what to do tomorrow, or how to improve one area without overdoing it."
                    />
                    <Button
                      type="submit"
                      className={cn(
                        "h-12 rounded-2xl px-4",
                        checkInTheme.brandButton
                      )}
                    >
                      <Send className="size-4" />
                      Ask
                    </Button>
                  </form>
                </CardContent>
              </CheckInSurfaceCard>
            </div>
          </>
        )}
      </section>
    </main>
  );
}
