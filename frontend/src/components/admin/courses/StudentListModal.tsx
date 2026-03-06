"use client"

import { X } from "lucide-react"
import { Student } from "@/types/CourseWithStudents"

export function StudentListModal({
  open,
  onClose,
  students,
  courseTitle,
}: {
  open: boolean
  onClose: () => void
  students: Student[]
  courseTitle: string
}) {
  if (!open) return null

  return (
    // 👇 คลิกพื้นหลังเพื่อปิด
    <div
      className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      {/* 👇 กันไม่ให้คลิกในกล่องแล้วปิด */}
      <div
        className="bg-white w-full max-w-md rounded-xl p-6 space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center">
          <h2 className="font-semibold text-blue-900">
            Students in {courseTitle}
          </h2>
          <button onClick={onClose}>
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {students.length > 0 ? (
          <ul className="divide-y">
            {students.map((s) => (
              <li key={s.id} className="py-2">
                <div className="font-medium text-gray-900">{s.name}</div>
                <div className="text-sm text-gray-500">{s.email}</div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-500 text-center py-6">
            No students enrolled
          </p>
        )}

        {/* Footer */}
        <div className="flex justify-end pt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}