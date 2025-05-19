// Mark this file as server-only to prevent client imports
import "server-only"

import mongoose, { Schema, type Document } from "mongoose"
import type { ObjectId } from "mongodb"

export interface IApplication extends Document {
  jobId: ObjectId
  applicantId: ObjectId
  coverLetter: string
  expectedRate: number
  availability: string
  status: "pending" | "shortlisted" | "accepted" | "rejected" | "withdrawn"
  employerNotes?: string
  createdAt: Date
  updatedAt: Date
}

const ApplicationSchema = new Schema<IApplication>({
  jobId: {
    type: Schema.Types.ObjectId,
    ref: "Job",
    required: [true, "Please provide a job ID"],
  },
  applicantId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Please provide an applicant ID"],
  },
  coverLetter: {
    type: String,
    required: [true, "Please provide a cover letter"],
  },
  expectedRate: {
    type: Number,
    required: [true, "Please provide an expected rate"],
  },
  availability: {
    type: String,
    required: [true, "Please provide availability information"],
  },
  status: {
    type: String,
    enum: ["pending", "shortlisted", "accepted", "rejected", "withdrawn"],
    default: "pending",
  },
  employerNotes: String,
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
