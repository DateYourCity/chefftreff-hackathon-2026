export const CHAT_CONTEXT_STORAGE_KEY = "coach-chat-context";

export type Recommendation = {
  title: string;
  detail: string;
  reason: string;
};

export type ShopRecommendation = {
  title: string;
  detail: string;
  href: string;
  linkLabel: string;
};

export type SubmittedCheckIn = {
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

export type DailyCheckInChatContext = {
  kind: "daily-checkin";
  submittedCheckIn: SubmittedCheckIn;
  recommendations: Recommendation[];
  intro: string;
  summaryTitle: string;
  summaryTheme: string;
};

export type MedicalDocumentSummary = {
  id: string;
  label: string;
  summary: string;
  riskCallout?: string;
  keyStats?: Array<{
    label: string;
    value: string;
  }>;
  focusAreas: string[];
  recommendedQuestions: string[];
  recommendations: Recommendation[];
  shopRecommendations: ShopRecommendation[];
  clinicFollowUp: string;
};

export type MedicalDocumentChatContext = {
  kind: "medical-document";
  document: MedicalDocumentSummary;
  intro: string;
  summaryTitle: string;
  summaryTheme: string;
};

export type CoachChatContext =
  | DailyCheckInChatContext
  | MedicalDocumentChatContext;

export function saveCoachChatContext(context: CoachChatContext) {
  if (typeof window === "undefined") {
    return;
  }

  window.sessionStorage.setItem(
    CHAT_CONTEXT_STORAGE_KEY,
    JSON.stringify(context)
  );
}

export function buildDailyCheckInChatContext(input: {
  submittedCheckIn: SubmittedCheckIn;
  recommendations: Recommendation[];
  intro: string;
  summaryTitle: string;
  summaryTheme: string;
}): DailyCheckInChatContext {
  return {
    kind: "daily-checkin",
    ...input,
  };
}

export function buildMedicalDocumentChatContext(input: {
  id: string;
  label: string;
}): MedicalDocumentChatContext {
  const normalized = `${input.id} ${input.label}`.toLowerCase();

  if (normalized.includes("blood")) {
    const recommendations: Recommendation[] = [
      {
        title: "Trend matters here",
        detail: "98 mg/dL is still in range, but it is a meaningful rise from your usual 85 mg/dL.",
        reason: "A baseline shift can show early drift before a lab becomes clearly abnormal.",
      },
      {
        title: "Watch glucose direction",
        detail: "This result does not confirm disease, but it suggests movement toward a higher-risk pattern.",
        reason: "Early changes are easier to address than late-stage abnormalities.",
      },
      {
        title: "Plan follow-up data",
        detail: "A repeat fasting glucose or HbA1c can help confirm whether this was a one-off value or a real trend.",
        reason: "Current risk is best judged from change over time, not one isolated result.",
      },
    ];

    const shopRecommendations: ShopRecommendation[] = [];

    return {
      kind: "medical-document",
      summaryTitle: "Glucose trend alert",
      summaryTheme: "Early metabolic drift",
      intro:
        "I reviewed your blood report. Fasting blood sugar is 98 mg/dL. That still looks normal on paper, but it is a clear rise from your baseline of 85 mg/dL and may signal early drift toward a higher-risk zone.",
      document: {
        id: input.id,
        label: input.label,
        summary:
          "This value is still sub-clinical, but the change from 85 to 98 mg/dL matters. The coach reads that shift as an early warning, not a harmless normal result.",
        riskCallout:
          "Normal range does not always mean normal for you. The key issue is the upward change from baseline.",
        keyStats: [
          { label: "Current", value: "98 mg/dL" },
          { label: "Baseline", value: "85 mg/dL" },
          { label: "Change", value: "+13 mg/dL" },
        ],
        focusAreas: [
          "Current value",
          "Baseline change",
          "Next-step testing",
        ],
        recommendedQuestions: [
          "Is this rise clinically relevant for me?",
          "Should I repeat fasting glucose or add HbA1c?",
          "What lifestyle factors could explain this increase?",
        ],
        recommendations,
        shopRecommendations,
        clinicFollowUp:
          "A follow-up visit can confirm whether this is a real metabolic trend and whether repeat fasting glucose, HbA1c, or other current markers are needed.",
      },
    };
  }

  const recommendations: Recommendation[] = [
    {
      title: "Review the main assessment",
      detail: "Start with the stated impression, assessment, or key findings.",
      reason: "That section usually summarizes the most important information.",
    },
    {
      title: "Check medication or care changes",
      detail: "Look for any updates to treatment, monitoring, or referrals.",
      reason: "Plan changes often matter more than the descriptive text.",
    },
    {
      title: "Confirm follow-up timing",
      detail: "Note any recommended follow-up visit, repeat imaging, or lab review.",
      reason: "Clear timing helps turn the report into a concrete plan.",
    },
  ];

  return {
    kind: "medical-document",
    summaryTitle: "Clinical report overview",
    summaryTheme: "Visit summary support",
    intro:
      "I reviewed the clinical report view. I can help summarize the visit, explain common medical wording, and identify which follow-up items are most important.",
    document: {
      id: input.id,
      label: input.label,
      summary:
        "This looks like a clinical report. The clearest way to review it is to focus on the assessment, any plan changes, and what follow-up is expected next.",
      focusAreas: [
        "Assessment or impression",
        "Plan or treatment changes",
        "Recommended follow-up steps",
      ],
      recommendedQuestions: [
        "What is the main conclusion of this report?",
        "Were there any treatment changes?",
        "What should be checked at the next visit?",
      ],
      recommendations,
      shopRecommendations: [],
      clinicFollowUp:
        "A follow-up clinic visit can confirm the current care plan and capture any new symptoms or updated measurements.",
    },
  };
}
