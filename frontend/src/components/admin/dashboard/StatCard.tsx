"use client"

import Link from "next/link"
import { LucideIcon } from "lucide-react"
import { useCountUp } from "@/hooks/useCountUp"

type Props = {
  title: string
  value: number
  icon: LucideIcon
  changePercent?: number
  href?: string // 👈 เพิ่ม
}

export function StatCard({
  title,
  value,
  icon: Icon,
  changePercent,
  href,
}: Props) {
  const animatedValue = useCountUp(value)
  const isUp = changePercent !== undefined && changePercent >= 0

  const CardContent = (
    <div
      className="
        group bg-white border rounded-xl p-5
        flex justify-between items-center
        shadow-sm transition
        hover:shadow-md hover:-translate-y-0.5
        cursor-pointer
      "
    >
      {/* Left */}
      <div>
        <p className="text-sm text-gray-500 mb-1">
          {title}
        </p>

        <p className="text-2xl font-semibold text-gray-900 tracking-tight">
          {animatedValue.toLocaleString()}
        </p>

        {changePercent !== undefined && (
          <p
            className={`mt-1 text-xs font-medium flex items-center gap-1 ${
              isUp ? "text-green-600" : "text-red-600"
            }`}
          >
            <span>{isUp ? "▲" : "▼"}</span>
            {Math.abs(changePercent)}%
            <span className="text-gray-400">
              vs last month
            </span>
          </p>
        )}
      </div>

      {/* Icon */}
      <div
        className="
          p-3 rounded-lg
          bg-blue-50 text-blue-700
          transition
          group-hover:bg-blue-100
          group-hover:scale-105
        "
      >
        <Icon className="h-5 w-5" />
      </div>
    </div>
  )

  // ถ้ามี href → wrap ด้วย Link
  if (href) {
    return (
      <Link href={href} className="block">
        {CardContent}
      </Link>
    )
  }

  return CardContent
}