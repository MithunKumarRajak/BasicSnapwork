"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { MapPin, Calendar, IndianRupee, Clock, User, Star } from "lucide-react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import VerificationBadge from "@/components/VerificationBadge"

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
  jobType: string
  experienceLevel: string
  isRemote: boolean
  isUrgent: boolean
  postedBy: {
    _id: string
    name: string
    verificationStatus?: "unverified" | "pending" | "verified"
    rating?: number
  }
  createdAt: string
  status: string
  applicationsCount?: number
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

        Object.entries(searchParams).forEach(([key, value]) => {
          if (value && value !== "") {
            queryParams.append(key, value.toString())
          }
        })

        const response = await fetch(`/api/jobs?${queryParams.toString()}`)

        if (!response.ok) {
          throw new Error("Failed to fetch jobs")
        }

        const data = await response.json()
        setJobs(data.jobs || [])
        setPagination(data.pagination || { total: 0, page: 1, limit: 10, pages: 1 })
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
                <div className="flex justify-between items-start mb-3">
                  <Skeleton className="h-6 w-2/3" />
                  <Skeleton className="h-6 w-20" />
                </div>
                <Skeleton className="h-4 w-1/3 mb-4" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4 mb-4" />
                <div className="flex flex-wrap gap-2">
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
      {/* Results Summary */}
      <div className="flex justify-between items-center">
        <p className="text-muted-foreground">
          Showing {jobs.length} of {pagination.total} jobs
        </p>
        <div className="flex gap-2">
          {Object.entries(searchParams).map(([key, value]) => {
            if (!value || value === "") return null
            return (
              <Badge key={key} variant="secondary" className="text-xs">
                {key}: {value}
              </Badge>
            )
          })}
        </div>
      </div>

      {/* Jobs List */}
      <div className="space-y-4">
        {jobs.map((job) => (
          <Card key={job._id} className="overflow-hidden hover:shadow-md transition-shadow">
            <CardContent className="p-0">
              <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-semibold">
                      <Link href={`/jobs/${job._id}`} className="hover:text-primary transition-colors">
                        {job.title}
                      </Link>
                    </h3>
                    {job.isUrgent && (
                      <Badge variant="destructive" className="text-xs">
                        Urgent
                      </Badge>
                    )}
                  </div>
                  <Badge>{job.category}</Badge>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-muted-foreground text-sm mb-3">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" />
                    <span>
                      {job.location.city}, {job.location.state}
                      {job.isRemote && " (Remote)"}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>{formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    <span>{job.jobType}</span>
                  </div>
                  {job.experienceLevel && (
                    <Badge variant="outline" className="text-xs">
                      {job.experienceLevel}
                    </Badge>
                  )}
                </div>

                <p className="text-muted-foreground line-clamp-2 mb-4">{job.description}</p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {job.skills.slice(0, 4).map((skill) => (
                    <Badge key={skill} variant="outline" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                  {job.skills.length > 4 && (
                    <Badge variant="outline" className="text-xs">
                      +{job.skills.length - 4} more
                    </Badge>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <User className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{job.postedBy.name}</span>
                      {job.postedBy.verificationStatus && (
                        <VerificationBadge status={job.postedBy.verificationStatus} size="sm" />
                      )}
                    </div>
                    {job.postedBy.rating && (
                      <div className="flex items-center gap-1">
                        <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm text-muted-foreground">{job.postedBy.rating.toFixed(1)}</span>
                      </div>
                    )}
                  </div>
                  {job.applicationsCount !== undefined && (
                    <span className="text-sm text-muted-foreground">{job.applicationsCount} applications</span>
                  )}
                </div>
              </div>

              <div className="bg-muted p-4 flex justify-between items-center">
                <div className="flex items-center gap-1 font-medium">
                  <IndianRupee className="h-4 w-4" />
                  <span>
                    {job.budget.min.toLocaleString()} - {job.budget.max.toLocaleString()}
                  </span>
                </div>
                <Button asChild>
                  <Link href={`/jobs/${job._id}`}>View Details</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination */}
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

            {Array.from({ length: Math.min(pagination.pages, 5) }, (_, i) => {
              const page = i + 1
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
