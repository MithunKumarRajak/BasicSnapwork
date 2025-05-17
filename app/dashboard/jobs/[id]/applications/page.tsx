import { getServerSession } from "next-auth/next"
import { redirect, notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { authOptions } from "@/lib/auth"
import dbConnect from "@/lib/db"
import Job from "@/models/Job"
import Application from "@/models/Application"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { formatDistanceToNow } from "date-fns"
import { User } from "lucide-react"
import VerificationBadge from "@/components/VerificationBadge"
import ApplicationStatusButton from "@/components/ApplicationStatusButton"

export async function generateMetadata({ params }: { params: { id: string } }) {
  return {
    title: "Job Applications - SnapWork",
    description: "Review applications for your job posting",
  }
}

export default async function JobApplicationsPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect(`/login?callbackUrl=/dashboard/jobs/${params.id}/applications`)
  }

  await dbConnect()

  // Find the job and check if the current user is the owner
  const job = await Job.findById(params.id)

  if (!job) {
    notFound()
  }

  if (job.postedBy.toString() !== session.user.id) {
    redirect("/dashboard/jobs")
  }

  // Get all applications for this job
  const applications = await Application.find({ jobId: params.id })
    .populate("applicantId", "name email profileImage verificationStatus")
    .sort({ createdAt: -1 })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Applications</h1>
          <p className="text-muted-foreground">
            For job:{" "}
            <Link href={`/jobs/${params.id}`} className="text-primary hover:underline">
              {job.title}
            </Link>
          </p>
        </div>
        <Button asChild>
          <Link href={`/jobs/${params.id}`}>View Job</Link>
        </Button>
      </div>

      {applications.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <h3 className="text-lg font-semibold mb-2">No applications yet</h3>
            <p className="text-muted-foreground mb-4">
              Your job posting hasn't received any applications yet. Check back later or share your job posting.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {applications.map((application) => (
            <Card key={application._id.toString()}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-4">
                    <div className="relative h-12 w-12 overflow-hidden rounded-full bg-secondary">
                      {application.applicantId.profileImage ? (
                        <Image
                          src={application.applicantId.profileImage || "/placeholder.svg"}
                          alt={application.applicantId.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <User className="h-full w-full p-2 text-muted-foreground" />
                      )}
                    </div>
                    <div>
                      <CardTitle className="text-xl flex items-center gap-1">
                        {application.applicantId.name}
                        {application.applicantId.verificationStatus && (
                          <VerificationBadge status={application.applicantId.verificationStatus} size="sm" />
                        )}
                      </CardTitle>
                      <div className="flex items-center mt-1 space-x-2">
                        <Badge
                          variant={
                            application.status === "accepted"
                              ? "success"
                              : application.status === "rejected"
                                ? "destructive"
                                : application.status === "shortlisted"
                                  ? "default"
                                  : "secondary"
                          }
                        >
                          {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          Applied {formatDistanceToNow(new Date(application.createdAt), { addSuffix: true })}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="mb-4">
                  <h4 className="text-sm font-semibold mb-1">Cover Letter:</h4>
                  <p className="text-sm text-muted-foreground whitespace-pre-line">{application.coverLetter}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-semibold mb-1">Expected Rate:</h4>
                    <p className="text-sm">
                      {application.expectedRate
                        ? `₹${application.expectedRate.toLocaleString("en-IN")}`
                        : "Not specified"}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold mb-1">Availability:</h4>
                    <p className="text-sm">
                      {application.availability === "immediately"
                        ? "Immediately"
                        : application.availability === "within-week"
                          ? "Within a week"
                          : application.availability === "within-two-weeks"
                            ? "Within two weeks"
                            : application.availability === "within-month"
                              ? "Within a month"
                              : "Custom (See cover letter)"}
                    </p>
                  </div>
                </div>

                {application.notes && (
                  <div className="mt-4 p-3 bg-muted rounded-md">
                    <h4 className="text-sm font-semibold mb-1">Your Notes:</h4>
                    <p className="text-sm">{application.notes}</p>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button asChild variant="outline" size="sm">
                  <Link href={`/dashboard/applications/${application._id}`}>View Details</Link>
                </Button>
                <div className="flex space-x-2">
                  <ApplicationStatusButton
                    applicationId={application._id.toString()}
                    currentStatus={application.status}
                    jobStatus={job.status}
                  />
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
