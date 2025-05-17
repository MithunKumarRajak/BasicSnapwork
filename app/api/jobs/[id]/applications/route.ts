import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import dbConnect from "@/lib/db"
import Job from "@/models/Job"
import Application from "@/models/Application"

// Get all applications for a job
export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await dbConnect()

    // Find the job
    const job = await Job.findById(params.id)

    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 })
    }

    // Check if the user is the job poster
    if (job.postedBy.toString() !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Get all applications for this job with applicant details
    const applications = await Application.find({ jobId: params.id })
      .populate("applicantId", "name email profileImage verificationStatus")
      .sort({ createdAt: -1 })

    return NextResponse.json(applications)
  } catch (error) {
    console.error("Error fetching applications:", error)
    return NextResponse.json({ error: "Failed to fetch applications" }, { status: 500 })
  }
}

// Submit a new application
export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await dbConnect()

    // Find the job
    const job = await Job.findById(params.id)

    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 })
    }

    // Check if job is still open
    if (job.status !== "open") {
      return NextResponse.json({ error: "This job is no longer accepting applications" }, { status: 400 })
    }

    // Check if user has already applied
    const existingApplication = await Application.findOne({
      jobId: params.id,
      applicantId: session.user.id,
    })

    if (existingApplication) {
      return NextResponse.json({ error: "You have already applied to this job" }, { status: 400 })
    }

    // Get application data from request
    const body = await req.json()
    const { coverLetter, expectedRate, availability, attachments } = body

    // Create new application
    const application = new Application({
      jobId: params.id,
      applicantId: session.user.id,
      coverLetter,
      expectedRate,
      availability,
      attachments: attachments || [],
      status: "pending",
    })

    await application.save()

    // Update job with new applicant and application
    await Job.findByIdAndUpdate(params.id, {
      $addToSet: { applicants: session.user.id, applications: application._id },
    })

    return NextResponse.json(application, { status: 201 })
  } catch (error) {
    console.error("Error submitting application:", error)
    return NextResponse.json({ error: "Failed to submit application" }, { status: 500 })
  }
}
