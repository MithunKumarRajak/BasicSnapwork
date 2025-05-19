"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Clock, MapPin, MessageSquare, Star, User, Check, Shield, Award } from "lucide-react"
import { getServiceById, getUserById, getReviewsByService } from "@/lib/db-service"
import { notFound } from "next/navigation"
import BookingForm from "@/components/booking-form"
import ReviewForm from "@/components/review-form"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export default async function ServicePage({ params }: { params: { id: string } }) {
  let service = null
  let provider = null
  let reviews = []
  let session = null

  try {
    service = await getServiceById(params.id)

    if (!service) {
      notFound()
    }

    // Only fetch these if service exists
    provider = await getUserById(service.providerId.toString())
    reviews = await getReviewsByService(params.id)
    session = await getServerSession(authOptions)
  } catch (error) {
    console.error("Error fetching service data:", error)
    notFound()
  }

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

          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-12 md:col-span-8 relative rounded-lg overflow-hidden aspect-video">
              <Image
                src={service.images[0] || "/placeholder.svg?height=400&width=600"}
                alt={`${service.title} main image`}
                fill
                className="object-cover"
                priority
              />
            </div>
            <div className="col-span-12 md:col-span-4 grid grid-cols-2 gap-4">
              {service.images.slice(1, 5).map((image, index) => (
                <div key={index} className="relative rounded-lg overflow-hidden aspect-square">
                  <Image
                    src={image || `/placeholder.svg?height=200&width=200&text=Image+${index + 2}`}
                    alt={`${service.title} image ${index + 2}`}
                    fill
                    className="object-cover"
                  />
                  {index === 3 && service.images.length > 5 && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <span className="text-white font-medium">+{service.images.length - 5} more</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <Tabs defaultValue="description" className="mt-8">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="reviews">Reviews ({reviews.length})</TabsTrigger>
              <TabsTrigger value="provider">Provider</TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="space-y-6 pt-6">
              <div className="prose dark:prose-invert max-w-none">
                <p className="text-base leading-relaxed">{service.description}</p>

                <h3 className="text-xl font-semibold mt-6 mb-4">What's included:</h3>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <span>Professional service by experienced providers</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <span>Quality work with attention to detail</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <span>Timely completion with regular updates</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <span>100% satisfaction guarantee</span>
                  </li>
                </ul>

                {service.tags && service.tags.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-xl font-semibold mb-4">Tags:</h3>
                    <div className="flex flex-wrap gap-2">
                      {service.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="reviews" className="space-y-6 pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold">Customer Reviews</h3>
                  <div className="flex items-center mt-1">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-5 w-5 ${
                            star <= (service.rating || 0) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="ml-2 font-medium">{service.rating?.toFixed(1) || "New"}</span>
                    <span className="mx-2 text-muted-foreground">•</span>
                    <span className="text-muted-foreground">{service.reviewCount || 0} reviews</span>
                  </div>
                </div>

                {session && session.user.id !== service.providerId.toString() && (
                  <Button
                    variant="outline"
                    onClick={() => document.getElementById("write-review")?.scrollIntoView({ behavior: "smooth" })}
                  >
                    Write a Review
                  </Button>
                )}
              </div>

              <div className="space-y-4">
                {reviews.length > 0 ? (
                  reviews.map((review) => (
                    <Card key={review._id?.toString()}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex items-start space-x-3">
                            <div className="rounded-full bg-slate-100 p-2">
                              <User className="h-5 w-5" />
                            </div>
                            <div>
                              <h4 className="font-medium">Customer</h4>
                              <div className="flex items-center">
                                <div className="flex">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                      key={star}
                                      className={`h-3 w-3 ${
                                        star <= review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                                      }`}
                                    />
                                  ))}
                                </div>
                                <span className="ml-2 text-xs text-muted-foreground">
                                  {new Date(review.createdAt).toLocaleDateString("en-IN", {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                  })}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <p className="mt-3 text-sm">{review.comment}</p>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="text-center py-8 bg-slate-50 dark:bg-slate-900 rounded-lg">
                    <Star className="h-12 w-12 mx-auto text-slate-300" />
                    <h3 className="mt-4 text-lg font-medium">No reviews yet</h3>
                    <p className="text-muted-foreground mt-2">Be the first to review this service!</p>
                  </div>
                )}
              </div>

              {session && session.user.id !== service.providerId.toString() && (
                <div id="write-review" className="mt-8 border-t pt-6">
                  <h3 className="font-semibold text-lg mb-4">Leave a Review</h3>
                  <ReviewForm serviceId={params.id} />
                </div>
              )}
            </TabsContent>

            <TabsContent value="provider" className="space-y-6 pt-6">
              <div className="flex items-center space-x-4">
                <div className="relative h-20 w-20 rounded-full overflow-hidden">
                  <Image
                    src={provider?.profileImage || "/placeholder.svg?height=100&width=100"}
                    alt={provider?.name || "Service Provider"}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">{provider?.name || "Service Provider"}</h3>
                  <div className="flex items-center text-sm text-muted-foreground mt-1">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>
                      Member since{" "}
                      {provider
                        ? new Date(provider.createdAt).toLocaleDateString("en-IN", {
                            year: "numeric",
                            month: "short",
                          })
                        : "Recently"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <Card>
                  <CardContent className="p-4 flex items-center space-x-3">
                    <div className="rounded-full bg-primary/10 p-3">
                      <Star className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{service.rating?.toFixed(1) || "New"} Rating</p>
                      <p className="text-sm text-muted-foreground">{service.reviewCount || 0} reviews</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4 flex items-center space-x-3">
                    <div className="rounded-full bg-primary/10 p-3">
                      <Shield className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Verified Provider</p>
                      <p className="text-sm text-muted-foreground">ID & Documents Verified</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4 flex items-center space-x-3">
                    <div className="rounded-full bg-primary/10 p-3">
                      <Award className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Top Provider</p>
                      <p className="text-sm text-muted-foreground">Highly rated services</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="mt-6">
                <h3 className="text-xl font-semibold mb-4">About the Provider</h3>
                <p className="text-muted-foreground">
                  {provider?.bio ||
                    `Professional service provider with expertise in ${service.category}. Committed to delivering
                    high-quality services with customer satisfaction as the top priority.`}
                </p>
              </div>

              {session && session.user.id !== service.providerId.toString() && (
                <Button className="mt-4" variant="outline">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Contact Provider
                </Button>
              )}
            </TabsContent>
          </Tabs>
        </div>

        <div className="md:col-span-1">
          <Card className="sticky top-8">
            <CardContent className="p-6 space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-3xl font-bold">{formattedPrice}</h2>
                  <Badge variant="outline" className="mt-1">
                    Per hour
                  </Badge>
                </div>
                <div className="flex items-center">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <span className="ml-1 font-medium">{service.rating?.toFixed(1) || "New"}</span>
                </div>
              </div>

              <div className="space-y-4 border-t border-b py-4">
                <div className="flex items-start">
                  <Clock className="h-5 w-5 text-muted-foreground mr-3 mt-0.5" />
                  <div>
                    <h3 className="font-medium">Availability</h3>
                    <p className="text-sm text-muted-foreground">Available Monday to Saturday, 9 AM - 6 PM</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <MapPin className="h-5 w-5 text-muted-foreground mr-3 mt-0.5" />
                  <div>
                    <h3 className="font-medium">Service Location</h3>
                    <p className="text-sm text-muted-foreground">{service.location} and surrounding areas</p>
                  </div>
                </div>
              </div>

              {session ? (
                session.user.id !== service.providerId.toString() ? (
                  <div className="space-y-4">
                    <BookingForm serviceId={params.id} />
                    <Button variant="outline" className="w-full">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Contact Provider
                    </Button>
                  </div>
                ) : (
                  <div className="bg-yellow-50 dark:bg-yellow-950 p-4 rounded-md text-yellow-800 dark:text-yellow-200 text-sm">
                    This is your service listing. You cannot book your own service.
                  </div>
                )
              ) : (
                <div className="space-y-4">
                  <Button className="w-full" asChild>
                    <a href="/sign-in">Sign in to Book</a>
                  </Button>
                  <p className="text-xs text-center text-muted-foreground">
                    Sign in to book this service or contact the provider
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}
