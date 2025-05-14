import { type NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/db"
import Job from "@/models/Job"

export async function GET(req: NextRequest) {
  try {
    await dbConnect()

    const { searchParams } = new URL(req.url)
    const category = searchParams.get("category")
    const search = searchParams.get("search")

    const query: any = {}

    if (category) {
      query.category = category
    }

    if (search) {
      query.$or = [{ title: { $regex: search, $options: "i" } }, { description: { $regex: search, $options: "i" } }]
    }

    const jobs = await Job.find(query).sort({ createdAt: -1 }).populate("postedBy", "name profileImage").limit(50)

    return NextResponse.json(jobs)
  } catch (error) {
    console.error("Error fetching jobs:", error)
    return NextResponse.json({ error: "Failed to fetch jobs" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect()

    const body = await req.json()

    // In a real app, you would get the user ID from the session
    // For now, we'll use a placeholder user ID
    const userId = "65f1e8e3b9b5e80e3c9c0e1a" // Placeholder

    const newJob = new Job({
      ...body,
      postedBy: userId,
    })

    await newJob.save()

    return NextResponse.json(newJob, { status: 201 })
  } catch (error) {
    console.error("Error creating job:", error)
    return NextResponse.json({ error: "Failed to create job" }, { status: 500 })
  }
}
