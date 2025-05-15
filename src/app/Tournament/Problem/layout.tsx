export default function ProblemLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#121113]">
      {children}
    </div>
  );
} 