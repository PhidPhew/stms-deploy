import { Sidebar } from "@/app/(protected)/admin/Sidebar"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar fix ด้านซ้าย */}
      <Sidebar />

      {/* Content scroll แยก */}
      <main className="flex-1 overflow-y-auto p-6">
        {children}
      </main>
    </div>
  )
}