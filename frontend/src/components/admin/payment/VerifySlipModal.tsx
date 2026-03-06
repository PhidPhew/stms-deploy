"use client"

type VerifySlipModalProps = {
  open: boolean
  onClose: () => void
  onApprove: () => void
  slipUrl?: string
}

export default function VerifySlipModal({
  open,
  onClose,
  onApprove,
  slipUrl,
}: VerifySlipModalProps) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-xl bg-white shadow-xl">
        {/* Header */}
        <div className="px-6 py-4 border-b">
          <h2 className="text-lg font-semibold text-blue-900">
            Verify Payment Slip
          </h2>
          <p className="text-sm text-gray-500">
            Review payment proof before approval
          </p>
        </div>

        {/* Content */}
        <div className="px-6 py-4 space-y-4">
          {/* Slip Preview */}
          <div className="h-40 rounded-lg border-2 border-dashed border-blue-200 bg-blue-50 flex items-center justify-center overflow-hidden">
            {slipUrl ? (
              <img
                src={slipUrl}
                alt="Slip"
                className="h-full object-contain"
              />
            ) : (
              <span className="text-sm text-blue-600">
                Slip Preview
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="px-6 py-4 border-t flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm rounded-md border text-gray-600 hover:bg-gray-50"
          >
            Cancel
          </button>

          <button
            onClick={onApprove}
            className="px-5 py-2 text-sm rounded-md bg-green-600 text-white hover:bg-green-700"
          >
            Approve
          </button>
        </div>
      </div>
    </div>
  )
}