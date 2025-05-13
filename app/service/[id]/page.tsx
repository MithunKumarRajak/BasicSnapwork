import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Clock, MapPin, MessageSquare, Star, User } from "lucide-react"
import { getServiceById, getUserById, getReviewsByService } from "@/lib/db-service"
import { notFound } from "next/navigation"
import BookingForm from "@/components/booking-form"
import ReviewForm from "@/components/review-form"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

export default async function ServicePage({ params }: { params: { id: string } }) {
  const service = await getServiceById(params.id)

  if (!service) {
    notFound()
  }

  const provider = await getUserById(service.providerId.toString())
  const reviews = await getReviewsByService(params.id)
  const session = await getServerSession(authOptions)

  // Format price in Indian Rupees
  const formattedPrice = `₹${service.price.toLocaleString("en-IN")}`

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
                <span className="ml-1 font-medium">{service.rating?.toFixed(1) || "New"}</span>
              </div>
              <span className="text-muted-foreground">•</span>
              <span className="text-muted-foreground">{service.reviewCount || 0} reviews</span>
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
                <li>Professional service</li>
                <li>Quality work</li>
                <li>Timely completion</li>
                <li>Satisfaction guarantee</li>
              </ul>
            </TabsContent>
            <TabsContent value="reviews" className="space-y-4 pt-4">
              <div className="space-y-4">
                {reviews.length > 0 ? (
                  reviews.map((review) => (
                    <Card key={review._id?.toString()}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex items-start space-x-2">
                            <div className="rounded-full bg-slate-100 p-2">
                              <User className="h-4 w-4" />
                            </div>
                            <div>
                              <h4 className="font-medium">User</h4>
                              <div className="flex items-center">
                                <div className="flex">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                      key={star}
                                      className={`h-3 w-3 ${star <= review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                                    />
                                  ))}
                                </div>
                                <span className="ml-2 text-xs text-muted-foreground">
                                  {new Date(review.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <p className="mt-2 text-sm">{review.comment}</p>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <p>No reviews yet. Be the first to review this service!</p>
                )}
              </div>

              {session && session.user.id !== service.providerId.toString() && (
                <div className="mt-6 border-t pt-6">
                  <h3 className="font-semibold text-lg mb-4">Leave a Review</h3>
                  <ReviewForm serviceId={params.id} />
                </div>
              )}
            </TabsContent>
            <TabsContent value="provider" className="space-y-4 pt-4">
              <div className="flex items-center space-x-4">
                <div className="relative h-16 w-16 rounded-full overflow-hidden">
                  <Image
                    src={provider?.profileImage || "/placeholder.svg?height=100&width=100"}
                    alt={provider?.name || "Service Provider"}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{provider?.name || "Service Provider"}</h3>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="h-3 w-3 mr-1" />
                    <span>Joined {provider ? new Date(provider.createdAt).toLocaleDateString() : "Recently"}</span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="flex items-center space-x-2">
                  <div className="rounded-full bg-primary/10 p-2">
                    <Star className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{service.rating?.toFixed(1) || "New"} Rating</p>
                    <p className="text-xs text-muted-foreground">{service.reviewCount || 0} reviews</p>
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
                    <p className="text-sm font-medium">Verified Provider</p>
                    <p className="text-xs text-muted-foreground">ID Verified</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="rounded-full bg-primary/10 p-2">
                    <Clock className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Quick Response</p>
                    <p className="text-xs text-muted-foreground">Usually responds within hours</p>
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
                <h2 className="text-2xl font-bold">{formattedPrice}</h2>
                <Badge variant="outline">Per hour</Badge>
              </div>

              {session ? (
                session.user.id !== service.providerId.toString() ? (
                  <div className="space-y-4 pt-4">
                    <BookingForm serviceId={params.id} />
                    <Button variant="outline" className="w-full">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Contact Provider
                    </Button>
                  </div>
                ) : (
                  <div className="bg-yellow-50 p-4 rounded-md text-yellow-800 text-sm">
                    This is your service listing. You cannot book your own service.
                  </div>
                )
              ) : (
                <div className="space-y-4 pt-4">
                  <Button className="w-full" asChild>
                    <a href="/sign-in">Sign in to Book</a>
                  </Button>
                </div>
              )}

              <div className="pt-4 border-t">
                <h3 className="font-medium mb-2">Availability</h3>
                <p className="text-sm text-muted-foreground">Available Monday to Saturday, 9 AM - 6 PM</p>
              </div>

              <div className="pt-4 border-t">
                <h3 className="font-medium mb-2">Service Location</h3>
                <p className="text-sm text-muted-foreground">
                  Service available in {service.location} and surrounding areas
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}
