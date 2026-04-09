import {
    ArrowLeft,
    CalendarDays,
    ChevronRight,
    FileText,
    MapPin,
    Sparkles,
    Stethoscope,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getVisitById, visitHistory } from "../../visit-data";

export async function generateStaticParams() {
    return visitHistory.map((visit) => ({
        visitId: visit.id,
    }));
}

export default async function VisitDetailPage(
    props: PageProps<"/medical_details/visit/[visitId]">,
) {
    const params = await props.params;
    const visit = getVisitById(params.visitId);

    if (!visit) {
        notFound();
    }

    const statusLabel = visit.status === "upcoming" ? "Upcoming appointment" : "Past appointment";
    const statusCopy =
        visit.status === "upcoming"
            ? "This visit is scheduled. Use this view to confirm the time, place, and reason for the appointment before you go."
            : "This visit is complete. The summary below keeps the key details in one place for quick review.";
    const documents =
        visit.status === "upcoming"
            ? [
                {
                    id: "prep-sheet",
                    label: "Pre-visit preparation sheet",
                    meta: "Instructions",
                },
                {
                    id: "consent-form",
                    label: "Digital consent form",
                    meta: "Required before check-in",
                },
            ]
            : [
                {
                    id: "visit-summary",
                    label: "Visit summary",
                    meta: "Clinical note",
                },
                {
                    id: "lab-results",
                    label: "Lab results",
                    meta: "PDF report",
                },
                {
                    id: "care-plan",
                    label: "Care plan",
                    meta: "Follow-up guidance",
                },
            ];

    return (
        <section className="min-h-full bg-[linear-gradient(180deg,#f8f5eb_0%,#f4f6fb_52%,#eef3f8_100%)] px-4 py-5">
            <div className="rounded-[28px] border border-white/70 bg-white/85 p-5 shadow-[0_20px_45px_rgba(15,23,42,0.08)] backdrop-blur">
                <Link
                    href="/medical_details?tab=visits"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-primary"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to visits
                </Link>

                <div className="mt-4 flex items-start gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                        <Stethoscope className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary/70">
                            {statusLabel}
                        </p>
                        <h1 className="mt-2 text-2xl font-semibold text-foreground">
                            {visit.doctor}
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            {visit.specialty}
                        </p>
                    </div>
                </div>

                <p className="mt-4 text-sm leading-6 text-muted-foreground">
                    {statusCopy}
                </p>
            </div>

            <div className="mt-4 space-y-3">
                <div className="rounded-[26px] border border-white/70 bg-white p-4 shadow-[0_14px_32px_rgba(15,23,42,0.06)]">
                    <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                        <CalendarDays className="h-4 w-4" />
                        Visit details
                    </div>

                    <div className="mt-4 space-y-3 text-sm leading-6 text-muted-foreground">
                        <div className="flex items-start justify-between gap-4">
                            <span className="text-foreground">Date</span>
                            <span className="text-right">{visit.date}</span>
                        </div>
                        <div className="flex items-start justify-between gap-4">
                            <span className="text-foreground">Location</span>
                            <span className="text-right">{visit.location}</span>
                        </div>
                        <div className="flex items-start justify-between gap-4">
                            <span className="text-foreground">Specialty</span>
                            <span className="text-right">{visit.specialty}</span>
                        </div>
                        <div className="flex items-start justify-between gap-4">
                            <span className="text-foreground">Status</span>
                            <span className="inline-flex rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                                {visit.status === "upcoming" ? "Scheduled" : "Completed"}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="rounded-[26px] border border-white/70 bg-white p-4 shadow-[0_14px_32px_rgba(15,23,42,0.06)]">
                    <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                        <MapPin className="h-4 w-4" />
                        Visit summary
                    </div>
                    <p className="mt-3 text-sm leading-6 text-muted-foreground">
                        {visit.summary}
                    </p>
                </div>

                <div className="rounded-[26px] border border-white/70 bg-white p-4 shadow-[0_14px_32px_rgba(15,23,42,0.06)]">
                    <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                        <FileText className="h-4 w-4" />
                        Documents
                    </div>

                    <div className="mt-4 space-y-2">
                        {documents.map((document) => (
                            <div
                                key={document.id}
                                className="flex items-center gap-3 rounded-2xl border border-border/70 bg-muted/20 px-3 py-3"
                            >
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                    <FileText className="h-4 w-4" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="truncate text-sm font-semibold text-foreground">
                                        {document.label}
                                    </p>
                                    <p className="truncate text-xs text-muted-foreground">
                                        {document.meta}
                                    </p>
                                </div>
                                <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="rounded-[26px] border border-emerald-200/80 bg-[linear-gradient(180deg,rgba(236,248,241,0.96),rgba(255,255,255,0.98))] p-4 shadow-[0_14px_32px_rgba(15,23,42,0.05)]">
                    <div className="flex items-center gap-2 text-emerald-700">
                        <Sparkles className="h-4 w-4" />
                        <p className="text-xs font-semibold uppercase tracking-[0.2em]">
                            Quick action
                        </p>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-emerald-950/70">
                        This demo detail page is designed to make each appointment feel tappable and easy to review.
                    </p>
                </div>
            </div>
        </section>
    );
}