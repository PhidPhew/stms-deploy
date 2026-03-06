"use client"

import { Bell } from "lucide-react"
import Link from "next/link"

export default function Header() {
  const pendingCount = 2 

  return (
    <div className="flex items-center justify-between">
      <h1 className="text-2xl font-bold text-blue-900">
        Dashboard
      </h1>

      {/* Notification */}
      <Link href="/admin/payments" className="relative">
        <Bell className="h-6 w-6 text-blue-700" />

        {pendingCount > 0 && (
          <span
            className="
              absolute -top-2 -right-2
              bg-red-500 text-white text-xs
              min-w-[18px] h-[18px]
              rounded-full flex items-center justify-center
              px-1
            "
          >
            {pendingCount}
          </span>
        )}
      </Link>
    </div>
  )
}