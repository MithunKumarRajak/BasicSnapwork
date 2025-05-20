"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import dbConnect from "@/lib/db"
import Service from "@/models/Service"
import { ObjectId } from "mongodb"

export async function createServiceAction(formData: FormData) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return { error: "You must be logged in to create a service" }
    }

    await dbConnect()

    // Extract form data
    const title = formData.get("title") as string
    const description = formData.get("description") as string
    const category = formData.get("category") as string
    const price = Number.parseFloat(formData.get("price") as string)
    const city = formData.get("city") as string
    const state = formData.get("state") as string
    const address = formData.get("address") as string
    const days = formData.getAll("days") as string[]
    const startTime = formData.get("startTime") as string
    const endTime = formData.get("endTime") as string
    const images = formData.getAll("images") as string[]

    // Validate required fields
    if (!title || !description || !category || !price || !city || !state) {
      return { error: "Please fill in all required fields" }
    }

    // Create service
    const service = new Service({
      title,
      description,
      category,
      price,
      location: {
        city,
        state,
        address,
      },
      provider: new ObjectId(session.user.id),
      images,
      availability: {
        days,
        hours: {
          start: startTime,
          end: endTime,
        },
      },
      rating: {
        average: 0,
        count: 0,
      },
      reviews: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    await service.save()

    // Revalidate services page
    revalidatePath("/services")
    revalidatePath("/provider/services")

    // Redirect to service page
    redirect(`/service/${service._id}`)
  } catch (error) {
    console.error("Error creating service:", error)
    return { error: "Failed to create service. Please try again." }
  }
}

export async function createService(serviceData: any) {
  try {
    await dbConnect()

    const newService = new Service({
      ...serviceData,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    await newService.save()

    return { success: true, serviceId: newService._id }
  } catch (error) {
    console.error("Error creating service:", error)
    return { success: false, error: "Failed to create service" }
  }
}

export async function updateServiceAction(serviceId: string, formData: FormData) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return { error: "You must be logged in to update a service" }
    }

    await dbConnect()

    // Find service
    const service = await Service.findById(serviceId)

    if (!service) {
      return { error: "Service not found" }
    }

    // Check if user is the service provider
    if (service.provider.toString() !== session.user.id) {
      return { error: "You are not authorized to update this service" }
    }

    // Extract form data
    const title = formData.get("title") as string
    const description = formData.get("description") as string
    const category = formData.get("category") as string
    const price = Number.parseFloat(formData.get("price") as string)
    const city = formData.get("city") as string
    const state = formData.get("state") as string
    const address = formData.get("address") as string
    const days = formData.getAll("days") as string[]
    const startTime = formData.get("startTime") as string
    const endTime = formData.get("endTime") as string
    const images = formData.getAll("images") as string[]

    // Validate required fields
    if (!title || !description || !category || !price || !city || !state) {
      return { error: "Please fill in all required fields" }
    }

    // Update service
    service.title = title
    service.description = description
    service.category = category
    service.price = price
    service.location.city = city
    service.location.state = state
    service.location.address = address
    service.availability.days = days
    service.availability.hours.start = startTime
    service.availability.hours.end = endTime
    if (images.length > 0) {
      service.images = images
    }
    service.updatedAt = new Date()

    await service.save()

    // Revalidate service pages
    revalidatePath(`/service/${serviceId}`)
    revalidatePath("/services")
    revalidatePath("/provider/services")

    return { success: true, message: "Service updated successfully" }
  } catch (error) {
    console.error("Error updating service:", error)
    return { error: "Failed to update service. Please try again." }
  }
}

export async function deleteServiceAction(serviceId: string) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return { error: "You must be logged in to delete a service" }
    }

    await dbConnect()

    // Find service
    const service = await Service.findById(serviceId)

    if (!service) {
      return { error: "Service not found" }
    }

    // Check if user is the service provider
    if (service.provider.toString() !== session.user.id) {
      return { error: "You are not authorized to delete this service" }
    }

    // Delete service
    await Service.findByIdAndDelete(serviceId)

    // Revalidate services page
    revalidatePath("/services")
    revalidatePath("/provider/services")

    // Redirect to dashboard
    redirect("/provider/services")
  } catch (error) {
    console.error("Error deleting service:", error)
    return { error: "Failed to delete service. Please try again." }
  }
}

export async function addReviewAction(serviceId: string, formData: FormData) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return { error: "You must be logged in to add a review" }
    }

    await dbConnect()

    // Find service
    const service = await Service.findById(serviceId)

    if (!service) {
      return { error: "Service not found" }
    }

    // Extract form data
    const rating = Number.parseInt(formData.get("rating") as string)
    const comment = formData.get("comment") as string

    // Validate required fields
    if (!rating || !comment) {
      return { error: "Please provide both rating and comment" }
    }

    // Check if user has already reviewed this service
    const existingReview = service.reviews.find((review) => review.user.toString() === session.user.id)

    if (existingReview) {
      return { error: "You have already reviewed this service" }
    }

    // Add review
    service.reviews.push({
      user: new ObjectId(session.user.id),
      rating,
      comment,
      createdAt: new Date(),
    })

    // Update service rating
    const totalRating = service.reviews.reduce((sum, review) => sum + review.rating, 0)
    service.rating.average = totalRating / service.reviews.length
    service.rating.count = service.reviews.length

    await service.save()

    // Revalidate service page
    revalidatePath(`/service/${serviceId}`)

    return { success: true, message: "Review added successfully" }
  } catch (error) {
    console.error("Error adding review:", error)
    return { error: "Failed to add review. Please try again." }
  }
}
