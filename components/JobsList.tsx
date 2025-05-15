"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Clock, IndianRupee } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

interface Job {
  _id: string
  title: string
  description: string
  category: string
  budget: number
  location: string
  createdAt: string
  postedBy: {
    name: string
    profileImage?: string
  }
}

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
        const category = searchParams.category
        const search = searchParams.search

        let url = "/api/jobs"
        const params = new URLSearchParams()

        if (category) {
          params.append("category", category.toString())
        }

        if (search) {
          params.append("search", search.toString())
        }

        if (params.toString()) {
          url += `?${params.toString()}`
        }

        const response = await fetch(url)
        if (!response.ok) {
          throw new Error("Failed to fetch jobs")
        }
        const data = await response.json()
        setJobs(data)
      } catch (error) {
        console.error("Error fetching jobs:", error)
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
                {job.location}
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <IndianRupee className="mr-1 h-3 w-3" />₹{job.budget.toLocaleString("en-IN")}
              </div>
            </div>
            <p className="text-sm text-muted-foreground line-clamp-3">{job.description}</p>
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
