"use client"

import { useState } from "react"

type Props = {
  open: boolean
  type: "revenue" | "expense"
  onClose: () => void
  onSubmit: (data: {
    date: string
    name: string
    description: string
    amount: number
  }) => void
}

export default function AddFinanceModal({
  open,
  type,
  onClose,
  onSubmit,
}: Props) {
  const [date, setDate] = useState("")
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [amount, setAmount] = useState("")

  if (!open) return null

  const handleSubmit = () => {
    const value = Number(amount)
    if (!date || !name || !value || value <= 0) return

    onSubmit({
      date,
      name,
      description,
      amount: value,
    })

    setDate("")
    setName("")
    setDescription("")
    setAmount("")
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white w-full max-w-md rounded-xl p-6 space-y-4">
        <h2
          className={`text-lg font-semibold ${
            type === "revenue"
              ? "text-emerald-600"
              : "text-red-600"
          }`}
        >
          Add {type === "revenue" ? "Revenue" : "Expense"}
        </h2>

        <div className="space-y-3">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full border rounded-md px-3 py-2 text-sm text-gray-500"
          />

          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border rounded-md px-3 py-2 text-sm text-gray-500"
          />

          <input
            type="text"
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border rounded-md px-3 py-2 text-sm text-gray-500"
          />

          <input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full border rounded-md px-3 py-2 text-sm text-gray-500"
          />
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm rounded-md border text-blue-500"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className={`px-4 py-2 text-sm rounded-md text-white ${
              type === "revenue"
                ? "bg-emerald-600 hover:bg-emerald-700"
                : "bg-red-600 hover:bg-red-700"
            }`}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  )
}