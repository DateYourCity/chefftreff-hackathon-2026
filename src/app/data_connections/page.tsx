import { Button } from "@/components/ui/button";
import {
    Apple,
    Building2,
    Microscope,
    ScanLine,
    ShieldCheck,
} from "lucide-react";

const DATA_SOURCES = [
    {
        id: "apple-health",
        label: "Apple Health",
        subtitle: "Daily activity, sleep, and heart trends",
        icon: Apple,
        iconClassName: "bg-slate-900 text-white",
    },
    {
        id: "hospital-ehr",
        label: "Hospital",
        subtitle: "Clinical notes, visits, and medications",
        icon: Building2,
        iconClassName: "bg-sky-100 text-sky-700",
    },
    {
        id: "diagnostics",
        label: "Diagnostics",
        subtitle: "Bloodwork and lab panel results",
        icon: Microscope,
        iconClassName: "bg-emerald-100 text-emerald-700",
    },
    {
        id: "mrt-imaging",
        label: "MRT Imaging",
        subtitle: "Radiology scans and structured findings",
        icon: ScanLine,
        iconClassName: "bg-violet-100 text-violet-700",
    },
] as const;

export default function DataConnectionsPage() {
    return (
        <section className="min-h-full bg-[linear-gradient(180deg,#eff6ff_0%,#f7f8fc_45%,#f4fbf7_100%)] px-4 py-5">
            <div className="rounded-[28px] border border-white/70 bg-white/85 p-5 shadow-[0_20px_45px_rgba(15,23,42,0.08)] backdrop-blur">
                <div className="flex items-start justify-between gap-3">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary/70">
                            Data Connections
                        </p>
                        <h1 className="mt-2 text-2xl font-semibold text-foreground">
                            Connect your sources
                        </h1>
                        <p className="mt-2 text-sm leading-6 text-muted-foreground">
                            Add trusted data feeds so your companion can build a better daily context.
                        </p>
                    </div>
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                        <ShieldCheck className="h-5 w-5" />
                    </div>
                </div>

                <Button className="mt-4 h-10 w-full rounded-full text-sm font-semibold">
                    Connect all
                </Button>
            </div>

            <div className="mt-4 space-y-3">
                {DATA_SOURCES.map((source) => {
                    const Icon = source.icon;

                    return (
                        <article
                            key={source.id}
                            className="flex items-center gap-3 rounded-[24px] border border-border/70 bg-white px-4 py-4 shadow-[0_14px_32px_rgba(15,23,42,0.06)]"
                        >
                            <div
                                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${source.iconClassName}`}
                            >
                                <Icon className="h-5 w-5" />
                            </div>

                            <div className="min-w-0 flex-1">
                                <p className="truncate text-base font-semibold text-foreground">
                                    {source.label}
                                </p>
                                <p className="truncate text-sm text-muted-foreground">
                                    {source.subtitle}
                                </p>
                            </div>

                            <Button
                                size="sm"
                                variant="outline"
                                className="h-9 shrink-0 rounded-full px-4 text-sm font-semibold"
                            >
                                Connect
                            </Button>
                        </article>
                    );
                })}
            </div>
        </section>
    );
}