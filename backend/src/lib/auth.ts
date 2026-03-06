import { cookies } from "next/headers"
import { verifyJwt } from "./jwt"
import { prisma } from "./prisma"
import { Role } from "@prisma/client"

export async function getUserFromHeaders(req: Request) {
  try {
    const authHeader = req.headers.get("Authorization")
    let token = ""

    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.substring(7)
    } else {
      // Fallback to cookie
      const cookieStore = cookies()
      token = cookieStore.get("token")?.value || ""
    }

    if (!token) return null

    const decoded: any = verifyJwt(token)
    if (!decoded || !decoded.userId) return null

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        status: true,
      },
    })

    if (!user || user.status !== "ACTIVE") return null

    return user
  } catch (error) {
    return null
  }
}

export async function requireAuth(req: Request) {
  const user = await getUserFromHeaders(req)
  if (!user) {
    throw new Error("Unauthorized")
  }
  return user
}

export async function requireRole(req: Request, roles: Role | Role[]) {
  const user = await requireAuth(req)
  const allowedRoles = Array.isArray(roles) ? roles : [roles]
  
  if (!allowedRoles.includes(user.role)) {
    throw new Error("Forbidden")
  }
  return user
}

export async function getCurrentUser() {
  const cookieStore = cookies()
  const token = cookieStore.get("token")?.value
  if (!token) return null

  const decoded: any = verifyJwt(token)
  if (!decoded || !decoded.userId) return null

  return prisma.user.findUnique({
    where: { id: decoded.userId },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
    },
  })
}
