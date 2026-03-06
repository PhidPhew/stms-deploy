"use client"

import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

type Props = {
  name: string
  course: string
  amount: number
  onReview: () => void
}

export function PendingPaymentItem({
  name,
  course,
  amount,
  onReview,
}: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="flex justify-between items-center rounded-lg border bg-white p-4 "
    >
      {/* Left */}
      <div className="flex items-start gap-3">
        <motion.span
          animate={{ scale: [1, 1.4, 1] }}
          transition={{ repeat: Infinity, duration: 1.2 }}
          className="mt-2 h-2 w-2 rounded-full bg-red-500"
        />
        <div>
          <p className="font-medium text-gray-900">{name}</p>
          <p className="text-sm text-gray-500">{course}</p>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-4">
        <p className="text-sm font-semibold text-blue-700">
          ฿{amount.toLocaleString()}
        </p>

        <Button
          onClick={onReview}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
        >
          View
        </Button>
      </div>
    </motion.div>
  )
}