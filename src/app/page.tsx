import { Separator } from "@/components/ui/separator"

const INFO_ITEMS = [
    {
        title: "Health companion demo",
        description:
            "A mobile-first prototype for the Chefftreff hackathon focused on making patient context easy to scan.",
    },
    {
        title: "Simple data overview",
        description:
            "Shows the essentials from EHR, lifestyle survey, and wearable telemetry data in one place.",
    },
    {
        title: "Wizard-of-Oz first",
        description:
            "Optimized for believable demos and quick decision support, not production workflows.",
    },
]

export default function Home() {
    return (
        <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-background to-muted px-6 py-12">
            <section className="w-full max-w-2xl space-y-8 rounded-3xl border bg-card/90 p-8 shadow-[0_20px_60px_rgba(15,23,42,0.12)] backdrop-blur">
                <div className="space-y-4 text-center">
                    <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
                        Health companion for the hackathon
                    </h1>
                    <p className="mx-auto max-w-xl text-base leading-7 text-muted-foreground md:text-lg">
                        A lightweight landing page for the project. It keeps the focus on the demo, the data sources, and the intended mobile experience.
                    </p>
                </div>

                <Separator />

                <div className="grid gap-4">
                    {INFO_ITEMS.map((item) => (
                        <div
                            key={item.title}
                            className="rounded-2xl border bg-background/70 p-4"
                        >
                            <h2 className="text-lg font-semibold">{item.title}</h2>
                            <p className="mt-1 text-sm leading-6 text-muted-foreground">
                                {item.description}
                            </p>
                        </div>
                    ))}
                </div>
            </section>
        </main>
    )
}
