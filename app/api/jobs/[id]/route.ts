import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import dbConnect from "@/lib/db"
import Job from "@/models/Job"

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await dbConnect()

    const job = await Job.findById(params.id).populate("postedBy", "name profileImage")

    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 })
    }

    return NextResponse.json(job)
  } catch (error) {
    console.error("Error fetching job:", error)
    return NextResponse.json({ error: "Failed to fetch job" }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await dbConnect()

    const job = await Job.findById(params.id)

    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 })
    }

    // Check if the user is the owner of the job
    if (job.postedBy.toString() !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const body = await req.json()

    const updatedJob = await Job.findByIdAndUpdate(params.id, { $set: body }, { new: true })

    return NextResponse.json(updatedJob)
  } catch (error) {
    console.error("Error updating job:", error)
    return NextResponse.json({ error: "Failed to update job" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await dbConnect()

    const job = await Job.findById(params.id)

    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 })
    }

    // Check if the user is the owner of the job
    if (job.postedBy.toString() !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    await Job.findByIdAndDelete(params.id)

    return NextResponse.json({ message: "Job deleted successfully" })
  } catch (error) {
    console.error("Error deleting job:", error)
    return NextResponse.json({ error: "Failed to delete job" }, { status: 500 })
  }
}
