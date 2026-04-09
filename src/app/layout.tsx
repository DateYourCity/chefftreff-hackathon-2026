import type { Metadata, Viewport } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import { BottomNav, Navbar } from "@/components/ui/navbar";

const manrope = Manrope({
    subsets: ["latin"],
    display: "swap",
    variable: "--font-manrope",
});

export const metadata: Metadata = {
    title: "BetterYou",
    description:
        "BetterYou is a mobile-first health companion demo for the Chefftreff hackathon, designed to make personal health context easy to understand at a glance.",
    icons: {
        icon: "/logo.png",
        shortcut: "/logo.png",
        apple: "/logo.png",
    },
};

export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
    viewportFit: "cover",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="de" suppressHydrationWarning>
            <body className={manrope.variable} suppressHydrationWarning>
                <div className="app-shell">
                    <div className="device-frame">
                        <div className="device-notch" aria-hidden="true" />
                        <div className="device-screen">
                            <Navbar />
                            <div className="flex-1 min-h-0 overflow-y-auto">
                                {children}
                            </div>
                            <BottomNav />
                        </div>
                    </div>
                </div>
            </body>
        </html>
    );
}
