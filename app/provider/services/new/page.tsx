import { createServiceAction } from "@/app/actions/service-actions"
import ServiceForm from "@/components/service-form"

export default function NewServicePage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Create New Service</h1>
      <ServiceForm action={createServiceAction} />
    </div>
  )
}
