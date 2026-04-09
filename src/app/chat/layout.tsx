
export default function ChatLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <main className="flex h-full min-h-0 w-full flex-col">
            {children}
        </main>
    )
}
