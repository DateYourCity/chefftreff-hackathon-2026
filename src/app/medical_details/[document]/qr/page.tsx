import { headers } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { toDataURL } from "qrcode";
import { getHealthDocs } from "@/lib/health-docs";

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
        <section className="fixed inset-0 z-[120] flex flex-col bg-white">
            <div className="flex-1 bg-white" />
            <div className="mx-auto w-full max-w-[58vw] sm:max-w-[50vw]">
                <Link
                    href={documentHref}
                    aria-label={`Open ${doc.label}`}
                    className="block"
                >
                    <Image
                        src={qrSource}
                        alt={`QR code to open ${doc.label}`}
                        width={1400}
                        height={1400}
                        className="h-auto w-full cursor-pointer"
                    />
                </Link>
            </div>
            <div className="flex-1 bg-white" />
        </section>
    );
}
