import mongoose from "mongoose"

const JobSchema = new mongoose.Schema({
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
    type: mongoose.Schema.Types.ObjectId,
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
      type: mongoose.Schema.Types.ObjectId,
      ref: "Application",
    },
  ],
  hiredApplicant: {
    type: mongoose.Schema.Types.ObjectId,
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
const Job = mongoose.models.Job || mongoose.model("Job", JobSchema)

// Export as default
export default Job
// Also export as named export
export { Job }
