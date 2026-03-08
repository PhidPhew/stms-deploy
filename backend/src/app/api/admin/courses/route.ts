import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireRole } from "@/lib/auth"

function generateScheduleDates(startDate: Date, endDate: Date, classDays: number[]): Date[] {
  const dates: Date[] = []
  const current = new Date(startDate)
  current.setHours(0, 0, 0, 0)
  const end = new Date(endDate)
  end.setHours(23, 59, 59, 999)
  while (current <= end) {
    if (classDays.includes(current.getDay())) {
      dates.push(new Date(current))
    }
    current.setDate(current.getDate() + 1)
  }
  return dates
}

export async function GET(req: Request) {
  try {
    await requireRole(req, "ADMIN")
    const courses = await prisma.course.findMany({
      include: {
        _count: { select: { enrollments: true } },
        coach: { include: { user: { select: { name: true, email: true } } } }
      }
    })
    return NextResponse.json({ success: true, data: courses })
  } catch (error) {
    console.error("GET Courses Error:", error)
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    await requireRole(req, "ADMIN")
    const body = await req.json()
    const { title, description, level, coach, price, status, startDate, endDate, classDays } = body
    const coachId = Number(coach)
    if (!title || !coachId) {
      return NextResponse.json({ success: false, error: "Title and Coach are required" }, { status: 400 })
    }
    const parsedClassDays: number[] = Array.isArray(classDays) ? classDays : []
    const parsedStart = startDate ? new Date(startDate) : null
    const parsedEnd = endDate ? new Date(endDate) : null
    const course = await prisma.$transaction(async (tx) => {
      const newCourse = await tx.course.create({
        data: {
          title,
          description,
          level: level || "BEGINNER",
          coachId,
          price: Number(price),
          status: status?.toUpperCase() || "DRAFT",
          startDate: parsedStart,
          endDate: parsedEnd,
          classDays: JSON.stringify(parsedClassDays)
        }
      })
      if (parsedStart && parsedEnd && parsedClassDays.length > 0) {
        const dates = generateScheduleDates(parsedStart, parsedEnd, parsedClassDays)
        if (dates.length > 0) {
          await tx.schedule.createMany({
            data: dates.map((date) => ({
              courseId: newCourse.id,
              date,
              startTime: "09:00",
              endTime: "11:00"
            }))
          })
        }
      }
      return newCourse
    })
    return NextResponse.json({ success: true, data: course }, { status: 201 })
  } catch (error) {
    console.error("POST Course Error:", error)
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 })
  }
}
