"use client"

import { useEffect, useState } from "react"
import {
  BarChart3,
  CalendarCheck,
  DollarSign,
  TrendingUp,
  Clock,
} from "lucide-react"
import axios from "@/lib/axios"

type CourseSummary = {
  id: number
  title: string
  sessions: number
  income: number
}

type SummaryData = {
  totalSessions: number
  totalIncome: number
  courses: CourseSummary[]
}

export default function CoachSummaryPage() {
  const [data, setData] = useState<SummaryData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await axios.get("/api/coach/summary")
        setData(res.data?.data || null)
      } catch (err) {
        console.error("Summary fetch error:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchSummary()
  }, [])

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center h-48 text-gray-400">
        Loading summary...
      </div>
    )
  }

  const totalSessions = data?.totalSessions ?? 0
  const totalIncome = data?.totalIncome ?? 0
  const courses = data?.courses ?? []
  const avgRate = totalSessions > 0 ? Math.round(totalIncome / totalSessions) : 0

  return (
    <div className="p-6 space-y-8 bg-gray-50">
      {/* ===== HEADER ===== */}
      <div className="flex items-center gap-3">
        <BarChart3 className="h-6 w-6 text-blue-700" />
        <h1 className="text-2xl font-bold text-blue-900">Teaching Summary</h1>
      </div>

      {/* ===== KPI CARDS ===== */}
      <div className="grid gap-5 md:grid-cols-4">
        <StatCard icon={<CalendarCheck />} label="Total Sessions" value={`${totalSessions} classes`} color="blue" />
        <StatCard icon={<DollarSign />} label="Total Income" value={`฿${totalIncome.toLocaleString()}`} color="green" />
        <StatCard icon={<Clock />} label="Avg / Session" value={`฿${avgRate}`} color="purple" />
        <StatCard icon={<TrendingUp />} label="Courses" value={`${courses.length}`} color="emerald" />
      </div>

      {/* ===== COURSE BREAKDOWN ===== */}
      {courses.length > 0 && (
        <div className="bg-white rounded-xl border p-6 space-y-4">
          <h2 className="font-semibold text-blue-900">Income Breakdown by Course</h2>
          <div className="space-y-4">
            {courses.map((c) => {
              const percent = totalIncome > 0 ? Math.round((c.income / totalIncome) * 100) : 0
              return (
                <div key={c.id}>
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{c.title}</span>
                    <span className="text-gray-600">
                      ฿{c.income.toLocaleString()} ({percent}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 h-2 rounded mt-2 overflow-hidden">
                    <div className="h-2 bg-blue-600 transition-all" style={{ width: `${percent}%` }} />
                  </div>
                  <div className="text-xs text-gray-500 mt-1">{c.sessions} sessions</div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

function StatCard({
  icon, label, value, color,
}: {
  icon: React.ReactNode
  label: string
  value: string
  color: "blue" | "green" | "purple" | "emerald"
}) {
  const colorMap = {
    blue: "text-blue-600 bg-blue-50",
    green: "text-green-600 bg-green-50",
    purple: "text-purple-600 bg-purple-50",
    emerald: "text-emerald-600 bg-emerald-50",
  }
  return (
    <div className="bg-white rounded-xl border p-5 space-y-2 hover:shadow-md transition">
      <div className={`h-10 w-10 flex items-center justify-center rounded-lg ${colorMap[color]}`}>
        {icon}
      </div>
      <div className="text-sm text-gray-500">{label}</div>
      <div className="text-xl font-bold text-gray-800">{value}</div>
    </div>
  )
}