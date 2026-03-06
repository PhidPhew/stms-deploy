"use client"

import { useState } from "react"

type UserRole = "admin" | "coach" | "student"

type Props = {
  open: boolean
  onClose: () => void
  onAdd: (user: {
    name: string
    email: string
    role: UserRole
  }) => void
}

export function AddUserModal({
  open,
  onClose,
  onAdd,
}: Props) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [role, setRole] = useState<UserRole>("student")

  if (!open) return null

  const handleSubmit = () => {
    if (!name || !email) return
    onAdd({ name, email, role })
    setName("")
    setEmail("")
    setRole("student")
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div className="bg-white w-full max-w-md rounded-xl shadow-xl text-blue-900">
        <div className="px-6 py-4 border-b">
          <h2 className="text-lg font-semibold">
            Add New User
          </h2>
        </div>

        {/* Body */}
        <div className="px-6 py-4 space-y-4">
          <div>
            <label className="text-sm text-gray-600">
              Name
            </label>
            <input
              className="w-full mt-1 border rounded-md px-3 py-2"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">
              Email
            </label>
            <input
              type="email"
              className="w-full mt-1 border rounded-md px-3 py-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">
              Role
            </label>
            <select
              className="w-full mt-1 border rounded-md px-3 py-2"
              value={role}
              onChange={(e) =>
                setRole(e.target.value as UserRole)
              }
            >
              <option value="student">Student</option>
              <option value="coach">Coach</option>
              <option value="admin">Admin</option>
            </select>
          </div>
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
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded-md"
          >
            Add User
          </button>
        </div>
      </div>
    </div>
  )
}