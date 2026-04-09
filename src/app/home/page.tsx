"use client";

import { useMemo, useState } from "react";
import SimpleDAEViewer from "@/components/three-avatar";
import { Button } from "@/components/ui/button";

const animationOptions = [
    { id: "neutral-idle", label: "Neutral Idle", modelPath: "/models/Neutral Idle.dae" },
    { id: "sad-walk", label: "Sad Walk", modelPath: "/models/Sad Walk.dae" },
    { id: "walking", label: "Walking", modelPath: "/models/Walking.dae" },
] as const;

export default function HomePage() {
    const [activeAnimationId, setActiveAnimationId] = useState<(typeof animationOptions)[number]["id"]>("walking");

    const activeAnimation = useMemo(
        () => animationOptions.find((option) => option.id === activeAnimationId) ?? animationOptions[2],
        [activeAnimationId]
    );

    return (
        <section className="h-full w-full px-4 pb-5 pt-4">
            <div className="relative mx-auto h-full w-full max-w-sm overflow-hidden rounded-3xl border border-emerald-200/80 bg-gradient-to-b from-emerald-50 via-teal-50 to-white shadow-[0_16px_40px_rgba(15,118,110,0.14)]">
                <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.35),transparent_72%)]" />

                <div className="relative z-10 px-5 pt-5 text-center">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-700/75">
                        Your Companion
                    </p>
                    <h1 className="mt-2 text-2xl font-bold text-emerald-950">
                        3D Health Avatar
                    </h1>
                    <p className="mt-2 text-sm text-emerald-900/70">
                        Debug animation states with quick switches.
                    </p>

                    <div className="mt-4 grid grid-cols-3 gap-2">
                        {animationOptions.map((option) => {
                            const isActive = activeAnimationId === option.id;

                            return (
                                <Button
                                    key={option.id}
                                    size="sm"
                                    variant={isActive ? "default" : "outline"}
                                    className={isActive ? "bg-emerald-600 text-white hover:bg-emerald-700" : "border-emerald-300/80 text-emerald-900 hover:bg-emerald-100/80"}
                                    onClick={() => setActiveAnimationId(option.id)}
                                >
                                    {option.label}
                                </Button>
                            );
                        })}
                    </div>
                </div>

                <div className="relative z-10 mt-2 h-[56vh] min-h-[370px] w-full p-3">
                    <div className="h-full w-full rounded-2xl bg-gradient-to-b from-emerald-100/55 to-teal-200/30">
                        <SimpleDAEViewer modelPath={activeAnimation.modelPath} />
                    </div>
                </div>
            </div>
        </section>
    );
}
