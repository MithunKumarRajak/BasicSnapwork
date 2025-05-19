// Mark this file as server-only to prevent client imports
import "server-only"

import mongoose, { Schema, type Document } from "mongoose"
import type { ObjectId } from "mongodb"

export interface IJob extends Document {
  title: string
  description: string
  category: string
  budget: {
    min: number
    max: number
  }
  location: {
    city: string
    state: string
    address?: string
  }
  skills: string[]
  duration: string
  postedBy: ObjectId
  status: "open" | "in-progress" | "completed" | "cancelled"
  applications: ObjectId[]
  hiredApplicant?: ObjectId
  createdAt: Date
  updatedAt: Date
}

const JobSchema = new Schema<IJob>({
  title: {
    type: String,
    required: [true, "Please provide a job title"],
  },
  description: {
    type: String,
    required: [true, "Please provide a job description"],
  },
  category: {
    type: String,
    required: [true, "Please provide a job category"],
  },
  budget: {
    min: {
      type: Number,
      required: [true, "Please provide a minimum budget"],
    },
    max: {
      type: Number,
      required: [true, "Please provide a maximum budget"],
    },
  },
  location: {
    city: {
      type: String,
      required: [true, "Please provide a city"],
    },
    state: {
      type: String,
      required: [true, "Please provide a state"],
    },
    address: String,
  },
  skills: [String],
  duration: String,
  postedBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Please provide a user ID"],
  },
  status: {
    type: String,
    enum: ["open", "in-progress", "completed", "cancelled"],
    default: "open",
  },
  applications: [
    {
      type: Schema.Types.ObjectId,
      ref: "Application",
    },
  ],
  hiredApplicant: {
    type: Schema.Types.ObjectId,
    ref: "User",
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

// Create the Job model
const Job = mongoose.models.Job || mongoose.model<IJob>("Job", JobSchema)

export default Job
