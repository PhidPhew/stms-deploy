"use client"

import { useMemo, useState, useEffect } from "react"
import axios from "@/lib/axios"
import CourseGrid from "@/app/student/courses/CourseGrid"
import { Course } from "@/app/student/courses/CourseCard"
import { BookOpen } from "lucide-react"


/* ================== PAGE ================== */

export default function StudentCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [myCourses, setMyCourses] = useState<Course[]>([])
  const [search, setSearch] = useState("")

  useEffect(() => {
    axios.get("/api/student/courses").then((res) => {
      setCourses(res.data.data ?? res.data.available ?? [])
      setMyCourses(res.data.enrolled ?? [])
    })
  }, [])
  const [sport, setSport] = useState<"all" | Course["sport"]>("all")
  const [level, setLevel] = useState<"all" | Course["level"]>("all")

  const filteredCourses = useMemo(() => {
; return courses.filter((c) => {
      const matchSearch =
        c.title.toLowerCase().includes(search.toLowerCase()) ||
        c.description.toLowerCase().includes(search.toLowerCase())

      const matchSport = sport === "all" || c.title?.toLowerCase().includes(sport?.toLowerCase() ?? "")
      const matchLevel = level === "all" || c.level?.toLowerCase() === level?.toLowerCase()

      return matchSearch && matchSport && matchLevel
    })
  }, [courses, search, sport, level])

  return (
    <div className="p-6 space-y-6">
      {/* ===== Header ===== */}
      <div className="flex items-center gap-3">
        <BookOpen className="h-6 w-6 text-blue-700" />
        <h1 className="text-2xl font-bold text-blue-900">
          Available Courses
        </h1>
      </div>

      

      {/* ===== Filters ===== */}
      <div className="flex flex-col md:flex-row gap-3">
        {/* Search */}
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search courses..."
          className="w-full md:w-1/2 border rounded-lg px-4 py-2 text-sm"
        />

        {/* Sport */}
        <select
          value={sport}
          onChange={(e) =>
            setSport(e.target.value as any)
          }
          className="border rounded-lg px-3 py-2 text-sm"
        >
          <option value="all">All sports</option>
          <option value="badminton">Badminton</option>
          <option value="football">Football</option>
          <option value="basketball">Basketball</option>
          <option value="swimming">Swimming</option>
          <option value="tennis">Tennis</option>
        </select>

        {/* Level */}
        <select
          value={level}
          onChange={(e) =>
            setLevel(e.target.value as any)
          }
          className="border rounded-lg px-3 py-2 text-sm"
        >
          <option value="all">All levels</option>
          <option value="beginner">Beginner</option>
          <option value="advanced">Advanced</option>
        </select>
      </div>

      {/* ===== Result ===== */}
      {filteredCourses.length > 0 ? (
        <CourseGrid courses={filteredCourses} />
      ) : (
        <div className="text-center py-20 text-gray-500">
          <p className="text-lg font-medium">
            No courses found
          </p>
          <p className="text-sm">
            Try changing your search or filters
          </p>
        </div>
      )}
    </div>
  )
}