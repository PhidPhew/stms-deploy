"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { CreditCard } from "lucide-react"
import axios from "@/lib/axios"

type PaymentStatus = "pending" | "approved" | "rejected"

type Payment = {
  id: number
  courseId?: number
  course: string
  amount: number
  date: string
  status: PaymentStatus
  slipUrl?: string
}

const STATUS_LABEL: Record<PaymentStatus, string> = {
  pending: "Under review",
  approved: "Approved",
  rejected: "Rejected",
}

export default function StudentPaymentPage() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [sort, setSort] = useState<"latest" | "oldest">("latest")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const res = await axios.get("/api/student/payments")
        setPayments(res.data?.data || [])
      } catch (err) {
        console.error("Payments fetch error:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchPayments()
  }, [])

  const sortedPayments = useMemo(() => {
    return [...payments].sort((a, b) => {
      const aDate = new Date(a.date).getTime()
      const bDate = new Date(b.date).getTime()
      return sort === "latest" ? bDate - aDate : aDate - bDate
    })
  }, [payments, sort])

  if (loading) {
    return <div className="p-6 flex items-center justify-center h-48 text-gray-400">Loading payments...</div>
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3">
        <CreditCard className="h-6 w-6 text-blue-700" />
        <h1 className="text-2xl font-bold text-blue-900">My Payments</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ================= LEFT ================= */}
        <div className="lg:col-span-2 bg-white border rounded-2xl">
          <div className="flex justify-between items-center p-4 border-b">
            <p className="font-medium text-blue-900">Payment History</p>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as "latest" | "oldest")}
              className="border rounded-lg px-3 py-1 text-sm"
            >
              <option value="latest">Latest first</option>
              <option value="oldest">Oldest first</option>
            </select>
          </div>

          {payments.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <p>No payment records found.</p>
              <Link href="/student/courses" className="text-blue-600 underline text-sm mt-2 block">
                Browse courses to enroll
              </Link>
            </div>
          ) : (
            <div className="divide-y">
              {sortedPayments.map((p) => (
                <div key={p.id} className="p-4 flex justify-between items-center">
                  <div>
                    <p className="font-medium">{p.course}</p>
                    <p className="text-sm text-gray-500">
                      {p.amount.toLocaleString()} THB ·{" "}
                      {new Date(p.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span
                      className={`text-xs px-3 py-1 rounded-full font-medium
                        ${p.status === "pending" ? "bg-yellow-100 text-yellow-700" :
                          p.status === "approved" ? "bg-green-100 text-green-700" :
                          "bg-red-100 text-red-700"}`}
                    >
                      {STATUS_LABEL[p.status] || p.status}
                    </span>
                    {p.status === "pending" && p.courseId && (
                      <Link
                        href={`/student/payment/submit?courseId=${p.courseId}&paymentId=${p.id}`}
                        className="text-sm text-blue-600 hover:underline"
                      >
                        Upload slip
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ================= RIGHT ================= */}
        <div className="space-y-4 sticky top-6">
          <InfoCard title="🏦 Bank Transfer">
            <p>Kasikorn Bank</p>
            <p>Sport Academy</p>
            <p className="font-mono">123-4-56789-0</p>
          </InfoCard>
          <InfoCard title="ℹ️ Important Notes">
            <ul className="list-disc ml-5 text-sm text-gray-600 space-y-1">
              <li>Transfer exact amount</li>
              <li>Upload slip within 24 hours</li>
              <li>Approval within 1 business day</li>
            </ul>
          </InfoCard>
          <InfoCard title="📞 Support">
            <p className="text-sm text-gray-600">Line: @sportacademy</p>
            <p className="text-sm text-gray-600">Email: support@sportacademy.com</p>
          </InfoCard>
        </div>
      </div>
    </div>
  )
}

function InfoCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border rounded-xl p-4 bg-white space-y-1">
      <p className="font-medium">{title}</p>
      {children}
    </div>
  )
}