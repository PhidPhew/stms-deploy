import mongoose from "mongoose"

const auditLogSchema = new mongoose.Schema({
  action: { type: String, required: true }, // e.g., "CREATE", "UPDATE", "DELETE", "LOGIN"
  collectionName: { type: String, required: true }, // e.g., "User", "Course", "Payment"
  documentId: { type: String }, // Can be ID or email for login
  userId: { type: Number }, // User who performed the action
  oldValues: { type: mongoose.Schema.Types.Mixed },
  newValues: { type: mongoose.Schema.Types.Mixed },
  description: { type: String },
  ipAddress: { type: String },
  timestamp: { type: Date, default: Date.now },
})

export const AuditLog = mongoose.models.AuditLog || mongoose.model("AuditLog", auditLogSchema)
