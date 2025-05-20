import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import dbConnect from "@/lib/db"
import Job from "@/models/Job"
import { ObjectId } from "mongodb"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    // Parse query parameters
    const category = searchParams.get("category")
    const city = searchParams.get("city")
    const state = searchParams.get("state")
    const q = searchParams.get("q")
    const page = searchParams.get("page") ? Number.parseInt(searchParams.get("page")!) : 1
    const limit = searchParams.get("limit") ? Number.parseInt(searchParams.get("limit")!) : 10
    const skip = (page - 1) * limit

    // Build query
    const query: any = {}

    if (category) {
      query.category = category
    }

    if (city) {
      query["location.city"] = city
    }

    if (state) {
      query["location.state"] = state
    }

    if (q) {
      query.$or = [
        { title: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } },
        { skills: { $in: [new RegExp(q, "i")] } },
      ]
    }

    await dbConnect()

    // Execute query
    const jobs = await Job.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("postedBy", "name image")
      .lean()

    // Get total count for pagination
    const total = await Job.countDocuments(query)

    return NextResponse.json({
      jobs,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error in jobs API:", error)
    return NextResponse.json({ error: "Failed to fetch jobs" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()

    // Validate required fields
    const requiredFields = ["title", "description", "category", "budget", "location", "skills"]
    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 })
      }
    }

    await dbConnect()

    // Create job object
    const job = new Job({
      ...data,
      postedBy: new ObjectId(session.user.id),
      status: "open",
      applications: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    await job.save()

    return NextResponse.json(job)
  } catch (error) {
    console.error("Error creating job:", error)
    return NextResponse.json({ error: "Failed to create job" }, { status: 500 })
  }
}
