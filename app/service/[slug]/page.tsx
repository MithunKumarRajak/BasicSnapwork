import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Clock, MapPin, MessageSquare, Star, User } from "lucide-react"

export default function ServicePage({ params }: { params: { slug: string } }) {
  // This would normally fetch data based on the slug
  const service = {
    title: "Home Cleaning",
    description:
      "Professional home cleaning services at affordable rates. I provide thorough cleaning for all rooms in your home, including kitchens, bathrooms, bedrooms, and living areas. Services include dusting, vacuuming, mopping, and sanitizing surfaces.",
    price: "$25/hr",
    rating: 4.8,
    reviews: 124,
    provider: {
      name: "Maria S.",
      image: "/placeholder.svg?height=100&width=100",
      joined: "April 2022",
      completedJobs: 215,
      responseTime: "Within 1 hour",
    },
    category: "Household",
    location: "New York, NY",
    images: [
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
    ],
  }

  return (
    <main className="container py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Badge>{service.category}</Badge>
              <span className="text-muted-foreground">•</span>
              <div className="flex items-center text-muted-foreground text-sm">
                <MapPin className="h-3 w-3 mr-1" />
                {service.location}
              </div>
            </div>
            <h1 className="text-3xl font-bold">{service.title}</h1>
            <div className="flex items-center space-x-2">
              <div className="flex items-center">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="ml-1 font-medium">{service.rating}</span>
              </div>
              <span className="text-muted-foreground">•</span>
              <span className="text-muted-foreground">{service.reviews} reviews</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {service.images.map((image, index) => (
              <div
                key={index}
                className={`relative rounded-lg overflow-hidden ${index === 0 ? "col-span-2 aspect-video" : "aspect-square"}`}
              >
                <Image
                  src={image || "/placeholder.svg"}
                  alt={`${service.title} image ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>

          <Tabs defaultValue="description">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
              <TabsTrigger value="provider">Provider</TabsTrigger>
            </TabsList>
            <TabsContent value="description" className="space-y-4 pt-4">
              <p>{service.description}</p>
              <h3 className="font-semibold text-lg">What's included:</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>Deep cleaning of all rooms</li>
                <li>Dusting and vacuuming</li>
                <li>Bathroom and kitchen sanitization</li>
                <li>Floor mopping</li>
                <li>Window cleaning (interior)</li>
              </ul>
            </TabsContent>
            <TabsContent value="reviews" className="space-y-4 pt-4">
              <div className="space-y-4">
                {[1, 2, 3].map((review) => (
                  <Card key={review}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex items-start space-x-2">
                          <div className="rounded-full bg-slate-100 p-2">
                            <User className="h-4 w-4" />
                          </div>
                          <div>
                            <h4 className="font-medium">John Doe</h4>
                            <div className="flex items-center">
                              <div className="flex">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Star
                                    key={star}
                                    className={`h-3 w-3 ${star <= 5 ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                                  />
                                ))}
                              </div>
                              <span className="ml-2 text-xs text-muted-foreground">2 weeks ago</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <p className="mt-2 text-sm">
                        Great service! Maria was professional, thorough, and left my home spotless. Would definitely
                        hire again.
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <Button variant="outline" className="w-full">
                Load More Reviews
              </Button>
            </TabsContent>
            <TabsContent value="provider" className="space-y-4 pt-4">
              <div className="flex items-center space-x-4">
                <div className="relative h-16 w-16 rounded-full overflow-hidden">
                  <Image
                    src={service.provider.image || "/placeholder.svg"}
                    alt={service.provider.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{service.provider.name}</h3>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="h-3 w-3 mr-1" />
                    <span>Joined {service.provider.joined}</span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="flex items-center space-x-2">
                  <div className="rounded-full bg-primary/10 p-2">
                    <Star className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{service.rating} Rating</p>
                    <p className="text-xs text-muted-foreground">{service.reviews} reviews</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="rounded-full bg-primary/10 p-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-4 w-4 text-primary"
                    >
                      <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                      <path d="m9 12 2 2 4-4" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium">{service.provider.completedJobs}</p>
                    <p className="text-xs text-muted-foreground">Jobs completed</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="rounded-full bg-primary/10 p-2">
                    <Clock className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{service.provider.responseTime}</p>
                    <p className="text-xs text-muted-foreground">Response time</p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div className="md:col-span-1">
          <Card className="sticky top-8">
            <CardContent className="p-6 space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">{service.price}</h2>
                <Badge variant="outline">Per hour</Badge>
              </div>

              <div className="space-y-4 pt-4">
                <Button className="w-full">Book Now</Button>
                <Button variant="outline" className="w-full">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Contact Provider
                </Button>
              </div>

              <div className="pt-4 border-t">
                <h3 className="font-medium mb-2">Availability</h3>
                <p className="text-sm text-muted-foreground">Available Monday to Friday, 9 AM - 5 PM</p>
              </div>

              <div className="pt-4 border-t">
                <h3 className="font-medium mb-2">Service Location</h3>
                <p className="text-sm text-muted-foreground">
                  Service available in New York City and surrounding areas
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}
