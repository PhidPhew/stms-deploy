"use client"

import { useEffect, useState } from "react"
import axios from "@/lib/axios"
import { AddCoachModal } from "@/components/admin/coach/AddCoachModal"
import { EditCoachModal } from "@/components/admin/coach/EditCoachModal"
import { DeleteCoachModal } from "@/components/admin/coach/DeleteCoachModal"

type Coach = {
  id: number
  name: string
  email: string
  expertise: string
  status: string
}

export default function AdminCoachPage() {
  const [coaches, setCoaches] = useState<Coach[]>([])
  const [loading, setLoading] = useState(true)
  const [openAdd, setOpenAdd] = useState(false)
  const [editTarget, setEditTarget] = useState<Coach | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Coach | null>(null)

  const fetchCoaches = async () => {
    try {
      const res = await axios.get("/api/admin/coaches")
      setCoaches(res.data?.data || [])
    } catch (err) {
      console.error("Coaches fetch error:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchCoaches() }, [])

  const handleAdd = async (payload: Partial<Coach>) => {
    try {
      await axios.post("/api/admin/coaches", payload)
      await fetchCoaches()
      setOpenAdd(false)
    } catch (err: any) {
      alert(err.response?.data?.error || "Failed to add coach")
    }
  }

  const handleEdit = async (id: number, payload: Partial<Coach>) => {
    try {
      await axios.put(`/api/admin/coaches/${id}`, payload)
      await fetchCoaches()
      setEditTarget(null)
    } catch (err: any) {
      alert(err.response?.data?.error || "Failed to update coach")
    }
  }

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`/api/admin/coaches/${id}`)
      await fetchCoaches()
      setDeleteTarget(null)
    } catch (err: any) {
      alert(err.response?.data?.error || "Failed to delete coach")
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-blue-900">Coach Management</h1>
          <p className="text-gray-500 text-sm">Manage coaches and their profiles</p>
        </div>
        <button
          onClick={() => setOpenAdd(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md"
        >
          + Add Coach
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-32 text-gray-400">Loading coaches...</div>
      ) : coaches.length === 0 ? (
        <div className="bg-white rounded-xl border p-8 text-center text-gray-500">
          No coaches found. Add your first coach.
        </div>
      ) : (
        <div className="bg-white rounded-xl border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b bg-gray-50">
                <th className="py-3 px-4">Name</th>
                <th className="px-4">Email</th>
                <th className="px-4">Expertise</th>
                <th className="px-4">Status</th>
                <th className="px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {coaches.map((coach) => (
                <tr key={coach.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium text-blue-900">{coach.name}</td>
                  <td className="px-4 text-gray-600">{coach.email}</td>
                  <td className="px-4">{coach.expertise}</td>
                  <td className="px-4">
                    <span className={`text-xs px-2 py-1 rounded-full
                      ${coach.status === "ACTIVE" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>
                      {coach.status}
                    </span>
                  </td>
                  <td className="px-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditTarget(coach)}
                        className="text-xs text-blue-600 hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => setDeleteTarget(coach)}
                        className="text-xs text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {openAdd && (
        <AddCoachModal
          open={openAdd}
          onClose={() => setOpenAdd(false)}
          onAdd={(c: any) => handleAdd(c)}
        />
      )}
      {editTarget && (
        <EditCoachModal
          open={!!editTarget}
          coach={editTarget as any}
          onClose={() => setEditTarget(null)}
          onSave={(updated: any) => handleEdit(editTarget.id, updated)}
        />
      )}
      {deleteTarget && (
        <DeleteCoachModal
          open={!!deleteTarget}
          coach={deleteTarget as any}
          onClose={() => setDeleteTarget(null)}
          onConfirm={() => handleDelete(deleteTarget.id)}
        />
      )}
    </div>
  )
}