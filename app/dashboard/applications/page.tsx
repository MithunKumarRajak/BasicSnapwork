import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import Link from "next/link"
import { authOptions } from "@/lib/auth"
import dbConnect from "@/lib/db"
import Application from "@/models/Application"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { formatDistanceToNow } from "date-fns"
import WithdrawApplicationButton from "@/components/WithdrawApplicationButton"

export const metadata = {
  title: "My Applications - SnapWork",
  description: "Track your job applications",
}

export default async function MyApplicationsPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login?callbackUrl=/dashboard/applications")
  }

  await dbConnect()

  const applications = await Application.find({ applicantId: session.user.id })
    .populate("jobId", "title budget location status category postedBy")
    .sort({ createdAt: -1 })

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
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">My Applications</h1>
        <Button asChild>
          <Link href="/jobs">Browse Jobs</Link>
        </Button>
      </div>

      {applications.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <h3 className="text-lg font-semibold mb-2">You haven't applied to any jobs yet</h3>
            <p className="text-muted-foreground mb-4">Browse available jobs and submit your first application</p>
            <Button asChild>
              <Link href="/jobs">Browse Jobs</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {applications.map((application) => (
            <Card key={application._id.toString()}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">
                      <Link href={`/jobs/${application.jobId._id}`} className="hover:underline">
                        {application.jobId.title}
                      </Link>
                    </CardTitle>
                    <div className="flex items-center mt-1 space-x-2">
                      <Badge>{application.jobId.category}</Badge>
                      <Badge variant={getStatusBadgeVariant(application.status)}>
                        {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        Applied {formatDistanceToNow(new Date(application.createdAt), { addSuffix: true })}
                      </span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="mb-2">
                  <p className="font-medium">Budget: ₹{application.jobId.budget.toLocaleString("en-IN")}</p>
                  <p className="text-sm text-muted-foreground">Location: {application.jobId.location}</p>
                </div>

                <div className="mt-4">
                  <h4 className="text-sm font-semibold mb-1">Your Cover Letter:</h4>
                  <p className="text-sm text-muted-foreground line-clamp-2">{application.coverLetter}</p>
                </div>

                {application.notes && (
                  <div className="mt-4 p-3 bg-muted rounded-md">
                    <h4 className="text-sm font-semibold mb-1">Employer Notes:</h4>
                    <p className="text-sm">{application.notes}</p>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button asChild variant="outline" size="sm">
                  <Link href={`/jobs/${application.jobId._id}`}>View Job</Link>
                </Button>
                <div className="flex space-x-2">
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/dashboard/applications/${application._id}`}>View Details</Link>
                  </Button>
                  {application.status === "pending" && (
                    <WithdrawApplicationButton applicationId={application._id.toString()} />
                  )}
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
