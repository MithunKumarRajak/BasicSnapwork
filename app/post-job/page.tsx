import PostJobForm from "@/components/PostJobForm"

export const metadata = {
  title: "Post a Job - SnapWork",
  description: "Post a new job or gig on SnapWork",
}

export default function PostJobPage() {
  return (
    <div className="container mx-auto px-4 py-8 md:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-6 text-3xl font-bold">Post a Job</h1>
        <PostJobForm />
      </div>
    </div>
  )
}
