"use client"

import { useState } from "react"

type Props = {
  open: boolean
  onClose: () => void
  onAdd: (payment: {
    name: string
    course: string
    amount: number
  }) => void
}

export default function AddPaymentModal({
  open,
  onClose,
  onAdd,
}: Props) {
  const [name, setName] = useState("")
  const [course, setCourse] = useState("")
  const [amount, setAmount] = useState<number>(0)

  if (!open) return null

  const handleSubmit = () => {
    if (!name || !course || !amount) return
    onAdd({ name, course, amount })
    setName("")
    setCourse("")
    setAmount(0)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div className="bg-white w-full max-w-md rounded-xl shadow-xl text-blue-900">
        <div className="px-6 py-4 border-b">
          <h2 className="text-lg font-semibold">
            Add Payment
          </h2>
        </div>

        <div className="px-6 py-4 space-y-4">
          <div>
            <label className="text-sm text-gray-600">Name</label>
            <input
              className="w-full mt-1 border rounded-md px-3 py-2"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">Course</label>
            <input
              className="w-full mt-1 border rounded-md px-3 py-2"
              value={course}
              onChange={(e) => setCourse(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">Amount</label>
            <input
              type="number"
              className="w-full mt-1 border rounded-md px-3 py-2"
              value={amount}
              onChange={(e) => setAmount(+e.target.value)}
            />
          </div>
        </div>

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
            Add
          </button>
        </div>
      </div>
    </div>
  )
}