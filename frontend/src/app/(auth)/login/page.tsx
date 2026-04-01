"use client"

import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Suspense, useState } from "react"
import axios from "@/lib/axios"
import { setToken } from "@/lib/auth"

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const roleHint = searchParams.get("role") // student | coach | admin

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const res = await axios.post("/api/auth/login", { email, password })
      setToken(res.data.token)
      const userRole = res.data.user.role
      if (userRole === "ADMIN") router.push("/admin")
      else if (userRole === "COACH") router.push("/coach")
      else router.push("/student")
    } catch (err: any) {
      setError(err.response?.data?.message || "Invalid credentials")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center relative"
      style={{ backgroundImage: "url('/_.png')" }}
      data-role-hint={roleHint ?? undefined}
    >
      {/* overlay */}
      <div className="absolute inset-0 bg-black/20" />

      <div className="w-full max-w-md bg-slate-900/80 backdrop-blur-xl rounded-2xl shadow-2xl p-8 animate-fade-in">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="text-4xl mb-2"></div>
          <h1 className="text-2xl font-bold text-white">Welcome Back</h1>
          <p className="text-slate-400 text-sm">
            Login to continue your journey
          </p>
        </div>

        {/* Form */}
        <form className="space-y-4" onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-slate-800 text-white placeholder-slate-400
            focus:outline-none focus:ring-2 focus:ring-green-500"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-slate-800 text-white placeholder-slate-400
            focus:outline-none focus:ring-2 focus:ring-green-500"
          />

          {error && <p className="text-red-400 text-sm text-center">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 py-3 rounded-lg bg-green-500 hover:bg-green-600
            transition font-semibold text-white flex items-center justify-center gap-2"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Footer */}
        <div className="text-center mt-6 space-y-2 text-sm">
          <Link href="/register" className="text-green-400 hover:underline block">
            Create new account
          </Link>
          <Link
            href="/forgot-password"
            className="text-slate-400 hover:underline block"
          >
            Forgot password?
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-900 text-slate-300">
          Loading...
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  )
}
