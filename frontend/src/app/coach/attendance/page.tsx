"use client"

import { useState, useEffect } from "react"
import {
  ClipboardCheck,
  Users,
  BookOpen,
  CheckCircle2,
} from "lucide-react"
import axios from "@/lib/axios"

type Student = {
  id: number
  name: string
  status?: string
}

type Course = {
  id: number
  title: string
  date: string
  startTime?: string
  endTime?: string
  students: Student[]
}

export default function CoachAttendancePage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null)
  const [checkedIn, setCheckedIn] = useState<Record<number, number[]>>({})
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const res = await axios.get("/api/coach/attendance")
        const data: Course[] = res.data?.data || []
        setCourses(data)
        if (data.length > 0) setSelectedCourseId(data[0].id)
      } catch (err) {
        console.error("Fetch attendance error:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchAttendance()
  }, [])

  const course = courses.find((c) => c.id === selectedCourseId)
  const checkedStudents = selectedCourseId ? checkedIn[selectedCourseId] || [] : []

  const handleCheckIn = async (student: Student) => {
    if (!selectedCourseId || checkedStudents.includes(student.id)) return

    setSubmitting(true)
    try {
      await axios.post("/api/coach/attendance", {
        scheduleId: selectedCourseId,
        studentId: student.id,
        status: "PRESENT",
      })
      setCheckedIn((prev) => ({
        ...prev,
        [selectedCourseId]: [...(prev[selectedCourseId] || []), student.id],
      }))
    } catch (err) {
      console.error("Check-in error:", err)
      alert("Failed to check in. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center h-48 text-gray-400">
        Loading attendance data...
      </div>
    )
  }

  const progress = course && course.students.length > 0
    ? (checkedStudents.length / course.students.length) * 100
    : 0

  return (
    <div className="min-h-screen bg-gray-50 p-6 space-y-6">
      {/* ===== HEADER ===== */}
      <div className="flex items-center gap-3">
        <ClipboardCheck className="h-6 w-6 text-blue-700" />
        <h1 className="text-2xl font-bold text-blue-900">
          Attendance Check-in
        </h1>
      </div>

      {courses.length === 0 ? (
        <div className="bg-white rounded-xl border p-8 text-center text-gray-500">
          <ClipboardCheck className="h-12 w-12 mx-auto mb-3 text-gray-300" />
          <p className="font-medium">No classes scheduled for today</p>
        </div>
      ) : (
        <>
          {/* ===== COURSE SELECTOR ===== */}
          <div className="flex gap-3 overflow-x-auto pb-2">
            {courses.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCourseId(c.id)}
                className={`px-4 py-3 rounded-xl border text-left min-w-[220px]
                  ${selectedCourseId === c.id
                    ? "bg-blue-600 text-white"
                    : "bg-white hover:bg-gray-100"
                  }`}
              >
                <p className="font-semibold">{c.title}</p>
                <p className="text-xs opacity-80">
                  {c.startTime ? `${c.startTime} – ${c.endTime}` : c.date}
                </p>
              </button>
            ))}
          </div>

          {course && (
            <>
              {/* ===== COURSE SUMMARY ===== */}
              <div className="bg-white border rounded-xl p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-blue-600" />
                    <p className="font-semibold text-blue-900">{course.title}</p>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Users className="h-4 w-4" />
                    {checkedStudents.length} / {course.students.length}
                  </div>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500 transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              {/* ===== STUDENT LIST ===== */}
              <div className="space-y-3">
                {course.students.length === 0 ? (
                  <div className="bg-white border rounded-xl p-6 text-center text-gray-500">
                    No students enrolled in this course.
                  </div>
                ) : (
                  course.students.map((s) => {
                    const isChecked = checkedStudents.includes(s.id)
                    return (
                      <div
                        key={s.id}
                        className="bg-white border rounded-xl p-4 flex justify-between items-center"
                      >
                        <div>
                          <p className="font-medium">{s.name}</p>
                        </div>
                        <button
                          disabled={isChecked || submitting}
                          onClick={() => handleCheckIn(s)}
                          className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2
                            ${isChecked
                              ? "bg-green-100 text-green-700"
                              : "bg-blue-600 text-white hover:bg-blue-700"
                            } disabled:opacity-60`}
                        >
                          {isChecked && <CheckCircle2 className="h-4 w-4" />}
                          {isChecked ? "Checked" : "Check-in"}
                        </button>
                      </div>
                    )
                  })
                )}
              </div>
            </>
          )}
        </>
      )}
    </div>
  )
}