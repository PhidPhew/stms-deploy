"use client"

import type { Coach } from "@/types/coach"

type Props = {
  open: boolean
  coach: Coach | null
  onClose: () => void
}

export function CoachHistoryModal({ open, coach, onClose }: Props) {
  if (!open || !coach) return null

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white w-full max-w-md rounded-xl shadow-xl text-black">
        <div className="px-6 py-4 border-b font-semibold">
          Teaching History
        </div>

        <div className="px-6 py-4 text-sm space-y-2">
          <p><strong>Name:</strong> {coach.name}</p>
          <p><strong>Total Courses:</strong> {coach.totalCourses}</p>
          <p className="text-xs text-gray-500">
            * Detailed course history will be loaded from backend
          </p>
        </div>

        <div className="px-6 py-4 border-t text-right">
          <button
            onClick={onClose}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}