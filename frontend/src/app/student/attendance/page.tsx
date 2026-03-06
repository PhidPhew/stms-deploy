"use client"

import { useEffect, useState } from "react"
import { ClipboardList } from "lucide-react"
import axios from "@/lib/axios"

type AttendanceRecord = {
  id: number
  date: string
  course: string
  status: string
  present: number
  total: number
}

export default function StudentAttendancePage() {
  const [records, setRecords] = useState<AttendanceRecord[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const res = await axios.get("/api/student/attendance")
        setRecords(res.data?.data || [])
      } catch (err) {
        console.error("Attendance fetch error:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchAttendance()
  }, [])

  if (loading) {
    return <div className="p-6 flex items-center justify-center h-48 text-gray-400">Loading attendance...</div>
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3">
        <ClipboardList className="h-6 w-6 text-blue-700" />
        <h1 className="text-2xl font-bold text-blue-900">My Attendance</h1>
      </div>

      {records.length === 0 ? (
        <div className="bg-white rounded-xl border p-8 text-center text-gray-500">
          <ClipboardList className="h-12 w-12 mx-auto mb-3 text-gray-300" />
          <p>No attendance records yet.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b bg-gray-50">
                <th className="py-3 px-4">Date</th>
                <th className="px-4">Course</th>
                <th className="px-4">Status</th>
                <th className="px-4">Progress</th>
              </tr>
            </thead>
            <tbody>
              {records.map((r) => (
                <tr key={r.id} className="border-b hover:bg-gray-50 transition">
                  <td className="py-3 px-4 text-blue-900">
                    {new Date(r.date).toLocaleDateString("en-GB", {
                      day: "numeric", month: "short", year: "numeric",
                    })}
                  </td>
                  <td className="px-4 font-medium">{r.course}</td>
                  <td className="px-4">
                    <span
                      className={`text-xs px-2 py-1 rounded-full font-medium
                        ${r.status === "present" || r.status === "PRESENT"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-600"}`}
                    >
                      {r.status === "present" || r.status === "PRESENT" ? "✓ Present" : "✕ Absent"}
                    </span>
                  </td>
                  <td className="px-4">
                    {r.total > 0 && (
                      <span className="text-gray-500">
                        {r.present}/{r.total} sessions
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}