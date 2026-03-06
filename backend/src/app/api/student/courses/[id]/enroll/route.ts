import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireRole } from "@/lib/auth"
import { createLog } from "@/lib/auditLog"

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const student = await requireRole(req, "STUDENT")
    const courseId = parseInt(params.id)

    if (isNaN(courseId)) {
      return NextResponse.json({ success: false, error: "Invalid course ID" }, { status: 400 })
    }

    const course = await prisma.course.findUnique({ where: { id: courseId } })
    if (!course) {
      return NextResponse.json({ success: false, error: "Course not found" }, { status: 404 })
    }

    // Upsert or Create enrollment
    const newEnrollment = await prisma.enrollment.create({
      data: {
        studentId: student.id,
        courseId: courseId
      }
    })

    await createLog("CREATE", "Enrollment", newEnrollment.id, student.id, null, newEnrollment, `Student ${student.id} enrolled in course ${courseId}`)

    // Optional: We can automatically generate a pending payment record here
    const newPayment = await prisma.payment.create({
      data: {
        studentId: student.id,
        courseId: courseId,
        amount: course.price,
        slipUrl: "", // Need to upload slip later
        status: "PENDING"
      }
    })

    return NextResponse.json({ success: true, data: newEnrollment, message: "Enrolled successfully! Please submit payment." }, { status: 201 })
  } catch (error: any) {
    if (error.message === "Unauthorized" || error.message === "Forbidden") {
      return NextResponse.json({ success: false, error: error.message }, { status: 401 })
    }
    if (error.code === "P2002") {
      return NextResponse.json({ success: false, error: "Already enrolled in this course" }, { status: 400 })
    }
    console.error("POST Student Enroll Error:", error)
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 })
  }
}
