"use server"

import { createService, updateService, getServiceById } from "@/lib/db-service"
import type { Service } from "@/lib/models"
import { ObjectId } from "mongodb"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

export async function createServiceAction(formData: FormData) {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== "provider") {
    return { error: "You must be logged in as a provider to create a service" }
  }

  const title = formData.get("title") as string
  const description = formData.get("description") as string
  const price = Number.parseFloat(formData.get("price") as string)
  const category = formData.get("category") as string
  const location = formData.get("location") as string
  const images = [formData.get("image") as string] // In a real app, handle multiple image uploads

  if (!title || !description || isNaN(price) || !category || !location) {
    return { error: "All fields are required" }
  }

  const newService: Omit<Service, "_id"> = {
    title,
    description,
    price,
    category,
    providerId: new ObjectId(session.user.id),
    location,
    images,
    createdAt: new Date(),
    updatedAt: new Date(),
    isActive: true,
  }

  await createService(newService)

  revalidatePath("/services")
  redirect("/provider/services")
}

export async function updateServiceAction(id: string, formData: FormData) {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== "provider") {
    return { error: "You must be logged in as a provider to update a service" }
  }

  const service = await getServiceById(id)

  if (!service) {
    return { error: "Service not found" }
  }

  if (service.providerId.toString() !== session.user.id) {
    return { error: "You can only update your own services" }
  }

  const title = formData.get("title") as string
  const description = formData.get("description") as string
  const price = Number.parseFloat(formData.get("price") as string)
  const category = formData.get("category") as string
  const location = formData.get("location") as string
  const isActive = formData.get("isActive") === "true"

  const updatedService: Partial<Service> = {
    title,
    description,
    price,
    category,
    location,
    updatedAt: new Date(),
    isActive,
  }

  await updateService(id, updatedService)

  revalidatePath(`/service/${id}`)
  revalidatePath("/services")
  redirect("/provider/services")
}
