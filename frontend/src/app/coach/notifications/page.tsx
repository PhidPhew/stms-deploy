"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import axios from "@/lib/axios"
import {
  CalendarCheck,
  UserPlus,
  XCircle,
  ArrowLeft,
} from "lucide-react"

type CoachNotificationType = "today" | "upcoming" | "assigned" | "cancelled"

type CoachNotification = {
  id: number
  type: CoachNotificationType
  title: string
  message: string
  date: string
  read: boolean
}

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
  if (type === "today" || type === "upcoming") return "/coach/schedule"
  if (type === "assigned") return "/coach"
  return null
}

export default function CoachNotificationsPage() {
  const [notifications, setNotifications] = useState<CoachNotification[]>([])
  const router = useRouter()

  useEffect(() => {
    axios.get("/api/coach/schedule").then((res) => {
      const schedules = res.data.data ?? []
      const today = new Date().toISOString().split("T")[0]

      const generated: CoachNotification[] = schedules.map((s: any, i: number) => {
        const isToday = s.date === today
        return {
          id: i + 1,
          type: isToday ? "today" : "upcoming",
          title: isToday ? "Today\'s Class" : "Upcoming Class",
          message: `${s.courseTitle} — ${s.date} at ${s.startTime}`,
          date: s.date,
          read: false,
        }
      })

      setNotifications(generated)
    }).catch(() => {})
  }, [])

  const unreadCount = notifications.filter((n) => !n.read).length

  const handleClick = (id: number, type: CoachNotificationType) => {
    setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n))
    const link = getLink(type)
    if (link) router.push(link)
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-blue-900">Notifications</h1>
          {unreadCount > 0 && (
            <span className="text-xs bg-red-500 text-white px-2 py-0.5 rounded-full">
              {unreadCount}
            </span>
          )}
        </div>
        <Link href="/coach" className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800">
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>
      </div>

      {notifications.length === 0 && (
        <p className="text-sm text-gray-500">No notifications</p>
      )}

      <div className="space-y-4">
        {notifications.map((n) => (
          <div
            key={n.id}
            onClick={() => handleClick(n.id, n.type)}
            className={`flex gap-4 p-4 rounded-lg border bg-white cursor-pointer transition hover:shadow-sm ${
              !n.read ? "border-blue-300 bg-blue-50/40" : "opacity-80"
            }`}
          >
            <div>{getIcon(n.type)}</div>
            <div className="flex-1">
              <div className="flex justify-between">
                <h3 className="font-medium">{n.title}</h3>
                <span className="text-xs text-gray-400">{n.date}</span>
              </div>
              <p className="text-sm text-gray-600 mt-1">{n.message}</p>
            </div>
            {!n.read && <span className="h-2 w-2 rounded-full bg-blue-500 mt-1 flex-shrink-0" />}
          </div>
        ))}
      </div>
    </div>
  )
}
