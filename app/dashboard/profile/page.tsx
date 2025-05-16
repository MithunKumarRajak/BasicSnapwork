import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import ProfileForm from "@/components/ProfileForm"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata = {
  title: "Profile - SnapWork",
  description: "Manage your SnapWork profile",
}

export default async function ProfilePage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login?callbackUrl=/dashboard/profile")
  }

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <h1 className="mb-6 text-3xl font-bold text-gradient">Your Profile</h1>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-1">
          <Card className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-slate-800 dark:to-slate-900 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-primary">Profile Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Complete your profile to increase your chances of getting hired or finding the right talent.
              </p>
              <div className="flex flex-col space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Profile Completion</span>
                  <span className="text-sm font-medium">70%</span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                    style={{ width: "70%" }}
                  ></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2">
          <Card className="shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-primary">Edit Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <ProfileForm userId={session.user.id} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
