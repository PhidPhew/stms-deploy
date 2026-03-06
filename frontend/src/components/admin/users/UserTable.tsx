"use client"

import { useState } from "react"
import { EditUserModal } from "@/components/admin/users/EditUserModal"
import { DeleteUserModal } from "@/components/admin/users/DeleteUserModal"

export type UserRole = "admin" | "coach" | "student"
export type UserStatus = "active" | "suspended"

export type User = {
    id: number
    name: string
    email: string
    role: UserRole
    status: UserStatus
}

type Props = {
    users: User[]
    currentUserRole: UserRole
    onUpdate: (user: User) => void
    onDelete: (id: number) => void
}

export function UserTable({
    users,
    currentUserRole,
    onUpdate,
    onDelete,
}: Props) {
    const [editUser, setEditUser] = useState<User | null>(null)
    const [deleteUser, setDeleteUser] = useState<User | null>(null)

    return (
        <>
            <div className="bg-white rounded-xl shadow border">
                <table className="w-full text-sm">
                    <thead className="border-b text-gray-500">
                        <tr>
                            <th className="text-left p-4">Name</th>
                            <th className="text-left p-4">Email</th>
                            <th className="text-left p-4">Role</th>
                            <th className="text-left p-4">Status</th>
                            <th className="text-right p-4">Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {users.map((u) => (
                            <tr
                                key={u.id}
                                className="border-b last:border-0 hover:bg-gray-50"
                            >
                                <td className="p-4 font-medium text-blue-900">
                                    {u.name}
                                </td>
                                <td className="p-4 text-gray-600">
                                    {u.email}
                                </td>

                                <td className="p-4">
                                    <span
                                        className={`px-3 py-1 rounded-full text-xs font-medium
                      ${u.role === "admin"
                                                ? "bg-purple-100 text-purple-700"
                                                : u.role === "coach"
                                                    ? "bg-blue-100 text-blue-700"
                                                    : "bg-green-100 text-green-700"
                                            }`}
                                    >
                                        {u.role}
                                    </span>
                                </td>

                                <td className="p-4">
                                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                                        {u.status}
                                    </span>
                                </td>

                                <td className="p-4 text-right space-x-3">
                                    {currentUserRole === "admin" &&
                                        u.role !== "admin" && (
                                            <>
                                                <button
                                                    onClick={() => setEditUser(u)}
                                                    className="text-blue-600 hover:underline"
                                                >
                                                    Edit
                                                </button>

                                                <button
                                                    onClick={() => setDeleteUser(u)}
                                                    className="text-red-600 hover:underline"
                                                >
                                                    Delete
                                                </button>
                                            </>
                                        )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Edit Modal */}
            <EditUserModal
                open={!!editUser}
                user={editUser}
                currentUserRole={currentUserRole}
                onClose={() => setEditUser(null)}
                onSave={(updated) => {
                    onUpdate(updated)
                    setEditUser(null)
                }}
            />

            {/* Delete Modal */}
            <DeleteUserModal
                open={!!deleteUser}
                user={deleteUser}
                onClose={() => setDeleteUser(null)}
                onConfirm={() => {
                    if (deleteUser) onDelete(deleteUser.id)
                    setDeleteUser(null)
                }}
            />
        </>
    )
}