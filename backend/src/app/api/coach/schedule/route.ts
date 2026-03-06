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

    // Get up to 30 days of upcoming schedules
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const next30Days = new Date(today)
    next30Days.setDate(today.getDate() + 30)

    const schedules = await prisma.schedule.findMany({
      where: {
        course: { coachId: coachProfile.id },
        date: {
          gte: today,
          lt: next30Days
        }
      },
      include: {
        course: { select: { title: true, level: true } }
      },
      orderBy: { date: "asc" }
    })

    const formattedSchedules = schedules.map(s => ({
      id: s.id,
      courseId: s.courseId,
      courseTitle: s.course.title,
      level: s.course.level,
      date: s.date.toISOString().split("T")[0],
      startTime: s.startTime || "TBD",
      endTime: s.endTime || "TBD"
    }))

    return NextResponse.json({ success: true, data: formattedSchedules })
  } catch (error: any) {
    if (error.message === "Unauthorized" || error.message === "Forbidden") {
      return NextResponse.json({ success: false, error: error.message }, { status: 401 })
    }
    console.error("GET Coach Schedule Error:", error)
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 })
  }
}
