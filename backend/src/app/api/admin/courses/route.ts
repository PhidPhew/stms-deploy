import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireRole } from "@/lib/auth"
import { createLog } from "@/lib/auditLog"

function generateDates(startDate: Date, endDate: Date, classDays: number[]) {
  const dates = []
  let currentDate = new Date(startDate)

  // Ensure times are zeroed out for clean comparison
  currentDate.setHours(0, 0, 0, 0)
  const end = new Date(endDate)
  end.setHours(0, 0, 0, 0)

  while (currentDate <= end) {
    if (classDays.includes(currentDate.getDay())) {
      dates.push(new Date(currentDate))
    }
    currentDate.setDate(currentDate.getDate() + 1)
  }
  return dates
}

export async function GET(req: Request) {
  try {
    const admin = await requireRole(req, "ADMIN")

    const courses = await prisma.course.findMany({
      include: {
        coach: {
          include: {
            user: { select: { name: true } }
          }
        },
        _count: { select: { enrollments: true } }
      },
      orderBy: { id: "desc" }
    })

    const formattedCourses = courses.map((c: any) => ({
      id: c.id,
      title: c.title,
      description: c.description,
      coach: c.coach.user.name,
      coachId: c.coachId,
      price: c.price,
      status: c.status,
      level: c.level,
      startDate: c.startDate ? c.startDate.toISOString().split("T")[0] : undefined,
      endDate: c.endDate ? c.endDate.toISOString().split("T")[0] : undefined,
      classDays: c.classDays ? JSON.parse(c.classDays) : [],
      enrolledStudents: c._count.enrollments
    }))

    return NextResponse.json({ success: true, data: formattedCourses })
  } catch (error: any) {
    if (error.message === "Unauthorized" || error.message === "Forbidden") {
      return NextResponse.json({ success: false, error: error.message }, { status: 401 })
    }
    console.error("GET Courses Error:", error)
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const admin = await requireRole(req, "ADMIN")
    const body = await req.json()
    const { title, description, coachId, price, status, level, startDate, endDate, classDays } = body

    if (!title || !coachId || price === undefined) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

    const newCourse = await prisma.course.create({
      data: {
        title,
        description: description || "",
        coachId,
        price,
        status: status?.toUpperCase() || "DRAFT",
        level: level?.toUpperCase(),
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        classDays: classDays && Array.isArray(classDays) ? JSON.stringify(classDays) : null,
      }
    })

    // If dates are provided, generate schedule entries
    if (startDate && endDate && Array.isArray(classDays) && classDays.length > 0) {
      const datesToSchedule = generateDates(new Date(startDate), new Date(endDate), classDays)
      
      const scheduleData = datesToSchedule.map(date => ({
        courseId: newCourse.id,
        date: date
      }))

      if (scheduleData.length > 0) {
        await prisma.schedule.createMany({ data: scheduleData })
      }
    }

    await createLog("CREATE", "Course", newCourse.id, admin.id, null, newCourse, `Admin created course ${newCourse.title}`)

    return NextResponse.json({ success: true, data: newCourse, message: "Course created successfully" }, { status: 201 })
  } catch (error: any) {
    if (error.message === "Unauthorized" || error.message === "Forbidden") {
      return NextResponse.json({ success: false, error: error.message }, { status: 401 })
    }
    console.error("POST Course Error:", error)
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 })
  }
}
