import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import dbConnect from "@/lib/db"
import Service from "@/models/Service"
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
      query.$or = [{ title: { $regex: q, $options: "i" } }, { description: { $regex: q, $options: "i" } }]
    }

    await dbConnect()

    // Execute query
    const services = await Service.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("provider", "name image")
      .lean()

    // Get total count for pagination
    const total = await Service.countDocuments(query)

    return NextResponse.json({
      services,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error in services API:", error)
    return NextResponse.json({ error: "Failed to fetch services" }, { status: 500 })
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
    const requiredFields = ["title", "description", "category", "price", "location"]
    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 })
      }
    }

    await dbConnect()

    // Create service object
    const service = new Service({
      ...data,
      provider: new ObjectId(session.user.id),
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    await service.save()

    return NextResponse.json(service)
  } catch (error) {
    console.error("Error creating service:", error)
    return NextResponse.json({ error: "Failed to create service" }, { status: 500 })
  }
}
