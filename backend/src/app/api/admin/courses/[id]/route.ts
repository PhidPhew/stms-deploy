import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireRole } from "@/lib/auth"
import { createLog } from "@/lib/auditLog"

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const admin = await requireRole(req, "ADMIN")
    const courseId = parseInt(params.id)
    if (isNaN(courseId)) {
      return NextResponse.json({ success: false, error: "Invalid course ID" }, { status: 400 })
    }

    const body = await req.json()
    const { title, description, coachId, price, status, level, startDate, endDate, classDays } = body

    const existingCourse = await prisma.course.findUnique({ where: { id: courseId } })
    if (!existingCourse) {
      return NextResponse.json({ success: false, error: "Course not found" }, { status: 404 })
    }

    const dataToUpdate: any = {}
    if (title !== undefined) dataToUpdate.title = title
    if (description !== undefined) dataToUpdate.description = description
    if (coachId !== undefined) dataToUpdate.coachId = coachId
    if (price !== undefined) dataToUpdate.price = price
    if (status) dataToUpdate.status = status.toUpperCase()
    if (level) dataToUpdate.level = level.toUpperCase()
    if (startDate !== undefined) dataToUpdate.startDate = startDate ? new Date(startDate) : null
    if (endDate !== undefined) dataToUpdate.endDate = endDate ? new Date(endDate) : null
    if (classDays !== undefined) dataToUpdate.classDays = Array.isArray(classDays) ? JSON.stringify(classDays) : null

    const updatedCourse = await prisma.course.update({
      where: { id: courseId },
      data: dataToUpdate
    })

    // Currently we DO NOT dynamically recreate schedules on update to avoid losing attendance data linked to schedules.
    // In a real-world scenario, you might add a separate endpoint or logic to 'regenerate schedule' which warns about data loss.

    await createLog("UPDATE", "Course", courseId, admin.id, existingCourse, dataToUpdate, `Admin updated course ${courseId}`)

    return NextResponse.json({ success: true, data: updatedCourse, message: "Course updated successfully" })
  } catch (error: any) {
    if (error.message === "Unauthorized" || error.message === "Forbidden") {
      return NextResponse.json({ success: false, error: error.message }, { status: 401 })
    }
    console.error("PUT Course Error:", error)
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const admin = await requireRole(req, "ADMIN")
    const courseId = parseInt(params.id)
    if (isNaN(courseId)) {
      return NextResponse.json({ success: false, error: "Invalid course ID" }, { status: 400 })
    }

    const existingCourse = await prisma.course.findUnique({ where: { id: courseId } })
    if (!existingCourse) {
      return NextResponse.json({ success: false, error: "Course not found" }, { status: 404 })
    }

    // Dependent objects like Enrollments and Schedules should either cascade or be deleted first.
    // For simplicity, we assume we want to delete them via prisma transaction.
    await prisma.$transaction([
      prisma.attendance.deleteMany({ where: { schedule: { courseId } } }),
      prisma.schedule.deleteMany({ where: { courseId } }),
      prisma.enrollment.deleteMany({ where: { courseId } }),
      prisma.course.delete({ where: { id: courseId } })
    ])

    await createLog("DELETE_HARD", "Course", courseId, admin.id, existingCourse, null, `Admin deleted course ${courseId}`)

    return NextResponse.json({ success: true, message: "Course deleted successfully" })
  } catch (error: any) {
    if (error.message === "Unauthorized" || error.message === "Forbidden") {
      return NextResponse.json({ success: false, error: error.message }, { status: 401 })
    }
    console.error("DELETE Course Error:", error)
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 })
  }
}
