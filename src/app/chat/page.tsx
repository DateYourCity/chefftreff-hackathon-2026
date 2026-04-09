"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Database, Paperclip, X } from "lucide-react";
import { useEffect, useRef, useState, type ChangeEvent } from "react";

type MessageRole = "assistant" | "user";

type Message = {
  id: string;
  role: MessageRole;
  content: string;
};

type AttachedFile = {
  id: string;
  file: File;
};

type Recommendation = {
  title: string;
  detail: string;
  reason: string;
};

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

type DailyCheckInChatContext = {
  submittedCheckIn: SubmittedCheckIn;
  recommendations: Recommendation[];
  intro: string;
  summaryTitle: string;
  summaryTheme: string;
};

type ShopRecommendation = {
  title: string;
  detail: string;
  href: string;
  linkLabel: string;
};

const STORAGE_KEY = "daily-checkin-chat-context";

const INITIAL_MESSAGES: Message[] = [
  {
    id: "m-1",
    role: "assistant",
    content:
      "Hello. I reviewed your recent check-in. I can explain the recommendations or help you plan next steps.",
  },
];

function getCoachReply(question: string, data: SubmittedCheckIn) {
  const normalized = question.toLowerCase();
  const stress = Number(data.stressLevel);
  const water = Number(data.waterGlasses);
  const fruitVeg = Number(data.fruitVeg);

  if (normalized.includes("hydr")) {
    return `Hydration is a focus because you logged ${water} glasses. This may affect energy and concentration later in the day.`;
  }

  if (
    normalized.includes("eat") ||
    normalized.includes("meal") ||
    normalized.includes("nutrition")
  ) {
    return "A practical next step is a structured lunch with protein, fiber, and one fruit or vegetable. This would support steadier energy through the afternoon.";
  }

  if (
    normalized.includes("movement") ||
    normalized.includes("exercise") ||
    normalized.includes("activity")
  ) {
    return "Based on today’s activity, a short walk or light mobility session would be a sensible next step. The goal is consistency, not intensity.";
  }

  if (
    normalized.includes("stress") ||
    normalized.includes("sleep") ||
    normalized.includes("energy")
  ) {
    return "Stress, sleep, and energy appear closely linked in this check-in. Improving evening recovery is likely to have the strongest effect on tomorrow.";
  }

  if (
    normalized.includes("priority") ||
    normalized.includes("most important")
  ) {
    if (stress >= 7) {
      return "The main priority is recovery this evening. A calmer routine is likely to help more than adding another task.";
    }

    if (fruitVeg <= 3 || data.mealRhythm !== "Regular meals") {
      return "The main priority is a more stable meal pattern tomorrow, especially at lunch.";
    }

    return "The main priority is to maintain the habits that already worked well today.";
  }

  return "The check-in suggests a mostly stable day with a few manageable issues. A simple, consistent plan for tomorrow is the best next step.";
}

function getShopRecommendations(data: SubmittedCheckIn): ShopRecommendation[] {
  const stress = Number(data.stressLevel);
  const water = Number(data.waterGlasses);
  const sleepIsLow =
    data.sleepSatisfaction === "Poor" || data.sleepSatisfaction === "Fair";

  const recommendations: ShopRecommendation[] = [];

  if (water <= 4) {
    recommendations.push({
      title: "Electrolyte support",
      detail:
        "Consider an electrolyte mix on heavier or lower-intake days to support hydration.",
      href: "https://drinklmnt.com/products/lmnt-recharge-electrolyte-drink",
      linkLabel: "View LMNT",
    });
  }

  if (stress >= 6 || sleepIsLow) {
    recommendations.push({
      title: "Magnesium glycinate",
      detail:
        "If appropriate for you, magnesium glycinate may be worth discussing for evening recovery support.",
      href: "https://www.thorne.com/products/dp/magnesium-glycinate",
      linkLabel: "View Thorne",
    });
  }

  return recommendations;
}

type ChatApiResponse = {
  content?: string;
};

function Avatar() {
  return (
    <div className="mb-1 flex h-8 w-8 items-center justify-center rounded-full bg-slate-800 text-xs font-semibold text-white shadow-sm">
      AI
    </div>
  );
}

