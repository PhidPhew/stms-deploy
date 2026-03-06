import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireRole } from "@/lib/auth"

export async function GET(req: Request) {
  try {
    const student = await requireRole(req, "STUDENT")

    const attendances = await prisma.attendance.findMany({
      where: { studentId: student.id },
      include: {
        schedule: {
          include: {
            course: { select: { title: true } }
          }
        }
      },
      orderBy: { schedule: { date: "desc" } }
    })

    const formattedAttendance = attendances.map(a => ({
      id: a.id,
      date: a.schedule.date.toISOString().split("T")[0],
      time: a.time,
      course: a.schedule.course.title,
      status: a.status.toLowerCase()
    }))

    return NextResponse.json({ success: true, data: formattedAttendance })
  } catch (error: any) {
    if (error.message === "Unauthorized" || error.message === "Forbidden") {
      return NextResponse.json({ success: false, error: error.message }, { status: 401 })
    }
    console.error("GET Student Attendance Error:", error)
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 })
  }
}
