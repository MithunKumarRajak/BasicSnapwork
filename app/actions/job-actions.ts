"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import dbConnect from "@/lib/db"
import Job from "@/models/Job"
import { ObjectId } from "mongodb"

export async function createJobAction(formData: FormData) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return { error: "You must be logged in to create a job" }
    }

    await dbConnect()

    // Extract form data
    const title = formData.get("title") as string
    const description = formData.get("description") as string
    const category = formData.get("category") as string
    const minBudget = Number.parseInt(formData.get("minBudget") as string)
    const maxBudget = Number.parseInt(formData.get("maxBudget") as string)
    const city = formData.get("city") as string
    const state = formData.get("state") as string
    const address = formData.get("address") as string
    const duration = formData.get("duration") as string
    const skills = (formData.get("skills") as string).split(",").map((skill) => skill.trim())

    // Validate required fields
    if (!title || !description || !category || !minBudget || !maxBudget || !city || !state || !duration) {
      return { error: "Please fill in all required fields" }
    }

    // Create job
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
        address,
      },
      skills,
      duration,
      postedBy: new ObjectId(session.user.id),
      status: "open",
      applications: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    await job.save()

    // Revalidate jobs page
    revalidatePath("/jobs")
    revalidatePath("/dashboard/jobs")

    // Redirect to job page
    redirect(`/jobs/${job._id}`)
  } catch (error) {
    console.error("Error creating job:", error)
    return { error: "Failed to create job. Please try again." }
  }
}

export async function updateJobAction(jobId: string, formData: FormData) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return { error: "You must be logged in to update a job" }
    }

    await dbConnect()

    // Find job
    const job = await Job.findById(jobId)

    if (!job) {
      return { error: "Job not found" }
    }

    // Check if user is the job poster
    if (job.postedBy.toString() !== session.user.id) {
      return { error: "You are not authorized to update this job" }
    }

    // Extract form data
    const title = formData.get("title") as string
    const description = formData.get("description") as string
    const category = formData.get("category") as string
    const minBudget = Number.parseInt(formData.get("minBudget") as string)
    const maxBudget = Number.parseInt(formData.get("maxBudget") as string)
    const city = formData.get("city") as string
    const state = formData.get("state") as string
    const address = formData.get("address") as string
    const duration = formData.get("duration") as string
    const skills = (formData.get("skills") as string).split(",").map((skill) => skill.trim())
    const status = formData.get("status") as string

    // Validate required fields
    if (!title || !description || !category || !minBudget || !maxBudget || !city || !state || !duration) {
      return { error: "Please fill in all required fields" }
    }

    // Update job
    job.title = title
    job.description = description
    job.category = category
    job.budget.min = minBudget
    job.budget.max = maxBudget
    job.location.city = city
    job.location.state = state
    job.location.address = address
    job.skills = skills
    job.duration = duration
    if (status && ["open", "in-progress", "completed", "cancelled"].includes(status)) {
      job.status = status as "open" | "in-progress" | "completed" | "cancelled"
    }
    job.updatedAt = new Date()

    await job.save()

    // Revalidate job pages
    revalidatePath(`/jobs/${jobId}`)
    revalidatePath("/jobs")
    revalidatePath("/dashboard/jobs")

    return { success: true, message: "Job updated successfully" }
  } catch (error) {
    console.error("Error updating job:", error)
    return { error: "Failed to update job. Please try again." }
  }
}

export async function deleteJobAction(jobId: string) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return { error: "You must be logged in to delete a job" }
    }

    await dbConnect()

    // Find job
    const job = await Job.findById(jobId)

    if (!job) {
      return { error: "Job not found" }
    }

    // Check if user is the job poster
    if (job.postedBy.toString() !== session.user.id) {
      return { error: "You are not authorized to delete this job" }
    }

    // Delete job
    await Job.findByIdAndDelete(jobId)

    // Revalidate jobs page
    revalidatePath("/jobs")
    revalidatePath("/dashboard/jobs")

    // Redirect to dashboard
    redirect("/dashboard/jobs")
  } catch (error) {
    console.error("Error deleting job:", error)
    return { error: "Failed to delete job. Please try again." }
  }
}
