// Mark this file as server-only to prevent client imports
import "server-only"
import mongoose, { Schema, type Document } from "mongoose"
import type { ObjectId } from "mongodb"

export interface IApplication extends Document {
  job: ObjectId
  applicant: ObjectId
  coverLetter: string
  expectedPay: number
  status: "pending" | "accepted" | "rejected" | "withdrawn"
  createdAt: Date
  updatedAt: Date
}

const ApplicationSchema = new Schema<IApplication>({
  job: {
    type: Schema.Types.ObjectId,
    ref: "Job",
    required: [true, "Please provide a job ID"],
  },
  applicant: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Please provide an applicant ID"],
  },
  coverLetter: {
    type: String,
    required: [true, "Please provide a cover letter"],
  },
  expectedPay: {
    type: Number,
    required: [true, "Please provide expected pay"],
  },
  status: {
    type: String,
    enum: ["pending", "accepted", "rejected", "withdrawn"],
    default: "pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
})

// Create the Application model
const Application = mongoose.models.Application || mongoose.model<IApplication>("Application", ApplicationSchema)

export default Application
