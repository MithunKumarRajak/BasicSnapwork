import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import type { Category } from "@/lib/models"

interface CategoryListProps {
  categories: Category[]
}

export default function CategoryList({ categories }: CategoryListProps) {
  // If no categories are provided, show a loading state or default categories
  if (!categories || categories.length === 0) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="h-full">
            <CardContent className="flex flex-col items-center justify-center p-6 text-center">
              <div className="mb-4 rounded-full bg-primary/10 p-3 text-primary animate-pulse h-12 w-12"></div>
              <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
      {categories.map((category) => (
        <Link key={category._id?.toString()} href={`/category/${category.slug}`}>
          <Card className="h-full transition-all hover:shadow-md hover:border-primary">
            <CardContent className="flex flex-col items-center justify-center p-6 text-center">
              <div
                className="mb-4 rounded-full bg-primary/10 p-3 text-primary"
                dangerouslySetInnerHTML={{ __html: category.icon }}
              ></div>
              <h3 className="font-medium">{category.name}</h3>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}
