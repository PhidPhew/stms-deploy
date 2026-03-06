"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Bell, Home } from "lucide-react"
import axios from "@/lib/axios"

type TodayClass = {
  id: number
  date: string
  time?: string
  course: string
  studentCount?: number
}

type TeachingCourse = {
  id: number
  title: string
  totalSessions: number
  taughtSessions?: number
}

function progressColor(progress: number) {
  if (progress >= 80) return "bg-green-500"
  if (progress >= 50) return "bg-blue-600"
  return "bg-yellow-500"
}

export default function CoachDashboard() {
  const [todayClasses, setTodayClasses] = useState<TodayClass[]>([])
  const [teachingCourses, setTeachingCourses] = useState<TeachingCourse[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [scheduleRes, summaryRes] = await Promise.all([
          axios.get("/api/coach/schedule"),
          axios.get("/api/coach/summary"),
        ])
        const schedule = scheduleRes.data?.data || []
        const summary = summaryRes.data?.data || {}

        // Today classes from schedule
        const today = new Date().toISOString().split("T")[0]
        const todayFiltered = schedule.filter((s: any) =>
          s.date?.startsWith(today)
        )
        setTodayClasses(todayFiltered)
        setTeachingCourses(summary.courses || [])
      } catch (err) {
        console.error("Coach dashboard fetch error:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center h-48 text-gray-400">
        Loading...
      </div>
    )
  }

  return (
    <div className="p-6 space-y-8 bg-gray-50">
      {/* ===== HEADER ===== */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Home className="h-6 w-6 text-blue-700" />
          <h1 className="text-2xl font-bold text-blue-900">Dashboard</h1>
        </div>
        <Link
          href="/coach/notifications"
          className="relative h-10 w-10 flex items-center justify-center rounded-full hover:bg-blue-50 transition"
        >
          <Bell className="h-6 w-6 text-blue-700" />
          <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] h-4 min-w-[16px] px-1 flex items-center justify-center rounded-full">
            !
          </span>
        </Link>
      </div>

      {/* ===== TODAY TEACHING ===== */}
      <section className="bg-white rounded-xl border p-4 space-y-4">
        <h2 className="font-semibold text-blue-900 flex items-center gap-2">
          📅 Today&apos;s Teaching
        </h2>
        {todayClasses.length === 0 ? (
          <p className="text-sm text-gray-500">No classes scheduled for today.</p>
        ) : (
          todayClasses.map((c) => (
            <div
              key={c.id}
              className="border rounded-xl p-4 flex justify-between items-center hover:shadow-sm transition"
            >
              <div>
                <p className="font-medium">{c.course}</p>
                <p className="text-xs text-gray-500">{c.time || c.date}</p>
              </div>
              <Link
                href="/coach/attendance"
                className="text-xs bg-blue-600 text-white px-4 py-2 rounded-lg"
              >
                Check-in
              </Link>
            </div>
          ))
        )}
      </section>

      {/* ===== MY TEACHING COURSES ===== */}
      <section className="bg-white rounded-xl border p-4 space-y-4">
        <h2 className="font-semibold text-blue-900 flex items-center gap-2">
          🎓 My Teaching Courses
        </h2>
        {teachingCourses.length === 0 ? (
          <p className="text-sm text-gray-500">No courses assigned yet.</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {teachingCourses.map((course) => {
              const taught = course.taughtSessions ?? 0
              const total = course.totalSessions ?? 1
              const progress = Math.round((taught / total) * 100)

              return (
                <div key={course.id} className="border rounded-xl overflow-hidden hover:shadow-md transition">
                  <div className="px-4 py-3 bg-blue-50">
                    <p className="font-medium text-blue-900">{course.title}</p>
                    <p className="text-xs text-gray-500">{taught} / {total} sessions</p>
                  </div>
                  <div className="p-4 space-y-3">
                    <div className="w-full bg-gray-200 h-2 rounded">
                      <div
                        className={`h-2 rounded ${progressColor(progress)}`}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-gray-600">
                      <span>{progress}% complete</span>
                      <span>{total - taught} left</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </section>
    </div>
  )
}