"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { MapPin, DollarSign, Calendar, User, Briefcase } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface JobProps {
  job: {
    _id: string
    title: string
    description: string
    category: string
    budget: number
    location: string
    skills: string[]
    status: string
    createdAt: string
    postedBy: {
      _id: string
      name: string
      profileImage?: string
    }
  }
}

export default function JobDetails({ job }: JobProps) {
  const [application, setApplication] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!application.trim()) {
      toast({
        title: "Error",
        description: "Please enter your application message",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    // In a real app, you would submit the application to an API endpoint
    // For now, we'll just simulate a successful submission
    setTimeout(() => {
      toast({
        title: "Application Submitted",
        description: "Your application has been submitted successfully!",
      })
      setApplication("")
      setIsSubmitting(false)
    }, 1500)
  }

  return (
    <div className="container mx-auto px-4 py-8 md:px-6 lg:px-8">
      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <Badge>{job.category}</Badge>
              <Badge variant="outline">{job.status}</Badge>
            </div>
            <h1 className="text-3xl font-bold">{job.title}</h1>
            <div className="mt-2 flex flex-wrap gap-4">
              <div className="flex items-center text-muted-foreground">
                <MapPin className="mr-1 h-4 w-4" />
                {job.location}
              </div>
              <div className="flex items-center text-muted-foreground">
                <DollarSign className="mr-1 h-4 w-4" />${job.budget}
              </div>
              <div className="flex items-center text-muted-foreground">
                <Calendar className="mr-1 h-4 w-4" />
                Posted on {new Date(job.createdAt).toLocaleDateString()}
              </div>
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
                  <h3 className="font-medium">{job.postedBy.name}</h3>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Briefcase className="mr-1 h-3 w-3" />
                    Client
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h2 className="mb-4 text-xl font-semibold">Apply for this Job</h2>
              <form onSubmit={handleApply} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="application" className="text-sm font-medium">
                    Your Application
                  </label>
                  <Textarea
                    id="application"
                    placeholder="Introduce yourself and explain why you're a good fit for this job..."
                    rows={6}
                    value={application}
                    onChange={(e) => setApplication(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? "Submitting..." : "Submit Application"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
