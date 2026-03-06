// src/lib/auth.ts
export async function getCurrentUser() {
  if (typeof window === "undefined") return null
  try {
    const user = localStorage.getItem("user")
    if (!user) return null
    return JSON.parse(user) as {
      id: string
      role: string
      email: string
      name: string
    }
  } catch {
    return null
  }
}