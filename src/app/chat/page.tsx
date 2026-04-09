"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Paperclip, X } from "lucide-react";
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

    const bottomRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

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
            content: trimmed ? `${trimmed}${attachmentSummary}` : `Uploaded${attachmentSummary}`,
        };

        const nextMessages = [...messages, userMessage];
        setMessages(nextMessages);
        setText("");
        setAttachedFiles([]);
        setIsTyping(true);

        try {
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
                {messages.map((message) => (
                    <MessageBubble key={message.id} message={message} />
                ))}

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
                    {attachedFiles.length > 0 && (
                        <div className="flex flex-wrap gap-2 px-1">
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
                    )}

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
                            placeholder="Message Health Copilot"
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