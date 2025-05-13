import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Search } from "lucide-react"
import ServiceCard from "@/components/service-card"
import CategoryList from "@/components/category-list"
import HeroSection from "@/components/hero-section"
import { getServices, getCategories } from "@/lib/db-service"

export default async function Home() {
  const services = await getServices(3)
  const categories = await getCategories()

  return (
    <main className="flex min-h-screen flex-col">
      <HeroSection />

      <section className="container py-12 space-y-6">
        <div className="flex flex-col items-center text-center space-y-4">
          <h2 className="text-3xl font-bold tracking-tight">Popular Categories</h2>
          <p className="text-muted-foreground max-w-[700px]">
            Find help with household tasks, tech support, labor work, and more from trusted individuals in your area.
          </p>
        </div>

        <CategoryList categories={categories} />
      </section>

      <section className="container py-12 space-y-6 bg-slate-50">
        <div className="flex flex-col items-center text-center space-y-4">
          <h2 className="text-3xl font-bold tracking-tight">Featured Services</h2>
          <p className="text-muted-foreground max-w-[700px]">Browse through our top-rated service providers</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
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
          ))}
        </div>

        <div className="flex justify-center mt-8">
          <Button asChild>
            <Link href="/services">View All Services</Link>
          </Button>
        </div>
      </section>

      <section className="container py-12 space-y-6">
        <div className="flex flex-col items-center text-center space-y-4">
          <h2 className="text-3xl font-bold tracking-tight">How It Works</h2>
          <p className="text-muted-foreground max-w-[700px]">
            Snapwork connects you with skilled individuals in just a few simple steps
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="rounded-full bg-primary/10 p-4 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Search</h3>
              <p className="text-muted-foreground">Find the service you need from our wide range of categories</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="rounded-full bg-primary/10 p-4 w-16 h-16 flex items-center justify-center mx-auto mb-4">
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
                  className="h-8 w-8 text-primary"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Connect</h3>
              <p className="text-muted-foreground">Chat with service providers and discuss your requirements</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="rounded-full bg-primary/10 p-4 w-16 h-16 flex items-center justify-center mx-auto mb-4">
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
                  className="h-8 w-8 text-primary"
                >
                  <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                  <path d="m9 12 2 2 4-4" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Complete</h3>
              <p className="text-muted-foreground">Get your task done and pay securely through our platform</p>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  )
}
