"use client"

import { Course } from "./CourseTable"

type Props = {
  open: boolean
  course: Course | null
  onClose: () => void
  onConfirm: () => void
}

export function DeleteCourseModal({
  open,
  course,
  onClose,
  onConfirm,
}: Props) {
  if (!open || !course) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md rounded-xl bg-white shadow-xl">
        {/* Header */}
        <div className="px-6 py-4 border-b">
          <h2 className="text-lg font-semibold text-red-600">
            Delete Course
          </h2>
        </div>

        {/* Body */}
        <div className="px-6 py-4 space-y-2">
          <p className="text-sm text-gray-700">
            Are you sure you want to delete
            <span className="font-medium"> {course.title}</span>?
          </p>
          <p className="text-xs text-red-500">
            This action cannot be undone.
          </p>
        </div>

        {/* Actions */}
        <div className="px-6 py-4 border-t flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded-md bg-blue-600 text-white"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}