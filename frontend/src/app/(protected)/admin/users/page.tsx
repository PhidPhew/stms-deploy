"use client"

import { useEffect, useState } from "react"
import axios from "@/lib/axios"
import { AddUserModal } from "@/components/admin/users/AddUserModal"

type User = {
  id: number
  name: string
  email: string
  role: string
  status: string
  createdAt?: string
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [openAdd, setOpenAdd] = useState(false)
  const [updating, setUpdating] = useState<number | null>(null)

  const fetchUsers = async () => {
    try {
      const res = await axios.get("/api/admin/users")
      setUsers(res.data?.data || [])
    } catch (err) {
      console.error("Users fetch error:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchUsers() }, [])

  const handleAdd = async (payload: Partial<User> & { password?: string }) => {
    try {
      await axios.post("/api/admin/users", payload)
      await fetchUsers()
      setOpenAdd(false)
    } catch (err: any) {
      alert(err.response?.data?.error || "Failed to add user")
    }
  }

  const handleSuspend = async (id: number) => {
    setUpdating(id)
    try {
      await axios.delete(`/api/admin/users/${id}`)
      await fetchUsers()
    } catch (err: any) {
      alert(err.response?.data?.error || "Failed to suspend user")
    } finally {
      setUpdating(null)
    }
  }

  const handleRoleChange = async (id: number, newRole: string) => {
    try {
      await axios.put(`/api/admin/users/${id}`, { role: newRole })
      await fetchUsers()
    } catch (err: any) {
      alert(err.response?.data?.error || "Failed to update role")
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-blue-900">User Management</h1>
          <p className="text-gray-500 text-sm">Manage users and permissions</p>
        </div>
        <button
          onClick={() => setOpenAdd(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md"
        >
          + Add User
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-32 text-gray-400">Loading users...</div>
      ) : (
        <div className="bg-white rounded-xl border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b bg-gray-50">
                <th className="py-3 px-4">Name</th>
                <th className="px-4">Email</th>
                <th className="px-4">Role</th>
                <th className="px-4">Status</th>
                <th className="px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium text-blue-900">{user.name}</td>
                  <td className="px-4 text-gray-600">{user.email}</td>
                  <td className="px-4">
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user.id, e.target.value)}
                      className="text-xs border rounded px-2 py-1"
                    >
                      <option value="ADMIN">Admin</option>
                      <option value="COACH">Coach</option>
                      <option value="STUDENT">Student</option>
                    </select>
                  </td>
                  <td className="px-4">
                    <span className={`text-xs px-2 py-1 rounded-full
                      ${user.status === "ACTIVE" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-4">
                    {user.status === "ACTIVE" && (
                      <button
                        onClick={() => handleSuspend(user.id)}
                        disabled={updating === user.id}
                        className="text-xs text-red-600 hover:underline disabled:opacity-60"
                      >
                        {updating === user.id ? "..." : "Suspend"}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {openAdd && (
        <AddUserModal
          open={openAdd}
          onClose={() => setOpenAdd(false)}
          onAdd={(u: any) => handleAdd(u)}
        />
      )}
    </div>
  )
}