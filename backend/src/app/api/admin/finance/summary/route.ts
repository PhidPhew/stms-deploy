import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireRole } from "@/lib/auth"

export async function GET(req: Request) {
  try {
    const admin = await requireRole(req, "ADMIN")

    // 1. Total Students
    const totalStudents = await prisma.user.count({
      where: { role: "STUDENT" }
    })

    // 2. Total Courses
    const totalCourses = await prisma.course.count()

    // 3. Financial Totals
    const financeRecords = await prisma.financeRecord.findMany()
    let totalRevenue = 0
    let totalExpense = 0

    financeRecords.forEach(record => {
      if (record.type === "revenue") totalRevenue += record.amount
      else if (record.type === "expense") totalExpense += record.amount
    })

    // 4. Monthly Breakdown (Mocking basic aggregation for the chart in frontend)
    const monthlyData: Record<string, { revenue: number, expense: number }> = {}

    financeRecords.forEach(record => {
      // Group by YYYY-MM
      const month = record.date.toISOString().slice(0, 7)
      if (!monthlyData[month]) {
        monthlyData[month] = { revenue: 0, expense: 0 }
      }
      if (record.type === "revenue") monthlyData[month].revenue += record.amount
      else if (record.type === "expense") monthlyData[month].expense += record.amount
    })

    const chartData = Object.keys(monthlyData).sort().map(month => ({
      month,
      revenue: monthlyData[month].revenue,
      expense: monthlyData[month].expense,
      profit: monthlyData[month].revenue - monthlyData[month].expense
    }))

    return NextResponse.json({
      success: true,
      data: {
        totalStudents,
        totalCourses,
        totalRevenue,
        totalExpense,
        chartData
      }
    })
  } catch (error: any) {
    if (error.message === "Unauthorized" || error.message === "Forbidden") {
      return NextResponse.json({ success: false, error: error.message }, { status: 401 })
    }
    console.error("GET Finance Summary Error:", error)
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 })
  }
}
