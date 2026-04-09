export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <main className="min-h-full w-full">{children}</main>;
}
