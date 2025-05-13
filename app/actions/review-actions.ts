"use server"

import { createReview } from "@/lib/db-service"
import type { Review } from "@/lib/models"
import { ObjectId } from "mongodb"
import { revalidatePath } from "next/cache"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

export async function createReviewAction(formData: FormData) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return { error: "You must be logged in to leave a review" }
  }

  const serviceId = formData.get("serviceId") as string
  const rating = Number.parseInt(formData.get("rating") as string)
  const comment = formData.get("comment") as string

  if (!serviceId || isNaN(rating) || !comment) {
    return { error: "All fields are required" }
  }

  if (rating < 1 || rating > 5) {
    return { error: "Rating must be between 1 and 5" }
  }

  const newReview: Omit<Review, "_id"> = {
    serviceId: new ObjectId(serviceId),
    userId: new ObjectId(session.user.id),
    rating,
    comment,
    createdAt: new Date(),
  }

  await createReview(newReview)

  revalidatePath(`/service/${serviceId}`)

  return { success: "Review submitted successfully" }
}
