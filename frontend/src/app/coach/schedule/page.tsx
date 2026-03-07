"use client"

import { useState, useEffect } from "react"
import axios from "@/lib/axios"
import { Calendar, Clock, MapPin } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

/* ================= TYPES ================= */

type ClassItem = {
  id: number
  date: string // YYYY-MM-DD
  course: string
  start: string
  end: string
  location: string
}

/* ================= HELPERS ================= */

const getClassesByDate = (classList: ClassItem[], date: string) =>
  classList.filter((c) => c.date === date)

const dotColor = (count: number) => {
  if (count >= 4) return "bg-red-500"
  if (count >= 2) return "bg-orange-400"
  return "bg-blue-500"
}

/* ================= PAGE ================= */

export default function CoachSchedulePage() {
  const [classes, setClasses] = useState<ClassItem[]>([])
  const [view, setView] = useState<"week" | "month">("month")
  const today = new Date().toISOString().split("T")[0]
  const [selectedDate, setSelectedDate] = useState(today)

  useEffect(() => {
    axios.get("/api/coach/schedule").then((res) => {
      const data = (res.data.data ?? []).map((s: any) => ({
        id: s.id,
        date: s.date,
        course: s.courseTitle,
        start: s.startTime,
        end: s.endTime,
        location: s.level ?? '-'
      }))
      setClasses(data)
    })
  }, [])

  const today_ym = today.slice(0, 7)
  const [currentYM, setCurrentYM] = useState(today_ym)

  const currentYear = parseInt(currentYM.split('-')[0])
  const currentMonth = parseInt(currentYM.split('-')[1])
  const daysInMonth = new Date(currentYear, currentMonth, 0).getDate()
  const monthLabel = new Date(currentYear, currentMonth - 1, 1)
    .toLocaleString('en-US', { month: 'long', year: 'numeric' })

  const selectedClasses = getClassesByDate(classes, selectedDate)

  return (
    <div className="min-h-screen bg-gray-50 p-6 space-y-6">
      {/* ===== HEADER ===== */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Calendar className="h-6 w-6 text-blue-700" />
          <h1 className="text-2xl font-bold text-blue-900">
            My Schedule
          </h1>
        </div>

        <div className="flex bg-white border rounded-lg overflow-hidden">
          <button
            onClick={() => setView("week")}
            className={`px-4 py-2 text-sm ${
              view === "week"
                ? "bg-blue-600 text-white"
                : "text-gray-600"
            }`}
          >
            Week
          </button>
          <button
            onClick={() => setView("month")}
            className={`px-4 py-2 text-sm ${
              view === "month"
                ? "bg-blue-600 text-white"
                : "text-gray-600"
            }`}
          >
            Month
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* ================= MONTH VIEW ================= */}
        {view === "month" && (
          <motion.div
            key="month"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid md:grid-cols-[300px_1fr] gap-6"
          >
            {/* Calendar */}
            <div className="bg-white border rounded-xl p-4">
              <div className="flex justify-between items-center mb-4">
                <button onClick={() => {
                  const d = new Date(currentYear, currentMonth - 2, 1)
                  setCurrentYM(`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`)
                }} className="px-2 py-1 text-gray-500 hover:text-blue-600">&#8592;</button>
                <p className="font-semibold text-blue-900">{monthLabel}</p>
                <button onClick={() => {
                  const d = new Date(currentYear, currentMonth, 1)
                  setCurrentYM(`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`)
                }} className="px-2 py-1 text-gray-500 hover:text-blue-600">&#8594;</button>
              </div>

              <div className="grid grid-cols-7 gap-2 text-center text-sm">
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const day = i + 1
                  const date = `${currentYM}-${String(day).padStart(2, "0")}`
                  const count = getClassesByDate(classes, date).length

                  return (
                    <button
                      key={day}
                      onClick={() => setSelectedDate(date)}
                      className={`h-10 rounded-lg flex flex-col items-center justify-center
                        ${
                          selectedDate === date
                            ? "bg-blue-600 text-white"
                            : "hover:bg-gray-100"
                        }`}
                    >
                      <span>{day}</span>
                      {count > 0 && (
                        <span
                          className={`mt-1 h-1.5 w-1.5 rounded-full ${dotColor(
                            count
                          )}`}
                        />
                      )}
                    </button>
                  )
                })}
              </div>

              {/* Legend */}
              <div className="mt-4 space-y-1 text-xs">
                <p className="flex items-center gap-2">
                  <span className="h-2 w-2 bg-blue-500 rounded-full" />
                  1 class
                </p>
                <p className="flex items-center gap-2">
                  <span className="h-2 w-2 bg-orange-400 rounded-full" />
                  2–3 classes
                </p>
                <p className="flex items-center gap-2">
                  <span className="h-2 w-2 bg-red-500 rounded-full" />
                  4+ classes
                </p>
              </div>
            </div>

            {/* Day Detail */}
            <div className="bg-white border rounded-xl p-4 space-y-4">
              <h2 className="font-semibold text-blue-900">
                Classes on {selectedDate}
              </h2>

              {selectedClasses.length === 0 && (
                <p className="text-sm text-gray-500">
                  No classes scheduled
                </p>
              )}

              {selectedClasses.map((c) => (
                <div
                  key={c.id}
                  className="border rounded-lg p-4 hover:shadow-sm transition"
                >
                  <p className="font-medium text-blue-900">
                    {c.course}
                  </p>

                  <div className="mt-2 flex items-center gap-4 text-xs text-gray-600">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {c.start} – {c.end}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {c.location}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* ================= WEEK VIEW (TIMELINE) ================= */}
        {view === "week" && (
          <motion.div
            key="week"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-white border rounded-xl p-6"
          >
            <h2 className="font-semibold text-blue-900 mb-6">
              This Week Timeline
            </h2>

            <div className="space-y-6 relative">
              <div className="absolute left-2 top-0 bottom-0 w-px bg-gray-200" />

              {classes.map((c) => (
                <div
                  key={c.id}
                  className="flex gap-6 relative"
                >
                  <div className="relative z-10">
                    <span className="h-4 w-4 bg-blue-600 rounded-full block" />
                  </div>

                  <div className="bg-gray-50 border rounded-lg p-4 w-full">
                    <p className="font-medium text-blue-900">
                      {c.course}
                    </p>

                    <div className="mt-1 text-xs text-gray-600 space-y-1">
                      <p className="text-green-600">{c.date}</p>
                      <p className="text-yellow-600">
                        {c.start} – {c.end}
                      </p>
                      <p>{c.location}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}