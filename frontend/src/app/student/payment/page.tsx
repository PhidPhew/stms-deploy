"use client"

import { useState, useMemo, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import axios from "@/lib/axios"
import Link from "next/link"
import Image from "next/image"
import { CreditCard } from "lucide-react"

/* ---------- TYPES ---------- */
type PaymentStatus = "unpaid" | "verifying" | "approved"

type Payment = {
  id: number
  courseId: number
  course: string
  amount: number
  date: string
  status: PaymentStatus
  slipUrl?: string
}

/* ---------- STATUS LABEL ---------- */
const STATUS_LABEL: Record<PaymentStatus, string> = {
  unpaid: "Waiting for payment",
  verifying: "Under review",
  approved: "Approved",
}

function StudentPaymentContent() {
  const [payments, setPayments] = useState<Payment[]>([])
  const searchParams = useSearchParams()
  const [sort, setSort] = useState<"latest" | "oldest">("latest")
  const [selectedSlip, setSelectedSlip] = useState<string | null>(null)

  useEffect(() => {
    axios.get("/api/student/payments").then((res) => setPayments(res.data.data ?? []))
  }, [searchParams])

  const sortedPayments = useMemo(() => {
    return [...payments].sort((a, b) => {
      const aDate = new Date(a.date).getTime()
      const bDate = new Date(b.date).getTime()
      return sort === "latest" ? bDate - aDate : aDate - bDate
    })
  }, [payments, sort])

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3">
        <CreditCard className="h-6 w-6 text-blue-700" />
        <h1 className="text-2xl font-bold text-blue-900 ">
          My Payments
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ================= LEFT ================= */}
        <div className="lg:col-span-2 bg-white border rounded-2xl">
          {/* ---------- HEADER ---------- */}
          <div className="flex justify-between items-center p-4 border-b">
            <p className="font-medium text-blue-900">Payment History</p>

            <select
              value={sort}
              onChange={(e) =>
                setSort(e.target.value as "latest" | "oldest")
              }
              className="border rounded-lg px-3 py-1 text-sm"
            >
              <option value="latest">Latest first</option>
              <option value="oldest">Oldest first</option>
            </select>
          </div>

          {/* ---------- LIST ---------- */}
          <div className="divide-y">
            {sortedPayments.map((p) => (
              <div
                key={p.id}
                className="p-4 flex justify-between items-center"
              >
                <div>
                  <p className="font-medium">{p.course}</p>
                  <p className="text-sm text-gray-500">
                    {p.amount.toLocaleString()} THB ·{" "}
                    {new Date(p.date).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  {/* STATUS */}
                  <span
                    className={`text-xs px-3 py-1 rounded-full font-medium ${
                      p.status === "unpaid"
                        ? "bg-gray-100 text-gray-600"
                        : p.status === "verifying"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {STATUS_LABEL[p.status]}
                  </span>

                  {/* VIEW SLIP (only verifying / approved) */}
                  {(p.status === "verifying" ||
                    p.status.toLowerCase() === "approved") &&
                    p.slipUrl && (
                      <button
                        onClick={() =>
                          setSelectedSlip(p.slipUrl!)
                        }
                        className="text-sm text-blue-600 hover:underline"
                      >
                        View slip
                      </button>
                    )}

                  {/* PAY (only unpaid) */}
                  {p.status === "unpaid" && (
                    <Link
                      href={`/student/payment/submit?courseId=${p.courseId}`}
                      className="text-sm text-blue-600 hover:underline"
                    >
                      Pay
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ================= RIGHT ================= */}
        <div className="space-y-4 sticky top-6 ">
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
            <p className="text-sm text-gray-600">
              Line: @sportacademy
            </p>
            <p className="text-sm text-gray-600">
              Email: support@sportacademy.com
            </p>
          </InfoCard>
        </div>
      </div>

      {/* ================= SLIP MODAL ================= */}
      {selectedSlip && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-4 max-w-md w-full relative">
            <button
              onClick={() => setSelectedSlip(null)}
              className="absolute top-3 right-3 text-gray-500"
            >
              ✕
            </button>

            <p className="font-medium mb-3">
              Payment Slip
            </p>

            <Image
              src={selectedSlip}
              alt="payment slip"
              width={400}
              height={600}
              className="rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default function StudentPaymentPage() {
  return (
    <Suspense
      fallback={
        <div className="p-6 text-gray-500">Loading...</div>
      }
    >
      <StudentPaymentContent />
    </Suspense>
  )
}

/* ---------- REUSABLE CARD ---------- */
function InfoCard({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="border rounded-xl p-4 bg-white space-y-1">
      <p className="font-medium">{title}</p>
      {children}
    </div>
  )
}