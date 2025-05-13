import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import ServiceCard from "@/components/service-card"
import { Search } from "lucide-react"
import { getServices, getCategories } from "@/lib/db-service"

export default async function ServicesPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const category = typeof searchParams.category === "string" ? searchParams.category : undefined
  const services = await getServices(20, category)
  const categories = await getCategories()

  return (
    <main className="container py-8">
      <div className="flex flex-col space-y-4">
        <h1 className="text-3xl font-bold">Find Services</h1>
        <p className="text-muted-foreground">Browse through our wide range of services</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
        <div className="md:col-span-1 space-y-6">
          <div className="border rounded-lg p-4 space-y-4">
            <h2 className="font-semibold text-lg">Filters</h2>

            <div className="space-y-2">
              <h3 className="text-sm font-medium">Category</h3>
              <Select defaultValue={category || "all"}>
                <SelectTrigger>
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat._id?.toString()} value={cat.slug}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium">Price Range</h3>
              <Slider defaultValue={[500]} max={2000} step={100} />
              <div className="flex items-center justify-between">
                <span className="text-sm">₹0</span>
                <span className="text-sm">₹2000+</span>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium">Rating</h3>
              <Select defaultValue="any">
                <SelectTrigger>
                  <SelectValue placeholder="Any Rating" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any Rating</SelectItem>
                  <SelectItem value="4plus">4+ Stars</SelectItem>
                  <SelectItem value="3plus">3+ Stars</SelectItem>
                  <SelectItem value="2plus">2+ Stars</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button className="w-full">Apply Filters</Button>
          </div>
        </div>

        <div className="md:col-span-3 space-y-6">
          <div className="flex items-center space-x-2">
            <Input placeholder="Search services..." className="flex-1" />
            <Button type="submit" size="icon">
              <Search className="h-4 w-4" />
              <span className="sr-only">Search</span>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.length > 0 ? (
              services.map((service) => (
                <ServiceCard
                  key={service._id?.toString()}
                  id={service._id?.toString() || ""}
                  title={service.title}
                  description={service.description}
                  price={service.price}
                  rating={service.rating || 0}
                  provider="Service Provider" // In a real app, fetch provider name
                  image={service.images[0] || "/placeholder.svg?height=200&width=300"}
                  category={service.category}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <h3 className="text-lg font-medium">No services found</h3>
                <p className="text-muted-foreground mt-2">Try adjusting your filters or search terms</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
