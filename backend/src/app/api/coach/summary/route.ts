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
      return NextResponse.json(
        { success: false, error: "Coach profile not found" },
        { status: 404 }
      )
    }

    // Total Courses
    const totalCourses = await prisma.course.count({
      where: {
        coachId: coachProfile.id,
        status: "PUBLISHED"
      }
    })

    // Total Sessions
    const totalSessions = await prisma.schedule.count({
      where: {
        course: {
          coachId: coachProfile.id
        }
      }
    })

    // Payments
    const payments = await prisma.payment.findMany({
      where: {
        course: {
          coachId: coachProfile.id
        },
        status: "APPROVED"
      }
    })

    // Total Income
    const totalIncome = payments.reduce((sum, p) => {
      return sum + (p.amount || 0)
    }, 0)

    // Monthly Trend
    const monthlyData: Record<string, { income: number, sessions: number }> = {}

    payments.forEach((p) => {
      if (!p.approvedAt) return
      const month = p.approvedAt.toISOString().slice(0, 7)
      if (!monthlyData[month]) monthlyData[month] = { income: 0, sessions: 0 }
      monthlyData[month].income += p.amount || 0
    })

    const allSchedules = await prisma.schedule.findMany({
      where: { course: { coachId: coachProfile.id } }
    })

    allSchedules.forEach((s) => {
      const month = s.date.toISOString().slice(0, 7)
      if (!monthlyData[month]) monthlyData[month] = { income: 0, sessions: 0 }
      monthlyData[month].sessions += 1
    })

    const monthlyTrend = Object.keys(monthlyData)
      .sort()
      .map((month) => ({
        month,
        income: monthlyData[month].income,
        sessions: monthlyData[month].sessions
      }))

    const courses = await prisma.course.findMany({
      where: {
        coachId: coachProfile.id,
        status: "PUBLISHED"
      },
      select: {
        id: true,
        title: true,
        _count: { select: { schedules: true } }
      }
    })

    const courseList = await Promise.all(courses.map(async c => {
      const approvedPayments = await prisma.payment.findMany({
        where: { courseId: c.id, status: "APPROVED" }
      })
      const totalRevenue = approvedPayments.reduce((sum, p) => sum + p.amount, 0)
      const studentCount = approvedPayments.length || 1
      const incomePerSession = c._count.schedules > 0
        ? Math.round(totalRevenue / c._count.schedules)
        : 0

      const taughtSessions = await prisma.schedule.count({
        where: {
          courseId: c.id,
          date: { lt: new Date() }
        }
      })

      return {
        id: c.id,
        courseTitle: c.title,
        totalSessions: c._count.schedules,
        taughtSessions,
        incomePerSession
      }
    }))

    return NextResponse.json({
      success: true,
      data: {
        totalCourses,
        totalSessions,
        totalIncome,
        monthlyTrend,
        courses: courseList
      }
    })
  } catch (error: any) {

    if (error.message === "Unauthorized" || error.message === "Forbidden") {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 401 }
      )
    }

    console.error("GET Coach Summary Error:", error)

    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    )
  }
}