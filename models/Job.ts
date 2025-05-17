import mongoose, { Schema, type Document } from "mongoose"

export interface IJob extends Document {
  title: string
  description: string
  category: string
  budget: number
  location: string
  city?: string
  state?: string
  skills: string[]
  postedBy: mongoose.Types.ObjectId
  status: "open" | "in-progress" | "completed" | "closed"
  applicants?: mongoose.Types.ObjectId[]
  applications?: mongoose.Types.ObjectId[]
  createdAt: Date
  updatedAt: Date
  deadline?: Date
  hiredApplicant?: mongoose.Types.ObjectId
}

const JobSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    budget: { type: Number, required: true },
    location: { type: String, required: true },
    city: { type: String },
    state: { type: String },
    skills: [{ type: String }],
    postedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    status: {
      type: String,
      enum: ["open", "in-progress", "completed", "closed"],
      default: "open",
    },
    applicants: [{ type: Schema.Types.ObjectId, ref: "User" }],
    applications: [{ type: Schema.Types.ObjectId, ref: "Application" }],
    deadline: { type: Date },
    hiredApplicant: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true },
)

export default mongoose.models.Job || mongoose.model<IJob>("Job", JobSchema)
