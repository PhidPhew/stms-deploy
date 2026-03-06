import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireRole } from "@/lib/auth"

export async function GET(req: Request) {
  try {
    const student = await requireRole(req, "STUDENT")

    const { searchParams } = new URL(req.url)
    const sportFilter = searchParams.get("sport")
    const levelFilter = searchParams.get("level")
    const search = searchParams.get("search")

    const whereClause: any = {
      status: "PUBLISHED"
    }

    if (sportFilter && sportFilter !== "all" && sportFilter !== "All") {
      // the frontend filters by string matching in title or description usually
      whereClause.title = { contains: sportFilter }
    }
    if (levelFilter && levelFilter !== "all" && levelFilter !== "All") {
      whereClause.level = levelFilter.toUpperCase()
    }
    if (search) {
      whereClause.OR = [
        { title: { contains: search } },
        { description: { contains: search } }
      ]
    }

    const courses = await prisma.course.findMany({
      where: whereClause,
      include: {
        coach: { include: { user: { select: { name: true } } } },
        _count: { select: { enrollments: true } }
      },
      orderBy: { id: "desc" }
    })

    const formattedCourses = courses.map(c => ({
      id: c.id,
      title: c.title,
      description: c.description,
      coach: c.coach.user.name,
      price: c.price,
      level: c.level,
      startDate: c.startDate ? c.startDate.toISOString().split("T")[0] : undefined,
      endDate: c.endDate ? c.endDate.toISOString().split("T")[0] : undefined,
      classDays: c.classDays ? JSON.parse(c.classDays) : [],
      status: c.status,
      enrolledCount: c._count.enrollments
    }))

    return NextResponse.json({ success: true, data: formattedCourses })
  } catch (error: any) {
    if (error.message === "Unauthorized" || error.message === "Forbidden") {
      return NextResponse.json({ success: false, error: error.message }, { status: 401 })
    }
    console.error("GET Student Courses Error:", error)
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 })
  }
}
