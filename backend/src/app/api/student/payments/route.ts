import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireRole } from "@/lib/auth"
import { createLog } from "@/lib/auditLog"

export async function GET(req: Request) {
  try {
    const student = await requireRole(req, "STUDENT")

    const payments = await prisma.payment.findMany({
      where: { studentId: student.id },
      include: {
        course: { select: { title: true } }
      },
      orderBy: { createdAt: "desc" }
    })

    const formattedPayments = payments.map(p => ({
      id: p.id,
      date: p.createdAt.toISOString().split("T")[0],
      courseId: p.courseId,
      course: p.course?.title || "General",
      amount: p.amount,
      status: p.status.toLowerCase()
    }))

    return NextResponse.json({ success: true, data: formattedPayments })
  } catch (error: any) {
    if (error.message === "Unauthorized" || error.message === "Forbidden") {
      return NextResponse.json({ success: false, error: error.message }, { status: 401 })
    }
    console.error("GET Student Payments Error:", error)
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    // In a real implementation this would handle FormData for slip uploads
    // For now we assume a JSON payload with a slipUrl (after uploading to S3/Cloudinary)
    const student = await requireRole(req, "STUDENT")
    const body = await req.json()
    const { paymentId, slipUrl } = body

    if (!paymentId || !slipUrl) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

    const existingPayment = await prisma.payment.findUnique({ where: { id: parseInt(paymentId) } })
    if (!existingPayment || existingPayment.studentId !== student.id) {
       return NextResponse.json({ success: false, error: "Payment record not found or unauthorized" }, { status: 404 })
    }

    const updatedPayment = await prisma.payment.update({
      where: { id: parseInt(paymentId) },
      data: {
        slipUrl,
        status: "PENDING" // Keeps it pending so admin can review
      }
    })

    await createLog("UPDATE", "Payment", updatedPayment.id, student.id, existingPayment, updatedPayment, `Student uploaded payment slip`)

    return NextResponse.json({ success: true, data: updatedPayment, message: "Payment slip submitted successfully" }, { status: 201 })
  } catch (error: any) {
    if (error.message === "Unauthorized" || error.message === "Forbidden") {
      return NextResponse.json({ success: false, error: error.message }, { status: 401 })
    }
    console.error("POST Student Payment Error:", error)
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 })
  }
}
