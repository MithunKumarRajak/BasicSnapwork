import { notFound } from "next/navigation"
import { getServerSession } from "next-auth/next"
import JobDetails from "@/components/JobDetails"
import dbConnect from "@/lib/db"
import Job from "@/models/Job"
import Application from "@/models/Application"
import { authOptions } from "@/lib/auth"

export async function generateMetadata({ params }: { params: { id: string } }) {
  await dbConnect()

  try {
    const job = await Job.findById(params.id)

    if (!job) {
      return {
        title: "Job Not Found - SnapWork",
        description: "The job you're looking for doesn't exist or has been removed.",
      }
    }

    return {
      title: `${job.title} - SnapWork`,
      description: job.description.substring(0, 160),
    }
  } catch (error) {
    return {
      title: "Job Details - SnapWork",
      description: "View job details and apply on SnapWork",
    }
  }
}

export default async function JobPage({ params }: { params: { id: string } }) {
  await dbConnect()

  try {
    const job = await Job.findById(params.id).populate("postedBy", "name profileImage verificationStatus")

    if (!job) {
      notFound()
    }

    // Check if the current user has already applied
    const session = await getServerSession(authOptions)
    let hasApplied = false

    if (session) {
      const application = await Application.findOne({
        jobId: params.id,
        applicantId: session.user.id,
      })
      hasApplied = !!application
    }

    return <JobDetails job={JSON.parse(JSON.stringify(job))} hasApplied={hasApplied} />
  } catch (error) {
    console.error("Error fetching job:", error)
    notFound()
  }
}
