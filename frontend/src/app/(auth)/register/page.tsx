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
  const [error, setError] = useState<string | null>(null)

  const toggleSport = (sport: string) => {
    setSports((prev) =>
      prev.includes(sport)
        ? prev.filter((s) => s !== sport)
        : [...prev, sport]
    )
  }

  const handleSubmit = async () => {
    setLoading(true)
    setError(null)
    try {
      await axios.post("/api/auth/register", {
        name, email, password, dob, phone, role, sports,
      })
      router.push("/login")
    } catch (err: any) {
      setError(err.response?.data?.message || "Registration failed")
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

        {/* PROFILE */}
        <div className="mb-4">
          <label className="block text-sm text-slate-400 mb-1">
            Date of Birth
          </label>
          <input
            type="date"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-slate-800 text-white"
          />
          <p className="text-xs text-slate-500 mt-1">
            
          </p>
        </div>

        <input
          type="tel"
          placeholder="Phone number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full mb-4 px-4 py-3 rounded-lg bg-slate-800 text-white"
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

 

          {error && <p className="text-red-400 text-sm text-center mt-2">{error}</p>}

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full py-3 rounded-lg bg-green-500 hover:bg-green-600 text-white font-semibold"
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