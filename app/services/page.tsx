import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent } from "@/components/ui/card"
import ServiceCard from "@/components/service-card"
import { Search, Filter, Star } from "lucide-react"
import { getServices, getCategories } from "@/lib/db-service"

export default async function ServicesPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const category = typeof searchParams.category === "string" ? searchParams.category : undefined

  // Fetch data with error handling
  let services = []
  let categories = []

  try {
    services = await getServices(20, category)
  } catch (error) {
    console.error("Failed to fetch services:", error)
    // Continue with empty services array
  }

  try {
    categories = await getCategories()
  } catch (error) {
    console.error("Failed to fetch categories:", error)
    // Continue with empty categories array
  }

  return (
    <main className="container py-8">
      <div className="flex flex-col space-y-4">
        <h1 className="text-3xl font-bold">Find Services</h1>
        <p className="text-muted-foreground">Browse through our wide range of services</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
        <div className="md:col-span-1 space-y-6">
          <Card>
            <CardContent className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-lg">Filters</h2>
                <Button variant="ghost" size="sm" className="h-8 text-xs">
                  Reset All
                </Button>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium flex items-center">
                    <Filter className="h-4 w-4 mr-2" />
                    Category
                  </h3>
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
                  <div className="pt-2">
                    <Slider defaultValue={[0, 2000]} max={5000} step={100} />
                    <div className="flex items-center justify-between mt-2">
                      <div className="bg-background border rounded-md px-2 py-1 text-sm">₹0</div>
                      <div className="bg-background border rounded-md px-2 py-1 text-sm">₹5000+</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-medium flex items-center">
                    <Star className="h-4 w-4 mr-2" />
                    Rating
                  </h3>
                  <div className="space-y-2">
                    {[5, 4, 3, 2, 1].map((rating) => (
                      <div key={rating} className="flex items-center space-x-2">
                        <Checkbox id={`rating-${rating}`} />
                        <label htmlFor={`rating-${rating}`} className="text-sm flex items-center cursor-pointer">
                          {Array(rating)
                            .fill(0)
                            .map((_, i) => (
                              <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            ))}
                          {Array(5 - rating)
                            .fill(0)
                            .map((_, i) => (
                              <Star key={i} className="h-4 w-4 text-gray-300" />
                            ))}
                          <span className="ml-1">{rating}+ & up</span>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Availability</h3>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="available-now" />
                      <label htmlFor="available-now" className="text-sm cursor-pointer">
                        Available Now
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="weekend" />
                      <label htmlFor="weekend" className="text-sm cursor-pointer">
                        Weekend Availability
                      </label>
                    </div>
                  </div>
                </div>

                <Button className="w-full">Apply Filters</Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-3 space-y-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search services..." className="pl-8" />
                </div>
                <Select defaultValue="relevance">
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="relevance">Relevance</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                    <SelectItem value="newest">Newest First</SelectItem>
                  </SelectContent>
                </Select>
                <Button type="submit">Search</Button>
              </div>
            </CardContent>
          </Card>

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
