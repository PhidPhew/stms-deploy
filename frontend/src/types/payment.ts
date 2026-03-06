// types/payment.ts
export type PaymentStatus = "unpaid" | "verifying" | "approved"

export const PAYMENT_STATUS_LABEL: Record<PaymentStatus, string> = {
  unpaid: "Waiting for payment",
  verifying: "Under review",
  approved: "Approved",
}