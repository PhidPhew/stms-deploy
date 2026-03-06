"use client"

import { useEffect, useState } from "react"
import Header from "@/components/admin/dashboard/Header"
import { StatCard } from "@/components/admin/dashboard/StatCard"
import { MonthlyRevenueChart } from "@/components/admin/dashboard/MonthlyRevenueChart"
import { Users, BookOpen, Wallet, TrendingDown } from "lucide-react"
import axios from "@/lib/axios"

type SummaryData = {
  totalStudents: number
  totalCourses: number
  totalRevenue: number
  totalExpense: number
  chartData: { month: string; revenue: number; expense: number; profit: number }[]
}

export default function AdminDashboard() {
  const [data, setData] = useState<SummaryData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await axios.get("/api/admin/finance/summary")
        setData(res.data?.data || null)
      } catch (err) {
        console.error("Admin dashboard fetch error:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchSummary()
  }, [])

  return (
    <div className="p-6 space-y-6">
      <Header />

      {loading ? (
        <div className="flex items-center justify-center h-32 text-gray-400">Loading stats...</div>
      ) : (
        <>
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Students"
              value={data?.totalStudents ?? 0}
              icon={Users}
              changePercent={0}
              href="/admin/users"
            />
            <StatCard
              title="Courses"
              value={data?.totalCourses ?? 0}
              icon={BookOpen}
              changePercent={0}
              href="/admin/courses"
            />
            <StatCard
              title="Revenue"
              value={data?.totalRevenue ?? 0}
              icon={Wallet}
              changePercent={0}
              href="/admin/payments"
            />
            <StatCard
              title="Expense"
              value={data?.totalExpense ?? 0}
              icon={TrendingDown}
              changePercent={0}
              href="/admin/payments"
            />
          </div>

          {/* Chart */}
          <MonthlyRevenueChart />
        </>
      )}
    </div>
  )
}