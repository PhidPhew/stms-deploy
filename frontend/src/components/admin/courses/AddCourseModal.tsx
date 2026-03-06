"use client"

import { useState } from "react"
import { CourseStatus } from "./CourseTable"

type Props = {
  open: boolean
  onClose: () => void
  onAdd: (course: {
    title: string
    description: string
    coach: string
    price: number
    status: CourseStatus
    startDate: string
    endDate: string
    classDays: number[]
  }) => void
}

export function AddCourseModal({ open, onClose, onAdd }: Props) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [coach, setCoach] = useState("")
  const [price, setPrice] = useState<string>("")
  const [status, setStatus] = useState<CourseStatus>("draft")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [classDays, setClassDays] = useState<number[]>([])

const handleSave = () => {
  onAdd({
    title,
    description,
    coach,
    price: Number(price || 0),
    status,

    // ✅ เพิ่ม
    startDate,
    endDate,
    classDays,
  })

  onClose()

  
}

  if (!open) return null

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center ">
      <div className="bg-white w-full max-w-md rounded-xl shadow-xl">
        <div className="px-6 py-4 border-b font-semibold text-blue-900">
          Add Course
        </div>

        <div className="px-6 py-4 space-y-4">
          <input
            placeholder="Course title"
            className="w-full border px-3 py-2 rounded text-blue-900"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <textarea
            placeholder="Description"
            className="w-full border px-3 py-2 rounded text-gray-400"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <input
            placeholder="Coach"
            className="w-full border px-3 py-2 rounded text-gray-400"
            value={coach}
            onChange={(e) => setCoach(e.target.value)}
          />
          
          <input
            type="number"
            placeholder="Price"
            className="w-full border px-3 py-2 rounded text-blue-900"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            min={0}
          />

          {/* 📅 Dates */}
          <div className="grid grid-cols-2 gap-3 text-gray-400">
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

          <select
            className="w-full border px-3 py-2 rounded text-gray-400"
            value={status}
            onChange={(e) =>
              setStatus(e.target.value as CourseStatus)
            }
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>

        <div className="px-6 py-4 border-t flex justify-end gap-2">
          <button onClick={onClose} className="text-blue-900 bg-gray-100 px-4 py-2 rounded">Cancel</button>
          <button onClick={handleSave} className="bg-blue-600 text-white px-4 py-2 rounded cursor-pointer text-gray-400">
            Save
          </button>
        </div>
      </div>
    </div>
  )
}