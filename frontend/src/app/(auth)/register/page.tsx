"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import axios from "@/lib/axios"

export default function RegisterPage() {
  const router = useRouter()

  /* Account */
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  /* Profile */
  const [dob, setDob] = useState("")
  const [phone, setPhone] = useState("")
  const [role, setRole] = useState<"student" | "coach">("student")
  const [sports, setSports] = useState<string[]>([])
  const [openSports, setOpenSports] = useState(false)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const toggleSport = (sport: string) => {
    setSports((prev) =>
      prev.includes(sport)
        ? prev.filter((s) => s !== sport)
        : [...prev, sport]
    )
  }

  const handleSubmit = async () => {
    setError("")
    setLoading(true)

    try {
      await axios.post("/api/auth/register", {
        name,
        email,
        password,
        role: role.toUpperCase(),
      })
      router.push("/login")
    } catch (err: any) {
      setError(err.response?.data?.error || "Registration failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center relative"
      style={{ backgroundImage: "url('/_.png')" }}
    >
      <div className="absolute inset-0 bg-black/20" />

      <div className="relative w-full max-w-md bg-slate-900/80 backdrop-blur-xl rounded-2xl shadow-2xl p-8">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-white">
            Create Account
          </h1>
          <p className="text-slate-400 text-sm">
            Start your training journey today
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 px-4 py-3 rounded-lg bg-red-500/20 border border-red-500/40 text-red-300 text-sm">
            {error}
          </div>
        )}

        {/* ACCOUNT */}
        <input
          placeholder="Full name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full mb-3 px-4 py-3 rounded-lg bg-slate-800 text-white"
          required
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-3 px-4 py-3 rounded-lg bg-slate-800 text-white"
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-6 px-4 py-3 rounded-lg bg-slate-800 text-white"
          required
        />

        {/* ROLE */}
        <p className="text-sm text-slate-400 mb-2">
          Select your role
        </p>
        <div className="grid grid-cols-2 gap-3 mb-6">
          <button
            type="button"
            onClick={() => setRole("student")}
            className={`p-3 rounded-lg border ${
              role === "student"
                ? "border-green-500 bg-green-500/10 text-green-400"
                : "border-slate-700 text-slate-400"
            }`}
          >
             Student
          </button>

          <button
            type="button"
            onClick={() => setRole("coach")}
            className={`p-3 rounded-lg border ${
              role === "coach"
                ? "border-blue-500 bg-blue-500/10 text-blue-400"
                : "border-slate-700 text-slate-400"
            }`}
          >
            Coach
          </button>
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full py-3 rounded-lg bg-green-500 hover:bg-green-600 text-white font-semibold disabled:opacity-60"
        >
          {loading ? "Creating account..." : "Create Account"}
        </button>

        <p className="text-center text-slate-400 text-sm mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-green-400">
            Login
          </Link>
        </p>
      </div>
    </div>
  )
}