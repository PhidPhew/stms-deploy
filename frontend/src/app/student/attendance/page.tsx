"use client"
import { useMemo, useEffect, useState } from "react"
import { CalendarCheck } from "lucide-react"
import axios from "@/lib/axios"

type AttendanceStatus = "present" | "absent"
type Attendance = {
  id: number
  date: string
  time?: string
  course: string
  status: AttendanceStatus
}

export default function StudentAttendancePage() {
  const [attendanceHistory, setAttendanceHistory] = useState<Attendance[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios.get("/api/student/attendance")
      .then((res) => setAttendanceHistory(res.data.data ?? []))
      .catch(() => setAttendanceHistory([]))
      .finally(() => setLoading(false))
  }, [])

  const courseSummary = useMemo(() => {
    const map: Record<string, { total: number; present: number }> = {}
    attendanceHistory.forEach((a) => {
      if (!map[a.course]) map[a.course] = { total: 0, present: 0 }
      map[a.course].total++
      if (a.status === "present") map[a.course].present++
    })
    return Object.entries(map).map(([course, v]) => ({
      course,
      total: v.total,
      present: v.present,
      percent: Math.round((v.present / v.total) * 100),
    }))
  }, [attendanceHistory])

  const sortedHistory = useMemo(() => {
    return [...attendanceHistory].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    )
  }, [attendanceHistory])

  if (loading) return <div className="p-6 text-gray-500">Loading...</div>

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3">
        <CalendarCheck className="h-6 w-6 text-blue-700" />
        <h1 className="text-2xl font-bold text-blue-900">Attendance</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {courseSummary.map((c) => (
          <CourseProgressCard key={c.course} {...c} />
        ))}
      </div>

      <div className="bg-white border rounded-2xl overflow-hidden">
        <div className="p-4 border-b">
          <p className="font-medium">Attendance History</p>
        </div>
        <div className="divide-y">
          {sortedHistory.length === 0 && (
            <p className="p-4 text-sm text-gray-400">No attendance records found.</p>
          )}
          {sortedHistory.map((a) => (
            <div key={a.id} className="p-4 flex justify-between items-center transition-all hover:bg-gray-50 hover:pl-6">
              <div>
                <p className="font-medium">{a.course}</p>
                <p className="text-sm text-gray-500">
                  {new Date(a.date).toLocaleDateString()}
                  {a.time && ` · ${a.time}`}
                </p>
              </div>
              <StatusPill status={a.status} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function CourseProgressCard({ course, present, total, percent }: { course: string; present: number; total: number; percent: number }) {
  const animated = useAnimatedNumber(percent)
  const isPerfect = percent === 100
  return (
    <div className={`relative bg-white border rounded-2xl p-4 space-y-3 transition-all hover:shadow-lg hover:-translate-y-1 ${isPerfect ? "ring-2 ring-yellow-300" : ""}`}>
      <div className="flex justify-between items-center">
        <p className="font-medium">{course}</p>
        {isPerfect && <PerfectBadge />}
      </div>
      <div className="h-2.5 w-full bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full bg-gradient-to-r ${percent >= 80 ? "from-green-400 to-emerald-500" : percent >= 50 ? "from-blue-400 to-blue-500" : percent >= 30 ? "from-yellow-400 to-amber-500" : "from-red-400 to-rose-500"} transition-all duration-700`}
          style={{ width: `${animated}%` }}
        />
      </div>
      <p className="text-sm text-gray-600">{present}/{total} classes · <span className="font-semibold">{animated}%</span></p>
    </div>
  )
}

function PerfectBadge() {
  return (
    <span className="flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-full bg-gradient-to-r from-yellow-400 to-amber-500 text-white shadow-md animate-bounce">
      🏆 Perfect
    </span>
  )
}

function StatusPill({ status }: { status?: AttendanceStatus }) {
  if (!status) return <span className="px-4 py-1 rounded-full text-sm bg-gray-200 text-gray-600">—</span>
  return (
    <span className={`px-4 py-1 rounded-full text-sm font-medium ${status === "present" ? "bg-gradient-to-r from-green-400 to-emerald-500 text-white" : "bg-gradient-to-r from-red-400 to-rose-500 text-white"}`}>
      {status === "present" ? "✓ Present" : "✕ Absent"}
    </span>
  )
}

function useAnimatedNumber(value: number) {
  const [display, setDisplay] = useState(0)
  useEffect(() => {
    let start = 0
    const duration = 700
    const step = 16
    const increment = value / (duration / step)
    const timer = setInterval(() => {
      start += increment
      if (start >= value) { setDisplay(value); clearInterval(timer) }
      else setDisplay(Math.floor(start))
    }, step)
    return () => clearInterval(timer)
  }, [value])
  return display
}
