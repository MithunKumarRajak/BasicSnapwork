"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Clock, IndianRupee, User } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import VerificationBadge from "@/components/VerificationBadge"

interface Job {
  _id: string
  title: string
  description: string
  category: string
  budget: number
  location: string
  city?: string
  state?: string
  createdAt: string
  postedBy: {
    _id: string
    name: string
    profileImage?: string
    verificationStatus?: "unverified" | "pending" | "verified"
  }
}

// Demo jobs data
const demoJobs: Job[] = [
  {
    _id: "demo1",
    title: "Electrician needed for house wiring",
    description:
      "Need an experienced electrician to fix wiring issues in a 2BHK apartment. Must have 3+ years of experience and own tools.",
    category: "Electrician",
    budget: 1500,
    location: "Mumbai",
    city: "Mumbai",
    state: "Maharashtra",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    postedBy: {
      _id: "user1",
      name: "Rahul Sharma",
      verificationStatus: "verified",
    },
  },
  {
    _id: "demo2",
    title: "Plumber for bathroom renovation",
    description:
      "Looking for a skilled plumber to install new fixtures in bathroom renovation project. Work expected to take 2 days.",
    category: "Plumber",
    budget: 2000,
    location: "Delhi",
    city: "Delhi",
    state: "Delhi",
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    postedBy: {
      _id: "user2",
      name: "Priya Patel",
      verificationStatus: "verified",
    },
  },
  {
    _id: "demo3",
    title: "Carpenter needed for furniture assembly",
    description:
      "Need a carpenter to assemble 3 wardrobes and 2 beds. All materials will be provided. Looking for someone who can start immediately.",
    category: "Carpenter",
    budget: 1200,
    location: "Bangalore",
    city: "Bangalore",
    state: "Karnataka",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    postedBy: {
      _id: "user3",
      name: "Amit Kumar",
      verificationStatus: "pending",
    },
  },
  {
    _id: "demo4",
    title: "House cleaning service required",
    description:
      "Need thorough cleaning of 3BHK apartment including kitchen and bathrooms. Regular weekly service possible for the right candidate.",
    category: "Cleaning",
    budget: 800,
    location: "Hyderabad",
    city: "Hyderabad",
    state: "Telangana",
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // 12 hours ago
    postedBy: {
      _id: "user4",
      name: "Sneha Reddy",
      verificationStatus: "unverified",
    },
  },
  {
    _id: "demo5",
    title: "Painter for 2BHK apartment",
    description:
      "Looking for an experienced painter to paint a 2BHK apartment. Need to finish within 3 days. Paint will be provided.",
    category: "Painter",
    budget: 5000,
    location: "Chennai",
    city: "Chennai",
    state: "Tamil Nadu",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
    postedBy: {
      _id: "user5",
      name: "Karthik Rajan",
      verificationStatus: "verified",
    },
  },
  {
    _id: "demo6",
    title: "Gardener needed for lawn maintenance",
    description:
      "Need a gardener for regular maintenance of home garden. Tasks include mowing, trimming, and planting seasonal flowers.",
    category: "Gardening",
    budget: 600,
    location: "Pune",
    city: "Pune",
    state: "Maharashtra",
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
    postedBy: {
      _id: "user6",
      name: "Vikram Desai",
      verificationStatus: "pending",
    },
  },
]

export default function JobsList({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchJobs() {
      try {
        setLoading(true)

        // Filter demo jobs based on search parameters
        let filteredJobs = [...demoJobs]

        // Apply category filter
        if (searchParams.category) {
          const category = searchParams.category.toString()
          filteredJobs = filteredJobs.filter((job) => job.category.toLowerCase() === category.toLowerCase())
        }

        // Apply search query filter
        if (searchParams.q) {
          const query = searchParams.q.toString().toLowerCase()
          filteredJobs = filteredJobs.filter(
            (job) => job.title.toLowerCase().includes(query) || job.description.toLowerCase().includes(query),
          )
        }

        // Apply city filter
        if (searchParams.city) {
          const city = searchParams.city.toString().toLowerCase()
          filteredJobs = filteredJobs.filter((job) => job.city?.toLowerCase().includes(city))
        }

        // Apply state filter
        if (searchParams.state) {
          const state = searchParams.state.toString().toLowerCase()
          filteredJobs = filteredJobs.filter((job) => job.state?.toLowerCase().includes(state))
        }

        setJobs(filteredJobs)
      } catch (error) {
        console.error("Error processing jobs:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchJobs()
  }, [searchParams])

  if (loading) {
    return (
      <div className="grid gap-6 md:grid-cols-2">
        {Array.from({ length: 6 }).map((_, index) => (
          <Card key={index} className="overflow-hidden">
            <CardContent className="p-6">
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-full mb-4" />
              <div className="flex items-center space-x-2 mb-4">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-24" />
              </div>
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-2/3" />
            </CardContent>
            <CardFooter className="bg-secondary/50 p-6">
              <Skeleton className="h-10 w-full" />
            </CardFooter>
          </Card>
        ))}
      </div>
    )
  }

  if (jobs.length === 0) {
    return (
      <div className="rounded-lg border p-8 text-center">
        <h3 className="mb-2 text-xl font-semibold">No jobs found</h3>
        <p className="mb-4 text-muted-foreground">
          Try adjusting your search filters or check back later for new opportunities.
        </p>
        <Button asChild variant="outline">
          <Link href="/jobs">Clear Filters</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {jobs.map((job) => (
        <Card key={job._id} className="overflow-hidden">
          <CardContent className="p-6">
            <div className="mb-3 flex items-center justify-between">
              <Badge>{job.category}</Badge>
              <div className="flex items-center text-sm text-muted-foreground">
                <Clock className="mr-1 h-3 w-3" />
                {new Date(job.createdAt).toLocaleDateString()}
              </div>
            </div>
            <h3 className="mb-2 text-xl font-bold">{job.title}</h3>
            <div className="mb-4 flex flex-wrap gap-2">
              <div className="flex items-center text-sm text-muted-foreground">
                <MapPin className="mr-1 h-3 w-3" />
                {job.city || ""}
                {job.city && job.state && ", "}
                {job.state || job.location}
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <IndianRupee className="mr-1 h-3 w-3" />₹{job.budget.toLocaleString("en-IN")}
              </div>
            </div>
            <p className="text-sm text-muted-foreground line-clamp-3">{job.description}</p>

            <div className="mt-4 flex items-center text-sm">
              <User className="mr-1 h-3 w-3 text-muted-foreground" />
              <span className="text-muted-foreground">Posted by: {job.postedBy.name}</span>
              {job.postedBy.verificationStatus && (
                <span className="ml-1">
                  <VerificationBadge status={job.postedBy.verificationStatus} size="sm" />
                </span>
              )}
            </div>
          </CardContent>
          <CardFooter className="bg-secondary/50 p-6">
            <Button asChild className="w-full">
              <Link href={`/jobs/${job._id}`}>View Details</Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
