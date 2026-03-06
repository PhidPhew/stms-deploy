"use client"

import { useState } from "react"
import type { Coach } from "@/types/coach"
import { EditCoachModal } from "./EditCoachModal"
import { DeleteCoachModal } from "./DeleteCoachModal"
import { CoachHistoryModal } from "./CoachHistoryModal"

type Props = {
  coaches: Coach[]
  onUpdate: (coach: Coach) => void
  onSoftDelete: (id: number) => void
}

export function CoachTable({
  coaches,
  onUpdate,
  onSoftDelete,
}: Props) {
  const [editCoach, setEditCoach] = useState<Coach | null>(null)
  const [deleteCoach, setDeleteCoach] = useState<Coach | null>(null)
  const [historyCoach, setHistoryCoach] = useState<Coach | null>(null)

  return (
    <>
      <div className="bg-white rounded-xl shadow border">
        <table className="w-full text-sm">
          <thead className="border-b text-gray-500">
            <tr>
              <th className="text-left p-4">Name</th>
              <th className="text-left p-4">Expertise</th>
              <th className="text-left p-4">Courses</th>
              <th className="text-left p-4">Status</th>
              <th className="text-right p-4">Action</th>
            </tr>
          </thead>

          <tbody>
            {coaches.map((c) => (
              <tr key={c.id} className="border-b hover:bg-gray-50">
                <td className="p-4 font-medium text-blue-900">{c.name}</td>
                <td className="p-4 text-blue-900">{c.expertise.join(", ")}</td>
                <td className="p-4 text-blue-900">{c.totalCourses}</td>
                <td className="p-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs ${
                      c.status === "active"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {c.status}
                  </span>
                </td>
                <td className="p-4 text-right space-x-3">
                  <button
                    onClick={() => setHistoryCoach(c)}
                    className="text-indigo-600 hover:underline"
                  >
                    History
                  </button>

                  <button
                    onClick={() => setEditCoach(c)}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </button>

                  {c.status === "active" && (
                    <button
                      onClick={() => setDeleteCoach(c)}
                      className="text-red-600 hover:underline"
                    >
                      Deactivate
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <EditCoachModal
        open={!!editCoach}
        coach={editCoach}
        onClose={() => setEditCoach(null)}
        onSave={(updated) => {
          onUpdate(updated)
          setEditCoach(null)
        }}
      />

      <DeleteCoachModal
        open={!!deleteCoach}
        coach={deleteCoach}
        onClose={() => setDeleteCoach(null)}
        onConfirm={() => {
          if (deleteCoach) onSoftDelete(deleteCoach.id)
          setDeleteCoach(null)
        }}
      />

      <CoachHistoryModal
        open={!!historyCoach}
        coach={historyCoach}
        onClose={() => setHistoryCoach(null)}
      />
    </>
  )
}