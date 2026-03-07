"use client"

import { useParams, useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import axios from "@/lib/axios"

type Course = {
  id: number
  title: string
  description: string
  price: number
  totalSessions: number
  sport?: string
  level?: string
  coachName?: string
  startDate?: string
  endDate?: string
}

export default function CourseDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [course, setCourse] = useState<Course | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios.get(`/api/student/courses/${params.id}`)
      .then((res) => setCourse(res.data.data ?? null))
      .catch(() => setCourse(null))
      .finally(() => setLoading(false))
  }, [params.id])

  if (loading) return <div className="p-6 text-gray-500">Loading...</div>
  if (!course) return <div className="p-6">Course not found</div>

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="bg-white border rounded-xl p-6 space-y-4">
        <h1 className="text-2xl font-bold text-blue-900">{course.title}</h1>
        <p className="text-gray-600">{course.description}</p>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Sessions</span>
            <div className="font-medium">{course.totalSessions ?? "-"}</div>
          </div>
          <div>
            <span className="text-gray-500">Price</span>
            <div className="font-medium">{course.price?.toLocaleString()} THB</div>
          </div>
          {course.coachName && (
            <div>
              <span className="text-gray-500">Coach</span>
              <div className="font-medium">{course.coachName}</div>
            </div>
          )}
          {course.level && (
            <div>
              <span className="text-gray-500">Level</span>
              <div className="font-medium capitalize">{course.level}</div>
            </div>
          )}
          {course.startDate && (
            <div>
              <span className="text-gray-500">Start Date</span>
              <div className="font-medium">{course.startDate}</div>
            </div>
          )}
          {course.endDate && (
            <div>
              <span className="text-gray-500">End Date</span>
              <div className="font-medium">{course.endDate}</div>
            </div>
          )}
        </div>

        <button
          onClick={() => router.push(`/student/payment/submit?courseId=${course.id}`)}
          className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
        >
          Enroll & Pay
        </button>
      </div>
    </div>
  )
}
