export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="max-w-xl mx-auto">{children}</div>;
}
