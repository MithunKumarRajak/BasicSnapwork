import { type NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/db"
import { Service } from "@/lib/server-models"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await dbConnect()

    const service = await Service.findById(params.id)
      .populate("provider", "name profileImage verificationStatus bio")
      .populate("reviews.user", "name profileImage")

    if (!service) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 })
    }

    return NextResponse.json(service)
  } catch (error) {
    console.error("Error fetching service:", error)
    return NextResponse.json({ error: "Failed to fetch service" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await dbConnect()

    const service = await Service.findById(params.id)

    if (!service) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 })
    }

    if (service.provider.toString() !== session.user.id) {
      return NextResponse.json({ error: "Not authorized to update this service" }, { status: 403 })
    }

    const data = await request.json()

    const updatedService = await Service.findByIdAndUpdate(params.id, { $set: data }, { new: true })

    return NextResponse.json(updatedService)
  } catch (error) {
    console.error("Error updating service:", error)
    return NextResponse.json({ error: "Failed to update service" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await dbConnect()

    const service = await Service.findById(params.id)

    if (!service) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 })
    }

    if (service.provider.toString() !== session.user.id) {
      return NextResponse.json({ error: "Not authorized to delete this service" }, { status: 403 })
    }

    await Service.findByIdAndDelete(params.id)

    return NextResponse.json({ message: "Service deleted successfully" })
  } catch (error) {
    console.error("Error deleting service:", error)
    return NextResponse.json({ error: "Failed to delete service" }, { status: 500 })
  }
}
