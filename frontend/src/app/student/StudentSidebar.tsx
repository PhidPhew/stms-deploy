"use client"
import { usePathname, useRouter } from "next/navigation"
import Link from "next/link"
import { useState, useEffect } from "react"
import axios from "@/lib/axios"
import {
  Home,
  BookOpen,
  CreditCard,
  LogOut,
  CalendarCheck,
} from "lucide-react"

const menu = [
  { label: "Dashboard", icon: Home, href: "/student" },
  { label: "Courses", icon: BookOpen, href: "/student/courses" },
  { label: "Payments", icon: CreditCard, href: "/student/payment" },
  { label: "Attendance", icon: CalendarCheck, href: "/student/attendance" },
]

export default function StudentSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")

  useEffect(() => {
    axios.get("/api/auth/me").then((res) => {
      setName(res.data.user?.name ?? "")
      setEmail(res.data.user?.email ?? "")
    }).catch(() => {})
  }, [])

  const initials = name
    ? name.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase()
    : "S"

  return (
    <aside className="w-64 bg-white border-r flex flex-col">
      <div className="p-6 text-xl font-bold text-blue-900 tracking-wide">STUDENT</div>
      <div className="mx-3 mb-3 p-3 bg-blue-50 rounded-xl flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
          {initials}
        </div>
        <div className="overflow-hidden">
          <p className="text-sm font-semibold text-blue-900 truncate">{name || "Student"}</p>
          <p className="text-xs text-gray-500 truncate">{email}</p>
        </div>
      </div>
      <nav className="flex-1 px-3 space-y-1">
        {menu.map((item) => {
          const active = pathname === item.href
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition
                ${active ? "bg-blue-50 text-blue-900" : "text-blue-700 hover:bg-blue-50"}`}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          )
        })}
      </nav>
      <div className="border-t p-4">
        <button
          onClick={() => { localStorage.removeItem("token"); router.push("/login") }}
          className="flex items-center gap-2 text-sm w-full text-red-600 hover:text-red-700"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </aside>
  )
}
