"use client";

import Sheet from "@/app/avatar/intro/sheet";
import { useEffect, useRef, useState } from "react";

const vitalBubbles = [
    {
        id: "blood-sugar",
        label: "Blood Sugar",
        value: <>98 <span className="text-sm">mg/dL</span></>,
        source: "EHR",
        tone: "from-rose-500 to-red-600",
        textTone: "text-rose-50",
        position: "left-1 top-12",
    },
    {
        id: "sleep",
        label: "Sleep",
        value: "4.4 / 10",
        source: "Apple Watch",
        tone: "from-rose-500 to-red-600",
        textTone: "text-rose-50",
        position: "right-1 top-12",
    },
    {
        id: "heart-rate",
        label: <>Vo<sub>2</sub> max</>,
        value: <>47 <span className="text-sm">ml/kg/min</span></>,
        source: "Apple Watch",
        tone: "from-emerald-400 to-green-500",
        textTone: "text-emerald-950",
        position: "left-3 bottom-14",
    },
    {
        id: "stress-level",
        label: "Stress Level",
        value: "??",
        source: "Checkin",
        tone: "from-slate-400 to-zinc-500",
        textTone: "text-slate-950",
        position: "right-3 bottom-14",
    },

] as const;

export default function HomePage() {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const timeOutRef = useRef<NodeJS.Timeout | null>(null);
    const [isBubblesShown, setIsBubblesShown] = useState(false);

    useEffect(() => {
        const videoElement = videoRef.current;
        videoElement?.play();

        timeOutRef.current = setTimeout(() => {
            setIsBubblesShown(true);
        }, 3800);

        return () => {
            if (timeOutRef.current) {
                clearTimeout(timeOutRef.current);
            }
        };
    }, []);

    return (
        <section className="h-full w-full bg-white px-4 pb-5 pt-4 relative">
            <div className="relative mx-auto flex h-full w-full max-w-sm flex-col overflow-hidden rounded-[32px] border border-slate-200/80 bg-white px-5 py-6 shadow-[0_24px_60px_rgba(15,23,42,0.14)]">
                <div className="pointer-events-none absolute inset-x-4 top-0 h-28 rounded-full" />

                <div style={{zIndex: 999}} className="relative z-10">
                    <div className="mx-auto flex w-full max-w-[220px] flex-col items-center rounded-[26px] border border-slate-200 bg-slate-50 px-4 py-3 text-center shadow-[0_12px_30px_rgba(15,23,42,0.06)]">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">
                            Biological Age
                        </p>
                        <p className="mt-2 text-3xl font-semibold text-slate-950">
                            {isBubblesShown ? "46" : "Loading..."}
                        </p>
                    </div>
                </div>

                <div style={{marginTop: "-30px"}} className="relative z-10 flex-1">
                    <div className="relative mx-auto flex h-full min-h-[520px] w-full max-w-[320px] items-center justify-center">

                        <div className="relative flex h-[420px] w-[260px] items-center justify-center">
                            <video
                                ref={videoRef}
                                style={{
                                    marginTop: "-90px",
                                    width: "260px",
                                    height: "420px",
                                }}
                                src="/avatar/wave_sad.mp4"
                                muted
                                loop
                                playsInline
                                className="object-cover"
                            />
                        </div>

                        {vitalBubbles.map((bubble, index) => (
                            <div
                                key={bubble.id}
                                className={`absolute z-20 w-[128px] rounded-[26px] bg-gradient-to-br ${bubble.tone} p-[1px] shadow-[0_18px_36px_rgba(15,23,42,0.16)] transition-all duration-700 ${bubble.position} ${
                                    isBubblesShown
                                        ? "translate-y-0 opacity-100"
                                        : index % 2 === 0
                                            ? "translate-y-4 opacity-0"
                                            : "-translate-y-4 opacity-0"
                                }`}
                                style={{ transitionDelay: `${index * 140}ms` }}
                            >
                                <div className="rounded-[25px] bg-slate-950/20 px-3 py-3 backdrop-blur-md">
                                    <p className={`text-[10px] font-semibold uppercase tracking-[0.2em] ${bubble.textTone} opacity-80`}>
                                        {bubble.label}
                                    </p>
                                    <p className={`mt-1 text-lg font-semibold ${bubble.textTone}`}>
                                        {bubble.value}
                                    </p>
                                    <p className={`mt-1 text-[9px] font-normal uppercase tracking-[0.14em] ${bubble.textTone} opacity-50`}>
                                        {bubble.source}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <Sheet />

        </section>
    );
}
