"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Home, Bell } from "lucide-react"
import axios from "@/lib/axios"

type TodayClass = {
  id: number
  date: string
  time?: string
  course: string
  status: string
}

type MyCourse = {
  id: number
  title: string
  progress: number
  status: string
}

function progressColor(progress: number) {
  if (progress >= 80) return "bg-green-500"
  if (progress >= 50) return "bg-blue-600"
  if (progress >= 30) return "bg-yellow-500"
  return "bg-red-500"
}

export default function StudentDashboard() {
  const [todayClasses, setTodayClasses] = useState<TodayClass[]>([])
  const [myCourses, setMyCourses] = useState<MyCourse[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await axios.get("/api/student/dashboard")
        const data = res.data?.data || {}
        setTodayClasses(data.todayClasses || [])
        setMyCourses(data.myCourses || [])
      } catch (err) {
        console.error("Student dashboard fetch error:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchDashboard()
  }, [])

  if (loading) {
    return <div className="p-6 flex items-center justify-center h-48 text-gray-400">Loading...</div>
  }

  return (
    <div className="p-6 space-y-8 bg-gray-50 min-h-screen">
      {/* ===== GLOBAL HEADER ===== */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Home className="h-6 w-6 text-blue-700" />
          <h1 className="text-2xl font-bold text-blue-900">Dashboard</h1>
        </div>
        <Link
          href="/student/notifications"
          className="relative h-10 w-10 flex items-center justify-center rounded-full hover:bg-blue-50 transition"
        >
          <Bell className="h-6 w-6 text-blue-700" />
        </Link>
      </div>

      {/* ===== TODAY CLASSES ===== */}
      <section className="bg-white rounded-xl border p-4 space-y-3">
        <h2 className="font-semibold text-blue-900">📅 Today&apos;s Classes</h2>
        {todayClasses.length === 0 ? (
          <p className="text-sm text-gray-500">No classes today.</p>
        ) : (
          todayClasses.map((c) => (
            <div key={c.id} className="border rounded-lg p-3 flex justify-between items-center">
              <div>
                <p className="font-medium">{c.course}</p>
                <p className="text-xs text-gray-500">{c.time || c.date}</p>
              </div>
              <span
                className={`text-xs px-2 py-1 rounded-full font-medium
                  ${c.status === "present" ? "bg-green-100 text-green-700" :
                    c.status === "absent" ? "bg-red-100 text-red-700" :
                    "bg-gray-100 text-gray-600"}`}
              >
                {c.status}
              </span>
            </div>
          ))
        )}
      </section>

      {/* ===== MY COURSES ===== */}
      <div className="flex items-center gap-3">
        <h2 className="text-lg font-semibold text-blue-900">My Active Courses</h2>
        <div className="flex-1 h-px bg-gray-300" />
      </div>

      {myCourses.length === 0 ? (
        <div className="bg-white rounded-xl border p-6 text-center text-gray-500">
          <p>You are not enrolled in any courses yet.</p>
          <Link href="/student/courses" className="text-blue-600 underline mt-2 block text-sm">
            Browse courses
          </Link>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2">
          {myCourses.map((course) => (
            <div
              key={course.id}
              className="bg-white rounded-xl border overflow-hidden transition hover:shadow-lg hover:-translate-y-0.5"
            >
              <div className="bg-blue-50 px-5 py-4 flex justify-between items-start border-b">
                <div className="font-semibold text-lg text-blue-900">{course.title}</div>
                <span className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-700 capitalize">
                  {course.status}
                </span>
              </div>
              <div className="p-5 space-y-4">
                <div className="w-full bg-gray-200 h-2 rounded overflow-hidden">
                  <div
                    className={`h-2 transition-all duration-700 ${progressColor(course.progress)}`}
                    style={{ width: `${course.progress}%` }}
                  />
                </div>
                <p className="text-sm text-gray-600">{course.progress}% complete</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}