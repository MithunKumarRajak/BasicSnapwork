import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import Link from "next/link"
import { authOptions } from "@/lib/auth"
import dbConnect from "@/lib/db"
import Job from "@/models/Job"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { formatDistanceToNow } from "date-fns"
import DeleteJobButton from "@/components/DeleteJobButton"

export const metadata = {
  title: "My Jobs - SnapWork",
  description: "Manage your posted jobs",
}

export default async function DashboardJobsPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login?callbackUrl=/dashboard/jobs")
  }

  await dbConnect()
  const jobs = await Job.find({ postedBy: session.user.id }).sort({ createdAt: -1 })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">My Jobs</h1>
        <Button asChild>
          <Link href="/post-job">Post a New Job</Link>
        </Button>
      </div>

      {jobs.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <h3 className="text-lg font-semibold mb-2">You haven't posted any jobs yet</h3>
            <p className="text-muted-foreground mb-4">Create your first job posting to find the perfect freelancer</p>
            <Button asChild>
              <Link href="/post-job">Post Your First Job</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {jobs.map((job) => (
            <Card key={job._id.toString()}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">{job.title}</CardTitle>
                    <div className="flex items-center mt-1 space-x-2">
                      <Badge>{job.category}</Badge>
                      <Badge variant="outline">{job.status}</Badge>
                      <span className="text-sm text-muted-foreground">
                        Posted {formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}
                      </span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pb-2">
                <p className="text-sm text-muted-foreground line-clamp-2">{job.description}</p>
                <div className="mt-2">
                  <p className="font-medium">Budget: ${job.budget}</p>
                  <p className="text-sm text-muted-foreground">Location: {job.location}</p>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button asChild variant="outline" size="sm">
                  <Link href={`/jobs/${job._id}`}>View Details</Link>
                </Button>
                <div className="flex space-x-2">
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/dashboard/jobs/edit/${job._id}`}>Edit</Link>
                  </Button>
                  <DeleteJobButton jobId={job._id.toString()} />
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
