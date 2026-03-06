"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  Bell,
  CalendarCheck,
  UserPlus,
  XCircle,
  ArrowLeft,
} from "lucide-react"

/* ================= TYPES ================= */

type CoachNotificationType =
  | "today"
  | "upcoming"
  | "assigned"
  | "cancelled"

type CoachNotification = {
  id: number
  type: CoachNotificationType
  title: string
  message: string
  date: string
  read: boolean
}

/* ================= MOCK DATA ================= */

const initialNotifications: CoachNotification[] = [
  {
    id: 1,
    type: "today",
    title: "Today's Classes",
    message: "You have 2 classes today starting at 17:00",
    date: "2026-02-28",
    read: false,
  },
  {
    id: 2,
    type: "upcoming",
    title: "Upcoming Class",
    message: "Badminton Beginner will start in 30 minutes",
    date: "2026-02-28",
    read: false,
  },
  {
    id: 3,
    type: "assigned",
    title: "New Course Assigned",
    message: "Admin assigned you to Swimming Technique course",
    date: "2026-02-27",
    read: true,
  },
  {
    id: 4,
    type: "cancelled",
    title: "Class Cancelled",
    message: "Class on 1 Mar 2026 was cancelled due to weather",
    date: "2026-02-26",
    read: false,
  },
]

/* ================= HELPERS ================= */

function getIcon(type: CoachNotificationType) {
  switch (type) {
    case "today":
    case "upcoming":
      return <CalendarCheck className="h-5 w-5 text-blue-600" />
    case "assigned":
      return <UserPlus className="h-5 w-5 text-green-600" />
    case "cancelled":
      return <XCircle className="h-5 w-5 text-red-500" />
  }
}

function getLink(type: CoachNotificationType) {
  if (type === "today" || type === "upcoming")
    return "/coach/schedule"
  if (type === "assigned") return "/coach/courses"
  return null
}

/* ================= PAGE ================= */

export default function CoachNotificationsPage() {
  const [notifications, setNotifications] =
    useState<CoachNotification[]>(initialNotifications)

  const router = useRouter()

  const unreadCount = notifications.filter(
    (n) => !n.read
  ).length

  const handleClick = (
    id: number,
    type: CoachNotificationType
  ) => {
    setNotifications((prev) =>
      prev.map((n) =>
        n.id === id ? { ...n, read: true } : n
      )
    )

    const link = getLink(type)
    if (link) router.push(link)
  }

  return (
    <div className="p-6 space-y-6">
      {/* ===== HEADER ===== */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-blue-900">
            Notifications
          </h1>

          {unreadCount > 0 && (
            <span className="text-xs bg-red-500 text-white px-2 py-0.5 rounded-full">
              {unreadCount}
            </span>
          )}
        </div>

        <Link
          href="/coach"
          className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>
      </div>

      {/* ===== LIST ===== */}
      <div className="space-y-4">
        {notifications.map((n) => (
          <div
            key={n.id}
            onClick={() => handleClick(n.id, n.type)}
            className={`flex gap-4 p-4 rounded-lg border bg-white cursor-pointer transition
              hover:shadow-sm
              ${
                !n.read
                  ? "border-blue-300 bg-blue-50/40"
                  : "opacity-80"
              }`}
          >
            <div>{getIcon(n.type)}</div>

            <div className="flex-1">
              <div className="flex justify-between">
                <h3 className="font-medium">
                  {n.title}
                </h3>
                <span className="text-xs text-gray-400">
                  {n.date}
                </span>
              </div>

              <p className="text-sm text-gray-600">
                {n.message}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}