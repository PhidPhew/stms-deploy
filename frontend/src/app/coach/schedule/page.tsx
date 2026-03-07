"use client"

import { useState, useEffect } from "react"
import { CalendarDays, Clock, MapPin } from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"
import axios from "@/lib/axios"

type ScheduleEntry = {
  id: number
  date: string
  startTime?: string
  endTime?: string
  course: string
  location?: string
}

export default function CoachSchedulePage() {
  const [view, setView] = useState<"list" | "week">("list")
  const [classes, setClasses] = useState<ScheduleEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const res = await axios.get("api/coach/schedule")
        setClasses(res.data?.data || [])
      } catch (err) {
        console.error("Schedule fetch error:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchSchedule()
  }, [])

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center h-48 text-gray-400">
        Loading schedule...
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6 bg-gray-50">
      {/* ===== HEADER ===== */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <CalendarDays className="h-6 w-6 text-blue-700" />
          <h1 className="text-2xl font-bold text-blue-900">My Schedule</h1>
        </div>
        <div className="flex gap-2">
          {(["list", "week"] as const).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`px-4 py-2 rounded-lg text-sm capitalize transition
                ${view === v ? "bg-blue-600 text-white" : "bg-white border"}`}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      {classes.length === 0 ? (
        <div className="bg-white rounded-xl border p-8 text-center text-gray-500">
          <CalendarDays className="h-12 w-12 mx-auto mb-3 text-gray-300" />
          <p className="font-medium">No upcoming classes</p>
        </div>
      ) : (
        <AnimatePresence mode="wait">
          {view === "list" && (
            <motion.div
              key="list"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-3"
            >
              {classes.map((c) => (
                <div
                  key={c.id}
                  className="bg-white border rounded-xl p-4 flex justify-between items-center hover:shadow-sm transition"
                >
                  <div>
                    <p className="font-semibold text-blue-900">{c.course}</p>
                    <div className="text-xs text-gray-500 mt-1 flex gap-3">
                      <span className="flex items-center gap-1">
                        <CalendarDays className="h-3 w-3" />
                        {new Date(c.date).toLocaleDateString("en-GB", {
                          day: "numeric", month: "short",
                        })}
                      </span>
                      {c.startTime && (
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {c.startTime} – {c.endTime}
                        </span>
                      )}
                      {c.location && (
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {c.location}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {view === "week" && (
            <motion.div
              key="week"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white border rounded-xl p-6"
            >
              <h2 className="font-semibold text-blue-900 mb-6">This Week Timeline</h2>
              <div className="space-y-6 relative">
                <div className="absolute left-2 top-0 bottom-0 w-px bg-gray-200" />
                {classes.map((c) => (
                  <div key={c.id} className="flex gap-6 relative">
                    <div className="relative z-10">
                      <span className="h-4 w-4 bg-blue-600 rounded-full block" />
                    </div>
                    <div className="bg-gray-50 border rounded-lg p-4 w-full">
                      <p className="font-medium text-blue-900">{c.course}</p>
                      <div className="mt-1 text-xs text-gray-600 space-y-1">
                        <p className="text-green-600">{c.date}</p>
                        {c.startTime && (
                          <p className="text-yellow-600">
                            {c.startTime} – {c.endTime}
                          </p>
                        )}
                        {c.location && <p>{c.location}</p>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  )
}