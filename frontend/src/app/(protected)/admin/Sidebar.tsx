"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  Home,
  Users,
  Book,
  User,
  CreditCard,
  LogOut,
} from "lucide-react"

const menu = [
  { label: "Dashboard", icon: Home, href: "/admin" },
  { label: "Users", icon: Users, href: "/admin/users" },
  { label: "Courses", icon: Book, href: "/admin/courses" },
  { label: "Coach", icon: User, href: "/admin/coach" },
  { label: "Payments and Finance", icon: CreditCard, href: "/admin/payments" },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()

  return (
    <aside className="w-64 bg-white border-r flex flex-col">
      {/* Logo */}
      <div className="p-6 text-xl font-bold text-blue-900 tracking-wide">
        ADMIN
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

      {/* Bottom */}
      <div className="border-t p-4">
        <button
          onClick={() => router.push("/login")}
          className="
            flex items-center gap-2 text-sm w-full
            text-red-600 hover:text-red-700
          "
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </aside>
  )
}