import mongoose from "mongoose"

const ApplicationSchema = new mongoose.Schema({
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Job",
    required: [true, "Please provide a job ID"],
  },
  applicantId: {
    type: mongoose.Schema.Types.ObjectId,
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
const Application = mongoose.models.Application || mongoose.model("Application", ApplicationSchema)

module.exports = Application
