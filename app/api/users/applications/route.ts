import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import dbConnect from "@/lib/db"
import Application from "@/models/Application"

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await dbConnect()

    // Get all applications for the current user
    const applications = await Application.find({ applicantId: session.user.id })
      .populate("jobId", "title budget location status category postedBy")
      .sort({ createdAt: -1 })

    return NextResponse.json(applications)
  } catch (error) {
    console.error("Error fetching user applications:", error)
    return NextResponse.json({ error: "Failed to fetch applications" }, { status: 500 })
  }
}
