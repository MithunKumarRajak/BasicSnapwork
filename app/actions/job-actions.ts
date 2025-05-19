"use server"

import { revalidatePath } from "next/cache"
import dbConnect from "@/lib/db"
import Job from "@/models/Job"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function createJob(formData: FormData) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return { success: false, error: "You must be logged in to create a job" }
    }

    await dbConnect()

    const title = formData.get("title") as string
    const description = formData.get("description") as string
    const category = formData.get("category") as string
    const minBudget = Number.parseInt(formData.get("minBudget") as string)
    const maxBudget = Number.parseInt(formData.get("maxBudget") as string)
    const city = formData.get("city") as string
    const state = formData.get("state") as string
    const duration = formData.get("duration") as string
    const skills = (formData.get("skills") as string).split(",").map((skill) => skill.trim())

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
      skills,
      duration,
      postedBy: session.user.id,
      status: "open",
      applications: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    await job.save()

    revalidatePath("/jobs")
    revalidatePath("/dashboard/jobs")

    return { success: true, jobId: job._id }
  } catch (error) {
    console.error("Error creating job:", error)
    return { success: false, error: "Failed to create job. Please try again." }
  }
}

export async function updateJobStatus(jobId: string, status: string) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return { success: false, error: "You must be logged in to update a job" }
    }

    await dbConnect()

    const job = await Job.findById(jobId)

    if (!job) {
      return { success: false, error: "Job not found" }
    }

    if (job.postedBy.toString() !== session.user.id) {
      return { success: false, error: "You are not authorized to update this job" }
    }

    job.status = status
    job.updatedAt = new Date()

    await job.save()

    revalidatePath(`/jobs/${jobId}`)
    revalidatePath("/dashboard/jobs")

    return { success: true }
  } catch (error) {
    console.error("Error updating job status:", error)
    return { success: false, error: "Failed to update job status. Please try again." }
  }
}

export async function deleteJob(jobId: string) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return { success: false, error: "You must be logged in to delete a job" }
    }

    await dbConnect()

    const job = await Job.findById(jobId)

    if (!job) {
      return { success: false, error: "Job not found" }
    }

    if (job.postedBy.toString() !== session.user.id) {
      return { success: false, error: "You are not authorized to delete this job" }
    }

    await Job.findByIdAndDelete(jobId)

    revalidatePath("/dashboard/jobs")

    return { success: true }
  } catch (error) {
    console.error("Error deleting job:", error)
    return { success: false, error: "Failed to delete job. Please try again." }
  }
}
