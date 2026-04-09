
export default function ChatLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <main className="w-full">
            {children}
        </main>
    )
}
