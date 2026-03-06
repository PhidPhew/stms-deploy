import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireRole } from "@/lib/auth"
import { createLog } from "@/lib/auditLog"

export async function GET(req: Request) {
  try {
    const coachUser = await requireRole(req, "COACH")

    const coachProfile = await prisma.coachProfile.findUnique({
      where: { userId: coachUser.id }
    })

    if (!coachProfile) {
      return NextResponse.json({ success: false, error: "Coach profile not found" }, { status: 404 })
    }

    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(today.getDate() + 1)

    // Get schedules for today
    const schedules = await prisma.schedule.findMany({
      where: {
        course: { coachId: coachProfile.id },
        date: { gte: today, lt: tomorrow }
      },
      include: {
        course: {
          include: {
            enrollments: {
              include: {
                student: { select: { id: true, name: true, email: true } }
              }
            }
          }
        },
        attendance: true
      }
    })

    const formattedSchedules = schedules.map(s => {
      return {
        scheduleId: s.id,
        courseId: s.courseId,
        courseTitle: s.course.title,
        students: s.course.enrollments.map(e => {
          const attendanceRecord = s.attendance.find(a => a.studentId === e.student.id)
          return {
            id: e.student.id,
            name: e.student.name,
            email: e.student.email,
            status: attendanceRecord ? attendanceRecord.status : "PENDING"
          }
        })
      }
    })

    return NextResponse.json({ success: true, data: formattedSchedules })
  } catch (error: any) {
    if (error.message === "Unauthorized" || error.message === "Forbidden") {
      return NextResponse.json({ success: false, error: error.message }, { status: 401 })
    }
    console.error("GET Coach Attendance Error:", error)
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const coachUser = await requireRole(req, "COACH")
    const body = await req.json()
    const { scheduleId, records } = body
    // records: [{ studentId: 1, status: "PRESENT" }, { studentId: 2, status: "ABSENT" }]

    if (!scheduleId || !Array.isArray(records)) {
      return NextResponse.json({ success: false, error: "Invalid payload" }, { status: 400 })
    }

    // Verify schedule belongs to coach
    const schedule = await prisma.schedule.findUnique({
      where: { id: parseInt(scheduleId) },
      include: { course: true }
    })

    if (!schedule) {
      return NextResponse.json({ success: false, error: "Schedule not found" }, { status: 404 })
    }

    const coachProfile = await prisma.coachProfile.findUnique({ where: { userId: coachUser.id } })
    if (schedule.course.coachId !== coachProfile?.id) {
       return NextResponse.json({ success: false, error: "Forbidden: Not your course schedule" }, { status: 403 })
    }

    const currentTime = new Date().toLocaleTimeString("en-US", { hour12: false, hour: "2-digit", minute: "2-digit" })

    // Upsert attendance records
    const transaction = records.map(record => {
      return prisma.attendance.upsert({
        where: {
          scheduleId_studentId: {
            scheduleId: parseInt(scheduleId),
            studentId: parseInt(record.studentId)
          }
        },
        update: {
          status: record.status.toUpperCase(),
          time: record.status.toUpperCase() === "PRESENT" ? currentTime : null
        },
        create: {
          scheduleId: parseInt(scheduleId),
          studentId: parseInt(record.studentId),
          status: record.status.toUpperCase(),
          time: record.status.toUpperCase() === "PRESENT" ? currentTime : null
        }
      })
    })

    await prisma.$transaction(transaction)

    await createLog("UPDATE", "Attendance", scheduleId, coachUser.id, null, records, "Coach marked attendance")

    return NextResponse.json({ success: true, message: "Attendance saved successfully" })
  } catch (error: any) {
    if (error.message === "Unauthorized" || error.message === "Forbidden") {
      return NextResponse.json({ success: false, error: error.message }, { status: 401 })
    }
    console.error("POST Coach Attendance Error:", error)
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 })
  }
}
