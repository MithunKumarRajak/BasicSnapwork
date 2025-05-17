"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, IndianRupee, Calendar, User, Briefcase, Clock } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import JobApplicationForm from "@/components/JobApplicationForm"
import VerificationBadge from "@/components/VerificationBadge"

interface JobProps {
  job: {
    _id: string
    title: string
    description: string
    category: string
    budget: number
    location: string
    city?: string
    state?: string
    skills: string[]
    status: string
    createdAt: string
    deadline?: string
    postedBy: {
      _id: string
      name: string
      profileImage?: string
      verificationStatus?: "unverified" | "pending" | "verified"
    }
    applications?: any[]
    hiredApplicant?: string
  }
  hasApplied?: boolean
}

export default function JobDetails({ job, hasApplied = false }: JobProps) {
  const { data: session } = useSession()
  const { toast } = useToast()
  const [showApplicationForm, setShowApplicationForm] = useState(false)

  const isJobPoster = session?.user?.id === job.postedBy._id
  const isJobOpen = job.status === "open"
  const canApply = !isJobPoster && isJobOpen && !hasApplied && session

  const handleApplyClick = () => {
    if (!session) {
      toast({
        title: "Login Required",
        description: "Please login to apply for this job",
        variant: "destructive",
      })
      return
    }

    setShowApplicationForm(true)
  }

  return (
    <div className="container mx-auto px-4 py-8 md:px-6 lg:px-8">
      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <Badge>{job.category}</Badge>
              <Badge variant={job.status === "open" ? "outline" : "secondary"}>
                {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
              </Badge>
            </div>
            <h1 className="text-3xl font-bold">{job.title}</h1>
            <div className="mt-2 flex flex-wrap gap-4">
              <div className="flex items-center text-muted-foreground">
                <MapPin className="mr-1 h-4 w-4" />
                {job.city || ""}
                {job.city && job.state && ", "}
                {job.state || job.location}
              </div>
              <div className="flex items-center text-muted-foreground">
                <IndianRupee className="mr-1 h-4 w-4" />₹{job.budget.toLocaleString("en-IN")}
              </div>
              <div className="flex items-center text-muted-foreground">
                <Calendar className="mr-1 h-4 w-4" />
                Posted on {new Date(job.createdAt).toLocaleDateString()}
              </div>
              {job.deadline && (
                <div className="flex items-center text-muted-foreground">
                  <Clock className="mr-1 h-4 w-4" />
                  Deadline: {new Date(job.deadline).toLocaleDateString()}
                </div>
              )}
            </div>
          </div>

          <Card>
            <CardContent className="p-6">
              <h2 className="mb-4 text-xl font-semibold">Job Description</h2>
              <div className="prose max-w-none">
                <p className="whitespace-pre-line">{job.description}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h2 className="mb-4 text-xl font-semibold">Required Skills</h2>
              <div className="flex flex-wrap gap-2">
                {job.skills && job.skills.length > 0 ? (
                  job.skills.map((skill, index) => (
                    <Badge key={index} variant="secondary">
                      {skill}
                    </Badge>
                  ))
                ) : (
                  <p className="text-muted-foreground">No specific skills required</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <h2 className="mb-4 text-xl font-semibold">About the Client</h2>
              <div className="flex items-center gap-4">
                <div className="relative h-12 w-12 overflow-hidden rounded-full bg-secondary">
                  {job.postedBy.profileImage ? (
                    <Image
                      src={job.postedBy.profileImage || "/placeholder.svg"}
                      alt={job.postedBy.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <User className="h-full w-full p-2 text-muted-foreground" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <h3 className="font-medium">{job.postedBy.name}</h3>
                    {job.postedBy.verificationStatus && (
                      <VerificationBadge status={job.postedBy.verificationStatus} size="sm" />
                    )}
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Briefcase className="mr-1 h-3 w-3" />
                    Client
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {isJobPoster ? (
            <Card>
              <CardContent className="p-6">
                <h2 className="mb-4 text-xl font-semibold">Job Management</h2>
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    You posted this job on {new Date(job.createdAt).toLocaleDateString()}.
                  </p>
                  <div className="flex flex-col gap-2">
                    <Button asChild>
                      <Link href={`/dashboard/jobs/${job._id}/applications`}>
                        View Applications {job.applications?.length > 0 && `(${job.applications.length})`}
                      </Link>
                    </Button>
                    <Button asChild variant="outline">
                      <Link href={`/dashboard/jobs/edit/${job._id}`}>Edit Job</Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : showApplicationForm ? (
            <JobApplicationForm jobId={job._id} jobTitle={job.title} />
          ) : (
            <Card>
              <CardContent className="p-6">
                <h2 className="mb-4 text-xl font-semibold">Apply for this Job</h2>
                {hasApplied ? (
                  <div className="text-center">
                    <p className="mb-4 text-green-600 font-medium">You have already applied to this job!</p>
                    <Button asChild variant="outline">
                      <Link href="/dashboard/applications">View Your Application</Link>
                    </Button>
                  </div>
                ) : job.status !== "open" ? (
                  <p className="text-center text-muted-foreground">This job is no longer accepting applications.</p>
                ) : (
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Interested in this job? Submit your application now to connect with the client.
                    </p>
                    <Button onClick={handleApplyClick} className="w-full" disabled={!canApply}>
                      {session ? "Apply Now" : "Login to Apply"}
                    </Button>
                    {!session && (
                      <p className="text-xs text-center text-muted-foreground">
                        <Link href={`/login?callbackUrl=/jobs/${job._id}`} className="text-primary hover:underline">
                          Login
                        </Link>{" "}
                        or{" "}
                        <Link href={`/register?callbackUrl=/jobs/${job._id}`} className="text-primary hover:underline">
                          Register
                        </Link>{" "}
                        to apply for this job.
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
