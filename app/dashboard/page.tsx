import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Briefcase, Plus, User, Settings } from "lucide-react"

export const metadata = {
  title: "Dashboard - SnapWork",
  description: "Manage your SnapWork account",
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login?callbackUrl=/dashboard")
  }

  return (
    <div className="container mx-auto px-4 py-8 md:px-6 lg:px-8">
      <h1 className="mb-6 text-3xl font-bold">Dashboard</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">My Profile</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{session.user.name}</div>
            <p className="text-xs text-muted-foreground">{session.user.email}</p>
            <div className="mt-4">
              <Button asChild variant="outline" size="sm">
                <Link href="/dashboard/profile">Edit Profile</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">My Jobs</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">Jobs posted or applied to</p>
            <div className="mt-4">
              <Button asChild variant="outline" size="sm">
                <Link href="/dashboard/jobs">View Jobs</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Post a Job</CardTitle>
            <Plus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-sm">Need help with a task? Post a job and find the right person.</p>
            <div className="mt-4">
              <Button asChild size="sm">
                <Link href="/post-job">Post a Job</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <h2 className="mb-4 text-xl font-semibold">Quick Actions</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Button asChild variant="outline" className="h-auto flex-col items-center justify-center p-6">
            <Link href="/dashboard/jobs">
              <Briefcase className="mb-2 h-6 w-6" />
              <span>My Jobs</span>
            </Link>
          </Button>
          <Button asChild variant="outline" className="h-auto flex-col items-center justify-center p-6">
            <Link href="/post-job">
              <Plus className="mb-2 h-6 w-6" />
              <span>Post a Job</span>
            </Link>
          </Button>
          <Button asChild variant="outline" className="h-auto flex-col items-center justify-center p-6">
            <Link href="/dashboard/profile">
              <User className="mb-2 h-6 w-6" />
              <span>Edit Profile</span>
            </Link>
          </Button>
          <Button asChild variant="outline" className="h-auto flex-col items-center justify-center p-6">
            <Link href="/dashboard/settings">
              <Settings className="mb-2 h-6 w-6" />
              <span>Settings</span>
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
