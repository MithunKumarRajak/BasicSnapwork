import { NextResponse } from "next/server"
import dbConnect from "@/lib/db"
import Job from "@/models/Job"

export async function GET(request: Request) {
  try {
    await dbConnect()

    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const category = searchParams.get("category")
    const city = searchParams.get("city")
    const minBudget = searchParams.get("minBudget")
    const maxBudget = searchParams.get("maxBudget")

    const query: any = { status: "open" }

    if (category) {
      query.category = category
    }

    if (city) {
      query["location.city"] = city
    }

    if (minBudget || maxBudget) {
      query["budget.min"] = {}
      if (minBudget) query["budget.min"].$gte = Number.parseInt(minBudget)
      if (maxBudget) query["budget.max"] = { $lte: Number.parseInt(maxBudget) }
    }

    const jobs = await Job.find(query)
      .populate("postedBy", "name")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)

    const total = await Job.countDocuments(query)

    return NextResponse.json({
      jobs,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching jobs:", error)
    return NextResponse.json({ error: "Failed to fetch jobs" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect()

    const body = await request.json()
    const { title, description, category, minBudget, maxBudget, city, state, postedBy } = body

    if (!title || !description || !category || !minBudget || !maxBudget || !city || !state || !postedBy) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const job = new Job({
      title,
      description,
      category,
      budget: {
        min: minBudget,
        max: maxBudget,
      },
      location: {
        city,
        state,
      },
      postedBy,
    })

    await job.save()

    return NextResponse.json({ job }, { status: 201 })
  } catch (error) {
    console.error("Error creating job:", error)
    return NextResponse.json({ error: "Failed to create job" }, { status: 500 })
  }
}
