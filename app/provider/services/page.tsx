import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { getServicesByProvider } from "@/lib/db-service"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { Star, Edit } from "lucide-react"
import { updateService } from "@/lib/db-service"

export default async function ProviderServicesPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/sign-in?callbackUrl=/provider/services")
  }

  if (session.user.role !== "provider") {
    redirect("/")
  }

  const services = await getServicesByProvider(session.user.id)

  return (
    <div className="container py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Services</h1>
        <Button asChild>
          <Link href="/provider/services/new">Add New Service</Link>
        </Button>
      </div>

      {services.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-xl font-medium mb-2">No services found</h2>
          <p className="text-muted-foreground mb-6">You haven't created any services yet.</p>
          <Button asChild>
            <Link href="/provider/services/new">Create Your First Service</Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <Card key={service._id?.toString()} className="flex flex-col">
              <div className="aspect-video relative">
                <Image
                  src={service.images[0] || "/placeholder.svg?height=200&width=300"}
                  alt={service.title}
                  fill
                  className="object-cover rounded-t-lg"
                />
                <Badge className="absolute top-2 right-2">{service.category}</Badge>
              </div>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">{service.title}</CardTitle>
                <div className="flex items-center">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="ml-1 text-sm font-medium">{service.rating?.toFixed(1) || "New"}</span>
                  <span className="mx-2 text-muted-foreground">•</span>
                  <span className="text-sm text-muted-foreground">{service.reviewCount || 0} reviews</span>
                </div>
              </CardHeader>
              <CardContent className="pb-2">
                <p className="text-sm text-muted-foreground line-clamp-2">{service.description}</p>
                <p className="font-bold mt-2">₹{service.price.toLocaleString("en-IN")}/hr</p>
              </CardContent>
              <CardFooter className="flex justify-between mt-auto">
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/service/${service._id}`}>View</Link>
                </Button>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/provider/services/edit/${service._id}`}>
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Link>
                  </Button>
                  <form
                    action={async () => {
                      "use server"
                      // Toggle active status
                      const updatedService = {
                        isActive: !service.isActive,
                        updatedAt: new Date(),
                      }
                      await updateService(service._id!.toString(), updatedService)
                    }}
                  >
                    <Button variant={service.isActive ? "outline" : "default"} size="sm" type="submit">
                      {service.isActive ? "Deactivate" : "Activate"}
                    </Button>
                  </form>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
