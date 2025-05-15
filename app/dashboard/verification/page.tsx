import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import VerificationForm from "@/components/VerificationForm"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Clock } from "lucide-react"
import dbConnect from "@/lib/db"
import User from "@/models/User"

export const metadata = {
  title: "Account Verification - SnapWork",
  description: "Verify your SnapWork account",
}

export default async function VerificationPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login?callbackUrl=/dashboard/verification")
  }

  await dbConnect()
  const user = await User.findById(session.user.id)
  const verificationStatus = user?.verificationStatus || "unverified"

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Account Verification</h1>

      {verificationStatus === "verified" ? (
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col items-center justify-center text-center py-6">
              <div className="rounded-full bg-green-100 p-3 mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-xl font-semibold mb-2">Your Account is Verified</h2>
              <p className="text-muted-foreground max-w-md">
                Congratulations! Your account has been verified. You now have full access to all features on SnapWork.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : verificationStatus === "pending" ? (
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col items-center justify-center text-center py-6">
              <div className="rounded-full bg-amber-100 p-3 mb-4">
                <Clock className="h-8 w-8 text-amber-600" />
              </div>
              <h2 className="text-xl font-semibold mb-2">Verification in Progress</h2>
              <p className="text-muted-foreground max-w-md">
                Your verification documents are currently being reviewed. This process typically takes 1-2 business
                days. We'll notify you once the verification is complete.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Why Verify Your Account?</CardTitle>
              <CardDescription>Verified accounts enjoy several benefits on SnapWork</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="flex flex-col items-center text-center p-4">
                  <div className="rounded-full bg-primary/10 p-3 mb-3">
                    <CheckCircle className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-medium mb-1">Build Trust</h3>
                  <p className="text-sm text-muted-foreground">
                    Verified badges help build trust with potential clients or employers
                  </p>
                </div>
                <div className="flex flex-col items-center text-center p-4">
                  <div className="rounded-full bg-primary/10 p-3 mb-3">
                    <CheckCircle className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-medium mb-1">More Opportunities</h3>
                  <p className="text-sm text-muted-foreground">
                    Many clients prefer to hire verified workers for their jobs
                  </p>
                </div>
                <div className="flex flex-col items-center text-center p-4">
                  <div className="rounded-full bg-primary/10 p-3 mb-3">
                    <CheckCircle className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-medium mb-1">Higher Visibility</h3>
                  <p className="text-sm text-muted-foreground">Verified accounts appear higher in search results</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <VerificationForm />
        </>
      )}
    </div>
  )
}
