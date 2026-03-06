"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"

export default function SubmitPaymentPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [slipPreview, setSlipPreview] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    // mock submit
    await new Promise((r) => setTimeout(r, 1200))

    router.push("/student/payment?success=true")
  }

  function handleFileChange(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = e.target.files?.[0]
    if (file) {
      setSlipPreview(URL.createObjectURL(file))
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="bg-gray-50 border rounded-xl p-6 space-y-4">
      <h1 className="text-2xl font-bold text-blue-900">
        Submit Payment
      </h1>

      <div className="grid md:grid-cols-3 gap-6">
        {/* ---------- LEFT : PAYMENT FORM ---------- */}
        <form
          onSubmit={handleSubmit}
          className="md:col-span-2 bg-white border rounded-xl p-6 space-y-5"
        >
          <SectionTitle title="Payment Information" />

          <div>
            <label className="text-sm text-gray-600">
              Transaction Reference
            </label>
            <input
              type="text"
              placeholder="e.g. SCB123456789"
              className="w-full mt-1 border rounded px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">
              Upload Payment Slip
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full mt-1 border rounded px-3 py-2"
              required
            />
          </div>

          {slipPreview && (
            <div className="border rounded-lg p-3">
              <p className="text-sm text-gray-500 mb-2">
                Slip Preview
              </p>
              <img
                src={slipPreview}
                alt="Slip preview"
                className="rounded-md max-h-60"
              />
            </div>
          )}

          <button
            disabled={loading}
            className="
              w-full py-2 rounded-md
              bg-green-600 text-white font-medium
              hover:bg-green-700
              disabled:opacity-50
            "
          >
            {loading ? "Submitting..." : "Submit Payment"}
          </button>
        </form>

        {/* ---------- RIGHT : COURSE + PAYMENT INFO ---------- */}
        <div className="space-y-6">
          {/* Course Summary */}
          <div className="bg-white border rounded-xl p-5">
            <SectionTitle title="Course Summary" />
            <div className="text-sm space-y-1 text-gray-700">
              <p>
                <b>Course:</b> Badminton Beginner
              </p>
              <p>
                <b>Sessions:</b> 16
              </p>
              <p>
                <b>Total Price:</b>{" "}
                <span className="font-semibold">
                  4,990 THB
                </span>
              </p>
            </div>
          </div>

          {/* Payment Instruction */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
            <SectionTitle title="How to Pay" />
            <div className="text-sm text-gray-700 space-y-1">
              <p>
                <b>Bank:</b> SCB
              </p>
              <p>
                <b>Account Name:</b> Sport Academy
              </p>
              <p>
                <b>Account No:</b> 123-456-7890
              </p>
              <p className="text-xs text-gray-500 mt-2">
                * Please upload the payment slip after
                transferring the exact amount.
              </p>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  )
}

function SectionTitle({ title }: { title: string }) {
  return (
    <h2 className="text-sm font-semibold text-gray-800 mb-3">
      {title}
    </h2>
  )
}