"use client"

import { Bell } from "lucide-react"
import Link from "next/link"

type StudentNotification = {
  id: number
  type: "class" | "payment" | "course"
  message: string
}

const notifications: StudentNotification[] = [
  { id: 1, type: "class", message: "Today you have a class" },
  { id: 2, type: "payment", message: "Payment approved" },
]

export default function StudentHeader() {
  const count = notifications.length

  return (
    <div className="flex items-center justify-between">
      <h1 className="text-2xl font-bold text-blue-900">
        Dashboard
      </h1>

      <Link href="/student/notifications" className="relative">
        <Bell className="h-6 w-6 text-blue-700" />

        {count > 0 && (
          <span
            className="
              absolute -top-2 -right-2
              bg-red-500 text-white text-xs
              min-w-[18px] h-[18px]
              rounded-full flex items-center justify-center
              px-1
            "
          >
            {count}
          </span>
        )}
      </Link>
    </div>
  )
}