import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import dbConnect from "@/lib/db"
import Job from "@/models/Job"

export async function GET(req: NextRequest) {
  try {
    await dbConnect()

    const { searchParams } = new URL(req.url)
    const category = searchParams.get("category")
    const search = searchParams.get("q")
    const city = searchParams.get("city")
    const state = searchParams.get("state")

    const query: any = {}

    if (category) {
      query.category = category
    }

    if (search) {
      query.$or = [{ title: { $regex: search, $options: "i" } }, { description: { $regex: search, $options: "i" } }]
    }

    // Add location filtering
    if (city || state) {
      const locationQuery: any = {}

      if (city) {
        locationQuery.city = { $regex: city, $options: "i" }
      }

      if (state) {
        locationQuery.state = { $regex: state, $options: "i" }
      }

      // If we already have $or for search, we need to use $and to combine with location
      if (query.$or) {
        query.$and = [{ $or: query.$or }, locationQuery]
        delete query.$or
      } else {
        Object.assign(query, locationQuery)
      }
    }

    const jobs = await Job.find(query).sort({ createdAt: -1 }).populate("postedBy", "name profileImage").limit(50)

    return NextResponse.json(jobs)
  } catch (error) {
    console.error("Error fetching jobs:", error)
    return NextResponse.json({ error: "Failed to fetch jobs. Please try again later." }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await dbConnect()

    const body = await req.json()

    const newJob = new Job({
      ...body,
      postedBy: body.postedBy || session.user.id,
      status: "open",
    })

    await newJob.save()

    return NextResponse.json(newJob, { status: 201 })
  } catch (error) {
    console.error("Error creating job:", error)
    return NextResponse.json({ error: "Failed to create job. Please try again later." }, { status: 500 })
  }
}
