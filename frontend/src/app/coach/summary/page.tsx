"use client"

import { useState, useEffect } from "react"
import axios from "@/lib/axios"
import {
  BarChart3,
  CalendarCheck,
  DollarSign,
  TrendingUp,
  Clock,
} from "lucide-react"

/* ================= TYPES ================= */

type CourseSummary = {
  id: number
  name: string
  sessions: number
  hourlyRate: number
}

type MonthlyStat = {
  month: string
  sessions: number
  income: number
}

/* ================= PAGE ================= */

export default function CoachSummaryPage() {
  const [courseSummaries, setCourseSummaries] = useState<CourseSummary[]>([])
  const [monthlyStats, setMonthlyStats] = useState<MonthlyStat[]>([])

  const [totalIncome, setTotalIncome] = useState(0)

  useEffect(() => {
    axios.get("/api/coach/summary").then((res) => {
      const data = res.data.data
      const courses = (data?.courses ?? []).map((c: any) => ({
        id: c.id,
        name: c.courseTitle,
        sessions: c.taughtSessions,
        hourlyRate: c.incomePerSession
      }))
      setCourseSummaries(courses)
      setTotalIncome(data?.totalIncome ?? 0)
      const monthly = (data?.monthlyTrend ?? []).map((m: any) => ({
        month: m.month,
        sessions: m.sessions ?? 0,
        income: m.income
      }))
      setMonthlyStats(monthly)
    })
  }, [])

  const totalSessions = (Array.isArray(courseSummaries) ? courseSummaries : []).reduce((sum, c) => sum + c.sessions, 0)
  const avgRate = totalSessions > 0 ? Math.round(totalIncome / totalSessions) : 0

  return (
    <div className="p-6 space-y-8 bg-gray-50">
      {/* ===== HEADER ===== */}
      <div className="flex items-center gap-3">
        <BarChart3 className="h-6 w-6 text-blue-700" />
        <h1 className="text-2xl font-bold text-blue-900">
          Teaching Summary
        </h1>
      </div>

      {/* ===== KPI CARDS ===== */}
      <div className="grid gap-5 md:grid-cols-4">
        <StatCard
          icon={<CalendarCheck />}
          label="Total Sessions"
          value={`${totalSessions} classes`}
          color="blue"
        />
        <StatCard
          icon={<DollarSign />}
          label="Total Income"
          value={`฿${totalIncome.toLocaleString()}`}
          color="green"
        />
        <StatCard
          icon={<Clock />}
          label="Avg / Session"
          value={`฿${avgRate}`}
          color="purple"
        />
        <StatCard
          icon={<TrendingUp />}
          label="Growth"
          value="+18%"
          color="emerald"
        />
      </div>

      {/* ===== COURSE BREAKDOWN ===== */}
      <div className="bg-white rounded-xl border p-6 space-y-4">
        <h2 className="font-semibold text-blue-900">
          Income Breakdown by Course
        </h2>

        <div className="space-y-4">
          {(Array.isArray(courseSummaries) ? courseSummaries : []).map((c) => {
            const income = c.sessions * c.hourlyRate
            const percent = Math.round(
              (income / totalIncome) * 100
            )

            return (
              <div key={c.id}>
                <div className="flex justify-between text-sm">
                  <span className="font-medium">
                    {c.name}
                  </span>
                  <span className="text-gray-600">
                    ฿{income.toLocaleString()} ({percent}
                    %)
                  </span>
                </div>

                <div className="w-full bg-gray-200 h-2 rounded mt-2 overflow-hidden">
                  <div
                    className="h-2 bg-blue-600 transition-all"
                    style={{ width: `${percent}%` }}
                  />
                </div>

                <div className="text-xs text-gray-500 mt-1">
                  {c.sessions} sessions × ฿
                  {c.hourlyRate}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* ===== MONTHLY TREND ===== */}
      <div className="bg-white rounded-xl border p-6 space-y-4">
        <h2 className="font-semibold text-blue-900">
          Monthly Teaching Trend
        </h2>

        <div className="grid grid-cols-3 gap-4">
          {monthlyStats.map((m) => (
            <div
              key={m.month}
              className="border rounded-lg p-4 text-center
                         hover:shadow-sm transition"
            >
              <div className="text-sm text-gray-500">
                {m.month}
              </div>

              <div className="text-lg font-semibold text-blue-800">
                {m.sessions} classes
              </div>

              <div className="text-sm text-green-600">
                ฿{m.income.toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ===== INSIGHT BOX ===== */}
      {(() => {
        const insights: string[] = []

        // หา course ที่ incomePerSession สูงสุด
        const topCourse = [...courseSummaries].sort((a, b) => b.hourlyRate - a.hourlyRate)[0]
        if (topCourse) insights.push(`${topCourse.name} gives highest income per session (฿${topCourse.hourlyRate.toLocaleString()})`)

        // หาเดือนที่รายได้สูงสุด
        const topMonth = [...monthlyStats].sort((a, b) => b.income - a.income)[0]
        if (topMonth) insights.push(`${topMonth.month} is your highest income month (฿${topMonth.income.toLocaleString()})`)

        // ถ้าไม่มี approved payments เลย
        if (totalIncome === 0) insights.push("No approved payments yet — income will appear after admin approves payments")

        if (insights.length === 0) return null

        return (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 space-y-2">
            <div className="font-semibold text-blue-900">💡 Insight</div>
            <ul className="text-sm text-blue-800 space-y-1 list-disc ml-4">
              {insights.map((insight, i) => <li key={i}>{insight}</li>)}
            </ul>
          </div>
        )
      })()}
    </div>
  )
}

/* ================= COMPONENTS ================= */

function StatCard({
  icon,
  label,
  value,
  color,
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
      <div
        className={`h-10 w-10 flex items-center justify-center rounded-lg ${colorMap[color]}`}
      >
        {icon}
      </div>

      <div className="text-sm text-gray-500">
        {label}
      </div>

      <div className="text-xl font-bold text-gray-800">
        {value}
      </div>
    </div>
  )
}