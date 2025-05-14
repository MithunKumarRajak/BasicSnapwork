import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Briefcase, Code, Home, Palette, BookOpen, Truck, Wrench, Users } from "lucide-react"

const categories = [
  {
    name: "Web Development",
    icon: <Code className="h-6 w-6" />,
    slug: "web-development",
  },
  {
    name: "Design",
    icon: <Palette className="h-6 w-6" />,
    slug: "design",
  },
  {
    name: "Writing",
    icon: <BookOpen className="h-6 w-6" />,
    slug: "writing",
  },
  {
    name: "Admin Support",
    icon: <Briefcase className="h-6 w-6" />,
    slug: "admin-support",
  },
  {
    name: "Customer Service",
    icon: <Users className="h-6 w-6" />,
    slug: "customer-service",
  },
  {
    name: "Delivery",
    icon: <Truck className="h-6 w-6" />,
    slug: "delivery",
  },
  {
    name: "Home Services",
    icon: <Home className="h-6 w-6" />,
    slug: "home-services",
  },
  {
    name: "Repairs",
    icon: <Wrench className="h-6 w-6" />,
    slug: "repairs",
  },
]

export default function Categories() {
  return (
    <section className="py-12">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold">Browse by Category</h2>
          <p className="mt-2 text-muted-foreground">Find work in your area of expertise</p>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8">
          {categories.map((category) => (
            <Link key={category.slug} href={`/jobs?category=${category.slug}`} className="block">
              <Card className="h-full transition-all hover:shadow-md hover:border-primary">
                <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                  <div className="mb-4 rounded-full bg-primary/10 p-3 text-primary">{category.icon}</div>
                  <h3 className="font-medium">{category.name}</h3>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
