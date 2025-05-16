"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { MapPin, Clock, IndianRupee, ArrowRight } from "lucide-react"
import VerificationBadge from "@/components/VerificationBadge"

interface Job {
  _id: string
  title: string
  description: string
  category: string
  budget: number
  location: string
  createdAt: string
  postedBy: {
    _id: string
    name: string
    profileImage?: string
    verificationStatus?: "unverified" | "pending" | "verified"
  }
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

export default function FeaturedJobs() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchFeaturedJobs() {
      try {
        const response = await fetch("/api/jobs?featured=true&limit=6")
        if (!response.ok) {
          throw new Error("Failed to fetch featured jobs")
        }
        const data = await response.json()
        setJobs(data)
      } catch (error) {
        console.error("Error fetching featured jobs:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchFeaturedJobs()
  }, [])

  return (
    <section className="py-16 bg-gradient-to-b from-purple-50 to-white dark:from-gray-900 dark:to-gray-950">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold mb-4">
            <span className="text-gradient">Featured Jobs</span>
          </h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Discover the latest job opportunities from verified employers across India. Find work that matches your
            skills and location.
          </p>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <Card key={index} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="p-6 space-y-4">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <div className="flex items-center space-x-2">
                      <Skeleton className="h-4 w-4 rounded-full" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="p-6 pt-0 border-t">
                  <Skeleton className="h-10 w-full" />
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <>
            <motion.div
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {jobs.map((job) => (
                <motion.div key={job._id} variants={item} whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
                  <Card className="h-full overflow-hidden border-2 border-transparent hover:border-primary/20 transition-all duration-300 shadow-md hover:shadow-xl">
                    <CardContent className="p-0">
                      <div className="p-6 space-y-4">
                        <div className="flex justify-between items-start">
                          <h3 className="font-semibold text-lg line-clamp-2">{job.title}</h3>
                          <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                            {job.category}
                          </Badge>
                        </div>

                        <p className="text-sm text-muted-foreground line-clamp-2">{job.description}</p>

                        <div className="flex flex-wrap gap-2 text-sm">
                          <div className="flex items-center text-muted-foreground">
                            <MapPin className="h-4 w-4 mr-1" />
                            <span>{job.location}</span>
                          </div>
                          <div className="flex items-center text-muted-foreground">
                            <Clock className="h-4 w-4 mr-1" />
                            <span>{new Date(job.createdAt).toLocaleDateString("en-IN")}</span>
                          </div>
                          <div className="flex items-center font-medium text-primary">
                            <IndianRupee className="h-4 w-4 mr-1" />
                            <span>{job.budget.toLocaleString("en-IN")}</span>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-medium">
                            {job.postedBy.name.charAt(0)}
                          </div>
                          <div className="flex items-center">
                            <span className="text-sm font-medium">{job.postedBy.name}</span>
                            {job.postedBy.verificationStatus && (
                              <span className="ml-1">
                                <VerificationBadge status={job.postedBy.verificationStatus} />
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="p-6 pt-0 border-t">
                      <Button asChild className="w-full button-gradient">
                        <Link href={`/jobs/${job._id}`}>
                          View Details <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="mt-12 text-center"
            >
              <Button asChild size="lg" className="button-gradient">
                <Link href="/jobs">
                  View All Jobs <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </motion.div>
          </>
        )}
      </div>
    </section>
  )
}
