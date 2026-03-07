import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { name, email, password, role } = body

    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, error: "Missing required fields: name, email, password" },
        { status: 400 }
      )
    }

    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: "Email already exists" },
        { status: 400 }
      )
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const allowedRoles = ["STUDENT", "COACH", "ADMIN"]
    const normalizedRole = role?.toUpperCase()
    const userRole = allowedRoles.includes(normalizedRole) ? normalizedRole : "STUDENT"

    const user = await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: { name, email, password: hashedPassword, role: userRole as any },
        select: { id: true, name: true, email: true, role: true },
      })

      if (userRole === "COACH") {
        await tx.coachProfile.create({
          data: { userId: newUser.id, expertise: "[]", status: "ACTIVE" },
        })
      }

      return newUser
    })

    return NextResponse.json(
      { success: true, message: "Account created successfully", data: user },
      { status: 201 }
    )
  } catch (error: any) {
    console.error("Register error:", error)
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    )
  }
}
