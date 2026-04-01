"use client"
import { useEffect, useMemo, useState } from "react"
import axios from "@/lib/axios"
import {
  BarChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"

const MONTH_LABELS: Record<string, string> = {
  "01": "January", "02": "February", "03": "March", "04": "April",
  "05": "May", "06": "June", "07": "July", "08": "August",
  "09": "September", "10": "October", "11": "November", "12": "December",
}

/** Raw monthly rows from /api/admin/finance/summary `chartData` */
export type MonthlyChartRawRow = {
  month?: string
  revenue?: number
  expense?: number
}

type FormattedRow = {
  month: string
  revenue: number
  expense: number
  profit: number
}

function formatMonthlyChartData(monthly: MonthlyChartRawRow[]): FormattedRow[] {
  return monthly.map((m) => {
    const monthKey = m.month?.slice(5, 7)
    const revenue = m.revenue ?? 0
    const expense = m.expense ?? 0
    return {
      month: (monthKey && MONTH_LABELS[monthKey]) ?? m.month ?? "",
      revenue,
      expense,
      profit: revenue - expense,
    }
  })
}

export type MonthlyRevenueChartProps = {
  /** When set, chart uses this data (e.g. from parent summary). When omitted, fetches from the API. */
  data?: MonthlyChartRawRow[]
}

export function MonthlyRevenueChart({ data }: MonthlyRevenueChartProps = {}) {
  const [fetchedData, setFetchedData] = useState<FormattedRow[]>([])

  useEffect(() => {
    if (data !== undefined) return
    axios.get("/api/admin/finance/summary").then((res) => {
      const monthly = res.data.data?.chartData ?? []
      setFetchedData(formatMonthlyChartData(monthly))
    }).catch(() => {})
  }, [data])

  const chartData = useMemo(() => {
    if (data !== undefined) return formatMonthlyChartData(data)
    return fetchedData
  }, [data, fetchedData])

  if (chartData.length === 0) return (
    <div className="bg-white rounded-xl p-6 shadow">
      <p className="text-sm text-gray-400">No financial data yet</p>
    </div>
  )

  return (
    <div className="bg-white rounded-xl p-6 shadow">
      <div className="mb-4">
        <h3 className="text-lg font-semibold">
          <span className="text-black">Monthly </span>
          <span className="text-blue-600">Revenue</span>
          <span className="text-slate-800">, </span>
          <span className="text-rose-500">Expense</span>
          <span className="text-slate-800"> and </span>
          <span className="text-yellow-500">Profit</span>
        </h3>
        <p className="text-sm text-slate-500">Overview of financial performance</p>
      </div>
      <div className="w-full h-[420px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <XAxis dataKey="month" tick={{ fill: "#475569", fontSize: 12 }} />
            <YAxis tick={{ fill: "#475569", fontSize: 12 }} tickFormatter={(v) => `฿${v / 1000}k`} />
            <Tooltip
              contentStyle={{ backgroundColor: "#fff", border: "1px solid #e2e8f0", borderRadius: 8 }}
              formatter={(value, name) => [`฿${(value as number).toLocaleString()}`, name]}
            />
            <Legend />
            <Bar dataKey="revenue" name="Revenue" fill="#2563eb" radius={[8, 8, 0, 0]} />
            <Bar dataKey="expense" name="Expense" fill="#f43f5e" radius={[8, 8, 0, 0]} />
            <Line type="monotone" dataKey="profit" name="Profit" stroke="#ffd500ff" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
