import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireRole } from "@/lib/auth"

export async function GET(req: Request) {
  try {
    await requireRole(req, "ADMIN")

    const courses = await prisma.course.findMany({
      include: {
        coach: {
          include: {
            user: {
              select: {
                name: true,
                email: true
              }
            }
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      data: courses
    })

  } catch (error) {
    console.error("GET Courses Error:", error)

    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  try {
    await requireRole(req, "ADMIN")

    const body = await req.json()
    console.log("COURSE BODY:", body)

    const {
      title,
      description,
      level,
      coach,
      price,
      status,
      startDate,
      endDate,
      classDays
    } = body

    const coachId = Number(coach)

    if (!title || !coachId) {
      return NextResponse.json(
        { success: false, error: "Title and Coach are required" },
        { status: 400 }
      )
    }

    const course = await prisma.course.create({
      data: {
        title,
        description,
        level: level || "BEGINNER",
        coachId: Number(coach),
        price: Number(price),
        status: status?.toUpperCase() || "DRAFT",
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        classDays: JSON.stringify(classDays || [])
      }
    })

    return NextResponse.json({
      success: true,
      data: course
    })

  } catch (error) {
    console.error("POST Course Error:", error)

    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    )
  }
}