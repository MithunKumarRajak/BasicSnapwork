"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Clock, DollarSign } from "lucide-react"
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

export default function FeaturedJobs() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchJobs() {
      try {
        const response = await fetch("/api/jobs")
        const data = await response.json()
        setJobs(data)
      } catch (error) {
        console.error("Error fetching jobs:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchJobs()
  }, [])

  return (
    <section className="py-12 bg-secondary/50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold">Featured Jobs</h2>
          <p className="mt-2 text-muted-foreground">Discover the latest opportunities</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {loading
            ? Array.from({ length: 6 }).map((_, index) => (
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
              ))
            : jobs.map((job) => (
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
                        <DollarSign className="mr-1 h-3 w-3" />${job.budget}
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

        <div className="mt-8 text-center">
          <Button asChild variant="outline">
            <Link href="/jobs">View All Jobs</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
