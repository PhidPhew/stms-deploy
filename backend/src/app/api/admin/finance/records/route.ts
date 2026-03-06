import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireRole } from "@/lib/auth"
import { createLog } from "@/lib/auditLog"

export async function GET(req: Request) {
  try {
    const admin = await requireRole(req, "ADMIN")

    const records = await prisma.financeRecord.findMany({
      orderBy: { date: "desc" }
    })

    const formattedRecords = records.map(r => ({
      id: r.id,
      date: r.date.toISOString().split("T")[0],
      name: r.name,
      description: r.description,
      amount: r.amount,
      type: r.type
    }))

    return NextResponse.json({ success: true, data: formattedRecords })
  } catch (error: any) {
    if (error.message === "Unauthorized" || error.message === "Forbidden") {
      return NextResponse.json({ success: false, error: error.message }, { status: 401 })
    }
    console.error("GET Finance Records Error:", error)
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const admin = await requireRole(req, "ADMIN")
    const body = await req.json()
    const { date, name, description, amount, type } = body

    if (!date || !name || !amount || !type || (type !== "revenue" && type !== "expense")) {
      return NextResponse.json({ success: false, error: "Missing or invalid required fields" }, { status: 400 })
    }

    const newRecord = await prisma.financeRecord.create({
      data: {
        date: new Date(date),
        name,
        description: description || "",
        amount: parseFloat(amount),
        type
      }
    })

    await createLog("CREATE", "FinanceRecord", newRecord.id, admin.id, null, newRecord, `Admin created manual ${type} record`)

    return NextResponse.json({ success: true, data: {
      ...newRecord,
      date: newRecord.date.toISOString().split("T")[0]
    }, message: "Finance record created successfully" }, { status: 201 })
  } catch (error: any) {
    if (error.message === "Unauthorized" || error.message === "Forbidden") {
      return NextResponse.json({ success: false, error: error.message }, { status: 401 })
    }
    console.error("POST Finance Record Error:", error)
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 })
  }
}
