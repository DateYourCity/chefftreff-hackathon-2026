"use client";

import userData from "@/app/chat/user_data.json";
import SimpleDAEViewer from "@/components/three-avatar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

type CompactTable = {
    c: string[];
    v: string[][];
};

function tableRowToRecord(table: CompactTable, rowIndex = 0): Record<string, string> {
    const row = table.v[rowIndex] ?? [];
    return Object.fromEntries(table.c.map((column, index) => [column, row[index] ?? ""])) as Record<string, string>;
}

function toNumber(value: string | undefined): number | null {
    if (!value) {
        return null;
    }

    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
}

function clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
}

function average(values: Array<number | null>): number | null {
    const validValues = values.filter((value): value is number => value !== null);
    if (validValues.length === 0) {
        return null;
    }

    return validValues.reduce((sum, value) => sum + value, 0) / validValues.length;
}

type InsightTone = "good" | "warn" | "bad";

function getTone(value: number, goodMin: number, warnMin: number): InsightTone {
    if (value >= goodMin) {
        return "good";
    }

    if (value >= warnMin) {
        return "warn";
    }

    return "bad";
}

const toneStyles: Record<InsightTone, { badge: string; bar: string; label: string }> = {
    good: {
        badge: "bg-emerald-100 text-emerald-800 border-emerald-200",
        bar: "bg-emerald-500",
        label: "On track",
    },
    warn: {
        badge: "bg-amber-100 text-amber-800 border-amber-200",
        bar: "bg-amber-500",
        label: "Needs attention",
    },
    bad: {
        badge: "bg-rose-100 text-rose-800 border-rose-200",
        bar: "bg-rose-500",
        label: "Off track",
    },
};

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

    const healthInsights = useMemo(() => {
        const wearTable = userData.wear as CompactTable;
        const wearRows = wearTable.v;
        const latestIndex = Math.max(wearRows.length - 1, 0);
        const latest = tableRowToRecord(wearTable, latestIndex);
        const recentRows = wearRows.slice(-7);
        const latestDate = latest.date
            ? new Date(latest.date).toLocaleDateString("en-GB", { day: "2-digit", month: "short" })
            : "-";

        const pickMetric = (columnName: string, row: string[]) => {
            const metricIndex = wearTable.c.indexOf(columnName);
            if (metricIndex < 0) {
                return null;
            }

            return toNumber(row[metricIndex]);
        };

        const avgSteps7d = average(recentRows.map((row) => pickMetric("steps", row)));
        const avgSleep7d = average(recentRows.map((row) => pickMetric("sleep_duration_hrs", row)));
        const avgRhr7d = average(recentRows.map((row) => pickMetric("resting_hr_bpm", row)));
        const avgHrv7d = average(recentRows.map((row) => pickMetric("hrv_rmssd_ms", row)));

        const latestSteps = toNumber(latest.steps);
        const latestSleep = toNumber(latest.sleep_duration_hrs);
        const latestSleepQuality = toNumber(latest.sleep_quality_score);
        const latestRhr = toNumber(latest.resting_hr_bpm);
        const latestHrv = toNumber(latest.hrv_rmssd_ms);
        const latestActiveMinutes = toNumber(latest.active_minutes);

        const stepsTone = latestSteps ? getTone(latestSteps, 7000, 5000) : "warn";
        const sleepTone = latestSleep ? getTone(latestSleep, 7, 6) : "warn";
        const activeTone = latestActiveMinutes ? getTone(latestActiveMinutes, 20, 12) : "warn";

        const hrvTone: InsightTone = latestHrv
            ? latestHrv >= 25
                ? "good"
                : latestHrv >= 22
                    ? "warn"
                    : "bad"
            : "warn";

        const hrTone: InsightTone = latestRhr
            ? latestRhr <= 80
                ? "good"
                : latestRhr <= 88
                    ? "warn"
                    : "bad"
            : "warn";

        const qualityTone: InsightTone = latestSleepQuality
            ? latestSleepQuality >= 70
                ? "good"
                : latestSleepQuality >= 55
                    ? "warn"
                    : "bad"
            : "warn";

        const sleepNorm = latestSleep ? clamp(1 - Math.abs(latestSleep - 7.5) / 2.5, 0, 1) : 0.5;
        const qualityNorm = latestSleepQuality ? clamp(latestSleepQuality / 100, 0, 1) : 0.5;
        const hrvNorm = latestHrv ? clamp((latestHrv - 15) / 20, 0, 1) : 0.5;
        const hrNorm = latestRhr ? clamp((95 - latestRhr) / 20, 0, 1) : 0.5;
        const recoveryScore = Math.round((sleepNorm * 0.25 + qualityNorm * 0.35 + hrvNorm * 0.2 + hrNorm * 0.2) * 100);

        const recoveryTone: InsightTone = recoveryScore >= 75 ? "good" : recoveryScore >= 55 ? "warn" : "bad";
        const gaugeColor = recoveryTone === "good" ? "#10b981" : recoveryTone === "warn" ? "#f59e0b" : "#f43f5e";

        return {
            latestDate,
            recoveryScore,
            recoveryTone,
            gaugeStyle: {
                background: `conic-gradient(${gaugeColor} ${recoveryScore * 3.6}deg, #d1fae5 0deg)`,
            },
            metrics: [
                {
                    title: "Steps",
                    value: latestSteps ? `${latestSteps.toLocaleString()} today` : "No data",
                    sub: avgSteps7d ? `7d avg ${Math.round(avgSteps7d).toLocaleString()}` : "",
                    progress: latestSteps ? clamp((latestSteps / 10000) * 100, 0, 100) : 0,
                    tone: stepsTone,
                },
                {
                    title: "Sleep",
                    value: latestSleep ? `${latestSleep.toFixed(1)}h` : "No data",
                    sub: avgSleep7d ? `7d avg ${avgSleep7d.toFixed(1)}h` : "",
                    progress: latestSleep ? clamp((latestSleep / 8.5) * 100, 0, 100) : 0,
                    tone: sleepTone,
                },
                {
                    title: "Active Minutes",
                    value: latestActiveMinutes ? `${latestActiveMinutes} min` : "No data",
                    sub: "Target 20+ min",
                    progress: latestActiveMinutes ? clamp((latestActiveMinutes / 30) * 100, 0, 100) : 0,
                    tone: activeTone,
                },
                {
                    title: "Sleep Quality",
                    value: latestSleepQuality ? `${Math.round(latestSleepQuality)}/100` : "No data",
                    sub: "Higher is better",
                    progress: latestSleepQuality ? clamp(latestSleepQuality, 0, 100) : 0,
                    tone: qualityTone,
                },
                {
                    title: "Resting HR",
                    value: latestRhr ? `${Math.round(latestRhr)} bpm` : "No data",
                    sub: avgRhr7d ? `7d avg ${Math.round(avgRhr7d)} bpm` : "",
                    progress: latestRhr ? clamp(((100 - latestRhr) / 30) * 100, 0, 100) : 0,
                    tone: hrTone,
                },
                {
                    title: "HRV",
                    value: latestHrv ? `${latestHrv.toFixed(1)} ms` : "No data",
                    sub: avgHrv7d ? `7d avg ${avgHrv7d.toFixed(1)} ms` : "",
                    progress: latestHrv ? clamp(((latestHrv - 15) / 20) * 100, 0, 100) : 0,
                    tone: hrvTone,
                },
            ],
        };
    }, []);

    useEffect(() => {
        currentOffsetRef.current = sheetOffset;
    }, [sheetOffset]);

    useEffect(() => {
        const sheetElement = sheetRef.current;
        if (!sheetElement) {
            return;
        }

        const PEEK_HEIGHT = 140;

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
                            <h2 className="text-base font-semibold text-emerald-950">Hi Thomas!</h2>
                            <p className="text-xs font-medium text-emerald-700/80">Latest sync: 09:35</p>
                        </div>
                    </div>

                    <div className="space-y-3 px-5 pb-6">
                        <div className="rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-teal-50 p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-[0.15em] text-emerald-700/80">Recovery gauge</p>
                                    <p className="mt-1 text-sm text-emerald-900">Based on sleep, quality, resting HR, and HRV.</p>
                                </div>
                                <div className="relative grid h-20 w-20 place-items-center rounded-full p-1" style={healthInsights.gaugeStyle}>
                                    <div className="grid h-full w-full place-items-center rounded-full bg-white">
                                        <span className="text-lg font-bold text-emerald-950">{healthInsights.recoveryScore}</span>
                                    </div>
                                </div>
                            </div>
                            <div className={`mt-3 inline-flex items-center rounded-full border px-2 py-1 text-xs font-semibold ${toneStyles[healthInsights.recoveryTone].badge}`}>
                                {toneStyles[healthInsights.recoveryTone].label}
                            </div>
                            <Button
                                asChild
                                variant="outline"
                                className="mt-4 w-full border-emerald-300/80 bg-white/70 text-emerald-950 hover:bg-emerald-100/80"
                            >
                                <Link href="/daily_checkin">Go to daily check-in</Link>
                            </Button>
                        </div>

                        <div className="grid grid-cols-1 gap-3">
                            {healthInsights.metrics.map((metric) => (
                                <div key={metric.title} className="rounded-2xl border border-slate-200/80 bg-white p-3">
                                    <div className="flex items-start justify-between gap-2">
                                        <div>
                                            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-600">{metric.title}</p>
                                            <p className="mt-1 text-sm font-semibold text-slate-900">{metric.value}</p>
                                            {metric.sub ? <p className="mt-0.5 text-xs text-slate-500">{metric.sub}</p> : null}
                                        </div>
                                        <span className={`rounded-full border px-2 py-1 text-[11px] font-semibold ${toneStyles[metric.tone].badge}`}>
                                            {toneStyles[metric.tone].label}
                                        </span>
                                    </div>
                                    <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-100">
                                        <div
                                            className={`h-full rounded-full transition-all ${toneStyles[metric.tone].bar}`}
                                            style={{ width: `${metric.progress}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
