import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star } from "lucide-react"

interface ServiceCardProps {
  id: string
  title: string
  description: string
  price: number
  rating: number
  provider: string
  image: string
  category: string
}

export default function ServiceCard({
  id,
  title,
  description,
  price,
  rating,
  provider,
  image,
  category,
}: ServiceCardProps) {
  // Format price in Indian Rupees
  const formattedPrice = `₹${price.toLocaleString("en-IN")}`

  return (
    <Link href={`/service/${id}`}>
      <Card className="overflow-hidden transition-all hover:shadow-md">
        <div className="aspect-video relative">
          <Image src={image || "/placeholder.svg"} alt={title} fill className="object-cover" />
          <Badge className="absolute top-2 right-2">{category}</Badge>
        </div>
        <CardContent className="p-4">
          <h3 className="text-lg font-bold">{title}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{description}</p>
          <div className="flex items-center mt-2">
            <div className="flex items-center">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="ml-1 text-sm font-medium">{rating.toFixed(1)}</span>
            </div>
            <span className="mx-2 text-muted-foreground">•</span>
            <span className="text-sm text-muted-foreground">by {provider}</span>
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0 flex justify-between items-center">
          <span className="font-bold text-lg">{formattedPrice}/hr</span>
          <Badge variant="outline" className="hover:bg-primary hover:text-primary-foreground">
            View Details
          </Badge>
        </CardFooter>
      </Card>
    </Link>
  )
}
