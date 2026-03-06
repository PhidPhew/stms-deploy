"use client"

import type { Coach } from "@/types/coach"

type Props = {
  open: boolean
  coach: Coach | null
  onClose: () => void
  onConfirm: () => void
}

export function DeleteCoachModal({
  open,
  coach,
  onClose,
  onConfirm,
}: Props) {
  if (!open || !coach) return null

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white w-full max-w-md rounded-xl shadow-xl">
        <div className="px-6 py-4 border-b text-red-600 font-semibold">
          Deactivate Coach
        </div>

        <div className="px-6 py-4 text-sm text-gray-700">
          Are you sure you want to deactivate{" "}
          <strong>{coach.name}</strong>?
        </div>

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
            Deactivate
          </button>
        </div>
      </div>
    </div>
  )
}