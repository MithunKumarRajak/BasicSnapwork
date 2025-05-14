import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import PostJobForm from "@/components/PostJobForm"

export const metadata = {
  title: "Post a Job - SnapWork",
  description: "Post a new job or gig on SnapWork",
}

export default async function PostJobPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login?callbackUrl=/post-job")
  }

  return (
    <div className="container mx-auto px-4 py-8 md:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-6 text-3xl font-bold">Post a Job</h1>
        <PostJobForm userId={session.user.id} />
      </div>
    </div>
  )
}
