"use server"

import { createBooking, getServiceById, updateBookingStatus } from "@/lib/db-service"
import type { Booking } from "@/lib/models"
import { ObjectId } from "mongodb"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

export async function createBookingAction(formData: FormData) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return { error: "You must be logged in to book a service" }
  }

  const serviceId = formData.get("serviceId") as string
  const date = new Date(formData.get("date") as string)
  const time = formData.get("time") as string
  const address = formData.get("address") as string
  const city = formData.get("city") as string
  const state = formData.get("state") as string
  const pincode = formData.get("pincode") as string
  const notes = formData.get("notes") as string

  if (!serviceId || !date || !time || !address || !city || !state || !pincode) {
    return { error: "All fields are required" }
  }

  const service = await getServiceById(serviceId)

  if (!service) {
    return { error: "Service not found" }
  }

  const newBooking: Omit<Booking, "_id"> = {
    serviceId: new ObjectId(serviceId),
    userId: new ObjectId(session.user.id),
    providerId: service.providerId,
    status: "pending",
    date,
    time,
    price: service.price,
    address,
    city,
    state,
    pincode,
    notes,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  await createBooking(newBooking)

  revalidatePath("/bookings")
  redirect("/bookings?success=Booking created successfully")
}

export async function updateBookingStatusAction(id: string, status: Booking["status"]) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return { error: "You must be logged in to update a booking" }
  }

  await updateBookingStatus(id, status)

  revalidatePath("/bookings")
  revalidatePath("/provider/bookings")

  return { success: "Booking status updated successfully" }
}
