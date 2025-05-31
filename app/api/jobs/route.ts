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
    const search = searchParams.get("search")
    const category = searchParams.get("category")
    const city = searchParams.get("city")
    const state = searchParams.get("state")
    const jobType = searchParams.get("jobType")
    const experienceLevel = searchParams.get("experience")
    const minPrice = searchParams.get("minPrice") ? Number.parseInt(searchParams.get("minPrice")!) : null
    const maxPrice = searchParams.get("maxPrice") ? Number.parseInt(searchParams.get("maxPrice")!) : null
    const skills = searchParams.get("skills")?.split(",").filter(Boolean) || []
    const isRemote = searchParams.get("remote") === "true"
    const isUrgent = searchParams.get("urgent") === "true"
    const isVerifiedOnly = searchParams.get("verified") === "true"
    const page = searchParams.get("page") ? Number.parseInt(searchParams.get("page")!) : 1
    const limit = searchParams.get("limit") ? Number.parseInt(searchParams.get("limit")!) : 10
    const skip = (page - 1) * limit

    // Build query
    const query: any = { status: "open" }

    // Search in title and description
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { skills: { $in: [new RegExp(search, "i")] } },
      ]
    }

    // Category filter
    if (category) {
      query.category = category
    }

    // Location filters
    if (city) {
      query["location.city"] = { $regex: city, $options: "i" }
    }

    if (state) {
      query["location.state"] = { $regex: state, $options: "i" }
    }

    // Job type filter
    if (jobType) {
      query.jobType = jobType
    }

    // Experience level filter
    if (experienceLevel) {
      query.experienceLevel = experienceLevel
    }

    // Price range filter
    if (minPrice !== null || maxPrice !== null) {
      query.$and = query.$and || []

      if (minPrice !== null) {
        query.$and.push({ "budget.min": { $gte: minPrice } })
      }

      if (maxPrice !== null) {
        query.$and.push({ "budget.max": { $lte: maxPrice } })
      }
    }

    // Skills filter
    if (skills.length > 0) {
      query.skills = { $in: skills.map((skill) => new RegExp(skill, "i")) }
    }

    // Remote work filter
    if (isRemote) {
      query.isRemote = true
    }

    // Urgent jobs filter
    if (isUrgent) {
      query.isUrgent = true
    }

    await dbConnect()

    // Build aggregation pipeline
    const pipeline: any[] = [
      { $match: query },
      {
        $lookup: {
          from: "users",
          localField: "postedBy",
          foreignField: "_id",
          as: "postedBy",
          pipeline: [
            {
              $project: {
                name: 1,
                verificationStatus: 1,
                rating: 1,
                password: 0,
              },
            },
          ],
        },
      },
      { $unwind: "$postedBy" },
      {
        $lookup: {
          from: "applications",
          localField: "_id",
          foreignField: "jobId",
          as: "applications",
        },
      },
      {
        $addFields: {
          applicationsCount: { $size: "$applications" },
        },
      },
      {
        $project: {
          applications: 0,
        },
      },
    ]

    // Add verified employers filter
    if (isVerifiedOnly) {
      pipeline.splice(2, 0, {
        $match: {
          "postedBy.verificationStatus": "verified",
        },
      })
    }

    // Add sorting
    pipeline.push({ $sort: { createdAt: -1 } })

    // Add pagination
    pipeline.push({ $skip: skip })
    pipeline.push({ $limit: limit })

    // Execute aggregation
    const jobs = await Job.aggregate(pipeline)

    // Get total count for pagination
    const countPipeline = pipeline.slice(0, -2) // Remove skip and limit
    countPipeline.push({ $count: "total" })
    const countResult = await Job.aggregate(countPipeline)
    const total = countResult[0]?.total || 0

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
