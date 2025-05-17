import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import dbConnect from "@/lib/db"
import Application from "@/models/Application"
import Job from "@/models/Job"

// Get a specific application
export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await dbConnect()

    const application = await Application.findById(params.id)
      .populate("applicantId", "name email profileImage verificationStatus")
      .populate("jobId", "title budget postedBy")

    if (!application) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 })
    }

    // Check if user is either the applicant or the job poster
    const job = await Job.findById(application.jobId)

    if (application.applicantId._id.toString() !== session.user.id && job?.postedBy.toString() !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    return NextResponse.json(application)
  } catch (error) {
    console.error("Error fetching application:", error)
    return NextResponse.json({ error: "Failed to fetch application" }, { status: 500 })
  }
}

// Update application status
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await dbConnect()

    const application = await Application.findById(params.id)

    if (!application) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 })
    }

    // Find the job
    const job = await Job.findById(application.jobId)

    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 })
    }

    // Only job poster can update application status
    if (job.postedBy.toString() !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const body = await req.json()
    const { status, notes } = body

    // Validate status
    if (!["pending", "shortlisted", "accepted", "rejected"].includes(status)) {
      return NextResponse.json({ error: "Invalid status value" }, { status: 400 })
    }

    // If accepting an application, update job status and hired applicant
    if (status === "accepted") {
      // Update job status to in-progress
      await Job.findByIdAndUpdate(job._id, {
        status: "in-progress",
        hiredApplicant: application.applicantId,
      })

      // Reject all other applications
      await Application.updateMany(
        {
          jobId: job._id,
          _id: { $ne: application._id },
          status: { $ne: "rejected" },
        },
        { status: "rejected", notes: "Another applicant was selected for this job" },
      )
    }

    // Update application
    const updatedApplication = await Application.findByIdAndUpdate(
      params.id,
      { status, notes: notes || application.notes },
      { new: true },
    ).populate("applicantId", "name email profileImage")

    return NextResponse.json(updatedApplication)
  } catch (error) {
    console.error("Error updating application:", error)
    return NextResponse.json({ error: "Failed to update application" }, { status: 500 })
  }
}

// Delete application (withdraw)
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await dbConnect()

    const application = await Application.findById(params.id)

    if (!application) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 })
    }

    // Only the applicant can withdraw their application
    if (application.applicantId.toString() !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Remove applicant from job
    await Job.findByIdAndUpdate(application.jobId, {
      $pull: { applicants: session.user.id, applications: application._id },
    })

    // Delete the application
    await Application.findByIdAndDelete(params.id)

    return NextResponse.json({ message: "Application withdrawn successfully" })
  } catch (error) {
    console.error("Error withdrawing application:", error)
    return NextResponse.json({ error: "Failed to withdraw application" }, { status: 500 })
  }
}
