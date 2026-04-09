import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, ExternalLink, FileText, Sparkles } from "lucide-react";
import { getHealthDocs } from "@/lib/health-docs";

export async function generateStaticParams() {
    const docs = await getHealthDocs();

    return docs.map((doc) => ({
        document: doc.id,
    }));
}

export default async function HealthDocViewerPage(
    props: PageProps<"/health_docs/[document]">,
) {
    const params = await props.params;
    const docs = await getHealthDocs();
    const documentName = decodeURIComponent(params.document);
    const doc = docs.find((entry) => entry.id === documentName);

    if (!doc) {
        notFound();
    }

    const pdfUrl = `/health_docs/${encodeURIComponent(doc.file_name)}`;

    return (
        <section className="flex min-h-full flex-col bg-[linear-gradient(180deg,#f6f7fb_0%,#edf2f7_100%)]">
            <div className="border-b border-border/70 bg-white/90 px-4 py-3 backdrop-blur">
                <Link
                    href="/health_docs"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-primary"
                >
                    <ChevronLeft className="h-4 w-4" />
                    All documents
                </Link>
                <div className="mt-3 flex items-start gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                        <FileText className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                        <p className="text-base font-semibold text-foreground">{doc.label}</p>
                    </div>
                </div>
            </div>

            <div className="flex flex-1 flex-col gap-3 p-4">
                <div className="grid grid-cols-2 gap-3">
                    <Link
                        href={`/chat?source=health-docs&document=${encodeURIComponent(doc.id)}`}
                        className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary/90"
                    >
                        Explain by Coach
                        <Sparkles className="h-4 w-4" />
                    </Link>
                    <Link
                        href={pdfUrl}
                        target="_blank"
                        className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-white px-4 py-2 text-sm font-semibold text-foreground shadow-sm transition-colors hover:bg-muted"
                    >
                        Open PDF
                        <ExternalLink className="h-4 w-4" />
                    </Link>
                </div>

                <div className="flex-1 overflow-hidden rounded-[28px] border border-border/70 bg-white shadow-[0_18px_45px_rgba(15,23,42,0.08)]">
                    <iframe
                        title={doc.label}
                        src={pdfUrl}
                        className="h-full min-h-[640px] w-full"
                    />
                </div>
            </div>
        </section>
    );
}