function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === "user";

  return (
    <div
      className={cn(
        "flex items-end gap-2",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      {!isUser && <Avatar />}

      <div
        className={cn(
          "max-w-[82%] rounded-3xl px-6 py-5 text-sm leading-relaxed shadow-sm",
          isUser
            ? "rounded-br-md bg-slate-900 text-slate-50"
            : "rounded-bl-md border border-slate-200 bg-white text-slate-700"
        )}
      >
        {message.content}
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex items-end gap-2">
      <Avatar />
      <div className="rounded-3xl rounded-bl-md border border-slate-200 bg-white px-6 py-5 shadow-sm">
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:0ms]" />
          <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:120ms]" />
          <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:240ms]" />
        </div>
      </div>
    </div>
  );
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [text, setText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([]);
  const [context, setContext] = useState<DailyCheckInChatContext | null>(null);

  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const raw = window.sessionStorage.getItem(STORAGE_KEY);

    if (!raw) {
      return;
    }

    try {
      const parsed = JSON.parse(raw) as DailyCheckInChatContext;
      setContext(parsed);
      setMessages([
        {
          id: "checkin-intro",
          role: "assistant",
          content: parsed.intro,
        },
      ]);
      window.sessionStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error("Failed to parse daily check-in chat context", error);
    }
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = "0px";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 144)}px`;
  }, [text]);

  const handleFilesSelected = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    if (files.length === 0) return;

    setAttachedFiles((current) => [
      ...current,
      ...files.map((file) => ({
        id: `${file.name}-${file.lastModified}-${Math.random()}`,
        file,
      })),
    ]);

    event.target.value = "";
  };

  const removeAttachedFile = (id: string) => {
    setAttachedFiles((current) => current.filter((item) => item.id !== id));
  };

  const sendMessage = async () => {
    const trimmed = text.trim();
    const fileCount = attachedFiles.length;

    if ((!trimmed && fileCount === 0) || isTyping) return;

    const attachmentSummary =
      fileCount > 0
        ? ` Attached ${fileCount} file${fileCount === 1 ? "" : "s"}: ${attachedFiles
            .map((item) => item.file.name)
            .join(", ")}.`
        : "";

    const userMessage: Message = {
      id: `u-${Date.now()}`,
      role: "user",
      content: trimmed
        ? `${trimmed}${attachmentSummary}`
        : `Uploaded${attachmentSummary}`,
    };

    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setText("");
    setAttachedFiles([]);
    setIsTyping(true);

    try {
      if (context) {
        const assistantMessage: Message = {
          id: `a-${Date.now()}`,
          role: "assistant",
          content: getCoachReply(trimmed, context.submittedCheckIn),
        };

        setMessages((current) => [...current, assistantMessage]);
        return;
      }

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: nextMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Chat request failed (${response.status}): ${errorText}`);
      }

      const data = (await response.json()) as ChatApiResponse;

      const assistantMessage: Message = {
        id: `a-${Date.now()}`,
        role: "assistant",
        content: data.content ?? "No response received.",
      };

      setMessages((current) => [...current, assistantMessage]);
    } catch (error) {
      console.error(error);

      setMessages((current) => [
        ...current,
        {
          id: `a-${Date.now()}`,
          role: "assistant",
          content: "There was an error contacting the chat service.",
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const shopRecommendations = context
    ? getShopRecommendations(context.submittedCheckIn)
    : [];

  return (
    <div className="relative flex h-full min-h-0 flex-col bg-[radial-gradient(circle_at_top,#fbfcfe_0%,#f1f5fa_50%,#eaf0f7_100%)]">
      <header className="border-b border-slate-200/90 px-4 py-3 backdrop-blur-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
          Personalized Assistant
        </p>
        <div className="mt-1 flex items-end justify-between gap-3">
          <h1 className="text-lg font-semibold text-slate-900">Health Copilot</h1>
          <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-700">
            Live Demo
          </span>
        </div>
      </header>

      <main className="flex-1 space-y-4 overflow-y-auto px-4 py-4 pb-34" aria-live="polite">
        {context && (
          <div className="space-y-4 rounded-3xl border border-slate-200 bg-white/95 p-4 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                  Check-in context
                </p>
                <h2 className="mt-1 text-lg font-semibold text-slate-900">
                  {context.summaryTitle}
                </h2>
              </div>
              <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-800">
                {context.summaryTheme}
              </span>
            </div>

            <div className="grid gap-3">
              {context.recommendations.map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-slate-200 bg-slate-50/90 p-3"
                >
                  <p className="text-sm font-semibold text-slate-900">
                    {item.title}
                  </p>
                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    {item.detail}
                  </p>
                </div>
              ))}
            </div>

            {shopRecommendations.length > 0 && (
              <div className="space-y-3 border-t border-slate-200 pt-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                    Supplement options
                  </p>
                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    These are optional and should be reviewed for fit and safety.
                  </p>
                </div>

                <div className="grid gap-3">
                  {shopRecommendations.map((item) => (
                    <div
                      key={item.title}
                      className="rounded-2xl border border-slate-200 bg-slate-50/90 p-3"
                    >
                      <p className="text-sm font-semibold text-slate-900">
                        {item.title}
                      </p>
                      <p className="mt-1 text-sm leading-6 text-slate-600">
                        {item.detail}
                      </p>
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-2 inline-flex text-sm font-medium text-slate-900 underline underline-offset-4"
                      >
                        {item.linkLabel}
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="rounded-2xl border border-slate-200 bg-slate-50/90 p-3">
              <p className="text-sm font-semibold text-slate-900">
                Follow-up clinic visit
              </p>
              <p className="mt-1 text-sm leading-6 text-slate-600">
                Consider a follow-up visit for more current data such as blood
                pressure, weight, medication review, and any relevant lab work.
              </p>
            </div>
          </div>
        )}

        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}

        {context && (
          <div className="flex flex-wrap gap-2">
            {[
              "Why is hydration important?",
              "What should I prioritize tomorrow?",
              "Which activity would help most?",
            ].map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => setText(prompt)}
                className="rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50"
              >
                {prompt}
              </button>
            ))}
          </div>
        )}

        {isTyping && <TypingIndicator />}
        <div ref={bottomRef} />
      </main>

      <form
        onSubmit={(event) => {
          event.preventDefault();
          sendMessage();
        }}
        className="absolute inset-x-0 bottom-0 border-t border-slate-200/90 bg-white/92 px-3 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] pt-3 backdrop-blur"
      >
        <div className="mx-auto flex max-w-xl flex-col gap-2">
          <div className="flex flex-wrap gap-2 px-1">
            <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-600">
              <Database className="h-3.5 w-3.5 text-slate-500" />
              <span>Health Data</span>
            </div>

            {attachedFiles.map(({ id, file }) => (
              <div
                key={id}
                className="flex max-w-full items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-600"
              >
                <span className="max-w-[11rem] truncate">{file.name}</span>
                <button
                  type="button"
                  onClick={() => removeAttachedFile(id)}
                  className="inline-flex h-4 w-4 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-200 hover:text-slate-700"
                  aria-label={`Remove ${file.name}`}
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>

          <div className="flex items-end gap-2 rounded-3xl border border-slate-200 bg-white px-2.5 py-2 shadow-sm">
            <input
              ref={fileInputRef}
              type="file"
              multiple
              className="hidden"
              onChange={handleFilesSelected}
            />

            <Button
              type="button"
              variant="outline"
              size="icon-sm"
              onClick={() => fileInputRef.current?.click()}
              className="shrink-0 self-center border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
              aria-label="Upload files"
            >
              <Paperclip className="h-4 w-4" />
            </Button>

            <textarea
              ref={textareaRef}
              value={text}
              onChange={(event) => setText(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  sendMessage();
                }
              }}
              rows={1}
              placeholder={
                context
                  ? "Ask about the recommendations or next steps"
                  : "Message Health Copilot"
              }
              className="max-h-36 min-h-10 flex-1 resize-none bg-transparent px-3 py-2 text-sm text-slate-800 outline-none placeholder:text-slate-400"
            />

            <Button
              type="submit"
              disabled={(!text.trim() && attachedFiles.length === 0) || isTyping}
              className="h-10 rounded-2xl px-4 text-sm"
            >
              Send
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
