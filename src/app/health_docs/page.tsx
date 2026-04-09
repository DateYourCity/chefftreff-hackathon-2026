import Link from "next/link";
import { ChevronRight, FileText } from "lucide-react";
import { getHealthDocs } from "@/lib/health-docs";

export default async function HealthDocsPage() {
    const docs = await getHealthDocs();

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
                    Browse your medical records
                </p>
            </div>

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
                            <p className="truncate text-sm text-muted-foreground">{doc.label}</p>
                        </div>
                        <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground" />
                    </Link>
                ))}
            </div>
        </section>
    );
}
