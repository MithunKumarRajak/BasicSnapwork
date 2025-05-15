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
  status: "open" | "in-progress" | "completed"
  applicants?: mongoose.Types.ObjectId[]
  createdAt: Date
  updatedAt: Date
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
    status: { type: String, enum: ["open", "in-progress", "completed"], default: "open" },
    applicants: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true },
)

export default mongoose.models.Job || mongoose.model<IJob>("Job", JobSchema)
