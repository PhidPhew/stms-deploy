"use client"

import { useEffect, useState } from "react"
import { Course, CourseStatus } from "./CourseTable"

type Props = {
  open: boolean
  course: Course | null
  onClose: () => void
  onSave: (course: Course) => void
}

const DAYS = [
  { id: 0, label: "Sun" },
  { id: 1, label: "Mon" },
  { id: 2, label: "Tue" },
  { id: 3, label: "Wed" },
  { id: 4, label: "Thu" },
  { id: 5, label: "Fri" },
  { id: 6, label: "Sat" },
]

export function EditCourseModal({
  open,
  course,
  onClose,
  onSave,
}: Props) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [coach, setCoach] = useState("")
  const [price, setPrice] = useState(0)
  const [status, setStatus] = useState<CourseStatus>("draft")

  // ✅ ฟิลด์ใหม่ (optional)
  const [startDate, setStartDate] = useState<string | undefined>()
  const [endDate, setEndDate] = useState<string | undefined>()
  const [classDays, setClassDays] = useState<number[]>([])

  useEffect(() => {
    if (!course) return

    setTitle(course.title)
    setDescription(course.description)
    setCoach(course.coach)
    setPrice(course.price)
    setStatus(course.status)

    // 👇 fallback กัน undefined
    setStartDate(course.startDate)
    setEndDate(course.endDate)
    setClassDays(course.classDays ?? [])
  }, [course])

  if (!open || !course) return null

  const toggleDay = (day: number) => {
    setClassDays((prev) =>
      prev.includes(day)
        ? prev.filter((d) => d !== day)
        : [...prev, day]
    )
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div className="bg-white w-full max-w-lg rounded-xl shadow-xl text-blue-600">
        {/* Header */}
        <div className="px-6 py-4 border-b">
          <h2 className="text-lg font-semibold text-blue-900">
            Edit Course
          </h2>
        </div>

        {/* Body */}
        <div className="px-6 py-4 space-y-4">
          <input
            className="w-full border rounded-md px-3 py-2"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Course title"
          />

          <textarea
            className="w-full border rounded-md px-3 py-2"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
          />

          <input
            className="w-full border rounded-md px-3 py-2"
            value={coach}
            onChange={(e) => setCoach(e.target.value)}
            placeholder="Coach"
          />

          {/* 📅 Dates */}
          <div className="grid grid-cols-2 gap-3">
            <input
              type="date"
              className="border rounded-md px-3 py-2"
              value={startDate ?? ""}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <input
              type="date"
              className="border rounded-md px-3 py-2"
              value={endDate ?? ""}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
          {/* 🗓 Class Days */}
          <div className="space-y-2">
            <div className="text-sm font-medium text-blue-900">
              Class Days
            </div>

            <div className="flex flex-wrap gap-2">
              {[
                { label: "Sun", value: 0 },
                { label: "Mon", value: 1 },
                { label: "Tue", value: 2 },
                { label: "Wed", value: 3 },
                { label: "Thu", value: 4 },
                { label: "Fri", value: 5 },
                { label: "Sat", value: 6 },
              ].map((d) => {
                const active = classDays.includes(d.value)
                return (
                  <button
                    type="button"
                    key={d.value}
                    onClick={() =>
                      setClassDays((prev) =>
                        active
                          ? prev.filter((v) => v !== d.value)
                          : [...prev, d.value]
                      )
                    }
                    className={`px-3 py-1 rounded-full text-sm border
                      ${
                        active
                          ? "bg-blue-600 text-white border-blue-600"
                          : "bg-white text-gray-600"
                      }`}
                  >
                    {d.label}
                  </button>
                )
              })}
            </div>
          </div>

          <input
            type="number"
            className="w-full border rounded-md px-3 py-2"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            placeholder="Price"
          />

          <select
            className="w-full border rounded-md px-3 py-2"
            value={status}
            onChange={(e) =>
              setStatus(e.target.value as CourseStatus)
            }
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded-md"
          >
            Cancel
          </button>
          <button
            onClick={() =>
              onSave({
                ...course,
                title,
                description,
                coach,
                price,
                status,

                // ส่งเฉพาะที่มีค่า (type-safe)
                startDate,
                endDate,
                classDays,
              })
            }
            className="px-4 py-2 bg-blue-600 text-white rounded-md"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  )
}