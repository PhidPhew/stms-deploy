"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Header from "@/components/admin/dashboard/Header"
import { StatCard } from "@/components/admin/dashboard/StatCard"
import { MonthlyRevenueChart } from "@/components/admin/dashboard/MonthlyRevenueChart"
import axios from "@/lib/axios"

// icons
import { Users, BookOpen, Wallet, TrendingDown, Dumbbell } from "lucide-react"

export default function AdminDashboard() {
  const router = useRouter()
  const [summary, setSummary] = useState({
    totalStudents: 0,
    totalCoaches: 0,
    totalCourses: 0,
    totalRevenue: 0,
    chartData: [] as any[],
    totalExpense: 0,
  })

  useEffect(() => {
    axios.get("/api/admin/finance/summary")
      .then((res) => setSummary(res.data.data))
      .catch((err) => {
        if (err.response?.status === 401) { localStorage.removeItem("token"); router.push("/login") }
      })
  }, [router])

  return (
    <div className="p-6 space-y-6">
      <Header />

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Students"
          value={summary.totalStudents}
          icon={Users}
          changePercent={0}
          href="/admin/users"
        />

        <StatCard
          title="Coaches"
          value={summary.totalCoaches}
          icon={Dumbbell}
          changePercent={0}
          href="/admin/coach"
        />
        <StatCard
          title="Courses"
          value={summary.totalCourses}
          icon={BookOpen}
          changePercent={0}
          href="/admin/courses"
        />

        <StatCard
          title="Revenue"
          value={summary.totalRevenue}
          icon={Wallet}
          changePercent={0}
          href="/admin/payments"
        />

        <StatCard
          title="Expense"
          value={summary.totalExpense}
          icon={TrendingDown}
          changePercent={0}
          href="/admin/payments"
        />
      </div>

      {/* Chart */}
      <MonthlyRevenueChart data={summary.chartData} />
    </div>
  )
}