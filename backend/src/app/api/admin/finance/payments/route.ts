import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireRole } from "@/lib/auth"

export async function GET(req: Request) {
  try {
    const admin = await requireRole(req, "ADMIN")

    const payments = await prisma.payment.findMany({
      include: {
        student: { select: { name: true } },
        course: { select: { title: true } }
      },
      orderBy: { createdAt: "desc" }
    })

    const formattedPayments = payments.map(p => ({
      id: p.id,
      name: p.student.name,
      course: p.course?.title || "General",
      amount: p.amount,
      slipUrl: p.slipUrl,
      status: p.status,
      approvedAt: p.approvedAt
    }))

    return NextResponse.json({ success: true, data: formattedPayments })
  } catch (error: any) {
    if (error.message === "Unauthorized" || error.message === "Forbidden") {
      return NextResponse.json({ success: false, error: error.message }, { status: 401 })
    }
    console.error("GET Payments Error:", error)
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 })
  }
}
