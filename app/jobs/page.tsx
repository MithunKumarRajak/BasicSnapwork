import JobsList from "@/components/JobsList"
import JobFilters from "@/components/JobFilters"

export const metadata = {
  title: "Browse Jobs - SnapWork",
  description: "Find the perfect job or gig on SnapWork",
}

export default function JobsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  return (
    <div className="container mx-auto px-4 py-8 md:px-6 lg:px-8">
      <h1 className="mb-6 text-3xl font-bold">Browse Jobs</h1>

      <div className="grid gap-6 md:grid-cols-4">
        <div className="md:col-span-1">
          <JobFilters />
        </div>
        <div className="md:col-span-3">
          <JobsList searchParams={searchParams} />
        </div>
      </div>
    </div>
  )
}
