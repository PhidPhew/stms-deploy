"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  Bell,
  CalendarCheck,
  CreditCard,
  ArrowLeft,
} from "lucide-react"

type NotificationType = "class" | "payment" | "course"

type StudentNotification = {
  id: number
  type: NotificationType
  title: string
  message: string
  date: string
  read: boolean
}

const initialNotifications: StudentNotification[] = [
  {
    id: 1,
    type: "class",
    title: "Today's Class",
    message: "You have Badminton class today at 16:00",
    date: "2026-02-27",
    read: false,
  },
  {
    id: 2,
    type: "payment",
    title: "Payment Approved",
    message: "Your payment for English Speaking was approved",
    date: "2026-02-25",
    read: true,
  },
  {
    id: 3,
    type: "course",
    title: "Course Ending Soon",
    message: "Badminton course will end in 7 days",
    date: "2026-02-24",
    read: false,
  },
]

function getIcon(type: NotificationType) {
  switch (type) {
    case "class":
      return <CalendarCheck className="h-5 w-5 text-blue-600" />
    case "payment":
      return <CreditCard className="h-5 w-5 text-green-600" />
    case "course":
      return <Bell className="h-5 w-5 text-red-500" />
  }
}

function getLink(type: NotificationType) {
  if (type === "payment") return "/student/payments"
  if (type === "course") return "/student/courses"
  return null
}

export default function NotificationsPage() {
  const [notifications, setNotifications] =
    useState<StudentNotification[]>(initialNotifications)

  const router = useRouter()

  const unreadCount = notifications.filter(
    (n) => !n.read
  ).length

  const handleClick = (id: number, type: NotificationType) => {
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
      {/* ===== Header ===== */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-blue-900">
            Notifications
          </h1>

          {/* 🔔 Badge */}
          {unreadCount > 0 && (
            <span
              className="text-xs bg-red-500 text-white px-2 py-0.5
                         rounded-full"
            >
              {unreadCount}
            </span>
          )}
        </div>

        <Link
          href="/student"
          className="flex items-center gap-2 text-sm text-blue-600
                     hover:text-blue-800"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>
      </div>

      {/* ===== Notifications ===== */}
      <div className="space-y-4">
        {notifications.map((n) => (
          <div
            key={n.id}
            onClick={() => handleClick(n.id, n.type)}
            className={`flex gap-4 p-4 rounded-lg border bg-white
              cursor-pointer transition
              hover:shadow-sm
              ${
                !n.read
                  ? "border-blue-300 bg-blue-50/40"
                  : "opacity-80"
              }
            `}
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