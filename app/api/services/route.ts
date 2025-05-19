import { type NextRequest, NextResponse } from "next/server"
import { getCollection } from "@/lib/db-service"
import { ObjectId } from "mongodb"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    // Parse query parameters
    const category = searchParams.get("category")
    const featured = searchParams.get("featured") === "true"
    const minPrice = searchParams.get("minPrice") ? Number.parseInt(searchParams.get("minPrice")!) : undefined
    const maxPrice = searchParams.get("maxPrice") ? Number.parseInt(searchParams.get("maxPrice")!) : undefined
    const minRating = searchParams.get("minRating") ? Number.parseFloat(searchParams.get("minRating")!) : undefined
    const limit = searchParams.get("limit") ? Number.parseInt(searchParams.get("limit")!) : 20
    const page = searchParams.get("page") ? Number.parseInt(searchParams.get("page")!) : 1
    const skip = (page - 1) * limit

    // Build query
    const query: any = { isActive: true }

    if (category) {
      query.category = category
    }

    if (featured) {
      query.featured = true
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      query.price = {}
      if (minPrice !== undefined) query.price.$gte = minPrice
      if (maxPrice !== undefined) query.price.$lte = maxPrice
    }

    if (minRating !== undefined) {
      query.rating = { $gte: minRating }
    }

    // Get services collection
    const collection = await getCollection("services")

    // Execute query
    const services = await collection.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).toArray()

    // Get total count for pagination
    const total = await collection.countDocuments(query)

    return NextResponse.json(services, {
      headers: {
        "X-Total-Count": total.toString(),
        "X-Page": page.toString(),
        "X-Limit": limit.toString(),
        "X-Total-Pages": Math.ceil(total / limit).toString(),
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
    const requiredFields = ["title", "description", "price", "category", "location"]
    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 })
      }
    }

    // Create service object
    const service = {
      ...data,
      providerId: new ObjectId(session.user.id),
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true,
      rating: 0,
      reviewCount: 0,
      images: data.images || [],
    }

    // Insert into database
    const collection = await getCollection("services")
    const result = await collection.insertOne(service)

    return NextResponse.json({
      _id: result.insertedId,
      ...service,
    })
  } catch (error) {
    console.error("Error creating service:", error)
    return NextResponse.json({ error: "Failed to create service" }, { status: 500 })
  }
}
