import { Button } from "@/components/ui/button";
import { getHealthDocs } from "@/lib/health-docs";
import {
    CalendarDays,
    ChevronRight,
    FileText,
    MapPin,
    Sparkles,
    Stethoscope,
} from "lucide-react";
import Link from "next/link";
import { PastVisitsList } from "./past-visits-list";
import { futureAppointmentProposals, visitHistory } from "./visit-data";

type HealthDocsPageProps = PageProps<"/medical_details">;

export default async function HealthDocsPage(props: HealthDocsPageProps) {
    const docs = await getHealthDocs();
    const searchParams = await props.searchParams;
    const activeTab = searchParams.tab === "documents" ? "documents" : "visits";
    const upcomingVisits = visitHistory.filter((visit) => visit.status === "upcoming");
    const pastVisits = visitHistory.filter((visit) => visit.status === "past");

    return (
        <section className="min-h-full bg-[linear-gradient(180deg,#f8f5eb_0%,#f4f6fb_52%,#eef3f8_100%)] px-4 py-5">
            <div className="rounded-[28px] border border-white/70 bg-white/80 p-5 shadow-[0_20px_45px_rgba(15,23,42,0.08)] backdrop-blur">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary/70">
                    Medical Details
                </p>
                <h1 className="mt-2 text-2xl font-semibold text-foreground">
                    Your medical documents
                </h1>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    Browse your records and review your previous doctor visits.
                </p>
            </div>

            <div className="mt-4 rounded-[26px] border border-white/70 bg-white/85 p-1.5 shadow-[0_14px_32px_rgba(15,23,42,0.07)]">
                <div className="grid grid-cols-2 gap-1">
                    <Link
                        href="/medical_details?tab=visits"
                        className={`flex items-center justify-center gap-2 rounded-[20px] px-3 py-3 text-center text-sm font-semibold transition-colors ${
                            activeTab === "visits"
                                ? "bg-primary text-white"
                                : "text-muted-foreground hover:bg-primary/5 hover:text-foreground"
                        }`}
                    >
                        <Stethoscope className="h-4 w-4 shrink-0" />
                        Doctor Visits
                        <span
                            className={`inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[11px] font-bold ${
                                activeTab === "visits"
                                    ? "bg-white/20 text-white"
                                    : "bg-primary text-white"
                            }`}
                        >
                            {upcomingVisits.length}
                        </span>
                    </Link>
                    <Link
                        href="/medical_details?tab=documents"
                        className={`flex items-center justify-center gap-2 rounded-[20px] px-3 py-3 text-center text-sm font-semibold transition-colors ${activeTab === "documents"
                                ? "bg-primary text-white"
                                : "text-muted-foreground hover:bg-primary/5 hover:text-foreground"
                            }`}
                    >
                        <FileText className="h-4 w-4 shrink-0" />
                        Documents
                    </Link>
                </div>
            </div>

            {activeTab === "documents" ? (
                <div className="mt-4 space-y-3">
                    {docs.map((doc) => (
                        <Link
                            key={doc.id}
                            href={doc.href}
                            className="flex items-center gap-3 rounded-[24px] border border-border/70 bg-white px-4 py-4 shadow-[0_14px_32px_rgba(15,23,42,0.06)] transition-transform transition-colors hover:-translate-y-0.5 hover:bg-primary/5"
                        >
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                                <FileText className="h-5 w-5" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="truncate text-base font-semibold text-foreground">
                                    {doc.label}
                                </p>
                                <p className="truncate text-sm text-muted-foreground">
                                    {doc.label}
                                </p>
                            </div>
                            <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground" />
                        </Link>
                    ))}
                </div>
            ) : (
                <div className="mt-4 space-y-3">
                        <div className="rounded-[26px] border border-rose-200/80 bg-[linear-gradient(135deg,rgba(255,228,228,0.95),rgba(255,255,255,0.97))] p-4 shadow-[0_14px_32px_rgba(15,23,42,0.06)]">
                            <div className="flex items-center gap-2 text-rose-700">
                            <Sparkles className="h-4 w-4" />
                            <p className="text-xs font-semibold uppercase tracking-[0.2em]">
                                Proposed Next Appointments
                            </p>
                        </div>
                            <p className="mt-2 text-sm leading-6 text-rose-900/70">
                            Based on your recent visits, these follow-ups would make sense to schedule next.
                        </p>

                        <div className="mt-4 space-y-3">
                            {futureAppointmentProposals.map((proposal) => (
                                <article
                                    key={proposal.id}
                                    className="rounded-[22px] border border-rose-200 bg-[linear-gradient(180deg,rgba(255,244,244,0.98),rgba(255,255,255,0.99))] px-4 py-4"
                                >
                                    <div className="flex items-start gap-3">
                                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-rose-100 text-rose-700">
                                            <CalendarDays className="h-5 w-5" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="text-sm font-medium text-rose-700">
                                                {proposal.timeframe}
                                            </p>
                                            <h2 className="mt-1 text-base font-semibold text-foreground">
                                                {proposal.doctor}
                                            </h2>
                                            <p className="text-sm text-muted-foreground">
                                                {proposal.specialty}
                                            </p>
                                            <p className="mt-2 text-sm leading-6 text-muted-foreground">
                                                {proposal.reason}
                                            </p>
                                            <Button
                                                asChild
                                                size="sm"
                                                className="mt-4 h-9 w-full rounded-full bg-rose-600 px-4 text-sm font-semibold text-white shadow-sm hover:bg-rose-700"
                                            >
                                                <Link href="/appointment">Book appointment</Link>
                                            </Button>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </div>

                        <section className="rounded-[26px] border border-emerald-200/80 bg-[linear-gradient(180deg,rgba(236,248,241,0.96),rgba(255,255,255,0.98))] p-4 shadow-[0_14px_32px_rgba(15,23,42,0.05)]">
                            <div className="flex items-center justify-between gap-3">
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
                                        Upcoming visits
                                    </p>
                                    <h3 className="mt-1 text-lg font-semibold text-foreground">
                                        Next appointments
                                    </h3>
                                </div>
                                <span className="inline-flex rounded-full bg-emerald-600 px-2.5 py-1 text-xs font-semibold text-white">
                                    {upcomingVisits.length}
                                </span>
                            </div>

                            <div className="mt-4 space-y-3">
                                {upcomingVisits.map((visit) => (
                                <Link
                                        key={visit.id}
                                    href={`/medical_details/visit/${visit.id}`}
                                    className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
                                    >
                                    <article className="rounded-[22px] border border-emerald-200 bg-white px-4 py-4 shadow-[0_8px_18px_rgba(15,23,42,0.04)] transition-all duration-200 group-hover:-translate-y-0.5 group-hover:border-emerald-300 group-hover:shadow-[0_14px_28px_rgba(15,23,42,0.08)]">
                                        <div className="flex items-start gap-3">
                                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 transition-colors group-hover:bg-emerald-200">
                                                <CalendarDays className="h-5 w-5" />
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <div className="flex items-center gap-2 text-sm text-emerald-700">
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
                                </Link>
                            ))}
                            </div>
                        </section>

                        <section className="rounded-[26px] border border-border/70 bg-white p-4 shadow-[0_14px_32px_rgba(15,23,42,0.06)]">
                            <div className="flex items-center justify-between gap-3">
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                                        Past visits
                                    </p>
                                    <h3 className="mt-1 text-lg font-semibold text-foreground">
                                        Previous appointments
                                    </h3>
                                </div>
                                <span className="inline-flex rounded-full bg-muted px-2.5 py-1 text-xs font-semibold text-muted-foreground">
                                    {pastVisits.length}
                                </span>
                            </div>

                            <PastVisitsList visits={pastVisits} />
                        </section>
                </div>
            )}
        </section>
    );
}
