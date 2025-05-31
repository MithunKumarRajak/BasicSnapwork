import mongoose, { Schema } from "mongoose"

export interface IJob {
  _id: string
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
  }
  postedBy: string
  status: "open" | "closed"
  createdAt: Date
}

const JobSchema = new Schema<IJob>({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  budget: {
    min: {
      type: Number,
      required: true,
    },
    max: {
      type: Number,
      required: true,
    },
  },
  location: {
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
  },
  postedBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  status: {
    type: String,
    enum: ["open", "closed"],
    default: "open",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

const Job = mongoose.models.Job || mongoose.model<IJob>("Job", JobSchema)

export default Job
