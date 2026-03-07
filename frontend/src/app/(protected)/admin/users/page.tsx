"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { UserTable, type User } from "@/components/admin/users/UserTable"
import { AddUserModal } from "@/components/admin/users/AddUserModal"
import axios from "@/lib/axios"

export default function UsersPage() {
    const router = useRouter()
    const [openAdd, setOpenAdd] = useState(false)
    const [users, setUsers] = useState<User[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        axios.get("/api/admin/users")
            .then((res) => setUsers(res.data.data ?? []))
            .catch((err) => {
                if (err.response?.status === 401) { localStorage.removeItem("token"); router.push("/login") }
                else setError("Failed to load users")
            })
            .finally(() => setLoading(false))
    }, [router])

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-blue-900">
                        User Management
                    </h1>
                    <p className="text-gray-500 text-sm">
                        Manage users and permissions
                    </p>
                </div>

                <button
                    onClick={() => setOpenAdd(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md"
                >
                    + Add User
                </button>
            </div>

            {loading && <p className="text-gray-500">Loading...</p>}
            {error && <p className="text-red-500">{error}</p>}

            <UserTable
                users={users}
                currentUserRole="admin"
                onUpdate={async (updated) => {
                    try {
                        await axios.put(`/api/admin/users/${updated.id}`, updated)
                        setUsers((prev) =>
                            prev.map((u) =>
                                u.id === updated.id ? updated : u
                            )
                        )
                    } catch { setError("Failed to update user") }
                }}
                onDelete={async (id) => {
                    try {
                        await axios.delete(`/api/admin/users/${id}`)
                        setUsers((prev) => prev.filter((u) => u.id !== id))
                    } catch { setError("Failed to delete user") }
                }}
            />

            <AddUserModal
                open={openAdd}
                onClose={() => setOpenAdd(false)}
                onAdd={async (user) => {
                    try {
                        const res = await axios.post("/api/admin/users", user)
                        setUsers((prev) => [...prev, res.data ?? { id: Date.now(), status: "active", ...user }])
                    } catch { setError("Failed to add user") }
                }}
            />
        </div>
    )
}