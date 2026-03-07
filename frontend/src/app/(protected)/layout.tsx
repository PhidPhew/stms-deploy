"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { AuthProvider } from "@/context/AuthContext"
import { getToken } from "@/lib/auth"
import axios from "@/lib/axios"

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()

  useEffect(() => {
    const token = getToken()
    if (!token) {
      router.push("/login")
      return
    }
    axios.get("/api/auth/me").catch((err) => {
      if (err.response?.status === 401) {
        localStorage.removeItem("token")
        router.push("/login")
      }
      // network error หรืออื่นๆ ไม่ redirect
    })
  }, [router])

  return <AuthProvider>{children}</AuthProvider>
}