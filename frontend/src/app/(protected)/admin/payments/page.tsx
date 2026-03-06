"use client"

import { useEffect, useState } from "react"
import { useState as useStateAlias } from "react"
import axios from "@/lib/axios"

type Payment = {
  id: number
  studentName: string
  course: string
  amount: number
  status: string
  slipUrl?: string
  createdAt: string
}

type FinanceRecord = {
  id: number
  date: string
  name: string
  description?: string
  type: "revenue" | "expense"
  amount: number
}

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [records, setRecords] = useState<FinanceRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [approving, setApproving] = useState<number | null>(null)

  const fetchAll = async () => {
    try {
      const [paymentsRes, recordsRes] = await Promise.all([
        axios.get("/api/admin/finance/payments"),
        axios.get("/api/admin/finance/records"),
      ])
      setPayments(paymentsRes.data?.data || [])
      setRecords(recordsRes.data?.data || [])
    } catch (err) {
      console.error("Payments fetch error:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchAll() }, [])

  const handleApprove = async (paymentId: number) => {
    setApproving(paymentId)
    try {
      await axios.post(`/api/admin/finance/payments/${paymentId}/approve`)
      await fetchAll()
    } catch (err: any) {
      alert(err.response?.data?.error || "Failed to approve payment")
    } finally {
      setApproving(null)
    }
  }

  if (loading) {
    return <div className="p-6 flex items-center justify-center h-48 text-gray-400">Loading payments...</div>
  }

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold text-blue-900">Finance & Payments</h1>

      {/* ===== PENDING PAYMENTS ===== */}
      <div className="bg-white rounded-xl p-5 shadow-sm border space-y-4">
        <h2 className="text-lg font-semibold text-blue-900">Pending Payment Approvals</h2>
        {payments.filter(p => p.status === "PENDING").length === 0 ? (
          <p className="text-sm text-gray-500">No pending payments.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b">
                <th className="py-3">Student</th>
                <th>Course</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Slip</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {payments.filter(p => p.status === "PENDING").map((p) => (
                <tr key={p.id} className="border-b">
                  <td className="py-3 font-medium text-blue-900">{p.studentName}</td>
                  <td>{p.course}</td>
                  <td className="text-emerald-600 font-semibold">฿{p.amount.toLocaleString()}</td>
                  <td className="text-gray-500">{new Date(p.createdAt).toLocaleDateString()}</td>
                  <td>
                    {p.slipUrl ? (
                      <a href={p.slipUrl} target="_blank" rel="noreferrer" className="text-blue-600 underline text-xs">View</a>
                    ) : <span className="text-gray-400 text-xs">—</span>}
                  </td>
                  <td>
                    <button
                      onClick={() => handleApprove(p.id)}
                      disabled={approving === p.id}
                      className="px-3 py-1 rounded-md bg-green-600 text-white text-xs disabled:opacity-60"
                    >
                      {approving === p.id ? "Approving..." : "Approve"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* ===== FINANCE RECORDS ===== */}
      <div className="bg-white rounded-xl p-5 shadow-sm border space-y-4">
        <h2 className="text-lg font-semibold text-blue-900">Revenue &amp; Expense Records</h2>
        {records.length === 0 ? (
          <p className="text-sm text-gray-500">No records yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b">
                <th className="py-3">Date</th>
                <th>Name</th>
                <th>Description</th>
                <th>Type</th>
                <th className="text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {records.map((f) => (
                <tr key={f.id} className="border-b">
                  <td className="py-3 text-blue-900">{new Date(f.date).toLocaleDateString()}</td>
                  <td className="font-medium text-blue-900">{f.name}</td>
                  <td className="text-gray-500">{f.description}</td>
                  <td>
                    <span className={`text-xs px-2 py-1 rounded-full
                      ${f.type === "revenue" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}>
                      {f.type}
                    </span>
                  </td>
                  <td className={`text-right font-semibold ${f.type === "revenue" ? "text-emerald-600" : "text-red-600"}`}>
                    {f.type === "revenue" ? "+" : "-"}฿{f.amount.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}