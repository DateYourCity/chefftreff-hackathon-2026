import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { toDataURL } from "qrcode";
import { getHealthDocs } from "@/lib/health-docs";
import { QrReturnLink } from "./qr-return-link";

export async function generateStaticParams() {
    const docs = await getHealthDocs();

    return docs.map((doc) => ({
        document: doc.id,
    }));
}

export default async function MedicalDocumentQrPage(
    props: PageProps<"/medical_details/[document]/qr">,
) {
    const params = await props.params;
    const docs = await getHealthDocs();
    const documentName = decodeURIComponent(params.document);
    const doc = docs.find((entry) => entry.id === documentName);

    if (!doc) {
        notFound();
    }

    const requestHeaders = await headers();
    const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "localhost:3000";
    const protocol = requestHeaders.get("x-forwarded-proto") ?? "http";
    const documentHref = `/medical_details/${encodeURIComponent(doc.id)}`;
    const documentUrl = `${protocol}://${host}/medical_details/${encodeURIComponent(doc.id)}`;
    const qrSource = await toDataURL(documentUrl, {
        margin: 0,
        width: 1400,
        color: {
            dark: "#000000",
            light: "#ffffff",
        },
    });

    return (
        <section className="fixed inset-0 z-[120] flex flex-col bg-white animate-in fade-in duration-300">
            <div className="flex-1 bg-white" />
            <div
                className="mx-auto w-full animate-in fade-in zoom-in-95 duration-500 delay-75"
                style={{ maxWidth: "calc(min(var(--app-frame-width), 100vw - 24px) - (var(--app-bezel) * 2))" }}
            >
                <QrReturnLink href={documentHref} imageSrc={qrSource} label={doc.label} />
            </div>
            <div className="flex-1 bg-white" />
        </section>
    );
}
