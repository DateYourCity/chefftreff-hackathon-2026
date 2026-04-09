
export default function ChatLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <main className="w-full pt-16">
            {children}
        </main>
    )
}
