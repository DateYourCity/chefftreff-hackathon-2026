import { readdir } from "fs/promises";
import path from "path";

export interface HealthDocFile {
    href: string;
    id: string;
    label: string;
    file_name: string;
}

const healthDocsDirectory = path.join(process.cwd(), "public", "health_docs");

function formatDocumentLabel(fileName: string) {
    return fileName
        .replace(/\.pdf$/i, "")
        .split(/[_-]+/)
        .filter(Boolean)
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(" ");
}

export async function getHealthDocs(): Promise<HealthDocFile[]> {
    const entries = await readdir(healthDocsDirectory, { withFileTypes: true });

    return entries
        .filter((entry) => entry.isFile() && entry.name.toLowerCase().endsWith(".pdf"))
        .map((entry) => ({
            href: `/health_docs/${encodeURIComponent(entry.name.replace(/\.pdf$/i, ""))}`,
            id: entry.name.replace(/\.pdf$/i, ""),
            label: formatDocumentLabel(entry.name),
            file_name: entry.name,
        }))
        .sort((left, right) => left.label.localeCompare(right.label));
}
