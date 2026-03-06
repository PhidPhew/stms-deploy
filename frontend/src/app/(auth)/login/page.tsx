"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import axios from "@/lib/axios"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const res = await axios.post("/api/auth/login", { email, password })
      const { token, user } = res.data

      localStorage.setItem("token", token)
      localStorage.setItem("user", JSON.stringify(user))

      // Redirect based on role
      const role = user.role?.toUpperCase()
      if (role === "ADMIN") router.push("/admin")
      else if (role === "COACH") router.push("/coach")
      else router.push("/student")
    } catch (err: any) {
      setError(err.response?.data?.error || "Login failed. Please check your credentials.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center relative"
      style={{ backgroundImage: "url('/_.png')" }}
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

        {/* Error Message */}
        {error && (
          <div className="mb-4 px-4 py-3 rounded-lg bg-red-500/20 border border-red-500/40 text-red-300 text-sm">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-lg bg-slate-800 text-white placeholder-slate-400
            focus:outline-none focus:ring-2 focus:ring-green-500"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-lg bg-slate-800 text-white placeholder-slate-400
            focus:outline-none focus:ring-2 focus:ring-green-500"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 py-3 rounded-lg bg-green-500 hover:bg-green-600
            transition font-semibold text-white flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Footer */}
        <div className="text-center mt-6 space-y-2 text-sm">
          <Link href="/register" className="text-green-400 hover:underline block">
            Create new account
          </Link>
          <Link href="/forgot-password" className="text-slate-400 hover:underline block">
            Forgot password?
          </Link>
        </div>

      </div>
    </div>
  )
}