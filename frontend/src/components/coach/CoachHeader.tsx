"use client"

import Link from "next/link"
import { Bell, Home } from "lucide-react"

export default function CoachHeader({
  title,
}: {
  title: string
}) {
  return (
    <div className="flex justify-between items-center">
      <Home className="h-6 w-6 text-blue-700" />
        <h1 className="text-2xl font-bold text-blue-900">
          {title}
        </h1>


      <Link
        href="/coach/notifications"
        className="relative"
      >
        <Bell className="h-6 w-6 text-blue-700" />

        {/* 🔴 Badge */}
        <span
          className="absolute -top-1 -right-1
                     bg-red-500 text-white text-[10px]
                     h-4 min-w-[16px] px-1
                     flex items-center justify-center
                     rounded-full"
        >
          3
        </span>
      </Link>
    </div>
  )
}