import CoachSidebar from "@/components/coach/CoachSidebar"

export default function CoachLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <CoachSidebar />

      <main className="flex-1 p-6">
        {children}
      </main>
    </div>
  )
}