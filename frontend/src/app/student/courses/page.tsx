"use client"

import { useEffect, useMemo, useState } from "react"
import { BookOpen } from "lucide-react"
import axios from "@/lib/axios"

type Course = {
  id: number
  title: string
  description: string
  price: number
  status: string
  level?: string
  startDate?: string
  endDate?: string
  enrolledStudents?: number
  isEnrolled?: boolean
}

export default function StudentCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [search, setSearch] = useState("")
  const [level, setLevel] = useState<string>("all")
  const [loading, setLoading] = useState(true)
  const [enrolling, setEnrolling] = useState<number | null>(null)

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get("/api/student/courses")
        setCourses(res.data?.data || [])
      } catch (err) {
        console.error("Courses fetch error:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchCourses()
  }, [])

  const handleEnroll = async (courseId: number) => {
    setEnrolling(courseId)
    try {
      await axios.post(`/api/student/courses/${courseId}/enroll`)
      setCourses((prev) =>
        prev.map((c) => (c.id === courseId ? { ...c, isEnrolled: true } : c))
      )
      alert("Enrolled successfully! Please submit payment.")
    } catch (err: any) {
      alert(err.response?.data?.error || "Enrollment failed.")
    } finally {
      setEnrolling(null)
    }
  }

  const filteredCourses = useMemo(() => {
    return courses.filter((c) => {
      const matchSearch =
        c.title.toLowerCase().includes(search.toLowerCase()) ||
        c.description.toLowerCase().includes(search.toLowerCase())
      const matchLevel = level === "all" || c.level?.toLowerCase() === level
      return matchSearch && matchLevel
    })
  }, [courses, search, level])

  if (loading) {
    return <div className="p-6 flex items-center justify-center h-48 text-gray-400">Loading courses...</div>
  }

  return (
    <div className="p-6 space-y-6">
      {/* ===== Header ===== */}
      <div className="flex items-center gap-3">
        <BookOpen className="h-6 w-6 text-blue-700" />
        <h1 className="text-2xl font-bold text-blue-900">Available Courses</h1>
      </div>

      {/* ===== Filters ===== */}
      <div className="flex flex-col md:flex-row gap-3">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search courses..."
          className="w-full md:w-1/2 border rounded-lg px-4 py-2 text-sm"
        />
        <select
          value={level}
          onChange={(e) => setLevel(e.target.value)}
          className="border rounded-lg px-3 py-2 text-sm"
        >
          <option value="all">All levels</option>
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>
      </div>

      {/* ===== Course Grid ===== */}
      {filteredCourses.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <p className="text-lg font-medium">No courses found</p>
          <p className="text-sm">Try changing your search or filters</p>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {filteredCourses.map((course) => (
            <div
              key={course.id}
              className="bg-white border rounded-xl overflow-hidden hover:shadow-lg transition"
            >
              <div className="px-5 py-4 bg-blue-50 border-b">
                <h3 className="font-semibold text-blue-900">{course.title}</h3>
                {course.level && (
                  <span className="text-xs capitalize bg-blue-100 text-blue-700 px-2 py-0.5 rounded mt-1 inline-block">
                    {course.level}
                  </span>
                )}
              </div>
              <div className="p-5 space-y-3">
                <p className="text-sm text-gray-600">{course.description}</p>
                <div className="flex justify-between items-center">
                  <span className="font-bold text-blue-800">฿{course.price.toLocaleString()}</span>
                  {course.startDate && (
                    <span className="text-xs text-gray-500">
                      {new Date(course.startDate).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => !course.isEnrolled && handleEnroll(course.id)}
                  disabled={course.isEnrolled || enrolling === course.id}
                  className={`w-full py-2 rounded-lg text-sm font-medium transition disabled:opacity-60
                    ${course.isEnrolled
                      ? "bg-green-100 text-green-700"
                      : "bg-blue-600 hover:bg-blue-700 text-white"
                    }`}
                >
                  {enrolling === course.id ? "Enrolling..." : course.isEnrolled ? "✓ Enrolled" : "Enroll Now"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}