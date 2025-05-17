"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"

interface JobApplicationFormProps {
  jobId: string
  jobTitle: string
}

export default function JobApplicationForm({ jobId, jobTitle }: JobApplicationFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    coverLetter: "",
    expectedRate: "",
    availability: "immediately",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.coverLetter.trim()) {
      toast({
        title: "Error",
        description: "Please provide a cover letter",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch(`/api/jobs/${jobId}/applications`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          coverLetter: formData.coverLetter,
          expectedRate: formData.expectedRate ? Number.parseFloat(formData.expectedRate) : undefined,
          availability: formData.availability,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to submit application")
      }

      toast({
        title: "Application Submitted",
        description: "Your application has been submitted successfully!",
      })

      // Redirect to applications page
      router.push("/dashboard/applications")
      router.refresh()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to submit application",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Apply for: {jobTitle}</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="coverLetter">Cover Letter</Label>
            <Textarea
              id="coverLetter"
              name="coverLetter"
              placeholder="Introduce yourself and explain why you're a good fit for this job..."
              rows={6}
              value={formData.coverLetter}
              onChange={handleChange}
              required
            />
            <p className="text-xs text-muted-foreground">
              Explain your experience, skills, and why you're interested in this job.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="expectedRate">Expected Rate (₹) (Optional)</Label>
            <Input
              id="expectedRate"
              name="expectedRate"
              type="number"
              placeholder="Your expected rate in ₹"
              value={formData.expectedRate}
              onChange={handleChange}
            />
            <p className="text-xs text-muted-foreground">Leave blank if you're comfortable with the posted budget.</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="availability">Availability</Label>
            <Select value={formData.availability} onValueChange={(value) => handleSelectChange("availability", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select your availability" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="immediately">Immediately</SelectItem>
                <SelectItem value="within-week">Within a week</SelectItem>
                <SelectItem value="within-two-weeks">Within two weeks</SelectItem>
                <SelectItem value="within-month">Within a month</SelectItem>
                <SelectItem value="custom">Custom (Specify in cover letter)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Application"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
