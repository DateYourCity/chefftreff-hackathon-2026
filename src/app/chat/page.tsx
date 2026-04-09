"use client";

import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";

type MessageRole = "assistant" | "user";

type Message = {
    id: string;
    role: MessageRole;
    content: string;
};

const INITIAL_MESSAGES: Message[] = [
    {
        id: "m-1",
        role: "assistant",
        content:
            "Hi Matthias, I reviewed your latest check-in and wearable trends. Want a quick summary or help drafting questions for your doctor visit?",
    },
    {
        id: "m-2",
        role: "user",
        content: "Give me a quick summary in plain language.",
    },
    {
        id: "m-3",
        role: "assistant",
        content:
            "Here is the short version: your sleep improved this week, stress markers are still elevated in the afternoon, and hydration is lower than your target on 3 out of 7 days.",
    },
];

export default function ChatPage() {
    const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
    const [text, setText] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const feedRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const feed = feedRef.current;
        if (!feed) {
            return;
        }

        feed.scrollTo({
            top: feed.scrollHeight,
            behavior: "smooth",
        });
    }, [messages, isTyping]);

    const sendMessage: React.FormEventHandler<HTMLFormElement> = (event) => {
        event.preventDefault();
        const trimmed = text.trim();

        if (!trimmed || isTyping) {
            return;
        }

        const userMessage: Message = {
            id: `u-${Date.now()}`,
            role: "user",
            content: trimmed,
        };

        setMessages((current) => [...current, userMessage]);
        setText("");
        setIsTyping(true);

        window.setTimeout(() => {
            const assistantMessage: Message = {
                id: `a-${Date.now()}`,
                role: "assistant",
                content:
                    "I can help with that. For this demo, I can summarize trends, suggest next actions, and draft a doctor-ready note from your data.",
            };

            setMessages((current) => [...current, assistantMessage]);
            setIsTyping(false);
        }, 900);
    };

    return (
        <div className="relative flex h-full min-h-0 flex-col bg-[radial-gradient(circle_at_top,#fbfcfe_0%,#f1f5fa_50%,#eaf0f7_100%)]">
            <div className="border-b border-slate-200/90 px-4 py-3 backdrop-blur-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                    Personalized Assistant
                </p>
                <div className="mt-1 flex items-end justify-between gap-3">
                    <h1 className="text-lg font-semibold text-slate-900">Health Copilot</h1>
                    <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-700">
                        Live Demo
                    </span>
                </div>
            </div>

            <div
                ref={feedRef}
                className="flex-1 space-y-4 overflow-y-auto px-4 py-4 pb-34"
                aria-live="polite"
            >
                {messages.map((message) => {
                    const isUser = message.role === "user";

                    return (
                        <div
                            key={message.id}
                            className={`flex items-end gap-2 ${isUser ? "justify-end" : "justify-start"}`}
                        >
                            {!isUser && (
                                <div className="mb-1 flex h-8 w-8 items-center justify-center rounded-full bg-slate-800 text-xs font-semibold text-white shadow-sm">
                                    AI
                                </div>
                            )}

                            <div
                                className={`max-w-[82%] rounded-3xl px-6 py-5 text-sm leading-relaxed shadow-sm ${isUser
                                    ? "rounded-br-md bg-slate-900 text-slate-50"
                                    : "rounded-bl-md border border-slate-200 bg-white text-slate-700"
                                    }`}
                            >
                                {message.content}
                            </div>
                        </div>
                    );
                })}

                {isTyping && (
                    <div className="flex items-end gap-2">
                        <div className="mb-1 flex h-8 w-8 items-center justify-center rounded-full bg-slate-800 text-xs font-semibold text-white shadow-sm">
                            AI
                        </div>
                        <div className="rounded-3xl rounded-bl-md border border-slate-200 bg-white px-6 py-5 shadow-sm">
                            <div className="flex items-center gap-1.5">
                                <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:0ms]" />
                                <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:120ms]" />
                                <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:240ms]" />
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <form
                onSubmit={sendMessage}
                className="absolute inset-x-0 bottom-0 border-t border-slate-200/90 bg-white/92 px-3 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] pt-3 backdrop-blur"
            >
                <div className="mx-auto flex max-w-xl items-end gap-2 rounded-3xl border border-slate-200 bg-white px-2.5 py-2 shadow-sm">
                    <textarea
                        value={text}
                        onChange={(event) => setText(event.target.value)}
                        onKeyDown={(event) => {
                            if (event.key === "Enter" && !event.shiftKey) {
                                event.preventDefault();
                                const form = event.currentTarget.form;
                                if (form) {
                                    form.requestSubmit();
                                }
                            }
                        }}
                        rows={1}
                        placeholder="Message Health Copilot"
                        className="max-h-36 min-h-10 flex-1 resize-none bg-transparent px-3 py-2 text-sm text-slate-800 outline-none placeholder:text-slate-400"
                    />
                    <Button
                        type="submit"
                        disabled={!text.trim() || isTyping}
                        className="h-10 rounded-2xl px-4 text-sm"
                    >
                        Send
                    </Button>
                </div>
            </form>
        </div>
    );
}