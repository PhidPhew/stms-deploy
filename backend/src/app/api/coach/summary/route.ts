import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireRole } from "@/lib/auth"

export async function GET(req: Request) {
  try {
    const coachUser = await requireRole(req, "COACH")

    const coachProfile = await prisma.coachProfile.findUnique({
      where: { userId: coachUser.id }
    })

    if (!coachProfile) {
      return NextResponse.json({ success: false, error: "Coach profile not found" }, { status: 404 })
    }

    // 1. Total Courses Taught
    const totalCourses = await prisma.course.count({
      where: { coachId: coachProfile.id, status: "PUBLISHED" }
    })

    // 2. Total Sessions (Schedules)
    const totalSessions = await prisma.schedule.count({
      where: { course: { coachId: coachProfile.id } }
    })

    // 3. Estimated Income (Sum of course prices * students - assumed coach share is 100% for this MVP or some calculation)
    // Here we'll just sum up the payment amounts for students enrolled in their courses
    const payments = await prisma.payment.findMany({
      where: { 
        course: { coachId: coachProfile.id },
        status: "APPROVED" 
      }
    })

    const totalIncome = payments.reduce((sum, p) => sum + p.amount, 0)

    // 4. Monthly Trend (Mocking based on payment dates)
    const monthlyData: Record<string, number> = {}

    payments.forEach(p => {
      const month = p.approvedAt ? p.approvedAt.toISOString().slice(0, 7) : ""
      if (month) {
        monthlyData[month] = (monthlyData[month] || 0) + p.amount
      }
    })

    const monthlyTrend = Object.keys(monthlyData).sort().map(month => ({
      month,
      income: monthlyData[month]
    }))

    return NextResponse.json({
      success: true,
      data: {
        totalCourses,
        totalSessions,
        totalIncome,
        monthlyTrend
      }
    })
  } catch (error: any) {
    if (error.message === "Unauthorized" || error.message === "Forbidden") {
      return NextResponse.json({ success: false, error: error.message }, { status: 401 })
    }
    console.error("GET Coach Summary Error:", error)
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 })
  }
}
