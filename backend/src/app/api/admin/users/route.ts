import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireRole } from "@/lib/auth"
import bcrypt from "bcryptjs"
import { createLog } from "@/lib/auditLog"

export async function GET(req: Request) {
  try {
    const admin = await requireRole(req, "ADMIN")

    // Filter by role or status if needed via query params
    const { searchParams } = new URL(req.url)
    const roleParam = searchParams.get("role")
    
    const whereClause: any = {}
    if (roleParam) {
      whereClause.role = roleParam.toUpperCase()
    }

    const users = await prisma.user.findMany({
      where: whereClause,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json({ success: true, data: users })
  } catch (error: any) {
    if (error.message === "Unauthorized" || error.message === "Forbidden") {
      return NextResponse.json({ success: false, error: error.message }, { status: 401 })
    }
    console.error("GET Users Error:", error)
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const admin = await requireRole(req, "ADMIN")
    const body = await req.json()
    const { name, email, role, password } = body

    if (!name || !email || !role) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

    // Default password logic could be here if not provided
    const hashedPassword = await bcrypt.hash(password || "default123", 10)

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role.toUpperCase(),
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
      }
    })

    await createLog("CREATE", "User", newUser.id, admin.id, null, newUser, `Admin created a new user with role ${newUser.role}`)

    return NextResponse.json({ success: true, data: newUser, message: "User created successfully" }, { status: 201 })
  } catch (error: any) {
    if (error.message === "Unauthorized" || error.message === "Forbidden") {
      return NextResponse.json({ success: false, error: error.message }, { status: 401 })
    }
    if (error.code === "P2002") {
      return NextResponse.json({ success: false, error: "Email already exists" }, { status: 400 })
    }
    console.error("POST Users Error:", error)
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 })
  }
}
