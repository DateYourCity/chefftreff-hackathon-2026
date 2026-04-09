"use client";

import { CalendarDays, MapPin, Stethoscope } from "lucide-react";
import { useState } from "react";

type Visit = {
    id: string;
    date: string;
    doctor: string;
    specialty: string;
    location: string;
    summary: string;
};

type PastVisitsListProps = {
    visits: Visit[];
};

export function PastVisitsList({ visits }: PastVisitsListProps) {
    const [showAll, setShowAll] = useState(false);
    const visibleVisits = showAll ? visits : visits.slice(0, 3);
    const hiddenCount = Math.max(visits.length - 3, 0);

    return (
        <div className="mt-4 space-y-3">
            {visibleVisits.map((visit) => (
                <article
                    key={visit.id}
                    className="rounded-[22px] border border-border/70 bg-white px-4 py-4 shadow-[0_8px_18px_rgba(15,23,42,0.04)]"
                >
                    <div className="flex items-start gap-3">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-secondary text-primary">
                            <Stethoscope className="h-5 w-5" />
                        </div>
                        <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <CalendarDays className="h-4 w-4" />
                                <span>{visit.date}</span>
                            </div>
                            <h2 className="mt-2 text-base font-semibold text-foreground">
                                {visit.doctor}
                            </h2>
                            <p className="text-sm font-medium text-primary">
                                {visit.specialty}
                            </p>
                            <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                                <MapPin className="h-4 w-4" />
                                <span>{visit.location}</span>
                            </div>
                            <p className="mt-3 text-sm leading-6 text-muted-foreground">
                                {visit.summary}
                            </p>
                        </div>
                    </div>
                </article>
            ))}

            {hiddenCount > 0 ? (
                <button
                    type="button"
                    onClick={() => setShowAll((current) => !current)}
                    className="flex w-full items-center justify-center rounded-[22px] border border-dashed border-border/80 bg-muted/20 px-4 py-4 text-sm font-semibold text-foreground transition-colors hover:bg-muted/35"
                >
                    {showAll ? "Show less" : `Show more (${hiddenCount})`}
                </button>
            ) : null}
        </div>
    );
}