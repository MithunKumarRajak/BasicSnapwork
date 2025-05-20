"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { MapPin, Calendar } from "lucide-react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"

interface Job {
  _id: string
  title: string
  description: string
  category: string
  budget: {
    min: number
    max: number
  }
  location: {
    city: string
    state: string
  }
  skills: string[]
  postedBy: {
    _id: string
    name: string
  }
  createdAt: string
  status: string
}

interface JobsListProps {
  searchParams: { [key: string]: string | string[] | undefined }
}

export default function JobsList({ searchParams }: JobsListProps) {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    pages: 1,
  })

  useEffect(() => {
    async function fetchJobs() {
      setLoading(true)
      setError(null)

      try {
        // Build query string from search params
        const queryParams = new URLSearchParams()

        if (searchParams.category) {
          queryParams.append("category", searchParams.category.toString())
        }

        if (searchParams.city) {
          queryParams.append("city", searchParams.city.toString())
        }

        if (searchParams.state) {
          queryParams.append("state", searchParams.state.toString())
        }

        if (searchParams.q) {
          queryParams.append("q", searchParams.q.toString())
        }

        if (searchParams.page) {
          queryParams.append("page", searchParams.page.toString())
        }

        const response = await fetch(`/api/jobs?${queryParams.toString()}`)

        if (!response.ok) {
          throw new Error("Failed to fetch jobs")
        }

        const data = await response.json()
        setJobs(data.jobs)
        setPagination(data.pagination)
      } catch (err) {
        console.error("Error fetching jobs:", err)
        setError("Failed to load jobs. Please try again.")
        setJobs([])
      } finally {
        setLoading(false)
      }
    }

    fetchJobs()
  }, [searchParams])

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <Card key={i} className="overflow-hidden">
            <CardContent className="p-0">
              <div className="p-6">
                <Skeleton className="h-6 w-2/3 mb-2" />
                <Skeleton className="h-4 w-1/4 mb-4" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4" />
                <div className="flex flex-wrap gap-2 mt-4">
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-6 w-24" />
                </div>
              </div>
              <div className="bg-muted p-4 flex justify-between items-center">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-9 w-24" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </CardContent>
      </Card>
    )
  }

  if (jobs.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <h3 className="text-lg font-medium mb-2">No jobs found</h3>
          <p className="text-muted-foreground mb-4">
            Try adjusting your search filters or check back later for new opportunities.
          </p>
          <Button asChild>
            <Link href="/jobs">Clear Filters</Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {jobs.map((job) => (
          <Card key={job._id} className="overflow-hidden hover:shadow-md transition-shadow">
            <CardContent className="p-0">
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <h3 className="text-xl font-semibold mb-1">
                    <Link href={`/jobs/${job._id}`} className="hover:text-primary transition-colors">
                      {job.title}
                    </Link>
                  </h3>
                  <Badge>{job.category}</Badge>
                </div>

                <div className="flex items-center text-muted-foreground text-sm mb-3">
                  <MapPin className="h-3.5 w-3.5 mr-1" />
                  <span>
                    {job.location.city}, {job.location.state}
                  </span>
                  <span className="mx-2">•</span>
                  <Calendar className="h-3.5 w-3.5 mr-1" />
                  <span>{formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}</span>
                </div>

                <p className="text-muted-foreground line-clamp-2 mb-4">{job.description}</p>

                <div className="flex flex-wrap gap-2">
                  {job.skills.slice(0, 3).map((skill) => (
                    <Badge key={skill} variant="outline">
                      {skill}
                    </Badge>
                  ))}
                  {job.skills.length > 3 && <Badge variant="outline">+{job.skills.length - 3} more</Badge>}
                </div>
              </div>

              <div className="bg-muted p-4 flex justify-between items-center">
                <div className="font-medium">
                  ₹{job.budget.min.toLocaleString()} - ₹{job.budget.max.toLocaleString()}
                </div>
                <Button asChild>
                  <Link href={`/jobs/${job._id}`}>View Details</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {pagination.pages > 1 && (
        <div className="flex justify-center mt-8">
          <div className="flex space-x-2">
            {pagination.page > 1 && (
              <Button variant="outline" asChild>
                <Link
                  href={{
                    pathname: "/jobs",
                    query: { ...searchParams, page: pagination.page - 1 },
                  }}
                >
                  Previous
                </Link>
              </Button>
            )}

            {Array.from({ length: pagination.pages }, (_, i) => i + 1)
              .filter(
                (page) =>
                  page === 1 ||
                  page === pagination.pages ||
                  (page >= pagination.page - 1 && page <= pagination.page + 1),
              )
              .map((page, i, arr) => {
                if (i > 0 && arr[i - 1] !== page - 1) {
                  return (
                    <div key={`ellipsis-${page}`} className="flex items-center">
                      <span className="px-2">...</span>
                      <Button variant={pagination.page === page ? "default" : "outline"} asChild>
                        <Link
                          href={{
                            pathname: "/jobs",
                            query: { ...searchParams, page },
                          }}
                        >
                          {page}
                        </Link>
                      </Button>
                    </div>
                  )
                }
                return (
                  <Button key={page} variant={pagination.page === page ? "default" : "outline"} asChild>
                    <Link
                      href={{
                        pathname: "/jobs",
                        query: { ...searchParams, page },
                      }}
                    >
                      {page}
                    </Link>
                  </Button>
                )
              })}

            {pagination.page < pagination.pages && (
              <Button variant="outline" asChild>
                <Link
                  href={{
                    pathname: "/jobs",
                    query: { ...searchParams, page: pagination.page + 1 },
                  }}
                >
                  Next
                </Link>
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
