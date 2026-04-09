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
        title: "Review flagged markers first",
        detail: "Start with any values outside the reference range or marked borderline.",
        reason: "This is usually the fastest way to identify what needs follow-up.",
      },
      {
        title: "Group results by category",
        detail: "Review blood count, metabolic markers, and nutrient-related markers separately.",
        reason: "Category-based review makes the report easier to understand.",
      },
      {
        title: "Confirm next test timing",
        detail: "Ask when repeat labs are needed and which markers matter most.",
        reason: "Trend data is often more useful than a single result.",
      },
    ];

    const shopRecommendations: ShopRecommendation[] = [
      {
        title: "Vitamin D3 support",
        detail: "If low vitamin D is confirmed, ask whether a daily supplement is appropriate.",
        href: "https://www.thorne.com/products/dp/vitamin-d-liquid",
        linkLabel: "View Thorne Vitamin D",
      },
      {
        title: "Iron bisglycinate",
        detail: "Only consider iron after reviewing ferritin or iron studies with a clinician.",
        href: "https://solaray.com/products/iron-glycinate",
        linkLabel: "View Iron Option",
      },
    ];

    return {
      kind: "medical-document",
      summaryTitle: "Blood report overview",
      summaryTheme: "Lab interpretation support",
      intro:
        "I reviewed the blood report view. I can help explain common lab sections, highlight what to review first, and help you prepare follow-up questions for your care team.",
      document: {
        id: input.id,
        label: input.label,
        summary:
          "This appears to be a blood report. The most useful first pass is to review flagged values, then look for patterns across blood count, metabolic, and nutrient markers.",
        focusAreas: [
          "Flagged or borderline results",
          "Patterns across related markers",
          "Questions for repeat testing",
        ],
        recommendedQuestions: [
          "Which result matters most clinically?",
          "Do any values need repeat testing?",
          "Could symptoms relate to nutrient or inflammation markers?",
        ],
        recommendations,
        shopRecommendations,
        clinicFollowUp:
          "A follow-up clinic review can confirm which markers need trend monitoring, repeat testing, or treatment.",
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
