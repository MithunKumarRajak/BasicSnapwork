import mongoose, { Schema, type Document } from "mongoose"

export interface IApplication extends Document {
  jobId: mongoose.Types.ObjectId
  applicantId: mongoose.Types.ObjectId
  coverLetter: string
  expectedRate?: number
  availability: string
  status: "pending" | "shortlisted" | "accepted" | "rejected"
  attachments?: string[]
  notes?: string
  createdAt: Date
  updatedAt: Date
}

const ApplicationSchema: Schema = new Schema(
  {
    jobId: { type: Schema.Types.ObjectId, ref: "Job", required: true },
    applicantId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    coverLetter: { type: String, required: true },
    expectedRate: { type: Number },
    availability: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "shortlisted", "accepted", "rejected"],
      default: "pending",
    },
    attachments: [{ type: String }],
    notes: { type: String },
  },
  { timestamps: true },
)

// Create a compound index to prevent duplicate applications
ApplicationSchema.index({ jobId: 1, applicantId: 1 }, { unique: true })

export default mongoose.models.Application || mongoose.model<IApplication>("Application", ApplicationSchema)
