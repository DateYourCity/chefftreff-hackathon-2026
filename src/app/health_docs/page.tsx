import Link from "next/link";
import {
    CalendarDays,
    ChevronRight,
    FileText,
    MapPin,
    Sparkles,
    Stethoscope,
} from "lucide-react";
import { getHealthDocs } from "@/lib/health-docs";

const visitHistory = [
    {
        id: "visit-01",
        date: "08 Apr 2026",
        doctor: "Dr. Anna Keller",
        specialty: "General Practice",
        location: "Munich City Center",
        summary: "Annual check-up and blood pressure review.",
    },
    {
        id: "visit-02",
        date: "14 Feb 2026",
        doctor: "Dr. Mehmet Yilmaz",
        specialty: "Cardiology",
        location: "Schwabing",
        summary: "Follow-up for palpitations and ECG discussion.",
    },
    {
        id: "visit-03",
        date: "03 Dec 2025",
        doctor: "Dr. Sophie Brandt",
        specialty: "Dermatology",
        location: "Maxvorstadt",
        summary: "Skin screening and mole monitoring.",
    },
    {
        id: "visit-04",
        date: "21 Oct 2025",
        doctor: "Dr. Lukas Werner",
        specialty: "Orthopedics",
        location: "Bogenhausen",
        summary: "Knee pain assessment after running injury.",
    },
    {
        id: "visit-05",
        date: "12 Aug 2025",
        doctor: "Dr. Clara Neumann",
        specialty: "Gynecology",
        location: "Haidhausen",
        summary: "Routine preventive exam and lab referral.",
    },
    {
        id: "visit-06",
        date: "25 Jun 2025",
        doctor: "Dr. Jonas Beck",
        specialty: "ENT",
        location: "Neuhausen",
        summary: "Recurring sinus pressure and allergy symptoms.",
    },
    {
        id: "visit-07",
        date: "09 Apr 2025",
        doctor: "Dr. Eva Schmitt",
        specialty: "Neurology",
        location: "Glockenbachviertel",
        summary: "Migraine consultation and medication adjustment.",
    },
    {
        id: "visit-08",
        date: "17 Jan 2025",
        doctor: "Dr. David Roth",
        specialty: "Gastroenterology",
        location: "Sendling",
        summary: "Digestive complaints and nutrition advice.",
    },
    {
        id: "visit-09",
        date: "04 Nov 2024",
        doctor: "Dr. Miriam Vogel",
        specialty: "Ophthalmology",
        location: "Lehel",
        summary: "Vision check and dry eye treatment plan.",
    },
    {
        id: "visit-10",
        date: "28 Aug 2024",
        doctor: "Dr. Felix Braun",
        specialty: "Endocrinology",
        location: "Isarvorstadt",
        summary: "Thyroid lab review and long-term monitoring.",
    },
];

const futureAppointmentProposals = [
    {
        id: "proposal-01",
        timeframe: "Suggested for May 2026",
        doctor: "Dr. Mehmet Yilmaz",
        specialty: "Cardiology",
        reason: "Repeat ECG and check whether the palpitations have fully settled.",
    },
];

type HealthDocsPageProps = PageProps<"/health_docs">;

export default async function HealthDocsPage(props: HealthDocsPageProps) {
    const docs = await getHealthDocs();
    const searchParams = await props.searchParams;
    const activeTab = searchParams.tab === "visits" ? "visits" : "documents";

    return (
        <section className="min-h-full bg-[linear-gradient(180deg,#f8f5eb_0%,#f4f6fb_52%,#eef3f8_100%)] px-4 py-5">
            <div className="rounded-[28px] border border-white/70 bg-white/80 p-5 shadow-[0_20px_45px_rgba(15,23,42,0.08)] backdrop-blur">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary/70">
                    Health Docs
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
                        href="/health_docs"
                        className={`flex items-center justify-center gap-2 rounded-[20px] px-3 py-3 text-center text-sm font-semibold transition-colors ${
                            activeTab === "documents"
                                ? "bg-primary text-white"
                                : "text-muted-foreground hover:bg-primary/5 hover:text-foreground"
                        }`}
                    >
                        <FileText className="h-4 w-4 shrink-0" />
                        Documents
                    </Link>
                    <Link
                        href="/health_docs?tab=visits"
                        className={`flex items-center justify-center gap-2 rounded-[20px] px-3 py-3 text-center text-sm font-semibold transition-colors ${
                            activeTab === "visits"
                                ? "bg-primary text-white"
                                : "text-muted-foreground hover:bg-primary/5 hover:text-foreground"
                        }`}
                    >
                        <Stethoscope className="h-4 w-4 shrink-0" />
                        Doctor Visits
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
                    <div className="rounded-[26px] border border-primary/15 bg-[linear-gradient(135deg,rgba(70,120,96,0.10),rgba(255,255,255,0.94))] p-4 shadow-[0_14px_32px_rgba(15,23,42,0.06)]">
                        <div className="flex items-center gap-2 text-primary">
                            <Sparkles className="h-4 w-4" />
                            <p className="text-xs font-semibold uppercase tracking-[0.2em]">
                                Proposed Next Appointments
                            </p>
                        </div>
                        <p className="mt-2 text-sm leading-6 text-muted-foreground">
                            Based on your recent visits, these follow-ups would make sense to schedule next.
                        </p>

                        <div className="mt-4 space-y-3">
                            {futureAppointmentProposals.map((proposal) => (
                                <article
                                    key={proposal.id}
                                    className="rounded-[22px] border border-primary/15 bg-[linear-gradient(180deg,rgba(229,242,235,0.96),rgba(243,249,245,0.98))] px-4 py-4"
                                >
                                    <div className="flex items-start gap-3">
                                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                                            <CalendarDays className="h-5 w-5" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="text-sm font-medium text-primary">
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
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </div>

                    {visitHistory.map((visit) => (
                        <article
                            key={visit.id}
                            className="rounded-[24px] border border-border/70 bg-white px-4 py-4 shadow-[0_14px_32px_rgba(15,23,42,0.06)]"
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
                </div>
            )}
        </section>
    );
}
