"use client"

import Link from "next/link"

type MyCourse = {
  id: number
  title: string
  progress: number
}

const myCourses: MyCourse[] = [
  {
    id: 1,
    title: "Badminton Beginner",
    progress: 60,
  },
]

export default function MyCoursesPage() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-blue-900">
        My Courses
      </h1>

      {myCourses.map((c) => (
        <div
          key={c.id}
          className="bg-white border rounded-lg p-4 space-y-3"
        >
          <div className="flex justify-between">
            <h3 className="font-medium">{c.title}</h3>
            <span className="text-sm text-gray-500">
              {c.progress}%
            </span>
          </div>

          <div className="h-2 bg-gray-200 rounded">
            <div
              className="h-2 bg-blue-600 rounded"
              style={{ width: `${c.progress}%` }}
            />
          </div>

          <Link
            href={`/student/courses/${c.id}`}
            className="text-sm text-blue-600"
          >
            View course →
          </Link>
        </div>
      ))}
    </div>
  )
}