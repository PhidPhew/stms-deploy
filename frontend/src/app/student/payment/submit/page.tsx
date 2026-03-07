"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useState, useEffect, Suspense } from "react"
import axios from "@/lib/axios"

function SubmitPaymentForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const courseId = searchParams.get("courseId")

  const [loading, setLoading] = useState(false)
  const [slipFile, setSlipFile] = useState<File | null>(null)
  const [slipPreview, setSlipPreview] = useState<string | null>(null)
  const [txRef, setTxRef] = useState("")
  const [paymentId, setPaymentId] = useState<number | null>(null)
  const [course, setCourse] = useState<{ title: string; price: number } | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!courseId) return
    axios.get("/api/student/payments").then((res) => {
      const payments = res.data.data ?? []
      const payment = payments.find((p: any) => p.courseId === parseInt(courseId))
      if (payment) {
        setPaymentId(payment.id)
        setCourse({ title: payment.course ?? "Course", price: payment.amount })
      }
    }).catch(() => setError("Failed to load payment info"))
  }, [courseId])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!slipFile) return
    setLoading(true)
    setError(null)
    try {
      let pid = paymentId
      if (!pid && courseId) {
        try { await axios.post(`/api/student/courses/${courseId}/enroll`) } catch {}
        const res2 = await axios.get("/api/student/payments")
        const p = (res2.data.data ?? []).find((p: any) => p.courseId === parseInt(courseId))
        if (!p) throw new Error("Failed to create payment record")
        pid = p.id
        setPaymentId(p.id)
        setCourse({ title: p.course ?? "Course", price: p.amount })
      }
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result as string)
        reader.onerror = reject
        reader.readAsDataURL(slipFile)
      })
      await axios.post("/api/student/payments", { paymentId: pid, slipUrl: base64, txRef })
      router.push("/student/payment?success=true")
    } catch (err: any) {
      setError(err.response?.data?.error ?? "Failed to submit payment")
      setLoading(false)
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) {
      setSlipFile(file)
      setSlipPreview(URL.createObjectURL(file))
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="bg-gray-50 border rounded-xl p-6 space-y-4">
        <h1 className="text-2xl font-bold text-blue-900">Submit Payment</h1>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <div className="grid md:grid-cols-3 gap-6">
          <form onSubmit={handleSubmit} className="md:col-span-2 bg-white border rounded-xl p-6 space-y-5">
            <SectionTitle title="Payment Information" />
            <div>
              <label className="text-sm text-gray-600">Transaction Reference</label>
              <input type="text" value={txRef} onChange={(e) => setTxRef(e.target.value)} placeholder="e.g. SCB123456789" className="w-full mt-1 border rounded px-3 py-2" required />
            </div>
            <div>
              <label className="text-sm text-gray-600">Upload Payment Slip</label>
              <input type="file" accept="image/*" onChange={handleFileChange} className="w-full mt-1 border rounded px-3 py-2" required />
            </div>
            {slipPreview && (
              <div className="border rounded-lg p-3">
                <p className="text-sm text-gray-500 mb-2">Slip Preview</p>
                <img src={slipPreview} alt="Slip preview" className="rounded-md max-h-60" />
              </div>
            )}
            <button disabled={loading} className="w-full py-2 rounded-md bg-green-600 text-white font-medium hover:bg-green-700 disabled:opacity-50">
              {loading ? "Submitting..." : "Submit Payment"}
            </button>
          </form>
          <div className="space-y-6">
            <div className="bg-white border rounded-xl p-5">
              <SectionTitle title="Course Summary" />
              <div className="text-sm space-y-1 text-gray-700">
                <p><b>Course:</b> {course?.title ?? "Loading..."}</p>
                <p><b>Total Price:</b> <span className="font-semibold">{course?.price?.toLocaleString() ?? "-"} THB</span></p>
              </div>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
              <SectionTitle title="How to Pay" />
              <div className="text-sm text-gray-700 space-y-1">
                <p><b>Bank:</b> SCB</p>
                <p><b>Account Name:</b> Sport Academy</p>
                <p><b>Account No:</b> 123-456-7890</p>
                <p className="text-xs text-gray-500 mt-2">* Please upload the payment slip after transferring the exact amount.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function SubmitPaymentPage() {
  return (
    <Suspense fallback={<div className="p-6">Loading...</div>}>
      <SubmitPaymentForm />
    </Suspense>
  )
}

function SectionTitle({ title }: { title: string }) {
  return <h2 className="text-sm font-semibold text-gray-800 mb-3">{title}</h2>
}
