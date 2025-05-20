// This file contains server-side API utilities for the app directory
import "server-only"

import dbConnect from "@/lib/db"
import Job from "@/models/Job"
import User from "@/models/User"
import Application from "@/models/Application"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function getJobs(options: {
  category?: string
  city?: string
  state?: string
  query?: string
  page?: number
  limit?: number
}) {
  await dbConnect()

  const { category, city, state, query, page = 1, limit = 10 } = options
  const skip = (page - 1) * limit

  const queryObj: any = {}

  if (category) {
    queryObj.category = category
  }

  if (city) {
    queryObj["location.city"] = city
  }

  if (state) {
    queryObj["location.state"] = state
  }

  if (query) {
    queryObj.$or = [
      { title: { $regex: query, $options: "i" } },
      { description: { $regex: query, $options: "i" } },
      { skills: { $in: [new RegExp(query, "i")] } },
    ]
  }

  const jobs = await Job.find(queryObj)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate("postedBy", "name profileImage")
    .lean()

  const total = await Job.countDocuments(queryObj)

  return {
    jobs,
    pagination: {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    },
  }
}

export async function getJobById(id: string) {
  await dbConnect()
  return Job.findById(id).populate("postedBy", "name profileImage").lean()
}

export async function getUserById(id: string) {
  await dbConnect()
  return User.findById(id).lean()
}

export async function getApplicationsByJobId(jobId: string) {
  await dbConnect()
  return Application.find({ jobId }).populate("applicantId", "name profileImage").lean()
}

export async function getApplicationsByUserId(userId: string) {
  await dbConnect()
  return Application.find({ applicantId: userId }).populate("jobId").lean()
}

export async function createApplication(data: {
  jobId: string
  coverLetter: string
  expectedRate: number
  availability: string
}) {
  await dbConnect()
  const session = await getServerSession(authOptions)

  if (!session) {
    throw new Error("Unauthorized")
  }

  const application = new Application({
    ...data,
    applicantId: session.user.id,
    status: "pending",
  })

  await application.save()

  // Update the job with the new application
  await Job.findByIdAndUpdate(data.jobId, {
    $push: { applications: application._id },
  })

  return application
}
