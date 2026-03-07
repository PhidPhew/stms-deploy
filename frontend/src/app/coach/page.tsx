"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Bell } from "lucide-react" 
import { Home } from "lucide-react"
import axios from "@/lib/axios"

/* ================= TYPES ================= */

type TodayClass = {
  id: number
  time: string
  course: string
  group: string
  taughtSessions: number
  incomePerSession: number
}
type CoachNotificationType =
  | "today"
  | "upcoming"
  | "assigned"
  | "cancelled"

type CoachNotification = {
  id: number
  type: CoachNotificationType
  message: string
}
type TeachingCourse = {
  id: number
  courseTitle: string
  totalSessions: number
  taughtSessions: number
  incomePerSession: number
}

/* ================= HELPERS ================= */

function progressColor(progress: number) {
  if (progress >= 80) return "bg-green-500"
  if (progress >= 50) return "bg-blue-600"
  return "bg-yellow-500"
}

/* ================= PAGE ================= */

export default function CoachDashboard() {
  const [todayClasses, setTodayClasses] = useState<TodayClass[]>([])
  const [teachingCourses, setTeachingCourses] = useState<TeachingCourse[]>([])
  const [totalIncome, setTotalIncome] = useState<number>(0)

  useEffect(() => {
    axios.get("/api/coach/schedule").then((res) => {
      const today = new Date().toISOString().split('T')[0]
      const filtered = (res.data.data ?? []).filter((s: any) => s.date === today)
      setTodayClasses(filtered)
    }).catch(() => {})
    axios.get("/api/coach/summary").then((res) => {
      const data = res.data.data
      setTotalIncome(data?.totalIncome ?? 0)
      setTeachingCourses(data?.courses ?? [])
    }).catch(() => {})
  }, [])

  return (
    <div className="p-6 space-y-8 bg-gray-50">
      {/* ===== HEADER ===== */}
<div className="flex items-center justify-between">
  {/* Left: Title */}
  <div className="flex items-center gap-3">
    <Home className="h-6 w-6 text-blue-700" />
    <h1 className="text-2xl font-bold text-blue-900">
      Dashboard
    </h1>
  </div>

  {/* Right: Notification Bell */}
  <Link
    href="/coach/notifications"
    className="relative h-10 w-10 flex items-center justify-center
               rounded-full hover:bg-blue-50 transition"
  >
    <Bell className="h-6 w-6 text-blue-700" />

    {/* 🔴 Badge */}
    <span
      className="absolute -top-0.5 -right-0.5
                 bg-red-500 text-white text-[10px]
                 h-4 min-w-[16px] px-1
                 flex items-center justify-center
                 rounded-full"
    >
      3
    </span>
  </Link>
</div>

      {/* ===== SUMMARY (เหมือน student card) ===== */}
      <section className="bg-white rounded-xl border p-4">
        <p className="text-sm text-gray-500">
          Total income from teaching
        </p>
        <p className="text-3xl font-bold text-blue-700">
          {totalIncome.toLocaleString()} THB
        </p>
      </section>

      {/* ===== TODAY TEACHING ===== */}
      <section className="bg-white rounded-xl border p-4 space-y-4">
        <h2 className="font-semibold text-blue-900 flex items-center gap-2">
          📅 Today’s Teaching
        </h2>

        {todayClasses.map((c) => (
          <div
            key={c.id}
            className="border rounded-xl p-4 flex justify-between items-center hover:shadow-sm transition"
          >
            <div>
              <p className="font-medium">{c.courseTitle}</p>
              <p className="text-xs text-gray-500">
                {c.date} · {c.startTime} - {c.endTime}
              </p>
            </div>

            <a
              href="/coach/attendance"
              className="text-xs bg-blue-600 text-white px-4 py-2 rounded-lg"
            >
              Check-in
            </a>
          </div>
        ))}
      </section>

      {/* ===== MY TEACHING COURSES (เหมือน My Active Courses) ===== */}
      <section className="bg-white rounded-xl border p-4 space-y-4">
        <h2 className="font-semibold text-blue-900 flex items-center gap-2">
          🎓 My Teaching Courses
        </h2>

        <div className="grid gap-4 md:grid-cols-2">
          {(Array.isArray(teachingCourses) ? teachingCourses : []).map((course) => {
            const progress =
              (course.taughtSessions / course.totalSessions) * 100

            return (
              <div
                key={course.id}
                className="border rounded-xl overflow-hidden hover:shadow-md transition"
              >
                {/* Header */}
                <div className="px-4 py-3 bg-blue-50">
                  <p className="font-medium text-blue-900">
                    {course.courseTitle}
                  </p>
                  <p className="text-xs text-gray-500">
                    {course.taughtSessions} /{" "}
                    {course.totalSessions} sessions
                  </p>
                </div>

                {/* Body */}
                <div className="p-4 space-y-3">
                  <div className="w-full bg-gray-200 h-2 rounded">
                    <div
                      className={`h-2 rounded ${progressColor(
                        progress
                      )}`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>

                  <div className="flex justify-between text-xs text-gray-600">
                    <span>
                      💰{" "}
                      {(
                        course.taughtSessions *
                        course.incomePerSession
                      ).toLocaleString()}{" "}
                      THB
                    </span>
                    <span>
                      {course.totalSessions -
                        course.taughtSessions}{" "}
                      left
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </section>
    </div>
  )
}