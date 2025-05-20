// This file contains server-side data fetching functions for the app directory
import "server-only"

import dbConnect from "@/lib/db"
import Job from "@/models/Job"
import User from "@/models/User"
import Service from "@/models/Service"

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

export async function getServices(limit = 10, category?: string) {
  await dbConnect()

  const query: any = { isActive: true }
  if (category) {
    query.category = category
  }

  return Service.find(query).limit(limit).lean()
}

export async function getCategories() {
  await dbConnect()
  return [
    { _id: "1", name: "Cleaning", slug: "cleaning" },
    { _id: "2", name: "Plumbing", slug: "plumbing" },
    { _id: "3", name: "Electrical", slug: "electrical" },
    { _id: "4", name: "Carpentry", slug: "carpentry" },
    { _id: "5", name: "Painting", slug: "painting" },
    { _id: "6", name: "Gardening", slug: "gardening" },
    { _id: "7", name: "Appliance Repair", slug: "appliance-repair" },
    { _id: "8", name: "Moving", slug: "moving" },
  ]
}

export async function getServiceById(id: string) {
  await dbConnect()
  return Service.findById(id).lean()
}

export async function getUserById(id: string) {
  await dbConnect()
  return User.findById(id).lean()
}

export async function getReviewsByService(serviceId: string) {
  await dbConnect()
  return [] // Replace with actual review fetching logic
}
