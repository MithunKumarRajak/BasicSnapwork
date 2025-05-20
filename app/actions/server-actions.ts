"use server"

import { revalidatePath } from "next/cache"
import dbConnect from "@/lib/db"
import Job from "@/models/Job"
import Application from "@/models/Application"
import { getServerSession } from "next-auth/next"
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

export async function applyForJob(formData: FormData) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return { success: false, error: "You must be logged in to apply for a job" }
    }

    await dbConnect()

    const jobId = formData.get("jobId") as string
    const coverLetter = formData.get("coverLetter") as string
    const expectedRate = Number.parseInt(formData.get("expectedRate") as string)
    const availability = formData.get("availability") as string

    // Check if user has already applied
    const existingApplication = await Application.findOne({
      jobId,
      applicantId: session.user.id,
    })

    if (existingApplication) {
      return { success: false, error: "You have already applied for this job" }
    }

    const application = new Application({
      jobId,
      applicantId: session.user.id,
      coverLetter,
      expectedRate,
      availability,
      status: "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    await application.save()

    // Update the job with the new application
    await Job.findByIdAndUpdate(jobId, {
      $push: { applications: application._id },
    })

    revalidatePath(`/jobs/${jobId}`)
    revalidatePath("/dashboard/applications")

    return { success: true, applicationId: application._id }
  } catch (error) {
    console.error("Error applying for job:", error)
    return { success: false, error: "Failed to apply for job. Please try again." }
  }
}
