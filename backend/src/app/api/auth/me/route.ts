import { NextRequest, NextResponse } from "next/server"
import { verifyJwt } from "@/lib/jwt"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization")
    let token: string | null = null

    if (authHeader?.startsWith("Bearer ")) {
      token = authHeader.slice(7)
    }

    if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 })

    const decoded: any = verifyJwt(token)
    if (!decoded) return NextResponse.json({ message: "Invalid token" }, { status: 401 })

    // รองรับทั้ง decoded.id และ decoded.userId
    const userId = decoded.id ?? decoded.userId
    if (!userId) return NextResponse.json({ message: "Invalid token payload" }, { status: 401 })

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, name: true, role: true, status: true },
    })

    if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 })

    return NextResponse.json({ user })
  } catch (err) {
    return NextResponse.json({ message: "Server error" }, { status: 500 })
  }
}
