"use client"

import { useState, useEffect } from "react"
import ServiceCard from "@/components/service-card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChevronRight } from "lucide-react"
import Link from "next/link"

interface Service {
  _id: string
  title: string
  description: string
  price: number
  rating: number
  category: string
  images: string[]
  location: string
  providerId: string
  providerName?: string
}

interface FeaturedServicesProps {
  initialServices?: Service[]
}

export default function FeaturedServices({ initialServices = [] }: FeaturedServicesProps) {
  const [services, setServices] = useState<Service[]>(initialServices)
  const [isLoading, setIsLoading] = useState(initialServices.length === 0)
  const [activeCategory, setActiveCategory] = useState("all")

  // Popular categories in India
  const categories = [
    { id: "all", name: "All Services" },
    { id: "cleaning", name: "Cleaning" },
    { id: "plumbing", name: "Plumbing" },
    { id: "electrical", name: "Electrical" },
    { id: "carpentry", name: "Carpentry" },
    { id: "painting", name: "Painting" },
  ]

  useEffect(() => {
    if (initialServices.length === 0) {
      fetchServices()
    }
  }, [initialServices])

  async function fetchServices(category?: string) {
    setIsLoading(true)
    try {
      const url =
        category && category !== "all"
          ? `/api/services?category=${category}&featured=true&limit=6`
          : `/api/services?featured=true&limit=6`

      const response = await fetch(url)
      if (!response.ok) throw new Error("Failed to fetch services")

      const data = await response.json()
      setServices(data)
    } catch (error) {
      console.error("Error fetching services:", error)
      setServices([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category)
    fetchServices(category)
  }

  return (
    <section className="py-12 bg-slate-50 dark:bg-slate-900">
      <div className="container">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold">Featured Services</h2>
            <p className="text-muted-foreground mt-2">Top-rated services from verified providers</p>
          </div>
          <Link href="/services" className="mt-4 md:mt-0">
            <Button variant="outline" className="group">
              View All Services
              <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>

        <Tabs defaultValue="all" className="w-full" onValueChange={handleCategoryChange}>
          <div className="overflow-x-auto pb-2">
            <TabsList className="mb-8 w-auto inline-flex">
              {categories.map((category) => (
                <TabsTrigger key={category.id} value={category.id} className="px-4">
                  {category.name}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {categories.map((category) => (
            <TabsContent key={category.id} value={category.id} className="mt-0">
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="rounded-lg border bg-card text-card-foreground shadow-sm">
                      <div className="aspect-video bg-slate-200 dark:bg-slate-800 animate-pulse rounded-t-lg" />
                      <div className="p-4 space-y-3">
                        <div className="h-6 bg-slate-200 dark:bg-slate-800 animate-pulse rounded-md w-3/4" />
                        <div className="h-4 bg-slate-200 dark:bg-slate-800 animate-pulse rounded-md w-full" />
                        <div className="h-4 bg-slate-200 dark:bg-slate-800 animate-pulse rounded-md w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : services.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {services.map((service) => (
                    <ServiceCard
                      key={service._id?.toString()}
                      id={service._id?.toString() || ""}
                      title={service.title}
                      description={service.description}
                      price={service.price}
                      rating={service.rating || 0}
                      provider={service.providerName || "Service Provider"}
                      image={service.images[0] || "/placeholder.svg?height=200&width=300"}
                      category={service.category}
                      location={service.location}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <h3 className="text-lg font-medium">No services found</h3>
                  <p className="text-muted-foreground mt-2">Try a different category or check back later</p>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  )
}
