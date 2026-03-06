"use client"

import { useState, useEffect } from "react"

type UserRole = "admin" | "coach" | "student"
type UserStatus = "active" | "suspended"

type User = {
  id: number
  name: string
  email: string
  role: UserRole
  status: UserStatus
}

type Props = {
  open: boolean
  user: User | null
  currentUserRole: UserRole
  onClose: () => void
  onSave: (user: User) => void
}

export function EditUserModal({
  open,
  user,
  currentUserRole,
  onClose,
  onSave,
}: Props) {
  const [role, setRole] = useState<UserRole>("student")
  const [status, setStatus] = useState<UserStatus>("active")

  useEffect(() => {
    if (user) {
      setRole(user.role)
      setStatus(user.status)
    }
  }, [user])

  if (!open || !user) return null

  const handleSave = () => {
    onSave({
      ...user,
      role,
      status,
    })
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div className="bg-white w-full max-w-md rounded-xl shadow-xl">
        {/* Header */}
        <div className="px-6 py-4 border-b">
          <h2 className="text-lg font-semibold text-blue-900">
            Edit User
          </h2>
        </div>

        {/* Body */}
        <div className="px-6 py-4 space-y-4 ">
          <div className="text-sm text-black">
            <p className="font-medium">{user.name}</p>
            <p className="text-gray-500">{user.email}</p>
          </div>

          {/* Role (admin only) */}
          {currentUserRole === "admin" && (
            <div>
              <label className="text-sm text-gray-600 ">
                Role
              </label>
              <select
                className="w-full mt-1 border rounded-md px-3 py-2 "
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
          )}

          <div>
            <label className="text-sm text-gray-600">
              Status
            </label>
            <select
              className="w-full mt-1 border rounded-md px-3 py-2"
              value={status}
              onChange={(e) =>
                setStatus(e.target.value as UserStatus)
              }
            >
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t flex justify-end gap-2 ">
          <button
            onClick={onClose}
            className="px-4 py-2 border bg-gray-100 rounded-md text-gray-600"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded-md"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  )
}