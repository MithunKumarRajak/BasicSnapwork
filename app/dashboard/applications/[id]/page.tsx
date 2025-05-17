import { getServerSession } from "next-auth/next"
import { redirect, notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { authOptions } from "@/lib/auth"
import dbConnect from "@/lib/db"
import Application from "@/models/Application"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { formatDistanceToNow } from "date-fns"
import { MapPin, IndianRupee, Calendar, User, Briefcase } from "lucide-react"
import WithdrawApplicationButton from "@/components/WithdrawApplicationButton"
import VerificationBadge from "@/components/VerificationBadge"
import ApplicationStatusButton from "@/components/ApplicationStatusButton"

export const metadata = {
  title: "Application Details - SnapWork",
  description: "View details of your job application",
}

export default async function ApplicationDetailsPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect(`/login?callbackUrl=/dashboard/applications/${params.id}`)
  }

  await dbConnect()

  const application = await Application.findById(params.id)
    .populate("applicantId", "name email profileImage verificationStatus")
    .populate({
      path: "jobId",
      populate: {
        path: "postedBy",
        select: "name profileImage verificationStatus",
      },
    })

  if (!application) {
    notFound()
  }

  // Check if user is either the applicant or the job poster
  const isApplicant = application.applicantId._id.toString() === session.user.id
  const isJobPoster = application.jobId.postedBy._id.toString() === session.user.id

  if (!isApplicant && !isJobPoster) {
    redirect("/dashboard")
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "accepted":
        return "success"
      case "rejected":
        return "destructive"
      case "shortlisted":
        return "default"
      default:
        return "secondary"
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 md:px-6 lg:px-8">
      <div className="mb-6">
        <Button asChild variant="outline" size="sm" className="mb-4">
          <Link href="/dashboard/applications">← Back to Applications</Link>
        </Button>
        <h1 className="text-3xl font-bold">Application Details</h1>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Job Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h2 className="text-xl font-semibold">
                  <Link href={`/jobs/${application.jobId._id}`} className="hover:underline">
                    {application.jobId.title}
                  </Link>
                </h2>
                <div className="flex flex-wrap gap-2 mt-2">
                  <Badge>{application.jobId.category}</Badge>
                  <Badge variant={application.jobId.status === "open" ? "outline" : "secondary"}>
                    {application.jobId.status.charAt(0).toUpperCase() + application.jobId.status.slice(1)}
                  </Badge>
                </div>
              </div>

              <div className="flex flex-wrap gap-4">
                <div className="flex items-center text-muted-foreground">
                  <MapPin className="mr-1 h-4 w-4" />
                  {application.jobId.location}
                </div>
                <div className="flex items-center text-muted-foreground">
                  <IndianRupee className="mr-1 h-4 w-4" />₹{application.jobId.budget.toLocaleString("en-IN")}
                </div>
                <div className="flex items-center text-muted-foreground">
                  <Calendar className="mr-1 h-4 w-4" />
                  Posted on {new Date(application.jobId.createdAt).toLocaleDateString()}
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2">Job Description</h3>
                <p className="text-muted-foreground whitespace-pre-line">{application.jobId.description}</p>
              </div>

              <div>
                <h3 className="font-medium mb-2">Required Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {application.jobId.skills && application.jobId.skills.length > 0 ? (
                    application.jobId.skills.map((skill: string, index: number) => (
                      <Badge key={index} variant="secondary">
                        {skill}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-muted-foreground">No specific skills required</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Application Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Status</h3>
                <Badge variant={getStatusBadgeVariant(application.status)}>
                  {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                </Badge>
                <p className="text-sm text-muted-foreground mt-2">
                  Applied {formatDistanceToNow(new Date(application.createdAt), { addSuffix: true })}
                </p>
              </div>

              <div>
                <h3 className="font-medium mb-2">Cover Letter</h3>
                <p className="text-muted-foreground whitespace-pre-line">{application.coverLetter}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium mb-2">Expected Rate</h3>
                  <p>
                    {application.expectedRate
                      ? `₹${application.expectedRate.toLocaleString("en-IN")}`
                      : "Not specified"}
                  </p>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Availability</h3>
                  <p>
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
                <div className="p-4 bg-muted rounded-md">
                  <h3 className="font-medium mb-2">Notes</h3>
                  <p className="whitespace-pre-line">{application.notes}</p>
                </div>
              )}
            </CardContent>
            <CardFooter>
              {isApplicant && application.status === "pending" && (
                <WithdrawApplicationButton applicationId={application._id.toString()} />
              )}
              {isJobPoster && (
                <ApplicationStatusButton
                  applicationId={application._id.toString()}
                  currentStatus={application.status}
                  jobStatus={application.jobId.status}
                />
              )}
            </CardFooter>
          </Card>
        </div>

        <div className="space-y-6">
          {isApplicant ? (
            <Card>
              <CardHeader>
                <CardTitle>About the Client</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <div className="relative h-12 w-12 overflow-hidden rounded-full bg-secondary">
                    {application.jobId.postedBy.profileImage ? (
                      <Image
                        src={application.jobId.postedBy.profileImage || "/placeholder.svg"}
                        alt={application.jobId.postedBy.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <User className="h-full w-full p-2 text-muted-foreground" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-1">
                      <h3 className="font-medium">{application.jobId.postedBy.name}</h3>
                      {application.jobId.postedBy.verificationStatus && (
                        <VerificationBadge status={application.jobId.postedBy.verificationStatus} size="sm" />
                      )}
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Briefcase className="mr-1 h-3 w-3" />
                      Client
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full">
                  <Link href={`/jobs/${application.jobId._id}`}>View Job</Link>
                </Button>
              </CardFooter>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>About the Applicant</CardTitle>
              </CardHeader>
              <CardContent>
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
                    <div className="flex items-center gap-1">
                      <h3 className="font-medium">{application.applicantId.name}</h3>
                      {application.applicantId.verificationStatus && (
                        <VerificationBadge status={application.applicantId.verificationStatus} size="sm" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{application.applicantId.email}</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full">
                  <Link href={`/dashboard/jobs/${application.jobId._id}/applications`}>View All Applications</Link>
                </Button>
              </CardFooter>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
