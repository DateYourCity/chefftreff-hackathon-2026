"use client";

import SimpleDAEViewer from "@/components/three-avatar";
import { Button } from "@/components/ui/button";
import { useEffect, useMemo, useRef, useState } from "react";

const animationOptions = [
    { id: "neutral-idle", label: "Neutral Idle", modelPath: "/models/Neutral Idle.dae" },
    { id: "sad-walk", label: "Sad Walk", modelPath: "/models/Sad Walk.dae" },
    { id: "walking", label: "Walking", modelPath: "/models/Walking.dae" },
] as const;

export default function HomePage() {
    const [activeAnimationId, setActiveAnimationId] = useState<(typeof animationOptions)[number]["id"]>("walking");
    const [sheetOffset, setSheetOffset] = useState(280);
    const [sheetTravel, setSheetTravel] = useState(280);
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [isDraggingSheet, setIsDraggingSheet] = useState(false);
    const sheetRef = useRef<HTMLDivElement | null>(null);
    const dragStartYRef = useRef(0);
    const dragStartOffsetRef = useRef(0);
    const currentOffsetRef = useRef(280);

    const activeAnimation = useMemo(
        () => animationOptions.find((option) => option.id === activeAnimationId) ?? animationOptions[2],
        [activeAnimationId]
    );

    useEffect(() => {
        currentOffsetRef.current = sheetOffset;
    }, [sheetOffset]);

    useEffect(() => {
        const sheetElement = sheetRef.current;
        if (!sheetElement) {
            return;
        }

        const PEEK_HEIGHT = 92;

        const updateTravelDistance = () => {
            const nextTravel = Math.max(sheetElement.getBoundingClientRect().height - PEEK_HEIGHT, 0);
            setSheetTravel(nextTravel);
            setSheetOffset(isSheetOpen ? 0 : nextTravel);
        };

        updateTravelDistance();

        const resizeObserver = new ResizeObserver(updateTravelDistance);
        resizeObserver.observe(sheetElement);

        return () => {
            resizeObserver.disconnect();
        };
    }, [isSheetOpen]);

    const updateSheetOpenState = (open: boolean) => {
        setIsSheetOpen(open);
        setSheetOffset(open ? 0 : sheetTravel);
    };

    const handleSheetPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
        dragStartYRef.current = event.clientY;
        dragStartOffsetRef.current = currentOffsetRef.current;
        setIsDraggingSheet(true);
        event.currentTarget.setPointerCapture(event.pointerId);
    };

    const handleSheetPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
        if (!isDraggingSheet) {
            return;
        }

        const draggedDistance = event.clientY - dragStartYRef.current;
        const nextOffset = Math.min(Math.max(dragStartOffsetRef.current + draggedDistance, 0), sheetTravel);
        setSheetOffset(nextOffset);
    };

    const handleSheetPointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
        if (!isDraggingSheet) {
            return;
        }

        setIsDraggingSheet(false);
        event.currentTarget.releasePointerCapture(event.pointerId);
        const shouldOpen = currentOffsetRef.current < sheetTravel * 0.5;
        updateSheetOpenState(shouldOpen);
    };

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

                <div
                    ref={sheetRef}
                    className="absolute inset-x-0 bottom-0 z-20 h-[70%] rounded-t-3xl border-t border-emerald-200/80 bg-white/95 backdrop-blur-sm"
                    style={{
                        transform: `translateY(${sheetOffset}px)`,
                        transition: isDraggingSheet ? "none" : "transform 250ms ease",
                    }}
                >
                    <div
                        className="cursor-grab touch-none px-5 pb-4 pt-3 active:cursor-grabbing"
                        onPointerDown={handleSheetPointerDown}
                        onPointerMove={handleSheetPointerMove}
                        onPointerUp={handleSheetPointerUp}
                        onPointerCancel={handleSheetPointerUp}
                    >
                        <div className="mx-auto h-1.5 w-12 rounded-full bg-emerald-300" />
                        <div className="mt-3 flex items-center justify-between">
                            <h2 className="text-base font-semibold text-emerald-950">Coach Notes</h2>
                            <Button
                                size="sm"
                                variant="outline"
                                className="border-emerald-300/90 text-emerald-900"
                                onClick={() => updateSheetOpenState(!isSheetOpen)}
                            >
                                {isSheetOpen ? "Collapse" : "Expand"}
                            </Button>
                        </div>
                    </div>

                    <div className="space-y-3 px-5 pb-6">
                        <div className="rounded-2xl border border-emerald-100 bg-emerald-50/70 p-3">
                            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-emerald-700/80">Daily focus</p>
                            <p className="mt-1 text-sm text-emerald-950">Try the Neutral Idle animation before check-in to calibrate posture and breath baseline.</p>
                        </div>
                        <div className="rounded-2xl border border-teal-100 bg-teal-50/70 p-3">
                            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-teal-700/80">Quick reminder</p>
                            <p className="mt-1 text-sm text-teal-950">Pull this sheet up anytime to show additional coaching cards, progress, and suggested routines.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
