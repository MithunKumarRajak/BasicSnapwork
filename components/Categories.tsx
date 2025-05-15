import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Home, Wrench, Truck, Utensils, Paintbrush, Construction, Scissors } from "lucide-react"

const categories = [
  {
    name: "Household Help",
    icon: <Home className="h-6 w-6" />,
    slug: "household-help",
  },
  {
    name: "Electrician",
    icon: <Wrench className="h-6 w-6" />,
    slug: "electrician",
  },
  {
    name: "Plumbing",
    icon: <Wrench className="h-6 w-6" />,
    slug: "plumbing",
  },
  {
    name: "Delivery",
    icon: <Truck className="h-6 w-6" />,
    slug: "delivery",
  },
  {
    name: "Cooking",
    icon: <Utensils className="h-6 w-6" />,
    slug: "cooking",
  },
  {
    name: "Painting",
    icon: <Paintbrush className="h-6 w-6" />,
    slug: "painting",
  },
  {
    name: "Construction",
    icon: <Construction className="h-6 w-6" />,
    slug: "construction",
  },
  {
    name: "Salon Services",
    icon: <Scissors className="h-6 w-6" />,
    slug: "salon-services",
  },
]

export default function Categories() {
  return (
    <section className="py-12">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold">Browse by Category</h2>
          <p className="mt-2 text-muted-foreground">Find daily work services in your area</p>
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
