"use client";

import { Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";

import {
  buildMedicalDocumentChatContext,
  saveCoachChatContext,
} from "@/lib/chat-context";

type ExplainByCoachButtonProps = {
  documentId: string;
  documentLabel: string;
};

export function ExplainByCoachButton({
  documentId,
  documentLabel,
}: ExplainByCoachButtonProps) {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => {
        saveCoachChatContext(
          buildMedicalDocumentChatContext({
            id: documentId,
            label: documentLabel,
          })
        );
        router.push("/chat");
      }}
      className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary/90"
    >
      Explain by Coach
      <Sparkles className="h-4 w-4" />
    </button>
  );
}
